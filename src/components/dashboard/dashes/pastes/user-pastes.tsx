"use client";

import {getLoggedInUsersPastes} from "@/common/api";
import {useQuery} from "@tanstack/react-query";
import Pagination from "@/components/pagination";
import {Page} from "@/common/pagination/pagination";
import {Paste} from "@/types/paste";
import {ReactNode, useEffect, useState} from "react";
import Highlighter from "@/components/highlighter";
import {formatBytes, formatNumber, getLines,} from "@/common/utils/string.util";
import Link from "next/link";
import {PasteCreatedTime} from "@/components/paste/created-time";
import Tooltip from "@/components/tooltip";
import {getRelativeTime} from "@/common/utils/date.util";
import {useSearchParams} from "next/navigation";
import usePageNavigation from "@/hooks/use-page-navigation";
import {useIsMobile} from "@/hooks/use-is-mobile";
import {PasteLanguageIcon} from "@/components/paste/language-icon";

type PasteDetails = {
  render: (paste: Paste) => string | ReactNode;
};

const pasteDetails: PasteDetails[] = [
  {
    render: (paste: Paste) => formatBytes(paste.size),
  },
  {
    render: (paste: Paste) =>
      `${formatNumber(paste.views)} View${paste.views === 1 ? "" : "s"}`,
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
];

export function UserPastes() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const { navigateToPage } = usePageNavigation();

  const [page, setPage] = useState(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  );
  const [pastes, setPastes] = useState<Page<Paste> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard:pastes", page],
    queryFn: () => getLoggedInUsersPastes(page),
  });

  /**
   * Updates the pastes and sets the page URL.
   */
  useEffect(() => {
    if (data) {
      setPastes(data);
      navigateToPage(`/dashboard/pastes${page > 1 ? `?page=${page}` : ""}`);
    }
  }, [data, navigateToPage, page]);

  return (
    <div className="flex flex-col gap-4 select-none px-2 md:px-5">
      {isLoading && !pastes && <p className="text-center">Loading pastes...</p>}
      {pastes && pastes.items.length === 0 && (
        <p className="text-center">You don&apos;t have any pastes yet.</p>
      )}
      {pastes && pastes.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {pastes.items.map((paste) => {
              return (
                <div
                  key={paste.id}
                  className="bg-background-secondary p-1.5 rounded-md h-full flex flex-col"
                >
                  <div className="flex gap-2 items-center">
                    <Tooltip display={paste.language}>
                      <PasteLanguageIcon
                        ext={paste.ext}
                        language={paste.language}
                      />
                    </Tooltip>
                    <Link
                      href={`/${paste.id}`}
                      draggable={false}
                      className="hover:text-link transition-all transform-gpu text-sm"
                    >
                      <p>
                        {paste.id}.{paste.ext}
                      </p>
                    </Link>
                  </div>
                  <div className="text-sm flex-grow">
                    <Highlighter
                      language={paste.ext}
                      content={getLines(paste.content, 3).join("\n")}
                    />
                  </div>

                  <div className="text-xs text-muted-foreground pt-1 flex gap-1 items-center justify-between">
                    <div className="text-xs flex items-center flex-wrap divide-x-2 divide-secondary">
                      {pasteDetails.map((detail, index) => {
                        const rendered = detail.render(paste);
                        if (rendered == undefined) {
                          return undefined;
                        }

                        return (
                          <div
                            key={index}
                            className="flex flex-row px-2 first:pl-1"
                          >
                            {rendered}
                          </div>
                        );
                      })}
                    </div>
                    <div className="min-w-[125px] flex justify-end">
                      <PasteCreatedTime createdAt={paste.timestamp} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            mobilePagination={isMobile}
            page={page}
            totalItems={pastes.metadata.totalItems}
            itemsPerPage={pastes.metadata.itemsPerPage}
            loadingPage={isLoading ? pastes.metadata.page : undefined}
            onPageChange={(page) => {
              setPage(page);
            }}
          />
        </>
      )}
    </div>
  );
}
