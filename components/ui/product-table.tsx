"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Edit, Trash2, AlertCircle } from "lucide-react"
import { Product } from "@/app/features/products/types"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductTableProps {
  products: Product[]
  isLoading?: boolean
  isError?: boolean
  onEdit?: (product: Product) => void
}

const ProductTableComponent = ({ products = [], isLoading = false, isError = false, onEdit }: ProductTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { paginatedData, totalPages } = useMemo(() => {
    if (isLoading || isError || !products) return { paginatedData: [], totalPages: 0 }
    
    const total = Math.ceil(products.length / itemsPerPage)
    const data = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    return { paginatedData: data, totalPages: total }
  }, [currentPage, products, isLoading, isError])

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1))
  }, [])

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1))
  }, [totalPages])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="font-medium">Failed to load products</p>
        <p className="text-sm text-gray-500">Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Price From</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
             {/* Note: Sales and Revenue are not in the provided API response example, hiding or keeping placeholders if needed */}
            {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Revenue
            </th> */}
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              <span className="sr-only">Actions</span>Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded" />
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-32" />
                       <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                <td className="px-6 py-4"><Skeleton className="h-8 w-16" /></td>
              </tr>
            ))
          ) : products.length === 0 ? (
             <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No products found. Add your first product!
              </td>
            </tr>
          ) : (
            paginatedData.map((product) => (
              <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images?.[0]?.url || "/placeholder.svg"}
                      alt={`${product.productName} product image`}
                      className="w-10 h-10 rounded object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.shortDescription}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {product.productType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">${product.priceFrom}</td>
                {/* Summing stock from variants as an example, or could use quantity field if reliability improved */}
                 <td className="px-6 py-4 text-sm text-gray-900">
                  {product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0} ({product.variants?.[0]?.unit})
                </td>
                <td className="px-6 py-4 text-sm">
                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'approved' ? 'bg-green-100 text-green-800' :
                    product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                   }`}>
                    {product.status}
                   </span>
                </td>
                {/* <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.revenue || "$0.00"}</td> */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      aria-label={`Edit ${product.productName}`}
                      onClick={() => onEdit?.(product)}
                    >
                      <Edit className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                      aria-label={`Delete ${product.productName}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            aria-label="Previous page"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                currentPage === i + 1
                  ? "bg-[#1B7D6E] text-white focus:ring-[#1B7D6E]"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-100 focus:ring-gray-400"
              }`}
              aria-current={currentPage === i + 1 ? "page" : undefined}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

export const ProductTable = memo(ProductTableComponent)
ProductTable.displayName = "ProductTable"
