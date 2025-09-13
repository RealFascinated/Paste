import { formatNumber } from "@/common/utils/string.util";
import { LanguageData } from "@/types/stats";

interface LanguageChartProps {
  data: LanguageData[];
}

export function LanguageChart({ data }: LanguageChartProps) {
  const totalPastes = data.reduce((sum, item) => sum + item._count.language, 0);

  return (
    <div className="p-4 sm:p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Top Languages</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Most popular programming languages used in pastes
      </p>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage =
            totalPastes > 0 ? (item._count.language / totalPastes) * 100 : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start sm:items-center gap-2">
                <span className="font-medium text-sm sm:text-base truncate">
                  {item.language || "Unknown"}
                </span>
                <div className="text-right text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                  <div>{formatNumber(item._count.language)} pastes</div>
                </div>
              </div>

              {/* Paste count bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{percentage.toFixed(1)}% of pastes</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
