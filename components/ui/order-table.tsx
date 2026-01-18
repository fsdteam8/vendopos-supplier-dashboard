"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Eye } from "lucide-react"
import { mockOrders } from "@/lib/mock-data"

interface OrderTableProps {
  onSelectCustomer: (customer: (typeof mockOrders)[0]) => void
}

const OrderTableComponent = ({ onSelectCustomer }: OrderTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const { paginatedData, totalPages } = useMemo(() => {
    const total = Math.ceil(mockOrders.length / itemsPerPage)
    const data = mockOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    return { paginatedData: data, totalPages: total }
  }, [currentPage])

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1))
  }, [])

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1))
  }, [totalPages])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Cancelled":
        return "text-red-600 bg-red-50"
      case "Pending":
        return "text-yellow-600 bg-yellow-50"
      case "Delivered":
        return "text-green-600 bg-green-50"
      case "Paid":
        return "text-green-600"
      case "Unpaid":
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
          {paginatedData.map((order) => (
            <tr
              key={`${order.id}-${order.billingDate}`}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{order.item}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{order.billingDate}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{order.amount}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                  role="status"
                  aria-label={`Order status: ${order.status}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => onSelectCustomer(order)}
                  className="flex items-center gap-2 text-[#1B7D6E] hover:text-[#155D5C] transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] focus:ring-offset-2 rounded"
                  aria-label={`View details for order ${order.id}`}
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  View
                </button>
              </td>
            </tr>
          ))}
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
