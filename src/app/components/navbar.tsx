import { formatBytes } from "@/app/common/utils/string.util";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Paste } from "@prisma/client";
import { Expiry } from "@/app/components/expiry";
import { getRelativeTime } from "@/app/common/utils/date.util";
import Tooltip from "@/app/components/tooltip";

type NavbarProps = {
  paste?: Paste;
};

export function Navbar({ paste }: NavbarProps) {
  return (
    <div className="h-[40px] p-1.5 px-3 bg-background-secondary flex justify-between items-center select-none">
      <div className="flex flex-row gap-3 items-center">
        <Link href="/">
          <p className="font-bold hover:brightness-75 transition-all transform-gpu">
            Paste
          </p>
        </Link>
        <div className="text-xs">
          {paste ? (
            <>
              <p>{formatBytes(paste.size)}</p>
              {paste.expiresAt && (
                <Tooltip display={paste.expiresAt.toLocaleString()}>
                  <p>Expires {getRelativeTime(paste.expiresAt)}</p>
                </Tooltip>
              )}
            </>
          ) : (
            <Expiry />
          )}
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
  );
}
