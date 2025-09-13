import { defaultMetadata } from "@/common/metadata";
import { getRelativeTime } from "@/common/utils/date.util";
import { lookupPaste } from "@/common/utils/paste.util";
import { formatBytes } from "@/common/utils/string.util";
import { Footer } from "@/components/footer";
import Highlighter from "@/components/highlighter";
import { Metadata } from "next";

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
Language: ${paste.language}
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
  const ext = id.split(".")[1] ?? "Text";
  const paste = await lookupPaste(id, true);

  return (
    <main className="flex flex-col gap-1 h-full grow">
      <div className="overflow-x-auto h-full flex grow w-full text-sm">
        {paste ? (
          <Highlighter language={ext} content={paste.content} />
        ) : (
          <div className="text-center w-full items-center mt-5">
            <p className="text-xl text-red-400">404</p>
            <p>Paste &#39;{id}&#39; not found, maybe it expired?</p>
          </div>
        )}
      </div>

      {paste && <Footer paste={paste} />}
    </main>
  );
}
