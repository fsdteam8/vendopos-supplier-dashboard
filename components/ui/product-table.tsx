"use client";

import { Product } from "@/app/features/products/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Edit, Trash2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import PaginationPage from "./PaginationPage";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  onEdit?: (product: Product) => void;
  totalItems?: number;
  onRequestPage?: (page: number) => void;
  externalPage?: number;
}

const ProductTableComponent = ({
  products = [],
  isLoading = false,
  isError = false,
  onEdit,
  totalItems,
  onRequestPage,
  externalPage,
  isFetching,
}: ProductTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showTransition, setShowTransition] = useState(false);

  // Reset to page 1 if the product list changes (e.g., filtering or deleting)
  // Reset to page 1 if the overall data size changes (client-side products length
  // or server-side totalItems). This avoids resetting when only the current page
  // content changes during server-side pagination.
  useEffect(() => {
    const derivedCount =
      typeof totalItems === "number" ? totalItems : products.length;
    setCurrentPage(1);
  }, [products.length, totalItems]);

  // If parent provides a controlled page (server-side pagination), sync it.
  useEffect(() => {
    if (typeof externalPage === "number") {
      setCurrentPage(externalPage);
    }
  }, [externalPage]);

  // Show a small transition overlay when fetching new page data.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isFetching) {
      setShowTransition(true);
    } else {
      // keep overlay visible for at least 300ms for a smooth effect
      t = setTimeout(() => setShowTransition(false), 300);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isFetching]);

  const { paginatedData, totalPages } = useMemo(() => {
    if (isLoading || isError || !Array.isArray(products)) {
      return { paginatedData: [], totalPages: 1 };
    }

    // If `totalItems` is provided by the parent, assume server-side pagination
    // and don't re-slice the provided `products` array (it's already a page).
    const totalCount =
      typeof totalItems === "number" ? totalItems : products.length;
    const total = Math.max(1, Math.ceil(totalCount / itemsPerPage));

    // Ensure currentPage doesn't exceed totalPages
    const safePage = Math.min(currentPage, total);

    const data =
      typeof totalItems === "number"
        ? products
        : products.slice(
            (safePage - 1) * itemsPerPage,
            safePage * itemsPerPage,
          );

    return { paginatedData: data, totalPages: total };
  }, [currentPage, products, isLoading, isError, totalItems]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      // If parent provided totalItems it means server-side pagination is used.
      // Notify parent to request the given page.
      if (typeof totalItems === "number") {
        onRequestPage?.(page);
      }
    },
    [onRequestPage, totalItems],
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="font-medium">Failed to load products</p>
        <p className="text-sm text-gray-500">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="relative">
          {showTransition && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm">
              <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-[#09714e] animate-spin" />
            </div>
          )}
          <div>
            <table className="w-full text-sm text-left" role="table">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price From</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Discount Price</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td className="px-6 py-4">
                        <Skeleton className="h-10 w-40" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Skeleton className="h-8 w-16 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((product) => (
                    <tr
                      key={product._id}
                      className="bg-white hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0]?.url || "/placeholder.svg"}
                            alt={product.productName}
                            className="w-10 h-10 rounded object-cover bg-gray-100"
                            loading="lazy"
                          />
                          <div className="max-w-[200px]">
                            <p className="font-medium text-gray-900 truncate">
                              {product.productName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {product.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {product.productType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        ${product.priceFrom}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {product.variants?.reduce(
                          (acc, v) => acc + (v.stock || 0),
                          0,
                        ) || 0}
                        <span className="text-gray-400 ml-1">
                          ({product.variants?.[0]?.unit || "pcs"})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.discountPriceFrom ? (
                          <span className="text-green-600 font-medium">
                            ${product.discountPriceFrom.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            onClick={() => onEdit?.(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <PaginationPage
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems ?? products.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export const ProductTable = memo(ProductTableComponent);
ProductTable.displayName = "ProductTable";
