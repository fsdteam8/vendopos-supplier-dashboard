"use client"

import { useState, useMemo } from "react"
import { OrderTable } from "@/components/ui/order-table"
import { CustomerDetailsModal } from "@/components/ui/customer-details-modal"
import { mockOrders } from "@/lib/mock-data"

export default function OrderHistory() {
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof mockOrders)[0] | null>(null)

  const stats = useMemo(
    () => ({
      paid: mockOrders.filter((o) => o.status === "Paid").length,
      unpaid: mockOrders.filter((o) => o.status === "Unpaid").length,
    }),
    [],
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and profile details.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 transition-colors">
          Unpaid
        </button>
        <button className="px-4 py-2 rounded-lg font-medium text-sm text-green-600 hover:bg-green-50 transition-colors">
          Paid
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <OrderTable onSelectCustomer={setSelectedCustomer} />
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  )
}
