import { Metadata } from "next";

/**
 * Default metadata for the app.
 *
 * @param openGraph Whether to include Open Graph metadata.
 * @returns The default metadata.
 */
export function defaultMetadata(openGraph: boolean = true): Metadata {
  return {
    title: {
      default: "Paste",
      template: "Paste - %s",
    },
    description: "Free and open-source paste service",
    ...(openGraph && {
      openGraph: {
        title: "Paste",
        description: "Free and open-source paste service",
      },
    }),
  };
}
