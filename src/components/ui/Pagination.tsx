import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import {
  PaginationContent,
  Pagination as PaginationShadcn,
} from "./paginationComponent";

export const Pagination = (props: Omit<any, "total">) => {
  const router = useRouter();
  const currentPage = props.pagination.currentPage;
  const totalPages = props.pagination.totalPages;

  const handlePageChange = (page: number) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        pageIndex: page?.toString(),
      },
    });
  };

  if (totalPages === 1) return null;

  const generatePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 2) {
        pages.push(currentPage - 1);
      }

      pages.push(currentPage);

      if (currentPage < totalPages - 1) {
        pages.push(currentPage + 1);
      }

      // Zawsze pokazujemy pierwszą stronę
      if (!pages.includes(1)) {
        pages.unshift(1);
        if (currentPage > 3) {
          pages.splice(1, 0, "...");
        }
      }

      // Zawsze pokazujemy ostatnią stronę
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
        if (currentPage < totalPages - 2) {
          pages.splice(pages.length - 1, 0, "...");
        }
      }
    }
    return pages;
  };

  const pagesToShow = generatePages();

  return (
    <PaginationShadcn className="text-white mt-4 select-none pb-6">
      <PaginationContent>
        {/* Left arrow */}
        <div
          onClick={() => handlePageChange(currentPage - 1)}
          className={clsx(
            currentPage > 1
              ? "cursor-pointer hover:text-white/70"
              : "opacity-20",
            "w-10 h-10 flex items-center justify-center text-white  rounded-md"
          )}>
          <ChevronLeft size={20} />
        </div>

        {pagesToShow.map((page, index) =>
          typeof page === "number" ? (
            <div
              key={index}
              onClick={() => handlePageChange(page)}
              className={clsx(
                currentPage === page
                  ? "bg-label text-white"
                  : " hover:bg-label",
                "w-10 h-10 flex items-center justify-center cursor-pointer bg-background-charts rounded-md"
              )}>
              {page}
            </div>
          ) : (
            <div
              key={index}
              className="w-10 h-10 flex items-center justify-center">
              ...
            </div>
          )
        )}

        {currentPage < totalPages ? (
          <div
            onClick={() => handlePageChange(currentPage + 1)}
            className={clsx(
              currentPage < totalPages
                ? "cursor-pointer hover:text-white/70"
                : "opacity-20",
              "w-10 h-10 flex items-center justify-center text-white rounded-md"
            )}>
            <ChevronRight size={20} />
          </div>
        ) : (
          <div
            className={clsx(
              currentPage < totalPages
                ? "cursor-pointer hover:text-white/70"
                : "opacity-20",
              "w-10 h-10 flex items-center justify-center text-white  rounded-md"
            )}>
            <ChevronRight size={20} />
          </div>
        )}
      </PaginationContent>
    </PaginationShadcn>
  );
};
