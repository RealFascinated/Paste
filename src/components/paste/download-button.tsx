"use client";

import { downloadFile } from "@/common/utils/browser.util";
import { Button } from "../ui/button";
import { PasteWithContent } from "@/types/paste";

export function DownloadPasteButton({ paste }: { paste: PasteWithContent }) {
  return (
    <Button
      onClick={() => downloadFile(`${paste.key}`, paste.content)}
      size="sm"
      className="text-xs sm:text-sm"
    >
      Download
    </Button>
  );
}
