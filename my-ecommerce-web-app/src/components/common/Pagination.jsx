import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const window = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - window && i <= currentPage + window)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200
          text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <HiChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-sm text-gray-400">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors
              ${
                page === currentPage
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200
          text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <HiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
