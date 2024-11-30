import {Metadata} from "next";
import {lookupPaste} from "@/common/utils/paste.util";
import {defaultMetadata} from "@/common/metadata";
import {formatBytes} from "@/common/utils/string.util";
import {getRelativeTime} from "@/common/utils/date.util";
import Highlighter from "@/components/highlighter";
import {Footer} from "@/components/footer";

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
  const paste = await lookupPaste(id, true);

  return (
    <main className="flex flex-col gap-1 h-full flex-grow">
      <div className="overflow-x-auto h-full flex flex-grow w-full text-sm">
        {paste ? (
          <Highlighter language={paste.ext} content={paste.content} />
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
