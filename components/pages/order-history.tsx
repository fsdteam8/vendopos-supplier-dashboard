import { useState } from "react"
import { OrderTable } from "@/components/ui/order-table"
import { CustomerDetailsModal } from "@/components/ui/customer-details-modal"
import { useOrders } from "@/app/features/order/hooks/useOrders"
import { Order } from "@/app/features/order/types"

export default function OrderHistory() {
  const [selectedCustomer, setSelectedCustomer] = useState<Order | null>(null)
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5, // Match requested limit
    orderStatus: 'all',
    paymentStatus: 'all',
    paymentType: 'all',
    sort: 'newest'
  })

  const { data, isLoading } = useOrders(filters)

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })) // Reset to page 1 on filter change
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600 mt-1">Manage your order history and view details.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <OrderTable 
           orders={data?.data || []} 
           isLoading={isLoading} 
           onSelectCustomer={setSelectedCustomer}
           currentPage={filters.page}
           totalPages={data?.meta?.totalPage || 1}
           onPageChange={handlePageChange}
           onFilterChange={handleFilterChange}
           filters={filters}
        />
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  )
}
