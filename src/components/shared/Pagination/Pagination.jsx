"use client";

import { PaginationSkeleton } from "@/components/skeleton/PaginationSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages, isLoading }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <>
      {isLoading ? (
        <PaginationSkeleton />
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            className="disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-brand"
          >
            <ArrowLeftIcon />
          </Button>

          {pages.map((page) => (
            <Button
              variant="outline"
              key={page}
              onClick={() => goToPage(page)}
              className="cursor-pointer"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1.5 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-brand"
          >
            <ArrowRightIcon />
          </Button>
        </div>
      )}
    </>
  );
}
