import { Config } from "@/common/config";
import { defaultMetadata } from "@/common/metadata";
import { getPaste } from "@/common/prisma";
import { getRelativeTime } from "@/common/utils/date.util";
import { formatBytes, pluralize } from "@/common/utils/string.util";
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

  const title = `Paste ${queryId}`;
  const description = `${paste.language} code snippet • ${paste.lineCount} ${pluralize(paste.lineCount, "line")} • ${formatBytes(paste.size)}${paste.expiresAt ? ` • Expires ${getRelativeTime(paste.expiresAt)}` : ""}`;
  const url = `${Config.siteUrl}/${queryId}`;

  return {
    ...defaultMetadata(false),
    title,
    description,
    keywords: [
      "paste",
      "code",
      paste.language.toLowerCase(),
      "snippet",
      "share",
    ],
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: Config.siteTitle,
      locale: "en_US",
      images: [
        {
          url: `${Config.siteUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&language=${encodeURIComponent(paste.language)}&lines=${paste.lineCount}&size=${encodeURIComponent(formatBytes(paste.size))}`,
          width: 1200,
          height: 630,
          alt: `${paste.language} code snippet`,
        },
      ],
      publishedTime: paste.timestamp.toISOString(),
      authors: ["Paste"],
      tags: [paste.language, "code", "snippet"],
    },
    twitter: {
      card: "summary_large_image",
      site: "@paste",
      creator: "@paste",
      title,
      description,
      images: [
        `${Config.siteUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&language=${encodeURIComponent(paste.language)}&lines=${paste.lineCount}&size=${encodeURIComponent(formatBytes(paste.size))}`,
      ],
    },
    other: {
      "og:image:alt": `${paste.language} code snippet`,
      "article:author": "Paste",
      "article:section": "Code",
      "article:tag": paste.language,
    },
  };
}

export default async function PastePage({ params }: PasteProps) {
  const queryId = (await params).id;
  const paste = await getPaste(queryId, true);

  if (!paste) {
    return <div>Paste not found</div>;
  }

  return (
    <Suspense fallback={<LoadingState type="paste-view" />}>
      <PasteViewPage paste={paste} id={queryId} />
    </Suspense>
  );
}
