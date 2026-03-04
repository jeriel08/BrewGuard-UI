import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function DataTablePagination({ table }) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  // Helper to generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (pageCount <= maxVisiblePages) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, and current window
      if (pageIndex < 3) {
        pages.push(0, 1, 2, "ellipsis", pageCount - 1);
      } else if (pageIndex > pageCount - 4) {
        pages.push(0, "ellipsis", pageCount - 3, pageCount - 2, pageCount - 1);
      } else {
        pages.push(0, "ellipsis", pageIndex, "ellipsis", pageCount - 1);
      }
    }
    return pages;
  };

  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-center md:justify-end py-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              disabled={!canPreviousPage}
              className={
                !canPreviousPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={pageIndex === page}
                  onClick={() => table.setPageIndex(page)}
                  className="cursor-pointer"
                >
                  {page + 1}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              disabled={!canNextPage}
              className={
                !canNextPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
