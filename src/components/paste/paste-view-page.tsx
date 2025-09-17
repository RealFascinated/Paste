"use client";

import { toastUtil } from "@/common/utils/toast.util";
import { Footer } from "@/components/footer";
import Highlighter from "@/components/highlighter";
import { usePasteViewShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { PasteWithContent } from "@/types/paste";
import { AlertTriangle, FileText, Plus } from "lucide-react";

type PasteViewPageProps = {
  paste: PasteWithContent | null;
  id: string;
};

export function PasteViewPage({ paste, id }: PasteViewPageProps) {
  // Keyboard shortcuts for paste view
  const handleNew = () => {
    window.location.href = "/";
  };

  const handleDuplicate = () => {
    if (paste) {
      window.location.href = `/?duplicate=${paste.id}`;
    }
  };

  const handleRaw = () => {
    if (paste) {
      window.location.href = `/raw/${paste.id}`;
    }
  };

  const handleCopyUrl = () => {
    if (paste) {
      const pasteUrl = `${window.location.origin}/${paste.id}`;
      navigator.clipboard.writeText(pasteUrl);
      toastUtil.pasteCopied(pasteUrl);
    }
  };

  const handleCopyContent = () => {
    if (paste) {
      navigator.clipboard.writeText(paste.content);
      toastUtil.pasteCopied(paste.content);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  usePasteViewShortcuts(
    handleNew,
    handleDuplicate,
    handleRaw,
    handleCopyUrl,
    handleBack,
    !!paste,
    !!paste,
    !!paste
  );

  return (
    <div className="h-full flex flex-col">
      {/* Self-destructing paste warning */}
      {paste && paste.deleteAfterRead && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-3">
          <div className="flex items-center gap-2 text-red-400">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Self-Destructing Paste
              </span>
            </div>
          </div>
          <p className="text-xs text-red-300 mt-1">
            This paste will be automatically deleted after viewing. Copy the
            content now if you need to save it.
          </p>
        </div>
      )}

      <main className="flex-1 min-h-0 overflow-auto">
        {paste ? (
          <Highlighter language={paste.ext} content={paste.content} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
            <div className="text-center space-y-6 max-w-md">
              {/* 404 Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-red-400" />
                </div>
              </div>

              {/* Error Message */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Paste Not Found
                </h1>
                <p className="text-muted-foreground">
                  The paste{" "}
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                    {id}
                  </code>{" "}
                  could not be found.
                </p>
              </div>

              {/* Possible Reasons */}
              <div className="text-left space-y-2 text-sm text-muted-foreground">
                <p className="font-medium">This could be because:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>The paste has expired</li>
                  <li>The paste was self-destructing and has been deleted</li>
                  <li>The URL is incorrect</li>
                  <li>The paste was never created</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleNew}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create New Paste
                </button>
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors text-sm font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {paste && (
        <Footer
          paste={paste}
          onDuplicate={handleDuplicate}
          onRaw={handleRaw}
          onNew={handleNew}
          onCopyUrl={handleCopyUrl}
          onCopyContent={handleCopyContent}
        />
      )}
    </div>
  );
}
