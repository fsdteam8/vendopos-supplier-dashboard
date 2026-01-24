"use client"

import { useMemo } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { ChartCard } from "@/components/ui/chart-card"
import { ProductTable } from "@/components/ui/product-table"
import { DollarSign, ShoppingCart, Box, TrendingUp } from "lucide-react"
import { mockDashboardData } from "@/lib/mock-data"
import { useProducts } from "@/app/features/products/hooks/useProducts"

export default function Dashboard() {
  const { data, isLoading, isError } = useProducts()
  const stats = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: "$62445.80",
        icon: DollarSign,
        bgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        label: "Total Sales",
        value: "420",
        icon: ShoppingCart,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        label: "Total Products",
        value: "3",
        icon: Box,
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      {
        label: "Total Inventory",
        value: "155 units",
        icon: TrendingUp,
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ],
    [],
  )

  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales by Product" type="bar" data={mockDashboardData.salesByProduct} />
        <ChartCard title="Weekly Sales Trend" type="line" data={mockDashboardData.weeklySalesTrend} />
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Inventory</h2>
        <p className="text-sm text-gray-600 mb-4">Manage your products and update prices</p>
        <ProductTable products={data?.data || []} isLoading={isLoading} isError={isError} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {mockDashboardData.topProducts.map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-500">#{idx + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                  <p className="text-xs text-green-600">+{product.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h3>
          <div className="space-y-4">
            {mockDashboardData.lowStockAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-500">#{idx + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.name}</p>
                    <p className="text-xs text-gray-500">{alert.sales} sales</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-orange-600">{alert.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
