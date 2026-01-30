"use client"
import { LayoutDashboard, Package, ShoppingCart, User, LogOut, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useProfile } from "@/app/features/profile/hooks/useProfile"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: any) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Order History", icon: ShoppingCart },
  { id: "profile", label: "Profile", icon: User },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "PaymentSettlement", label: "Payment Settlements", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: ShoppingCart },
]

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { data: profile } = useProfile()
  const userData = profile?.data

  return (
    <div className="w-56 bg-[#1D4E890A] text-white flex flex-col">
      {/* Logo */}
      <Link href="/" className="flex justify-center">
      
        <div className="px-6 py-8 border-b border-white/10 mx-auto">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} />
        </div>
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-sm font-medium cursor-pointer",
                isActive ? "bg-primary text-white" : "text-black hover:bg-primary hover:text-white",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-3">
        <div className="px-4 py-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold overflow-hidden">
              {userData?.image?.url ? (
                <img src={userData.image.url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userData?.firstName?.charAt(0) || "U"
              )}
            </div>
            <div>
              <p className="text-sm font-medium truncate text-black w-[100px]">{userData ? `${userData.firstName} ${userData.lastName}` : "User"}</p>
              <p className="text-xs text-black capitalize">{userData?.role || "Member"}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-white text-md bg-red-500 hover:bg-red-400 cursor-pointer text-center transition-colors  font-medium"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
