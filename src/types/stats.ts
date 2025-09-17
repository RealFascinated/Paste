export interface StatsOverview {
  totalPastes: number;
  totalSize: number;
  totalViews: number;
  averageSize: number;
  recentPastes: number;
  pastesToday: number;
  pastesThisWeek: number;
}

export interface StatsResponse {
  overview: StatsOverview;
  monthlyData: Record<string, number>;
}
