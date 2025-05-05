import { getRelativeTime } from "@/common/utils/date.util";
import { formatBytes, formatNumber } from "@/common/utils/string.util";
import { PasteCreatedTime } from "@/components/paste/created-time";
import { DownloadPasteButton } from "@/components/paste/download-button";
import { PasteLanguageIcon } from "@/components/paste/language-icon";
import { Paste } from "@/types/paste";
import { PasteEditDetails } from "@/types/paste-edit-details";
import Link from "next/link";
import { ReactNode } from "react";
import Tooltip from "./tooltip";
import { Expiry } from "./expiry";
import { Button } from "./ui/button";

type PasteDetails = {
  type: "paste" | "edit";
  render: (paste?: Paste, editDetails?: PasteEditDetails) => ReactNode | string;
};

const pasteDetails: PasteDetails[] = [
  // Paste details
  {
    type: "paste",
    render: (paste?: Paste) => paste && formatBytes(paste.size),
  },
  {
    type: "paste",
    render: (paste?: Paste) =>
      paste &&
      `${formatNumber(paste.views)} View${paste.views === 1 ? "" : "s"}`,
  },
  {
    type: "paste",
    render: (paste?: Paste) =>
      paste && <PasteCreatedTime createdAt={paste.timestamp} />,
  },
  {
    type: "paste",
    render: (paste?: Paste) => {
      if (!paste || paste.expiresAt === null) {
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
    type: "paste",
    render: (paste?: Paste) =>
      paste && (
        <div className="flex gap-1 items-center">
          <PasteLanguageIcon ext={paste.ext} language={paste.language} />
          {paste.language}
        </div>
      ),
  },

  // Paste edit details
  {
    type: "edit",
    render: (paste?: Paste, editDetails?: PasteEditDetails) =>
      !editDetails ? undefined : (
        <p>
          {editDetails.lines} lines, {editDetails.words} words,{" "}
          {editDetails.characters} characters
        </p>
      ),
  },
  {
    type: "edit",
    render: (paste?: Paste, editDetails?: PasteEditDetails) =>
      !editDetails ? undefined : (
        <p>{formatBytes(Buffer.byteLength(editDetails.content))}</p>
      ),
  },
];

function PasteDetails({
  paste,
  editDetails,
}: {
  paste?: Paste;
  editDetails?: PasteEditDetails;
}) {
  return (
    <div className="text-xs flex items-center justify-center flex-wrap gap-1">
      {pasteDetails.map((detail, index) => {
        const rendered = detail.render(paste, editDetails);
        if (rendered == undefined) {
          return undefined;
        }

        return (
          <div 
            key={index} 
            className="flex flex-row items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/30 hover:bg-secondary/40 transition-colors"
          >
            {rendered}
          </div>
        );
      })}
    </div>
  );
}

type FooterProps = {
  paste?: Paste;
  editDetails?: PasteEditDetails;
};

export function Footer({ paste, editDetails }: FooterProps) {
  return (
    <div
      className={
        "fixed bottom-0 left-0 right-0 px-4 py-2.5 bg-background/50 backdrop-blur-sm border-t border-border/50 select-none flex flex-col justify-between items-center text-sm w-full isolate"
      }
    >
      <div className="flex gap-4 items-center w-full justify-between">
        <div className="flex gap-4 items-center">
          {!paste && <Expiry />}
          <div className="hidden md:block">
            {paste || editDetails ? (
              <PasteDetails paste={paste} editDetails={editDetails} />
            ) : null}
          </div>
        </div>

        <>
          {paste ? (
            <div className="flex gap-2.5">
              <DownloadPasteButton paste={paste} />
              <Link href={`/?duplicate=${encodeURI(paste.id)}`}>
                <Button variant="secondary">Duplicate</Button>
              </Link>
              <Link
                href={`/raw/${paste.id}.${paste.ext}`}
              >
                <Button variant="outline">Raw</Button>
              </Link>
              <Link href="/">
                <Button className="bg-[hsl(160_60%_45%)] hover:bg-[hsl(160_60%_40%)] text-white">New</Button>
              </Link>
            </div>
          ) : (
            <Button>Save</Button>
          )}
        </>
      </div>
      <div className="block md:hidden w-full pt-3 border-t border-border/50 mt-2">
        {paste || editDetails ? (
          <PasteDetails paste={paste} editDetails={editDetails} />
        ) : null}
      </div>
    </div>
  );
}
