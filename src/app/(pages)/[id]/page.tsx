import { redirect } from "next/navigation";
import { Metadata } from "next";
import { lookupPaste } from "@/common/utils/paste.util";
import { defaultMetadata } from "@/common/metadata";
import { formatBytes } from "@/common/utils/string.util";
import { getRelativeTime } from "@/common/utils/date.util";
import { Navbar } from "@/components/navbar";
import Highlighter from "@/components/highlighter";

type PasteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(props: PasteProps): Promise<Metadata> {
  const id = (await props.params).id;
  const paste = await lookupPaste(id);
  if (paste == null) {
    return defaultMetadata();
  }

  const formattedId = `${paste.id}.${paste.ext}`;
  return {
    ...defaultMetadata(false),
    title: formattedId,
    openGraph: {
      title: `Paste - ${formattedId}`,
      description: `
Lines: ${paste.content.split("\n").length}
Size: ${formatBytes(paste.size)}
Language: ${paste.formattedLang}
${
  paste.expiresAt !== null
    ? `
Expires ${getRelativeTime(paste.expiresAt)}`
    : ""
}
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
