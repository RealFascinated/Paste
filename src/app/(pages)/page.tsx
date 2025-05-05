"use client";

import { getPaste, uploadPaste } from "@/common/api";
import { Config } from "@/common/config";
import { Footer } from "@/components/footer";
import { toast } from "sonner"
import { usePasteExpiry } from "@/providers/paste-expiry-provider";
import { redirect, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

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

  useEffect(() => {
    if (duplicate && content == "") {
      getPaste(duplicate).then(paste => {
        const newPage = "/";
        const newState = { page: newPage };
        window.history.replaceState(newState, "", newPage);
        setContent(paste.content);
      });
    }
  }, [content, duplicate]);

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
      toast.error("Paste cannot be empty");
      return;
    }

    const { paste, error } = await uploadPaste(content, expiry);
    if (error !== null || paste == null) {
      toast.error(error?.error ?? "Failed to create your paste :(");
      return;
    }

    toast.success("Paste created successfully, copied to clipboard!");
    await navigator.clipboard.writeText(
      `${Config.siteUrl}/${paste.key}.${paste.ext}`
    );
    redirect(`/${paste.key}.${paste.ext}`);
  }

  return (
    <form
      onSubmit={async event => {
        event.preventDefault();
        await createPaste(event);
      }}
      className="flex flex-col h-[calc(100vh-120px)] w-full"
    >
      <div className="flex flex-row h-full pl-4 pt-4 gap-2 text-sm z-10">
        <span className="hidden sm:block text-gray-500">{">"}</span>
        <textarea
          name="content"
          className="w-full h-full text-white bg-background resize-none select-none outline-none font-mono text-sm overflow-auto"
          placeholder={Config.pastePlaceholder}
          value={content}
          onChange={event => {
            setContent(event.target.value);
          }}
        />
      </div>

      <Footer
        editDetails={{
          content: content,
          lines: content.length == 0 ? 0 : content.split("\n").length,
          words: content.length == 0 ? 0 : content.split(" ").length,
          characters: content.length == 0 ? 0 : content.split("").length,
        }}
      />
    </form>
  );
}
