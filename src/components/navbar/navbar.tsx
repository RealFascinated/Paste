import { Config } from "@/common/config";
import Link from "next/link";

export async function Navbar() {
  return (
    <div>
      <div className="min-h-[40px] px-4 py-2 bg-background/50 backdrop-blur-sm border-b border-border/50 flex justify-between items-center h-full">
        <div className="flex items-center gap-2">
          <Link
            className="font-bold text-lg hover:text-primary transition-colors"
            href="/"
            prefetch={false}
          >
            {Config.siteTitle}
          </Link>
        </div>
      </div>
    </div>
  );
}
