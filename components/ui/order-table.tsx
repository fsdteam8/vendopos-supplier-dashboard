"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Eye } from "lucide-react";
import { Order } from "@/app/features/order/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  onSelectCustomer: (customer: Order) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (key: string, value: string) => void;
  filters: {
    orderStatus: string;
    paymentStatus: string;
    sort: string;
  };
}

const OrderTableComponent = ({
  orders = [],
  isLoading,
  onSelectCustomer,
  currentPage,
  totalPages,
  onPageChange,
  onFilterChange,
  filters,
}: OrderTableProps) => {
  const handlePrevPage = useCallback(() => {
    onPageChange(Math.max(1, currentPage - 1));
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  }, [currentPage, totalPages, onPageChange]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "delivered":
        return "text-green-600 bg-green-50";
      case "paid":
        return "text-green-600";
      case "unpaid":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }, []);

  return (
    <div>
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 items-center justify-end">
        <div className="flex gap-4">
          <Select
            value={filters.orderStatus}
            onValueChange={(value) => onFilterChange("orderStatus", value)}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="all">All Status</SelectItem>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="pending">Pending</SelectItem>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="processing">Processing</SelectItem>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="delivered">Delivered</SelectItem>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.paymentStatus}
            onValueChange={(value) => onFilterChange("paymentStatus", value)}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="all">Payment Status</SelectItem>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="paid">Paid</SelectItem>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sort}
            onValueChange={(value) => onFilterChange("sort", value)}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="newest">Newest First</SelectItem>
              <SelectItem className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer" value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                INVOICE
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                BILLING DATE
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                AMOUNT
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                <span className="sr-only">Actions</span>View
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-8 w-16" />
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {order.items[0]?.product?.title || "Unknown Item"}
                      </span>
                      {order.items.length > 1 && (
                        <span className="text-xs text-gray-500">
                          +{order.items.length - 1} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {format(new Date(order.purchaseDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    ${order.totalPrice}
                  </td>
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
                      className="flex items-center gap-2 text-[#1B7D6E] hover:text-[#155D5C] transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] focus:ring-offset-2 rounded cursor-pointer"
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
      </div>

      {/* Pagination */}
      <nav
        className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50"
        aria-label="Order table pagination"
      >
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-[#1B7D6E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
          aria-label="Previous page"
        >
          ←
        </button>
        <span className="text-sm text-gray-600 px-2">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 rounded-full border  border-gray-300 text-gray-600 hover:bg-[#1B7D6E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
          aria-label="Next page"
        >
          →
        </button>
      </nav>
    </div>
  );
};

export const OrderTable = memo(OrderTableComponent);
OrderTable.displayName = "OrderTable";
