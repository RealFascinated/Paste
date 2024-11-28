import { Navbar } from "@/components/navbar/navbar";
import { PasteExpiryProvider } from "@/providers/paste-expiry-provider";

import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <PasteExpiryProvider>
      <Navbar />
      {children}
    </PasteExpiryProvider>
  );
}
