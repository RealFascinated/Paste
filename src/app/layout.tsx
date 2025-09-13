import { defaultMetadata } from "@/common/metadata";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { ReactNode } from "react";
import "./globals.css";

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
  return (
    <html lang="en">
      {process.env.ANALYTICS_SERVICE === "umami" &&
        process.env.NODE_ENV === "production" && (
          <Script
            src={process.env.ANALYTICS_UMAMI_SCRIPT}
            data-domain={process.env.ANALYTICS_UMAMI_DOMAIN}
          />
        )}
      <body className={`${siteFont.className} antialiased w-full h-[95vh] overflow-hidden`}>
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
