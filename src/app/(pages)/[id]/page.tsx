import { redirect } from "next/navigation";
import { getPaste } from "@/app/common/prisma";
import { Navbar } from "@/app/components/navbar";
import Highlighter from "@/app/components/highlighter";

type PasteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Paste({ params }: PasteProps) {
  const id = (await params).id;
  const paste = await getPaste(id);
  if (paste == null) {
    return redirect("/");
  }

  return (
    <main className="flex flex-col gap-1 min-h-screen">
      <Navbar paste={paste} />
      <div className="overflow-x-auto h-full flex flex-grow w-full text-sm">
        <Highlighter language={paste.lang}>{paste.content}</Highlighter>
      </div>
    </main>
  );
}
