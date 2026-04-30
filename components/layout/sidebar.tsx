"use client";

import { useProfile } from "@/app/features/profile/hooks/useProfile";
import { cn } from "@/lib/utils";
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Order History", icon: ShoppingCart },
  { id: "profile", label: "Profile", icon: User },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "PaymentSettlement", label: "Settlements", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { data: profile } = useProfile();
  const userData = profile?.data;

  return (
    <div className="w-64 h-screen bg-[#f5f7f9] flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <Link href="/" className="flex justify-center py-5">
          <Image src="/logo.svg" alt="Logo" width={70} height={70} />
        </Link>

        {/* Menu */}
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer",
                  isActive
                    ? "bg-[#09714e] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#09714e]",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section (Profile) */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-sm font-semibold">
            {userData?.image?.url ? (
              <img
                src={userData.image.url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              userData?.firstName?.charAt(0) || "U"
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {userData ? `${userData.firstName} ${userData.lastName}` : "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {userData?.role || "Member"}
            </p>
          </div>

          {/* Logout */}
          <button 
            onClick={() => signOut()}
            className="p-2 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut className="w-5 h-5 text-red-500 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
}
