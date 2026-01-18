"use client"
import { X, Mail, Phone, Calendar, MapPin } from "lucide-react"
import { useEffect, useRef } from "react"
import type { mockOrders } from "@/lib/mock-data"

interface CustomerDetailsModalProps {
  customer: (typeof mockOrders)[0]
  onClose: () => void
}

export function CustomerDetailsModal({ customer, onClose }: CustomerDetailsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Focus management for accessibility
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">
              Customer Details
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">Complete customer information and order history</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#A8D5D0] text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
              J
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                {customer.status}
              </span>
              <p className="text-sm text-gray-600 mt-2">Customer ID: #{customer.id}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Join Date</p>
                  <p className="text-sm font-medium text-gray-900">{customer.joinDate}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Last Order</p>
                  <p className="text-sm font-medium text-gray-900">{customer.lastOrderDate}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                    {customer.lastOrderStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Stats */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-xs text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{customer.totalOrders}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{customer.totalValue}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{customer.avgOrderValue}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Shipping Address</h4>
            </div>
            <p className="text-sm text-gray-900">{customer.shippingAddress.street}</p>
            <p className="text-sm text-gray-900">{`${customer.shippingAddress.city}, ${customer.shippingAddress.state} ${customer.shippingAddress.zipCode}`}</p>
            <p className="text-sm text-gray-900">{customer.shippingAddress.country}</p>
          </div>

          {/* Recent Orders */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Orders</h4>
            <div className="space-y-3">
              {customer.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#A8D5D0]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-600">🛍️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{order.amount}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
