import { getPrismaClient } from "@/common/prisma";
import { StatsResponse } from "@/types/stats";
import { NextResponse } from "next/server";

export async function GET() {
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
      pastesByLanguage,
      pastes,
      recentPastes,
      avgSizeResult,
      totalViewsResult,
      pastesToday,
      pastesThisWeek,
    ] = await Promise.all([
      // Basic counts
      prisma.paste.count(),

      // Total size
      prisma.paste.aggregate({
        _sum: { size: true },
      }),

      // Pastes by language
      prisma.paste.groupBy({
        by: ["language"],
        _count: { language: true },
        orderBy: { _count: { language: "desc" } },
        take: 10,
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
    ]);

    // Process results
    const totalSize = sizeResult._sum.size || 0;
    const averageSize = Math.round(avgSizeResult._avg.size || 0);
    const totalViews = totalViewsResult._sum.views || 0;

    // Process languages data into object format
    const languages = pastesByLanguage.reduce((acc, item) => {
      const language = item.language || 'Unknown';
      acc[language] = item._count.language;
      return acc;
    }, {} as Record<string, number>);

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
      },
      languages,
      monthlyData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
