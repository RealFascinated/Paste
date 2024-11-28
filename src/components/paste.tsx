"use client";

import { redirect } from "next/navigation";
import { FormEvent } from "react";
import { usePasteExpiry } from "@/providers/paste-expiry-provider";
import { toast } from "@/hooks/use-toast";
import { uploadPaste } from "@/common/api";
import { Config } from "@/common/config";
import { Paste } from "@/types/paste";
import { Footer } from "@/components/footer";

export function PastePage() {
  const { expiry } = usePasteExpiry();

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

    let paste: Paste | null = null;
    try {
      paste = await uploadPaste(content, expiry);
      toast({
        title: "Success",
        description: "Paste created successfully, copied to clipboard!",
      });
      await navigator.clipboard.writeText(
        `${Config.siteUrl}/${paste.key}.${paste.ext}`,
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to upload paste",
      });
    } finally {
      if (paste != null) {
        redirect(`/${paste.key}.${paste.ext}`);
      }
    }
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
        />
      </div>

      <Footer />
    </form>
  );
}
