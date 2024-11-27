"use client";

import { usePasteExpiry } from "@/app/providers/paste-expiry-provider";
import { uploadPaste } from "@/app/common/api";
import { redirect } from "next/navigation";
import { Paste } from "@prisma/client";
import { Navbar } from "@/app/components/navbar";
import Form from "next/form";

export function PastePage() {
  const { expiry } = usePasteExpiry();

  /**
   * Creates a new paste.
   *
   * @param form the form to create the paste with.
   */
  async function createPaste(form: FormData) {
    const content = form.get("content") as string;
    if (content == null || content.length == 0) {
      return;
    }

    let paste: Paste | null = null;
    try {
      paste = await uploadPaste(content, expiry);
    } catch (error) {
      console.error(error);
    } finally {
      if (paste != null) {
        redirect(`/${paste.id}`);
      }
    }
  }

  return (
    <Form
      action={createPaste}
      // onSubmit={(event) => event.preventDefault()}
      className="flex flex-col min-h-screen"
    >
      <Navbar />
      <div className="flex flex-row flex-grow pl-[0.5rem] pt-[0.5rem] gap-1 text-sm">
        <span>{">"}</span>
        <textarea
          name="content"
          className="w-full text-white bg-background resize-none select-none outline-none"
          placeholder="Paste here..."
        />
      </div>
    </Form>
  );
}
