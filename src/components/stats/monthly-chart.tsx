import { formatNumber } from "@/common/utils/string.util";
import { MonthlyData } from "@/types/stats";

interface MonthlyChartProps {
  data: MonthlyData[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const maxCount = Math.max(...data.map(item => item.count));
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  };

  return (
    <div className="p-4 sm:p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Pastes by Month</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Monthly paste creation trends over the last 12 months
      </p>
      <div className="space-y-3 sm:space-y-4">
        {data.map((item, index) => {
          const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

          return (
            <div key={index} className="flex items-end space-x-2">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs sm:text-sm font-medium">
                    {formatMonth(item.month)}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {formatNumber(item.count)}
                  </span>
                </div>
                {item.count > 0 ? (
                  <div className="w-full bg-muted rounded-full h-6 sm:h-8 relative">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 sm:h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${height}%` }}
                    >
                      {height > 20 && (
                        <span className="text-white text-xs font-medium">
                          {formatNumber(item.count)}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-muted/30 rounded-full h-6 sm:h-8 relative flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      No pastes
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
