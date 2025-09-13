import { formatBytes, formatNumber } from "@/common/utils/string.util";
import { StatsOverview as StatsOverviewType } from "@/types/stats";
import {
  Calendar,
  CalendarDays,
  Clock,
  Database,
  Eye,
  FileText,
  TrendingUp,
} from "lucide-react";

interface StatsOverviewProps {
  data: StatsOverviewType;
}

export function StatsOverview({ data }: StatsOverviewProps) {
  const cards = [
    {
      title: "Total Pastes",
      value: formatNumber(data.totalPastes),
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Total Size",
      value: formatBytes(data.totalSize),
      icon: Database,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Total Views",
      value: formatNumber(data.totalViews),
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Average Size",
      value: formatBytes(data.averageSize),
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ];

  const activityCards = [
    {
      title: "Last 24 Hours",
      value: formatNumber(data.recentPastes),
      icon: Clock,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    },
    {
      title: "Today",
      value: formatNumber(data.pastesToday),
      icon: Calendar,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
    {
      title: "This Week",
      value: formatNumber(data.pastesThisWeek),
      icon: CalendarDays,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Overview</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Key metrics about all pastes on the platform
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      {card.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-full ${card.bgColor} flex-shrink-0 ml-2`}
                  >
                    <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${card.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Overview */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold">Paste Creation Activity</h2>
          <div className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full whitespace-nowrap">
            Live Data
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          How many new pastes have been created recently
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {activityCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold mt-1">
                      {card.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-tight">
                      {card.title === "Last 24 Hours" &&
                        "Pastes created in last 24 hours"}
                      {card.title === "Today" && "Pastes created today"}
                      {card.title === "This Week" && "Pastes created this week"}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-full ${card.bgColor} flex-shrink-0 ml-2`}
                  >
                    <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${card.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
