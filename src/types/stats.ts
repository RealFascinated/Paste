export interface StatsOverview {
  totalPastes: number;
  totalSize: number;
  totalViews: number;
  averageSize: number;
  recentPastes: number;
  pastesToday: number;
  pastesThisWeek: number;
}

export interface LanguageData {
  language: string;
  _count: { language: number };
  _sum: { size: number | null };
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface StatsResponse {
  overview: StatsOverview;
  languages: LanguageData[];
  monthlyData: MonthlyData[];
}
