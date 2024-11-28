"use client";

import { Paste } from "@/types/paste";
import { Button } from "@/components/button";
import { downloadFile } from "@/common/utils/browser.util";

export function DownloadPasteButton({ paste }: { paste: Paste }) {
  return (
    <Button onClick={() => downloadFile(`${paste.key}`, paste.content)}>
      Download
    </Button>
  );
}
