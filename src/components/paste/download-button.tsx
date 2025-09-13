"use client";

import { downloadFile } from "@/common/utils/browser.util";
import { PasteWithContent } from "@/types/paste";
import { Button } from "../ui/button";

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
