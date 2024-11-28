import { redirect } from "next/navigation";
import { dashboardItems } from "@/common/dashboard-items";

type DashboardProps = {
  params: Promise<{
    type: string[];
  }>;
};

export default async function Dashboard({ params }: DashboardProps) {
  const type = (await params).type ?? "pastes";
  const dashboard = dashboardItems.find((dash) => dash.key === type[0]);
  if (!dashboard) {
    return redirect(dashboardItems[0].url);
  }
  return dashboard.render();
}
