import { Config } from "@/common/config";
import Link from "next/link";
import { Code2, Sparkles } from "lucide-react";

export async function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      <div className="min-h-[48px] px-3 sm:px-6 py-3 bg-background/80 backdrop-blur-md border-b border-border/60 flex justify-between items-center h-full shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            <Link
              className="font-bold text-lg sm:text-xl hover:text-primary transition-colors duration-200 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
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
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:block w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-muted-foreground hidden sm:inline">Online</span>
        </div>
      </div>
    </div>
  );
}
