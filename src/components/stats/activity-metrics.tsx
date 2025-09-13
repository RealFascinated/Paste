import { formatBytes, formatNumber } from "@/common/utils/string.util";
import { StatsOverview } from "@/types/stats";
import { Minus, TrendingUp } from "lucide-react";

interface ActivityMetricsProps {
  data: StatsOverview;
}

export function ActivityMetrics({ data }: ActivityMetricsProps) {
  // Calculate some derived metrics
  const avgViewsPerPaste =
    data.totalPastes > 0 ? data.totalViews / data.totalPastes : 0;
  const avgPastesPerDay = data.pastesThisWeek / 7;
  const avgSizePerView =
    data.totalViews > 0 ? data.totalSize / data.totalViews : 0;

  const metrics = [
    {
      title: "Average Views per Paste",
      value: formatNumber(Math.round(avgViewsPerPaste)),
      description: "How many times each paste is viewed on average",
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Daily Average",
      value: formatNumber(Math.round(avgPastesPerDay)),
      description: "Average pastes created per day this week",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Size per View",
      value: formatBytes(Math.round(avgSizePerView)),
      description: "Average data transferred per view",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "Growth Rate",
      value: data.pastesToday > 0 ? "+" + formatNumber(data.pastesToday) : "0",
      description: "New pastes created today",
      icon: data.pastesToday > 0 ? TrendingUp : Minus,
      color: data.pastesToday > 0 ? "text-green-500" : "text-gray-500",
    },
  ];

  return (
    <div className="p-4 sm:p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Activity Insights</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Derived metrics and engagement statistics
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="p-3 sm:p-4 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2 mb-2">
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${metric.color}`} />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {metric.title}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                {metric.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
