import Link from "next/link";
import { Config } from "@/common/config";
import { AuthButton } from "@/components/auth/auth-button";

export function Navbar() {
  return (
    <div className="min-h-[40px] p-1.5 px-3 bg-background-secondary select-none">
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <Link href="/">
            <p className="font-bold hover:brightness-75 transition-all transform-gpu">
              {Config.siteTitle}
            </p>
          </Link>
        </div>

        <div className="flex gap-2">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
