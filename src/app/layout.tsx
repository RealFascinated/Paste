import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { defaultMetadata } from "@/common/metadata";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { Navbar } from "@/components/navbar/navbar";
import { PasteExpiryProvider } from "@/providers/paste-expiry-provider";

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
      {process.env.NODE_ENV === "production" && (
        <Script
          src="https://analytics.fascinated.cc/js/script.js"
          data-domain="paste.fascinated.cc"
        />
      )}
      <body className={`${siteFont.className} antialiased w-full h-full`}>
        <Toaster />
        <TooltipProvider>
          <PasteExpiryProvider>
            <main className="flex flex-col min-h-screen text-white w-full">
              <Navbar />
              {children}
            </main>
          </PasteExpiryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
