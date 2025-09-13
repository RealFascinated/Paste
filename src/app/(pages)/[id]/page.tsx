import { defaultMetadata } from "@/common/metadata";
import { getRelativeTime } from "@/common/utils/date.util";
import { lookupPaste } from "@/common/utils/paste.util";
import { formatBytes } from "@/common/utils/string.util";
import { LoadingState } from "@/components/loading-states";
import { PasteViewPage } from "@/components/paste-view-page";
import { Metadata } from "next";
import { Suspense } from "react";

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
    <Suspense fallback={<LoadingState type="paste-view" />}>
      <PasteViewPage paste={paste} id={id} />
    </Suspense>
  );
}
