import Logger from "@/common/logger";
import { getPrismaClient } from "@/common/prisma";
import { StatsResponse } from "@/types/stats";
import { NextResponse } from "next/server";

export async function GET() {
  const startTime = performance.now();
  try {
    const prisma = getPrismaClient();

    // Calculate date ranges once
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Run all database queries in parallel
    const [
      totalPastes,
      sizeResult,
      pastes,
      recentPastes,
      avgSizeResult,
      totalViewsResult,
      pastesToday,
      pastesThisWeek,
      expiredPastes,
    ] = await Promise.all([
      // Basic counts
      prisma.paste.count(),

      // Total size
      prisma.paste.aggregate({
        where: { expired: false },
        _sum: { size: true },
      }),

      // Pastes for monthly data
      prisma.paste.findMany({
        where: { timestamp: { gte: twelveMonthsAgo } },
        select: { timestamp: true },
      }),

      // Recent activity (last 24 hours)
      prisma.paste.count({
        where: { timestamp: { gte: oneDayAgo } },
      }),

      // Average paste size
      prisma.paste.aggregate({
        where: { expired: false },
        _avg: { size: true },
      }),

      // Total views
      prisma.paste.aggregate({
        _sum: { views: true },
      }),

      // Pastes created today
      prisma.paste.count({
        where: { timestamp: { gte: today, lt: tomorrow } },
      }),

      // Pastes created this week
      prisma.paste.count({
        where: { timestamp: { gte: weekAgo } },
      }),

      // Expired pastes
      prisma.paste.count({
        where: { expired: true },
      }),
    ]);

    // Process results
    const totalSize = sizeResult._sum.size || 0;
    const averageSize = Math.round(avgSizeResult._avg.size || 0);
    const totalViews = totalViewsResult._sum.views || 0;

    // Process monthly data (most recent first)
    const monthlyData: Record<string, number> = {};
    Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      // Count pastes for this specific month
      const count = pastes.filter(paste => {
        const pasteDate = new Date(paste.timestamp);
        const pasteMonthKey = `${pasteDate.getFullYear()}-${String(pasteDate.getMonth() + 1).padStart(2, "0")}`;
        return pasteMonthKey === monthKey;
      }).length;

      monthlyData[monthKey] = count;
    });

    const response: StatsResponse = {
      overview: {
        totalPastes,
        totalSize,
        totalViews,
        averageSize,
        recentPastes,
        pastesToday,
        pastesThisWeek,
        expiredPastes,
      },
      monthlyData,
    };

    Logger.infoWithTiming("Stats retrieved successfully", startTime, {
      totalPastes,
      totalSize,
      averageSize,
      totalViews,
      recentPastes,
      pastesToday,
      pastesThisWeek,
      expiredPastes,
      monthlyDataPoints: Object.keys(monthlyData).length,
    });

    return NextResponse.json(response);
  } catch (error) {
    Logger.errorWithTiming("Failed to fetch statistics", startTime, {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
