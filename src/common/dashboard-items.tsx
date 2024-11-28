import { PastesDashboard } from "@/components/dashboard/dashes/pastes";
import { Clipboard, Settings } from "lucide-react";
import { SettingsDashboard } from "@/components/dashboard/dashes/settings";

export const dashboardItems = [
  {
    title: "Pastes",
    key: "pastes",
    url: "/dashboard/pastes",
    icon: Clipboard,
    render: () => <PastesDashboard />,
  },
  {
    title: "Settings",
    key: "settings",
    url: "/dashboard/settings",
    icon: Settings,
    render: () => <SettingsDashboard />,
  },
];
