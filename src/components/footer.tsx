import Link from "next/link";
import { ReactNode } from "react";
import { Paste } from "@/types/paste";
import { formatBytes, formatNumber } from "@/common/utils/string.util";
import { getRelativeTime } from "@/common/utils/date.util";
import Tooltip from "./tooltip";
import { Expiry } from "@/components/expiry";
import { Button } from "@/components/button";
import { PasteCreatedTime } from "@/components/paste/created-time";

type PasteDetails = {
  render: (paste: Paste) => string | ReactNode;
};

const pasteDetails: PasteDetails[] = [
  {
    render: (paste: Paste) => formatBytes(paste.size),
  },
  {
    render: (paste: Paste) => {
      if (paste.expiresAt === null) {
        return undefined;
      }

      return (
        <Tooltip display={paste.expiresAt.toLocaleString()}>
          <p>Expires {getRelativeTime(paste.expiresAt)}</p>
        </Tooltip>
      );
    },
  },
  {
    render: (paste: Paste) =>
      `${formatNumber(paste.views)} View${paste.views === 1 ? "" : "s"}`,
  },
  {
    render: (paste: Paste) => <PasteCreatedTime createdAt={paste.timestamp} />,
  },
  {
    render: (paste: Paste) =>
      paste.ext === "txt" ? "Plain Text" : paste.formattedLang,
  },
];

function PasteDetails({ paste }: { paste: Paste }) {
  return (
    <div className="text-xs flex flex-row gap-1 items-center">
      {pasteDetails.map((detail, index) => {
        const rendered = detail.render(paste);
        if (rendered == undefined) {
          return undefined;
        }

        return (
          <div key={index} className="flex flex-row gap-1">
            {rendered}
            {index !== pasteDetails.length - 1 && <p>|</p>}
          </div>
        );
      })}
    </div>
  );
}

type FooterProps = {
  paste?: Paste;
};

export function Footer({ paste }: FooterProps) {
  return (
    <div className="min-h-[40px] p-1.5 px-3 bg-background-secondary select-none flex justify-between items-center">
      {paste && <PasteDetails paste={paste} />}

      <>
        {paste ? (
          <div className="flex gap-2">
            <Link href={`/raw/${paste.id}.${paste.ext}`}>
              <Button>Raw</Button>
            </Link>
            <Link href="/">
              <Button>New</Button>
            </Link>
          </div>
        ) : (
          <>
            <Expiry />
            <Button>Save</Button>
          </>
        )}
      </>
    </div>
  );
}
