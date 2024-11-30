import Link from "next/link";
import { ReactNode } from "react";
import { Paste } from "@/types/paste";
import { formatBytes, formatNumber } from "@/common/utils/string.util";
import { getRelativeTime } from "@/common/utils/date.util";
import Tooltip from "./tooltip";
import { Expiry } from "@/components/expiry";
import { Button } from "@/components/button";
import { PasteCreatedTime } from "@/components/paste/created-time";
import { DownloadPasteButton } from "@/components/paste/download-button";
import { cn } from "@/common/utils";
import { PasteLanguageIcon } from "@/components/paste/language-icon";
import {PasteEditDetails} from "@/types/paste-edit-details";

type PasteDetails = {
  type: "paste" | "edit";
  render: (paste?: Paste, editDetails?: PasteEditDetails) => ReactNode | string;
};

const pasteDetails: PasteDetails[] = [
  {
    type: "paste",
    render: (paste?: Paste) => paste && formatBytes(paste.size),
  },
  {
    type: "paste",
    render: (paste?: Paste) =>
      paste && `${formatNumber(paste.views)} View${paste.views === 1 ? "" : "s"}`,
  },
  {
    type: "paste",
    render: (paste?: Paste) => paste && <PasteCreatedTime createdAt={paste.timestamp} />,
  },
  {
    type: "paste",
    render: (paste?: Paste) => {
      if (!paste || paste.expiresAt === null) {
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
    type: "paste",
    render: (paste?: Paste) => (
      paste && <div className="flex gap-1 items-center">
        <PasteLanguageIcon
          ext={paste.ext}
          formattedLang={paste.formattedLang}
        />
        {paste.formattedLang}
      </div>
    ),
  },

  // Paste edit details
  {
    type: "edit",
    render: (paste?: Paste, editDetails?: PasteEditDetails) => (
      !editDetails ? undefined : <p>{editDetails.lines} lines, {editDetails.words} words, {editDetails.characters} characters</p>
    )
  },
];

function PasteDetails({ paste, editDetails }: { paste?: Paste, editDetails?: PasteEditDetails }) {
  return (
    <div className="text-xs flex items-center justify-center flex-wrap divide-x-2 divide-secondary">
      {pasteDetails.map((detail, index) => {
        const rendered = detail.render(paste, editDetails);
        if (rendered == undefined) {
          return undefined;
        }

        return (
          <div key={index} className="flex flex-row gap-1 px-2">
            {rendered}
          </div>
        );
      })}
    </div>
  );
}

type FooterProps = {
  paste?: Paste;
  editDetails?: PasteEditDetails;
};

export function Footer({ paste, editDetails }: FooterProps) {
  return (
    <div
      className={cn(
        "min-h-[40px] p-1.5 px-3 bg-background-secondary select-none gap-1 flex justify-between items-center text-sm",
        paste && "flex-col-reverse md:flex-row",
      )}
    >
      <div className="flex gap-2">
        {!paste && <Expiry />}
        {paste || editDetails ? (
          <PasteDetails paste={paste} editDetails={editDetails} />
        ) : null}
      </div>

      <>
        {paste ? (
          <div className="flex gap-2">
            <DownloadPasteButton paste={paste} />
            <Link href={`/?content=${encodeURI(paste.content)}`}>
              <Button>Copy</Button>
            </Link>
            <Link href={`/src/app/(pages)/(app)/raw/${paste.id}.${paste.ext}`}>
              <Button>Raw</Button>
            </Link>
            <Link href="/">
              <Button>New</Button>
            </Link>
          </div>
        ) : (
          <>

            <Button>Save</Button>
          </>
        )}
      </>
    </div>
  );
}
