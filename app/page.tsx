"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import Dashboard from "@/components/pages/dashboard"
import Products from "@/components/pages/products"
import OrderHistory from "@/components/pages/order-history"
import Profile from "@/components/pages/profile"

type PageType = "dashboard" | "products" | "orders" | "profile"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")

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
