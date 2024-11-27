import { PastePage } from "@/components/paste";
import { PasteExpiryProvider } from "@/providers/paste-expiry-provider";

export default function Home() {
  return (
    <main>
      <PasteExpiryProvider>
        <PastePage />
      </PasteExpiryProvider>
    </main>
  );
}
