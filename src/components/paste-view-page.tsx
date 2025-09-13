"use client";

import { toastUtil } from "@/common/utils/toast.util";
import { Footer } from "@/components/footer";
import Highlighter from "@/components/highlighter";
import { usePasteViewShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { PasteWithContent } from "@/types/paste";

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
      window.location.href = `/raw/${paste.id}.${paste.ext}`;
    }
  };

  const handleCopyUrl = () => {
    if (paste) {
      const pasteUrl = `${window.location.origin}/${paste.id}.${paste.ext}`;
      navigator.clipboard.writeText(pasteUrl);
      toastUtil.pasteCopied(pasteUrl);
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
      <main className="flex-1 min-h-0 overflow-auto">
        {paste ? (
          <Highlighter language={paste.ext} content={paste.content} />
        ) : (
          <div className="text-center w-full items-center mt-5 px-4">
            <p className="text-xl text-red-400">404</p>
            <p className="text-sm sm:text-base">
              Paste &#39;{id}&#39; not found, maybe it expired?
            </p>
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
        />
      )}
    </div>
  );
}
