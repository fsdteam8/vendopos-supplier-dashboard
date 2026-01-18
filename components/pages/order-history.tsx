import { useState } from "react"
import { OrderTable } from "@/components/ui/order-table"
import { CustomerDetailsModal } from "@/components/ui/customer-details-modal"
import { useOrders } from "@/app/features/order/hooks/useOrders"
import { Order } from "@/app/features/order/types"

export default function OrderHistory() {
  const [selectedCustomer, setSelectedCustomer] = useState<Order | null>(null)
  const { data, isLoading } = useOrders()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and profile details.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <OrderTable 
           orders={data?.data || []} 
           isLoading={isLoading} 
           onSelectCustomer={setSelectedCustomer} 
        />
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  )
}
