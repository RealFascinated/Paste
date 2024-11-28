import { AuthButton } from "@/components/auth/auth-button";
import { HomeButton } from "@/components/navbar/home-button";

export function Navbar() {
  return (
    <div className="min-h-[40px] p-1.5 px-3 bg-background-secondary select-none">
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <HomeButton />
        </div>

        <div className="flex gap-2">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
