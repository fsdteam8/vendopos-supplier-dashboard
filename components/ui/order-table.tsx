'use client';

import { Order } from '@/app/features/order/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { memo, useCallback } from 'react';
import PaginationPage from './PaginationPage';

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
  const meta = orders[0]?.meta;

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'paid':
        return 'text-green-600';
      case 'unpaid':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }, []);

  return (
    <div>
      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center justify-end gap-3">
        <div className="flex flex-wrap gap-3">
          <Select
            value={filters.orderStatus}
            onValueChange={(value) => onFilterChange('orderStatus', value)}
          >
            <SelectTrigger className="w-[180px] bg-white border-gray-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="all"
              >
                All Status
              </SelectItem>

              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="pending"
              >
                Pending
              </SelectItem>

              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="processing"
              >
                Processing
              </SelectItem>

              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="delivered"
              >
                Delivered
              </SelectItem>

              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="cancelled"
              >
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.paymentStatus}
            onValueChange={(value) => onFilterChange('paymentStatus', value)}
          >
            <SelectTrigger className="w-[180px] bg-white border-gray-200">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="all"
              >
                Payment Status
              </SelectItem>

              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="paid"
              >
                Paid
              </SelectItem>

              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="unpaid"
              >
                Unpaid
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sort} onValueChange={(value) => onFilterChange('sort', value)}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="newest"
              >
                Newest First
              </SelectItem>

              <SelectItem
                className="hover:bg-[#1B7D6E] hover:text-white cursor-pointer"
                value="oldest"
              >
                Oldest First
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full border-collapse" role="table">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Order ID
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Item
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Billing Date
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Total Quantity
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Payment Status
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>

              <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                View
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
                <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                  No orders available right now.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                >
                  {/* Order ID */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {order.orderUniqueId}
                      </span>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-900 leading-none">
                        {order.items[0]?.product?.title || 'Unknown Item'}
                      </span>

                      {order.items.length > 1 && (
                        <span className="text-xs text-gray-400">
                          +{order.items.length - 1} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {format(new Date(order.purchaseDate), 'MMM dd, yyyy')}
                  </td>

                  {/* Quantity */}
                  <td className="px-6 py-4 text-sm">
                    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {order.items.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">${order.totalPrice}</span>
                  </td>

                  {/* Payment Status */}
                  <td className="px-6 py-4 text-sm">
                    <span
                      role="status"
                      aria-label={`Payment status: ${order.paymentStatus}`}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize transition-colors ${
                        order.paymentStatus?.toLowerCase() === 'paid'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : order.paymentStatus?.toLowerCase() === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : order.paymentStatus?.toLowerCase() === 'failed'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          order.paymentStatus?.toLowerCase() === 'paid'
                            ? 'bg-green-500'
                            : order.paymentStatus?.toLowerCase() === 'pending'
                              ? 'bg-amber-500'
                              : order.paymentStatus?.toLowerCase() === 'failed'
                                ? 'bg-red-500'
                                : 'bg-gray-400'
                        }`}
                      />

                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Order Status */}
                  <td className="px-6 py-4 text-sm">
                    <span
                      role="status"
                      aria-label={`Order status: ${order.orderStatus}`}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize transition-colors ${
                        order.orderStatus?.toLowerCase() === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : order.orderStatus?.toLowerCase() === 'processing'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.orderStatus?.toLowerCase() === 'shipped'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : order.orderStatus?.toLowerCase() === 'delivered'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : order.orderStatus?.toLowerCase() === 'cancelled'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : order.orderStatus?.toLowerCase() === 'returned'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          order.orderStatus?.toLowerCase() === 'pending'
                            ? 'bg-amber-500'
                            : order.orderStatus?.toLowerCase() === 'processing'
                              ? 'bg-blue-500'
                              : order.orderStatus?.toLowerCase() === 'shipped'
                                ? 'bg-indigo-500'
                                : order.orderStatus?.toLowerCase() === 'delivered'
                                  ? 'bg-green-500'
                                  : order.orderStatus?.toLowerCase() === 'cancelled'
                                    ? 'bg-red-500'
                                    : order.orderStatus?.toLowerCase() === 'returned'
                                      ? 'bg-purple-500'
                                      : 'bg-gray-400'
                        }`}
                      />

                      {order.orderStatus}
                    </span>
                  </td>

                  {/* View */}
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onSelectCustomer(order)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#1B7D6E] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] focus:ring-offset-2 cursor-pointer"
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
      <PaginationPage
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={meta?.totalPage || 0}
        itemsPerPage={meta?.limit || 0}
      />
    </div>
  );
};

export const OrderTable = memo(OrderTableComponent);
OrderTable.displayName = 'OrderTable';
