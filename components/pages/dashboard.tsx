"use client"

import { useMemo } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { ChartCard } from "@/components/ui/chart-card"
import { ProductTable } from "@/components/ui/product-table"
import { DollarSign, ShoppingCart, Box, TrendingUp } from "lucide-react"
import { useProducts } from "@/app/features/products/hooks/useProducts"
import { useAnalytics, useProductsRevenue, useSalesTrend } from "@/hooks/useOverView"
import { ProductAnalyticsApiResponse, SupplierChartData } from "@/types/overview"
import Revenue from "../chart/ProductSels"
import SalesByRegion from "../chart/SalesByRegion"

export default function Dashboard() {
  const currentYear = "2026"
  const { data: productsResult, isLoading: productsLoading, isError: productsError } = useProducts()
  const { data: revenueResult, isLoading: revenueLoading } = useProductsRevenue(currentYear)
  const { data: salesTrendResult, isLoading: salesTrendLoading } = useSalesTrend(currentYear)
  const { data: analyticsResult, isLoading: analyticsLoading } = useAnalytics()

  const productsRevenue = (revenueResult as ProductAnalyticsApiResponse)?.data?.chart || []
  const salesTrend = (salesTrendResult as ProductAnalyticsApiResponse)?.data?.chart || []
  const analyticsData = analyticsResult?.data || {}

  const stats = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: `$${analyticsData.totalRevenue || "0.00"}`,
        icon: DollarSign,
        bgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        label: "Total Sales",
        value: `${analyticsData.totalOrders || "0"}`,
        icon: ShoppingCart,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        label: "Total Products",
        value: `${analyticsData.totalProducts || "3"}`,
        icon: Box,
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      {
        label: "Total Inventory",
        value: `${analyticsData.totalInventory || "0"} units`,
        icon: TrendingUp,
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ],
    [analyticsData],
  )

  const productsRevenueChartData = useMemo(
    () => productsRevenue.map((item: SupplierChartData) => ({
      name: item.month,
      value: item.totalRevenue
    })),
    [productsRevenue]
  )

  const salesTrendChartData = useMemo(
    () => salesTrend.map((item: SupplierChartData) => ({
      name: item.month,
      value: item.sales
    })),
    [salesTrend]
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
       <div className="bg-white rounded-lg shadow">
            <Revenue />
          </div>
          <div className="bg-white rounded-lg shadow">
            <SalesByRegion />
          </div>
      </div>

      {/* Product Inventory Table */}
      {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Inventory</h2>
        <p className="text-sm text-gray-600 mb-4">Manage your products and update prices</p>
        <ProductTable products={productsResult?.data || []} isLoading={productsLoading} isError={productsError} />
      </div> */}

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Months (based on revenue data) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Performance</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {revenueLoading ? (
              <p className="text-sm text-gray-500">Loading revenue data...</p>
            ) : productsRevenue.length > 0 ? (
              productsRevenue.map((item: SupplierChartData, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500">#{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.month}</p>
                      <p className="text-xs text-gray-500">{item.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${item.totalRevenue}</p>
                    <p className="text-xs text-green-600">Total Revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No revenue data available for {currentYear}</p>
            )}
          </div>
        </div>

        {/* Sales Trend Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend Details</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {salesTrendLoading ? (
               <p className="text-sm text-gray-500">Loading sales trend...</p>
            ) : salesTrend.length > 0 ? (
              salesTrend.map((item: SupplierChartData, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500">#{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.month}</p>
                      <p className="text-xs text-gray-500">{item.totalRevenue} revenue</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1B7D6E]">{item.sales} sales</p>
                    <p className="text-xs text-blue-600">Volume</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No sales trend data available for {currentYear}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
