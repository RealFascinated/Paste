import { PasteExpiryProvider } from "@/app/providers/paste-expiry-provider";
import { PastePage } from "@/app/components/paste";

export default function Home() {
  return (
    <main>
      <PasteExpiryProvider>
        <PastePage />
      </PasteExpiryProvider>
    </main>
  );
}
