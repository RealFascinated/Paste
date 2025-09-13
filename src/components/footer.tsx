import { getRelativeTime } from "@/common/utils/date.util";
import { formatBytes, formatNumber } from "@/common/utils/string.util";
import { PasteCreatedTime } from "@/components/paste/created-time";
import { DownloadPasteButton } from "@/components/paste/download-button";
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
    <div className="text-xs flex items-center justify-center flex-wrap gap-1.5 sm:gap-2">
      {pasteDetails.map((detail, index) => {
        const rendered = detail.render(paste, editDetails);
        if (rendered == undefined) {
          return undefined;
        }

        return (
          <div
            key={index}
            className="flex flex-row items-center gap-1 px-2 py-1 rounded-md bg-muted/60 hover:bg-muted/80 transition-colors text-xs text-foreground/90"
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
  isLoading?: boolean;
};

export function Footer({ paste, editDetails, isLoading = false }: FooterProps) {
  return (
    <div
      className={
        "px-2 sm:px-4 py-2 sm:py-2.5 bg-background/50 backdrop-blur-sm border-t border-border/50 select-none flex flex-col justify-between items-center text-sm w-full"
      }
    >
      <div className="flex gap-2 sm:gap-4 items-center w-full justify-between">
        <div className="flex gap-2 sm:gap-4 items-center min-w-0 flex-1">
          {!paste && <Expiry />}
          <div className="hidden md:block">
            {(paste || editDetails) ? (
              <PasteDetails paste={paste} editDetails={editDetails} />
            ) : null}
          </div>
        </div>

        <div className="flex-shrink-0">
          {paste ? (
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <DownloadPasteButton paste={paste} />
              <Link
                href={`/?duplicate=${encodeURI(paste.id)}`}
                prefetch={false}
              >
                <Button
                  variant="secondary"
                  size="default"
                  className="text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0"
                >
                  Duplicate
                </Button>
              </Link>
              <Link href={`/raw/${paste.id}.${paste.ext}`} prefetch={false}>
                <Button
                  variant="outline"
                  size="default"
                  className="text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
                >
                  Raw
                </Button>
              </Link>
              <Link href="/" prefetch={false}>
                <Button
                  size="default"
                  className="text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0"
                >
                  New
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              type="submit"
              form="paste-form"
              size="default"
              className="text-sm font-medium px-6 py-2 h-9 shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          )}
        </div>
      </div>
        {(paste || editDetails) && (
          <div className="block md:hidden w-full pt-2 sm:pt-3 border-t border-border/50 mt-2">
            <PasteDetails paste={paste} editDetails={editDetails} />
          </div>
        )}
    </div>
  );
}
