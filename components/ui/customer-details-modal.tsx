"use client"
import { X, Mail, Phone, Calendar, MapPin, Package } from "lucide-react"
import { useEffect, useRef } from "react"
import { Order } from "@/app/features/order/types"
import { format } from "date-fns"

interface CustomerDetailsModalProps {
  customer: Order // This is effectively the selected Order with Customer info
  onClose: () => void
}

export function CustomerDetailsModal({ customer: order, onClose }: CustomerDetailsModalProps) {
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

  const customerName = order.billingInfo?.name || `${order.user?.firstName} ${order.user?.lastName}` || "Unknown Customer"

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
              Order Details
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">Order #{order._id} - {format(new Date(order.purchaseDate), 'PPP')}</p>
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
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{customerName}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                 order.orderStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.orderStatus || order.paymentStatus}
              </span>
              <p className="text-sm text-gray-600 mt-2">Order ID: #{order._id}</p>
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
                  <p className="text-sm font-medium text-gray-900">{order.billingInfo?.email || order.user?.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{order.billingInfo?.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Billing/Shipping Address</h4>
            </div>
            {order.billingInfo ? (
              <div className="text-sm text-gray-900">
                <p>{order.billingInfo.address}</p>
                <p>{`${order.billingInfo.city}, ${order.billingInfo.country}`}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No billing info available</p>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                     {item.product?.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt={item.product.title} className="w-10 h-10 rounded-lg object-cover" />
                     ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                           <Package className="w-5 h-5 text-gray-400" />
                        </div>
                     )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product?.title || "Unknown Product"}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.unitPrice}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${item.quantity * item.unitPrice}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
               <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">${order.totalPrice}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
