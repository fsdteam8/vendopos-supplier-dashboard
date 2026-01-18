"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Eye } from "lucide-react"
import { Order } from "@/app/features/order/types"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

interface OrderTableProps {
  orders: Order[]
  isLoading?: boolean
  onSelectCustomer: (customer: Order) => void
}

const OrderTableComponent = ({ orders = [], isLoading, onSelectCustomer }: OrderTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const { paginatedData, totalPages } = useMemo(() => {
    if (!orders) return { paginatedData: [], totalPages: 0 }
    const total = Math.ceil(orders.length / itemsPerPage)
    const data = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    return { paginatedData: data, totalPages: total }
  }, [currentPage, orders])

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1))
  }, [])

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1))
  }, [totalPages])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "cancelled":
        return "text-red-600 bg-red-50"
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      case "delivered":
        return "text-green-600 bg-green-50"
      case "paid":
        return "text-green-600"
      case "unpaid":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              INVOICE
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Item</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              BILLING DATE
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">AMOUNT</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">STATUS</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              <span className="sr-only">Actions</span>View
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
             Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                   <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                   <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                   <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                   <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                   <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                   <td className="px-6 py-4"><Skeleton className="h-8 w-16" /></td>
                </tr>
             ))
          ) : paginatedData.length === 0 ? (
             <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                   No orders found.
                </td>
             </tr>
          ) : (
            paginatedData.map((order) => (
            <tr
              key={order._id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="flex flex-col">
                   <span className="font-medium">{order.items[0]?.product?.title || "Unknown Item"}</span>
                   {order.items.length > 1 && <span className="text-xs text-gray-500">+{order.items.length - 1} more</span>}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{format(new Date(order.purchaseDate), 'MMM dd, yyyy')}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-semibold">${order.totalPrice}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus || order.paymentStatus)}`}
                  role="status"
                  aria-label={`Order status: ${order.orderStatus}`}
                >
                  {order.orderStatus || order.paymentStatus}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => onSelectCustomer(order)}
                  className="flex items-center gap-2 text-[#1B7D6E] hover:text-[#155D5C] transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] focus:ring-offset-2 rounded"
                  aria-label={`View details for order ${order._id}`}
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  View
                </button>
              </td>
            </tr>
          ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav
        className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50"
        aria-label="Order table pagination"
      >
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
            onClick={() => setCurrentPage(i + 1)}
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
      </nav>
    </div>
  )
}

export const OrderTable = memo(OrderTableComponent)
OrderTable.displayName = "OrderTable"
