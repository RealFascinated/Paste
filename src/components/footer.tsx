import { getRelativeTime } from "@/common/utils/date.util";
import { formatBytes, formatNumber } from "@/common/utils/string.util";
import { PasteCreatedTime } from "@/components/paste/created-time";
import { DownloadPasteButton } from "@/components/paste/download-button";
import { PasteLanguageIcon } from "@/components/paste/language-icon";
import { PasteWithContent } from "@/types/paste";
import { PasteEditDetails } from "@/types/paste-edit-details";
import Link from "next/link";
import { ReactNode } from "react";
import { Expiry } from "./expiry";
import Tooltip from "./tooltip";
import { Button } from "./ui/button";

type PasteDetails = {
  type: "paste" | "edit";
  render: (
    paste?: PasteWithContent,
    editDetails?: PasteEditDetails
  ) => ReactNode | string;
};

const pasteDetails: PasteDetails[] = [
  // Paste details
  {
    type: "paste",
    render: (paste?: PasteWithContent) => paste && formatBytes(paste.size),
  },
  {
    type: "paste",
    render: (paste?: PasteWithContent) =>
      paste &&
      `${formatNumber(paste.views)} View${paste.views === 1 ? "" : "s"}`,
  },
  {
    type: "paste",
    render: (paste?: PasteWithContent) =>
      paste && <PasteCreatedTime createdAt={paste.timestamp} />,
  },
  {
    type: "paste",
    render: (paste?: PasteWithContent) => {
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
    render: (paste?: PasteWithContent) =>
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
    render: (paste?: PasteWithContent, editDetails?: PasteEditDetails) =>
      !editDetails ? undefined : (
        <p>
          {editDetails.lines} lines, {editDetails.words} words,{" "}
          {editDetails.characters} characters
        </p>
      ),
  },
  {
    type: "edit",
    render: (paste?: PasteWithContent, editDetails?: PasteEditDetails) =>
      !editDetails ? undefined : (
        <p>{formatBytes(Buffer.byteLength(editDetails.content))}</p>
      ),
  },
];

function PasteDetails({
  paste,
  editDetails,
}: {
  paste?: PasteWithContent;
  editDetails?: PasteEditDetails;
}) {
  return (
    <div className="text-xs flex items-center justify-center flex-wrap gap-1 sm:gap-1.5">
      {pasteDetails.map((detail, index) => {
        const rendered = detail.render(paste, editDetails);
        if (rendered == undefined) {
          return undefined;
        }

        return (
          <div
            key={index}
            className="flex flex-row items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-secondary/30 hover:bg-secondary/40 transition-colors text-xs sm:text-xs"
          >
            {rendered}
          </div>
        );
      })}
    </div>
  );
}

type FooterProps = {
  paste?: PasteWithContent;
  editDetails?: PasteEditDetails;
};

export function Footer({ paste, editDetails }: FooterProps) {
  return (
    <div
      className={
        "fixed bottom-0 left-0 right-0 px-2 sm:px-4 py-2 sm:py-2.5 bg-background/50 backdrop-blur-sm border-t border-border/50 select-none flex flex-col justify-between items-center text-sm w-full isolate"
      }
    >
      <div className="flex gap-2 sm:gap-4 items-center w-full justify-between">
        <div className="flex gap-2 sm:gap-4 items-center min-w-0 flex-1">
          {!paste && <Expiry />}
          <div className="hidden md:block">
            {paste || editDetails ? (
              <PasteDetails paste={paste} editDetails={editDetails} />
            ) : null}
          </div>
        </div>

        <div className="flex-shrink-0">
          {paste ? (
            <div className="flex gap-1 sm:gap-2.5 flex-wrap">
              <DownloadPasteButton paste={paste} />
              <Link
                href={`/?duplicate=${encodeURI(paste.id)}`}
                prefetch={false}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Duplicate
                </Button>
              </Link>
              <Link href={`/raw/${paste.id}.${paste.ext}`} prefetch={false}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Raw
                </Button>
              </Link>
              <Link href="/" prefetch={false}>
                <Button
                  size="sm"
                  className="bg-[hsl(160_60%_45%)] hover:bg-[hsl(160_60%_40%)] text-white text-xs sm:text-sm"
                >
                  New
                </Button>
              </Link>
            </div>
          ) : (
            <Button size="sm" className="text-xs sm:text-sm">
              Save
            </Button>
          )}
        </div>
      </div>
      <div className="block md:hidden w-full pt-2 sm:pt-3 border-t border-border/50 mt-2">
        {paste || editDetails ? (
          <PasteDetails paste={paste} editDetails={editDetails} />
        ) : null}
      </div>
    </div>
  );
}
