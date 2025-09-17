import { Metadata } from "next";
import { Config } from "./config";

/**
 * Default metadata for the app.
 *
 * @param openGraph Whether to include Open Graph metadata.
 * @returns The default metadata.
 */
export function defaultMetadata(openGraph: boolean = true): Metadata {
  return {
    title: {
      default: Config.siteTitle,
      template: `%s | ${Config.siteTitle}`,
    },
    description:
      "Free and open-source paste service for sharing code snippets and text",
    keywords: [
      "paste",
      "code sharing",
      "text sharing",
      "snippets",
      "open source",
    ],
    authors: [{ name: "Paste" }],
    creator: "Paste",
    publisher: "Paste",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(openGraph && {
      openGraph: {
        type: "website",
        locale: "en_US",
        url: Config.siteUrl,
        siteName: Config.siteTitle,
        title: Config.siteTitle,
        description:
          "Free and open-source paste service for sharing code snippets and text",
        images: [
          {
            url: `${Config.siteUrl}/api/og?title=${encodeURIComponent(Config.siteTitle)}&description=${encodeURIComponent("Free and open-source paste service")}`,
            width: 1200,
            height: 630,
            alt: Config.siteTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@paste",
        creator: "@paste",
        title: Config.siteTitle,
        description:
          "Free and open-source paste service for sharing code snippets and text",
        images: [
          `${Config.siteUrl}/api/og?title=${encodeURIComponent(Config.siteTitle)}&description=${encodeURIComponent("Free and open-source paste service")}`,
        ],
      },
    }),
  };
}
