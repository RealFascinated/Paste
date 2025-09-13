"use client";

import { downloadFile } from "@/common/utils/browser.util";
import { PasteWithContent } from "@/types/paste";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

export function DownloadPasteButton({ 
  paste, 
  className 
}: { 
  paste: PasteWithContent;
  className?: string;
}) {
  return (
    <Button
      onClick={() => downloadFile(`${paste.key}`, paste.content)}
      size="default"
      className={className || "text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0"}
    >
      <Download className="h-3 w-3 mr-1" />
      Download
    </Button>
  );
}
