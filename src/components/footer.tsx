import { downloadFile } from "@/common/utils/browser.util";
import {
  formatBytes,
  formatNumber,
  pluralize,
} from "@/common/utils/string.util";
import { PasteCreatedTime } from "@/components/paste/created-time";
import { MobilePasteDetails } from "@/components/paste/mobile-paste-details";
import { PasteExpiryTime } from "@/components/paste/paste-expiry-time";
import { PasteWithContent } from "@/types/paste";
import { PasteEditDetails } from "@/types/paste-edit-details";
import { Copy, Download, FileText, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Expiry } from "./expiry";
import { PasteFooterButton } from "./paste-footer-button";

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
      paste && `${formatNumber(paste.views)} ${pluralize(paste.views, "View")}`,
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
        "px-2 sm:px-4 py-2 sm:py-2.5 bg-background/50 backdrop-blur-sm border-t border-border/50 select-none flex flex-col justify-center sm:justify-between items-center text-sm w-full"
      }
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-center sm:justify-between w-full">
        <div
          className={`flex flex-wrap gap-3 sm:gap-6 items-center justify-center sm:justify-start min-w-0 ${paste ? "hidden sm:flex" : "flex-1"}`}
        >
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
          <div className="md:hidden relative z-50">
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
              <div className="flex flex-wrap gap-2 w-full">
                {onClear &&
                  editDetails?.content &&
                  editDetails.content.trim().length > 0 && (
                    <PasteFooterButton
                      type="button"
                      variant="outline"
                      onClick={onClear}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </PasteFooterButton>
                  )}
                <PasteFooterButton
                  type="submit"
                  form="paste-form"
                  disabled={isLoading}
                  className="font-semibold shadow-lg flex-1"
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
                </PasteFooterButton>
              </div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:block">
            {paste ? (
              <div className="flex flex-wrap gap-2">
                <PasteFooterButton
                  onClick={() => downloadFile(`${paste.key}`, paste.content)}
                  iconOnly
                >
                  <Download className="h-3 w-3 lg:mr-1" />
                  <span className="hidden lg:inline">Download</span>
                </PasteFooterButton>
                {onCopyContent && (
                  <PasteFooterButton onClick={onCopyContent} iconOnly>
                    <Copy className="h-3 w-3 lg:mr-1" />
                    <span className="hidden lg:inline">Copy</span>
                  </PasteFooterButton>
                )}
                <Link
                  href={`/?duplicate=${encodeURI(paste.id)}`}
                  prefetch={false}
                >
                  <PasteFooterButton variant="secondary" iconOnly>
                    <Copy className="h-3 w-3 lg:mr-1" />
                    <span className="hidden lg:inline">Duplicate</span>
                  </PasteFooterButton>
                </Link>
                <Link href={`/raw/${paste.id}.${paste.ext}`} prefetch={false}>
                  <PasteFooterButton variant="orange" iconOnly>
                    <FileText className="h-3 w-3 lg:mr-1" />
                    <span className="hidden lg:inline">Raw</span>
                  </PasteFooterButton>
                </Link>
                <Link href="/" prefetch={false}>
                  <PasteFooterButton variant="emerald" iconOnly>
                    <Plus className="h-3 w-3 lg:mr-1" />
                    <span className="hidden lg:inline">New</span>
                  </PasteFooterButton>
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {onClear &&
                  editDetails?.content &&
                  editDetails.content.trim().length > 0 && (
                    <PasteFooterButton
                      type="button"
                      variant="outline"
                      onClick={onClear}
                      disabled={isLoading}
                      iconOnly
                    >
                      <Trash2 className="h-3 w-3 lg:mr-1" />
                      <span className="hidden lg:inline">Clear</span>
                    </PasteFooterButton>
                  )}
                <PasteFooterButton
                  type="submit"
                  form="paste-form"
                  disabled={isLoading}
                  className="font-semibold shadow-lg"
                  iconOnly
                >
                  {isLoading ? (
                    <div className="flex items-center lg:space-x-2">
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="hidden lg:inline">Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center lg:space-x-2">
                      <Save className="h-4 w-4" />
                      <span className="hidden lg:inline">Save</span>
                    </div>
                  )}
                </PasteFooterButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
