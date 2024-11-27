import { redirect } from "next/navigation";
import { getPaste } from "@/app/common/prisma";

type PasteRawProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PasteRaw({ params }: PasteRawProps) {
  const id = (await params).id;
  const paste = await getPaste(id);
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
