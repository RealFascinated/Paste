import Link from "next/link";
import { ReactNode } from "react";
import { Paste } from "@/types/paste";
import { formatBytes } from "@/common/utils/string.util";
import { getRelativeTime } from "@/common/utils/date.util";
import Tooltip from "./tooltip";
import { Expiry } from "@/components/expiry";
import { Button } from "./ui/button";
import { Config } from "@/common/config";

type PasteDetails = {
  render: (paste: Paste) => string | ReactNode;
};

const pasteDetails: PasteDetails[] = [
  {
    render: (paste: Paste) => formatBytes(paste.size),
  },
  {
    render: (paste: Paste) => {
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
    render: (paste: Paste) =>
      paste.lang === "text" ? "Plain Text" : paste.formattedLang,
  },
];

function PasteDetails({ paste }: { paste?: Paste }) {
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
  paste?: Paste;
};

export function Navbar({ paste }: NavbarProps) {
  return (
    <div className="min-h-[40px] p-1.5 px-3 bg-background-secondary select-none">
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <Link href="/">
            <p className="font-bold hover:brightness-75 transition-all transform-gpu">
              {Config.siteTitle}
            </p>
          </Link>
          <div className="hidden sm:block">
            <PasteDetails paste={paste} />
          </div>
        </div>

        <div className="flex gap-2">
          {paste ? (
            <>
              <Link href={`/raw/${paste.id}.${paste.ext}`}>
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
