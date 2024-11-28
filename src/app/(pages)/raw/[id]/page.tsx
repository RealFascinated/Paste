import { lookupPaste } from "@/common/utils/paste.util";
import { redirect } from "next/navigation";

type PasteRawProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RawPage({ params }: PasteRawProps) {
  const id = (await params).id;
  const paste = await lookupPaste(id);
  if (paste == null) {
    return redirect("/");
  }

  return (
    <main>
      <code>
        <pre>{paste.content}</pre>
      </code>
    </main>
  );
}
