import { Config } from "@/common/config";
import { Code2, Sparkles, BarChart3 } from "lucide-react";
import Link from "next/link";

export async function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      <div className="min-h-[48px] px-2 sm:px-4 py-2.5 bg-background/80 backdrop-blur-md border-b border-border/60 flex justify-between items-center h-full shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <Code2 className="w-3.5 h-3.5 text-primary" />
            </div>
            <Link
              className="font-bold text-base sm:text-lg hover:text-primary transition-colors duration-200 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
              href="/"
              prefetch={false}
            >
              {Config.siteTitle}
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>Paste & Share</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/stats"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Stats</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-muted-foreground">
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
