import { formatBytes, formatNumber } from "@/common/utils/string.util";
import { PasteCreatedTime } from "@/components/paste/created-time";
import { DownloadPasteButton } from "@/components/paste/download-button";
import { MobilePasteDetails } from "@/components/paste/mobile-paste-details";
import { PasteExpiryTime } from "@/components/paste/paste-expiry-time";
import { PasteWithContent } from "@/types/paste";
import { PasteEditDetails } from "@/types/paste-edit-details";
import { Copy, FileText, Plus, Save, X } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Expiry } from "./expiry";
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

      return <PasteExpiryTime expiresAt={paste.expiresAt} />;
    },
  },
  {
    type: "paste",
    render: (paste?: PasteWithContent) => paste && <p>{paste.language}</p>,
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
  onDuplicate?: () => void;
  onRaw?: () => void;
  onNew?: () => void;
  onSave?: () => void;
  onCopyUrl?: () => void;
  onCopyContent?: () => void;
  onClear?: () => void;
};

export function Footer({
  paste,
  editDetails,
  isLoading = false,
  onDuplicate,
  onRaw,
  onNew,
  onSave,
  onCopyUrl,
  onCopyContent,
  onClear,
}: FooterProps) {
  return (
    <div
      className={
        "px-2 sm:px-4 py-2 sm:py-2.5 bg-background/50 backdrop-blur-sm border-t border-border/50 select-none flex flex-col justify-between items-center text-sm w-full"
      }
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center w-full">
        <div className="flex flex-wrap gap-3 sm:gap-6 items-center justify-center sm:justify-start min-w-0 flex-1">
          {!paste && (
            <>
              <Expiry />
            </>
          )}
          <div className="hidden md:block">
            {paste || editDetails ? (
              <PasteDetails paste={paste} editDetails={editDetails} />
            ) : null}
          </div>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-end">
          {/* Mobile Actions */}
          <div className="md:hidden">
            {paste ? (
              <MobilePasteDetails
                paste={paste}
                editDetails={editDetails}
                onDuplicate={onDuplicate}
                onRaw={onRaw}
                onNew={onNew}
                onSave={onSave}
                onCopyUrl={onCopyUrl}
                onCopyContent={onCopyContent}
                isLoading={isLoading}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {onClear &&
                  editDetails?.content &&
                  editDetails.content.trim().length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      className="text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
                      onClick={onClear}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                <Button
                  type="submit"
                  form="paste-form"
                  size="default"
                  className="text-sm font-semibold px-6 py-3 h-12 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 rounded-lg flex-1 min-w-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Paste</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:block">
            {paste ? (
              <div className="flex flex-wrap gap-2">
                <DownloadPasteButton paste={paste} />
                {onCopyContent && (
                  <Button
                    onClick={onCopyContent}
                    variant="outline"
                    size="default"
                    className="text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                )}
                <Link
                  href={`/?duplicate=${encodeURI(paste.id)}`}
                  prefetch={false}
                >
                  <Button
                    variant="secondary"
                    size="default"
                    className="text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicate
                  </Button>
                </Link>
                <Link href={`/raw/${paste.id}.${paste.ext}`} prefetch={false}>
                  <Button
                    variant="outline"
                    size="default"
                    className="text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Raw
                  </Button>
                </Link>
                <Link href="/" prefetch={false}>
                  <Button
                    size="default"
                    className="text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    New
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {onClear &&
                  editDetails?.content &&
                  editDetails.content.trim().length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      className="text-sm font-medium px-4 py-2 h-9 shadow-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
                      onClick={onClear}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                <Button
                  type="submit"
                  form="paste-form"
                  size="default"
                  className="text-sm font-semibold px-6 py-2 h-9 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
