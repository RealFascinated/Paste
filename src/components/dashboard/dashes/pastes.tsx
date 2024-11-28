"use client";

import { getLoggedInUsersPastes } from "@/common/api";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/pagination";
import { Page } from "@/common/pagination/pagination";
import { Paste } from "@/types/paste";
import { useEffect, useState } from "react";
import Highlighter from "@/components/highlighter";
import { getLines } from "@/common/utils/string.util";
import Link from "next/link";

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {pastes.items.map((paste) => {
              return (
                <div
                  key={paste.id}
                  className="bg-background-secondary p-1.5 rounded-md"
                >
                  <Link
                    href={`/${paste.id}`}
                    className="hover:text-link transition-all transform-gpu"
                  >
                    <p>{paste.id}</p>
                  </Link>
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
