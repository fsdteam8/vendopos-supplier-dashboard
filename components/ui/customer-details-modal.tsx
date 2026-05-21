'use client';

import { X, Mail, Phone, MapPin, Package } from 'lucide-react';
import { useEffect } from 'react';
import { Order } from '@/app/features/order/types';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CustomerDetailsModalProps {
  customer: Order;
  onClose: () => void;
}

export function CustomerDetailsModal({ customer: order, onClose }: CustomerDetailsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const customerInfo = {
    name:
      order.billingInfo?.name ||
      `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() ||
      'Unknown Customer',

    email: order.billingInfo?.email || order.user?.email || 'Not provided',
    phone: order.billingInfo?.phone || 'Not provided',

    address: order.billingInfo
      ? `${order.billingInfo.address}, ${order.billingInfo.city}, ${order.billingInfo.country}`
      : null,
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500">
              #{order.orderUniqueId} • {format(new Date(order.purchaseDate), 'PPP')}
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* CUSTOMER HEADER */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1B7D6E] text-white flex items-center justify-center font-bold text-lg">
              {customerInfo.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{customerInfo.name}</h3>
              <p className="text-sm text-gray-500">Order ID: {order.orderUniqueId}</p>
            </div>

            {/* STATUS DROPDOWN (UNCHANGED FUNCTIONALITY) */}
            <Select defaultValue={order.orderStatus}>
              <SelectTrigger className="w-[160px] border-gray-200">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CONTACT INFO (USING SMART RESOLVER) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Mail className="w-4 h-4 text-gray-400 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{customerInfo.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="w-4 h-4 text-gray-400 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-gray-900">{customerInfo.phone}</p>
              </div>
            </div>
          </div>

          {/* ADDRESS (SMART FALLBACK) */}
          <div className="flex gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
            <div>
              <p className="text-xs text-gray-500">Shipping / Billing Address</p>

              {customerInfo.address ? (
                <p className="text-sm text-gray-900">{customerInfo.address}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">No billing information provided</p>
              )}
            </div>
          </div>

          {/* ORDER ITEMS */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>

            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-xl p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {item.product?.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt="product"
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product?.title}</p>
                      <p className="text-xs text-gray-500">
                        Qty {item.quantity} × ${item.unitPrice}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${item.quantity * item.unitPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="flex justify-end mt-4 border-t pt-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">${order.totalPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
