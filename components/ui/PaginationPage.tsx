"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const PaginationPage: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const getPageNumbers = () => {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let l: number | undefined;
    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <section className="w-full py-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2 text-gray-400">
                  <MoreHorizontal size={16} />
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`h-9 w-9 rounded-full border text-sm font-medium cursor-pointer transition-all ${
                    currentPage === page
                      ? "bg-[#09714e] border-[#09714e] text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="hidden sm:block text-sm text-gray-600">
          Page <span className="font-semibold">{currentPage}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </div>
      </div>
    </section>
  );
};

export default PaginationPage;
