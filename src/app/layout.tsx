import { defaultMetadata } from "@/common/metadata";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { ReactNode } from "react";
import "./globals.css";
import { env } from "@/common/env";

const siteFont = localFont({
  src: "./fonts/JetBrainsMono.ttf",
  weight: "100 900",
});

export const metadata: Metadata = defaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="en">
      {env.NEXT_PUBLIC_ANALYTICS_SERVICE === "umami" && isProduction && (
        <Script
          src={env.NEXT_PUBLIC_ANALYTICS_UMAMI_SCRIPT}
          data-website-id={env.NEXT_PUBLIC_ANALYTICS_UMAMI_DATA_ID}
        />
      )}
      <body
        className={`${siteFont.className} antialiased w-full h-dvh overflow-hidden`}
      >
        <Toaster />
        <TooltipProvider>
          <QueryProvider>
            <main className="flex flex-col h-full text-white w-full">
              {children}
            </main>
          </QueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
