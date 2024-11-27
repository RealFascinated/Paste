import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import PlausibleProvider from "next-plausible";
import Head from "next/head";
import { defaultMetadata } from "@/common/metadata";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

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
      <Head>
        <PlausibleProvider domain="paste.fascinated.cc" selfHosted />
      </Head>
      <body className={`${siteFont.className} antialiased`}>
        <ToastProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
