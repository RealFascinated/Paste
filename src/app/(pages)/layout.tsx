import { Navbar } from "@/components/navbar/navbar";
import { PasteExpiryProvider } from "@/providers/paste-expiry-provider";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <PasteExpiryProvider>
      <div className="flex flex-col h-full">
        <Navbar />
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </PasteExpiryProvider>
  );
}
