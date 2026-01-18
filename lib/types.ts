import type React from "react"
// Type definitions for the admin panel
export interface Product {
  id: number
  name: string
  description: string
  image?: string
  category: string
  price: string
  quantity: number
  sales: number
  revenue: string
}

export interface Order {
  id: string
  item: string
  billingDate: string
  amount: string
  status: "Paid" | "Unpaid" | "Cancelled" | "Pending" | "Delivered"
}

export interface DashboardStats {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  iconColor: string
}

export interface ChartData {
  name: string
  value: number
}

export interface TopProduct {
  name: string
  sales: number
  revenue: string
  growth: string
}

export interface LowStockAlert {
  name: string
  sales: number
  stock: string
}
