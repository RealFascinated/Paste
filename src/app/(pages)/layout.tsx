import { Navbar } from "@/components/navbar/navbar";
import { PasteExpiryProvider } from "@/providers/paste-expiry-provider";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <PasteExpiryProvider>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 pb-[80px] sm:pb-[60px]">
          {children}
        </div>
      </div>
    </PasteExpiryProvider>
  );
}
