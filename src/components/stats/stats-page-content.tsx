"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsOverview } from "./stats-overview";
import { LanguageChart } from "./language-chart";
import { MonthlyChart } from "./monthly-chart";
import { ActivityMetrics } from "./activity-metrics";
import { StatsResponse } from "@/types/stats";

async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return response.json();
}

export function StatsPageContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <LanguageChart data={data.languages} />
        <MonthlyChart data={data.monthlyData} />
      </div>
    </div>
  );
}
