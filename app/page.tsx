"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import Dashboard from "@/components/pages/dashboard"
import Products from "@/components/pages/products"
import OrderHistory from "@/components/pages/order-history"
import Profile from "@/components/pages/profile"
import Payments from "@/components/pages/payments"

type PageType = "dashboard" | "products" | "orders" | "profile" | "payments"

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-lg animate-pulse">Loading Dashboard...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}

function HomeContent() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const searchParams = useSearchParams()

  useEffect(() => {
    const page = searchParams.get("page") as PageType
    if (page && ["dashboard", "products", "orders", "profile", "payments"].includes(page)) {
      setCurrentPage(page)
    }
  }, [searchParams])

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "products":
        return <Products />
      case "orders":
        return <OrderHistory />
      case "profile":
        return <Profile />
      case "payments":
        return <Payments />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  )
}
