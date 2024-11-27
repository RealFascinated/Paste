import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { ToastProvider } from "@/app/components/ui/toast";
import PlausibleProvider from "next-plausible";

import "./globals.css";
const siteFont = localFont({
  src: "./fonts/JetBrainsMono.ttf",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Paste",
  description: "Free and open-source paste service",
  openGraph: {
    title: "Paste",
    description: "Free and open-source paste service",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${siteFont.className} antialiased`}>
        <PlausibleProvider domain="paste.fascinated.cc" selfHosted>
          <ToastProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ToastProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
