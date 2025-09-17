"use client";

import { getPaste, uploadPaste } from "@/common/api";
import { Config } from "@/common/config";
import { toastUtil } from "@/common/utils/toast.util";
import { CodeEditor } from "@/components/editor/code-editor";
import { Footer } from "@/components/footer";
import { LoadingState } from "@/components/loading-states";
import { useCreatePageShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { usePasteExpiry } from "@/providers/paste-expiry-provider";
import { redirect, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";

export default function PasteCreatePage() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}

function Page() {
  const searchParams = useSearchParams();
  const { expiry } = usePasteExpiry();

  const duplicate = searchParams.get("duplicate");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingDuplicate, setIsLoadingDuplicate] = useState<boolean>(false);
  const [deleteAfterRead, setDeleteAfterRead] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (duplicate && content == "") {
      setIsLoadingDuplicate(true);
      getPaste(duplicate)
        .then(paste => {
          const newPage = "/";
          const newState = { page: newPage };
          window.history.replaceState(newState, "", newPage);
          setContent(paste.content);
        })
        .catch(() => {
          toastUtil.pasteNotFound();
        })
        .finally(() => {
          setIsLoadingDuplicate(false);
        });
    }
  }, [content, duplicate]);

  // Keyboard shortcuts
  const handleSave = () => {
    if (content.trim() && !isLoading) {
      formRef.current?.requestSubmit();
    }
  };

  const handleNew = () => {
    setContent("");
    setDeleteAfterRead(false);
    toastUtil.info("Editor cleared", {
      title: "New Paste",
      description: "Ready to create a new paste",
    });
  };

  const handleDeleteAfterReadToggle = (enabled: boolean) => {
    setDeleteAfterRead(enabled);
    if (enabled) {
      toastUtil.deleteAfterReadEnabled();
    } else {
      toastUtil.deleteAfterReadDisabled();
    }
  };

  useCreatePageShortcuts(
    handleSave,
    handleNew,
    content.trim().length > 0 && !isLoading
  );

  /**
   * Creates a new paste.
   *
   * @param event
   */
  async function createPaste(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.target as HTMLFormElement);
    const content = form.get("content") as string;
    if (content == null || content.length == 0) {
      toastUtil.pasteEmpty();
      return;
    }

    setIsLoading(true);
    toastUtil.loading("Creating your paste...");

    try {
      const { paste, error } = await uploadPaste(
        content,
        expiry,
        deleteAfterRead
      );

      if (error !== null || paste == null) {
        toastUtil.dismissLoading();
        toastUtil.serverError(error?.error ?? "Failed to create your paste");
        return;
      }

      const pasteUrl = `${Config.siteUrl}/${paste.key}`;
      await navigator.clipboard.writeText(pasteUrl);

      toastUtil.dismissLoading();

      // Don't redirect if it's a delete after read paste - show success message instead
      if (deleteAfterRead) {
        // Clear the editor for self-destructing pastes
        setContent("");
        setDeleteAfterRead(false);

        toastUtil.success("Self-destructing paste created!", {
          title: "⚠️ Paste Created",
          description:
            "Your paste has been created and will self-destruct after first view. The URL has been copied to your clipboard.",
          action: {
            label: "Copy Link",
            onClick: () => navigator.clipboard.writeText(pasteUrl),
          },
        });
      } else {
        toastUtil.pasteCreated(pasteUrl);
        // Small delay to let the toast show before redirect
        setTimeout(() => {
          redirect(`/${paste.key}`);
        }, 150);
      }
    } catch {
      toastUtil.dismissLoading();
      toastUtil.networkError();
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingDuplicate) {
    return <LoadingState type="paste-edit" />;
  }

  return (
    <div className="flex flex-col h-full">
      <form
        id="paste-form"
        ref={formRef}
        onSubmit={async event => {
          event.preventDefault();
          await createPaste(event);
        }}
        className="flex-1 min-h-0 overflow-hidden"
      >
        <div className="flex flex-row h-full text-sm z-10 min-h-0 overflow-hidden">
          <div className="w-full h-full relative min-h-0">
            <CodeEditor
              content={content}
              onChange={setContent}
              placeholder={Config.pastePlaceholder}
              disabled={isLoading}
              className="w-full h-full min-h-0"
            />
            <input type="hidden" name="content" value={content} />
          </div>
        </div>
      </form>

      <Footer
        editDetails={{
          content: content,
          lines: content.length == 0 ? 0 : content.split("\n").length,
          words: content.length == 0 ? 0 : content.split(" ").length,
          characters: content.length == 0 ? 0 : content.split("").length,
        }}
        isLoading={isLoading}
        onNew={handleNew}
        onSave={handleSave}
        onClear={handleNew}
        onDeleteAfterReadToggle={handleDeleteAfterReadToggle}
        deleteAfterRead={deleteAfterRead}
      />
    </div>
  );
}
