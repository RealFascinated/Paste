import { formatBytes } from "@/app/common/utils/string.util";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Expiry } from "@/app/components/expiry";
import { getRelativeTime } from "@/app/common/utils/date.util";
import Tooltip from "@/app/components/tooltip";
import { PasteWithLang } from "@/app/types/paste";
import { ReactNode } from "react";

type PasteDetails = {
  render: (paste: PasteWithLang) => string | ReactNode;
};

const pasteDetails: PasteDetails[] = [
  {
    render: (paste: PasteWithLang) => formatBytes(paste.size),
  },
  {
    render: (paste: PasteWithLang) => {
      if (paste.expiresAt === null) {
        return undefined;
      }

      return (
        <Tooltip display={paste.expiresAt.toLocaleString()}>
          <p>Expires {getRelativeTime(paste.expiresAt)}</p>
        </Tooltip>
      );
    },
  },
  {
    render: (paste: PasteWithLang) =>
      paste.lang === "text" ? "Plain Text" : paste.formattedLang,
  },
];

function PasteDetails({ paste }: { paste?: PasteWithLang }) {
  return (
    <div className="text-xs flex flex-row gap-1 items-center">
      {paste ? (
        <>
          {pasteDetails.map((detail, index) => {
            const rendered = detail.render(paste);
            if (rendered == undefined) {
              return undefined;
            }

            return (
              <div key={index} className="flex flex-row gap-1">
                {rendered}
                {index !== pasteDetails.length - 1 && <p>|</p>}
              </div>
            );
          })}
        </>
      ) : (
        <Expiry />
      )}
    </div>
  );
}

type NavbarProps = {
  paste?: PasteWithLang;
};

export function Navbar({ paste }: NavbarProps) {
  return (
    <div className="min-h-[40px] p-1.5 px-3 bg-background-secondary select-none">
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <Link href="/">
            <p className="font-bold hover:brightness-75 transition-all transform-gpu">
              Paste
            </p>
          </Link>
          <div className="hidden sm:block">
            <PasteDetails paste={paste} />
          </div>
        </div>

        <div className="flex gap-2">
          {paste ? (
            <>
              <Link href={`/raw/${paste.id}`}>
                <Button>Raw</Button>
              </Link>
              <Link href="/">
                <Button>New</Button>
              </Link>
            </>
          ) : (
            <>
              <>
                <Button type="submit">Save</Button>
              </>
            </>
          )}
        </div>
      </div>
      <div className="block sm:hidden">
        <PasteDetails paste={paste} />
      </div>
    </div>
  );
}
