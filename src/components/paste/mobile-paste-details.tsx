"use client";

import { PasteCreatedTime } from "@/components/paste/created-time";
import { DownloadPasteButton } from "@/components/paste/download-button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { PasteWithContent } from "@/types/paste";
import { PasteEditDetails } from "@/types/paste-edit-details";
import { Copy, FileText, Info, Plus, Save } from "lucide-react";
import { useState } from "react";

interface MobilePasteDetailsProps {
  paste?: PasteWithContent;
  editDetails?: PasteEditDetails;
  onDuplicate?: () => void;
  onRaw?: () => void;
  onNew?: () => void;
  onSave?: () => void;
  onCopyUrl?: () => void;
  onCopyContent?: () => void;
  isLoading?: boolean;
}

export function MobilePasteDetails({
  paste,
  editDetails,
  onDuplicate,
  onRaw,
  onNew,
  onSave,
  onCopyUrl,
  onCopyContent,
  isLoading = false,
}: MobilePasteDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pasteDetails = [
    {
      type: "language",
      render: (paste?: PasteWithContent) =>
        paste && (
          <div className="flex gap-1 items-center">{paste.language}</div>
        ),
    },
    {
      type: "size",
      render: (paste?: PasteWithContent) =>
        paste && (
          <div className="flex gap-1 items-center">{paste.size} bytes</div>
        ),
    },
    {
      type: "created",
      render: (paste?: PasteWithContent) =>
        paste && <PasteCreatedTime createdAt={paste.timestamp} />,
    },
  ];

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="md:hidden h-8 px-3 text-xs"
      >
        <Info className="h-3 w-3 mr-1" />
        Details
      </Button>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Paste Details"
      >
        <div className="p-4 space-y-4">
          {/* Paste Info */}
          {(paste || editDetails) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Information
              </h4>
              <div className="flex flex-wrap gap-2">
                {pasteDetails.map((detail, index) => {
                  const rendered = detail.render(paste);
                  if (rendered == undefined) {
                    return undefined;
                  }

                  return (
                    <div
                      key={index}
                      className="flex flex-row items-center gap-1 px-3 py-2 rounded-lg bg-muted/60 text-xs text-foreground/90"
                    >
                      {rendered}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {onCopyContent && (
                <Button
                  onClick={() => {
                    onCopyContent();
                    setIsOpen(false);
                  }}
                  size="sm"
                  className="text-xs font-medium px-3 py-2 h-9 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              )}

              {onDuplicate && (
                <Button
                  onClick={() => {
                    onDuplicate();
                    setIsOpen(false);
                  }}
                  size="sm"
                  className="text-xs font-medium px-3 py-2 h-9 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Duplicate
                </Button>
              )}

              {onRaw && (
                <Button
                  onClick={() => {
                    onRaw();
                    setIsOpen(false);
                  }}
                  size="sm"
                  className="text-xs font-medium px-3 py-2 h-9 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Raw
                </Button>
              )}

              {onNew && (
                <Button
                  onClick={() => {
                    onNew();
                    setIsOpen(false);
                  }}
                  size="sm"
                  className="text-xs font-medium px-3 py-2 h-9 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
              )}

              {onSave && (
                <Button
                  onClick={() => {
                    onSave();
                    setIsOpen(false);
                  }}
                  disabled={isLoading}
                  size="sm"
                  className="text-xs font-medium px-3 py-2 h-9 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </>
                  )}
                </Button>
              )}

              {onCopyUrl && (
                <Button
                  onClick={() => {
                    onCopyUrl();
                    setIsOpen(false);
                  }}
                  size="sm"
                  className="text-xs font-medium px-3 py-2 h-9 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy URL
                </Button>
              )}

              {paste && (
                <div className="col-span-2">
                  <DownloadPasteButton
                    paste={paste}
                    className="w-full text-xs font-medium px-3 py-2 h-9 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
