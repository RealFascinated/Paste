import { redirect } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import Highlighter from "@/app/components/highlighter";
import { Metadata } from "next";
import { defaultMetadata } from "@/app/common/metadata";
import { formatBytes } from "@/app/common/utils/string.util";
import { getRelativeTime } from "@/app/common/utils/date.util";
import { lookupPaste } from "@/app/common/utils/paste.util";

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

  const formattedId = `${paste.id}.${paste.lang}`;
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
