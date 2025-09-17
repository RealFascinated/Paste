import { defaultMetadata } from "@/common/metadata";
import { getPaste } from "@/common/prisma";
import { getRelativeTime } from "@/common/utils/date.util";
import { formatBytes } from "@/common/utils/string.util";
import { LoadingState } from "@/components/loading-states";
import { PasteViewPage } from "@/components/paste/paste-view-page";
import { Metadata } from "next";
import { Suspense } from "react";

type PasteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(props: PasteProps): Promise<Metadata> {
  const queryId = (await props.params).id;
  const paste = await getPaste(queryId, false);
  if (paste == null) {
    return defaultMetadata();
  }

  return {
    ...defaultMetadata(false),
    title: queryId,
    openGraph: {
      title: `Paste - ${queryId}`,
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
  const queryId = (await params).id;
  const paste = await getPaste(queryId, true);

  return (
    <Suspense fallback={<LoadingState type="paste-view" />}>
      <PasteViewPage paste={paste} id={queryId} />
    </Suspense>
  );
}
