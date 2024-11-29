import { UserPastes } from "@/components/dashboard/dashes/pastes/user-pastes";
import { UserPasteStatistics } from "@/components/dashboard/dashes/pastes/user-paste-statistics";
import { Separator } from "@/components/ui/separator";

export function PastesDashboard() {
  return (
    <div className="flex flex-col gap-5 mt-3">
      <UserPasteStatistics />
      <Separator />
      <UserPastes />
    </div>
  );
}
