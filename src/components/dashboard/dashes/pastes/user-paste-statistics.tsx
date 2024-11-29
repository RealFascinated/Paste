"use client";

import { getLoggedInUsersPasteStatistics } from "@/common/api";
import { useQuery } from "@tanstack/react-query";
import { UserStatistics } from "@/common/types/user/paste-statistics";
import { formatNumber } from "@/common/utils/string.util";

type UserPasteStatistic = {
  /**
   * The name of the statistic.
   */
  name: string;

  /**
   * The value of the statistic.
   */
  render: (statistics: UserStatistics) => number;
};

const statistics: UserPasteStatistic[] = [
  {
    name: "Pastes Created",
    render: (statistics: UserStatistics) => statistics.totalPastes,
  },
  {
    name: "Paste Views",
    render: (statistics: UserStatistics) => statistics.totalViews,
  },
];

export function UserPasteStatistics() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard:user-paste-statistics"],
    queryFn: () => getLoggedInUsersPasteStatistics(),
  });

  return (
    <div className="flex flex-col gap-2 select-none">
      <p className="text-sm text-muted-foreground text-center">
        These are the statistics for your account.
      </p>
      {isLoading && !data && (
        <p className="text-center">Loading account stats...</p>
      )}

      <div className="flex gap-2 w-full items-center justify-center">
        {data &&
          statistics.map((statistic) => {
            const rendered = statistic.render(data);
            if (rendered == undefined) {
              return undefined;
            }

            return (
              <div
                key={statistic.name}
                className="flex gap-2 items-center bg-background-secondary p-1.5 rounded-md"
              >
                <p className="text-sm font-semibold">{statistic.name}</p>
                <p className="text-sm">{formatNumber(rendered)}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
