import { formatNumber } from "@/common/utils/string.util";

interface LanguageChartProps {
  data: Record<string, number>;
}

export function LanguageChart({ data }: LanguageChartProps) {
  // Convert object to array and sort by count (descending)
  const languageEntries = Object.entries(data).sort(([, a], [, b]) => b - a);
  const totalPastes = languageEntries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="p-4 sm:p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Top Languages</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Most popular programming languages used in pastes
      </p>
      <div className="space-y-3">
        {languageEntries.map(([language, count], index) => {
          const percentage = totalPastes > 0 ? (count / totalPastes) * 100 : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start sm:items-center gap-2">
                <span className="font-medium text-sm sm:text-base truncate">
                  {language || "Unknown"}
                </span>
                <div className="text-right text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                  <div>{formatNumber(count)} pastes</div>
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
