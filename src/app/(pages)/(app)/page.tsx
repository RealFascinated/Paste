"use client";

import {redirect, useSearchParams} from "next/navigation";
import {FormEvent, Suspense, useEffect, useState} from "react";
import {usePasteExpiry} from "@/providers/paste-expiry-provider";
import {toast} from "@/hooks/use-toast";
import {getPaste, uploadPaste} from "@/common/api";
import {Config} from "@/common/config";
import {Footer} from "@/components/footer";

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
      toast({
        title: "Error",
        description: "Paste cannot be empty",
      });
      return;
    }

    const { paste, error } = await uploadPaste(content, expiry);
    if (error !== null || paste == null) {
      toast({
        title: "Error",
        description: error?.error ?? "Failed to create your paste :("
      })
      return;
    }

    toast({
      title: "Success",
      description: "Paste created successfully, copied to clipboard!",
    });
    await navigator.clipboard.writeText(
      `${Config.siteUrl}/${paste.key}.${paste.ext}`,
    );
    redirect(`/${paste.key}.${paste.ext}`);
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await createPaste(event);
      }}
      className="flex flex-col h-full flex-grow gap-1 w-full"
    >
      <div className="flex flex-row flex-grow pl-[0.5rem] pt-[0.5rem] gap-2 text-sm z-10">
        <span className="hidden sm:block">{">"}</span>
        <textarea
          name="content"
          className="w-full text-white bg-background resize-none select-none outline-none"
          placeholder={Config.pastePlaceholder}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
        />
      </div>

      <Footer editDetails={{
        content: content,
        lines: content.length == 0 ? 0 : content.split("\n").length,
        words: content.length == 0 ? 0 : content.split(" ").length,
        characters: content.length == 0 ? 0 : content.split("").length
      }} />
    </form>
  );
}
