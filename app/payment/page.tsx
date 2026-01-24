"use client"

import { Sidebar } from "@/components/layout/sidebar"
import Payments from "@/components/pages/payments"
import { useState } from "react"

export default function PaymentPage() {
  const [currentPage, setCurrentPage] = useState<any>("payments")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} setCurrentPage={(page) => {
        // Since we are on a separate route, if the user clicks other sidebar items, 
        // we might want to redirect them back to the home page with that state.
        // For now, let's just make it a functional sidebar that stays on this page 
        // if it's "payments", or we could redirect.
        if (page !== "payments") {
          window.location.href = `/?page=${page}`
        }
      }} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Payments />
        </main>
      </div>
    </div>
  )
}
