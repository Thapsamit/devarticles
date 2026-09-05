import React from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const Pagination = ({ page = 1, totalPages = 1, onChange }) => {
  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange?.(p);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-8 flex justify-center">
      <ul className="flex items-center gap-1.5">
        <li>
          <button
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            className="icon-btn disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <HiOutlineChevronLeft className="h-4 w-4" />
          </button>
        </li>

        {pages.map((p) => (
          <li key={p}>
            <button
              onClick={() => go(p)}
              aria-current={p === page ? "page" : undefined}
              className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl2 px-3 text-[13.5px] font-medium transition-all duration-200 ${
                p === page
                  ? "border border-accent-500/[0.45] bg-accent-500/[0.14] text-accent-200"
                  : "border border-hair/[0.08] bg-hair/[0.04] text-primaryText2 hover:bg-hair/[0.09] hover:text-primaryText4"
              }`}
            >
              {p}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() => go(page + 1)}
            disabled={page >= totalPages}
            className="icon-btn disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <HiOutlineChevronRight className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
