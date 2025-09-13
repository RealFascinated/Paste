"use client";

import { downloadFile } from "@/common/utils/browser.util";
import { Paste } from "@/types/paste";
import { Button } from "../ui/button";

export function DownloadPasteButton({ paste }: { paste: Paste }) {
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
