import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { ToastProvider } from "@/app/components/ui/toast";
import PlausibleProvider from "next-plausible";
import Head from "next/head";
import { defaultMetadata } from "@/app/common/metadata";

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
