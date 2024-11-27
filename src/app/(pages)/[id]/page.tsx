import { redirect } from "next/navigation";
import { getPaste } from "@/app/common/prisma";
import { Navbar } from "@/app/components/navbar";
import Highlighter from "@/app/components/highlighter";
import { cache } from "react";
import { Paste } from "@prisma/client";
import { Metadata } from "next";
import { defaultMetadata } from "@/app/common/metadata";
import { formatBytes } from "@/app/common/utils/string.util";
import { getRelativeTime } from "@/app/common/utils/date.util";

type PasteProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * Gets a paste from the cache or the database.
 *
 * @param id The ID of the paste to get.
 * @returns The paste with the given ID.
 */
const lookupPaste = cache(async (id: string): Promise<Paste | null> => {
  return getPaste(id);
});

export async function generateMetadata(props: PasteProps): Promise<Metadata> {
  const id = (await props.params).id;
  const paste = await lookupPaste(id);
  if (paste == null) {
    return defaultMetadata;
  }

  return {
    ...defaultMetadata,
    openGraph: {
      title: `Paste - ${paste.id}`,
      description: `
Lines: ${paste.content.split("\n").length}
Size: ${formatBytes(paste.size)}

${paste.expiresAt !== null ? `Expires ${getRelativeTime(paste.expiresAt)}` : ""}
Click to view the Paste.
`,
    },
  };
}

export default async function PastePage({ params }: PasteProps) {
  const id = (await params).id;
  const paste = await lookupPaste(id);
  if (paste == null) {
    return redirect("/");
  }

  return (
    <main className="flex flex-col gap-1 min-h-screen">
      <Navbar paste={paste} />
      <div className="overflow-x-auto h-full flex flex-grow w-full text-sm">
        <Highlighter language={paste.lang}>{paste.content}</Highlighter>
      </div>
    </main>
  );
}
