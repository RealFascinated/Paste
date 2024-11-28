"use client";

import { getLoggedInUsersPastes } from "@/common/api";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/pagination";
import { Page } from "@/common/pagination/pagination";
import { Paste } from "@/types/paste";
import { ReactNode, useEffect, useState } from "react";
import Highlighter from "@/components/highlighter";
import {
  formatBytes,
  formatNumber,
  getLines,
} from "@/common/utils/string.util";
import Link from "next/link";
import { PasteCreatedTime } from "@/components/paste/created-time";
import Tooltip from "@/components/tooltip";
import { getRelativeTime } from "@/common/utils/date.util";

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
      return <PasteCreatedTime createdAt={paste.timestamp} />;
    },
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

export function PastesDashboard() {
  const [page, setPage] = useState(1);
  const [pastes, setPastes] = useState<Page<Paste> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard:pastes", page],
    queryFn: () => getLoggedInUsersPastes(page),
  });

  useEffect(() => {
    if (data) {
      setPastes(data);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      {isLoading && !pastes && <p>Loading pastes...</p>}
      {pastes && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {pastes.items.map((paste) => {
              return (
                <div
                  key={paste.id}
                  className="bg-background-secondary p-1.5 rounded-md"
                >
                  <div className="flex gap-2">
                    <Link
                      href={`/${paste.id}`}
                      className="hover:text-link transition-all transform-gpu"
                    >
                      <p>{paste.id}</p>
                    </Link>
                    <div className="text-xs flex items-center justify-center flex-wrap divide-x-2 divide-secondary">
                      {pasteDetails.map((detail, index) => {
                        const rendered = detail.render(paste);
                        if (rendered == undefined) {
                          return undefined;
                        }

                        return (
                          <div key={index} className="flex flex-row px-2">
                            {rendered}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Highlighter
                    language={paste.lang}
                    content={getLines(paste.content, 3).join("\n")}
                  />
                </div>
              );
            })}
          </div>

          <Pagination
            mobilePagination={false}
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
