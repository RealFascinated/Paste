"use client";

import { StatsResponse } from "@/types/stats";
import { useQuery } from "@tanstack/react-query";
import { ActivityMetrics } from "./activity-metrics";
import { MonthlyChart } from "./monthly-chart";
import { StatsOverview } from "./stats-overview";

async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch("/api/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch statistics");
  }
  return response.json();
}

export function StatsPageContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <StatsOverview data={data.overview} />

      {/* Activity Metrics */}
      <ActivityMetrics data={data.overview} />

      {/* Monthly Chart */}
      <MonthlyChart data={data.monthlyData} />
    </div>
  );
}
