"use client";

import { redirect } from "next/navigation";
import { Paste } from "@prisma/client";
import { FormEvent } from "react";
import { usePasteExpiry } from "@/providers/paste-expiry-provider";
import { useToast } from "@/hooks/use-toast";
import { uploadPaste } from "@/common/api";
import { Navbar } from "./navbar";
import { Config } from "@/common/config";

export function PastePage() {
  const { expiry } = usePasteExpiry();
  const toast = useToast();

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
      return;
    }

    let paste: Paste | null = null;
    try {
      paste = await uploadPaste(content, expiry);
    } catch (error) {
      console.error(error);
      toast.toast({
        title: "Error",
        description: "Failed to upload paste",
      });
    } finally {
      if (paste != null) {
        redirect(`/${paste.id}`);
      }
    }
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await createPaste(event);
      }}
      className="flex flex-col min-h-screen gap-1"
    >
      <Navbar />
      <div className="flex flex-row flex-grow pl-[0.5rem] pt-[0.5rem] gap-2 text-sm">
        <span className="hidden sm:block">{">"}</span>
        <textarea
          name="content"
          className="w-full text-white bg-background resize-none select-none outline-none"
          placeholder={Config.pastePlaceholder}
        />
      </div>
    </form>
  );
}
