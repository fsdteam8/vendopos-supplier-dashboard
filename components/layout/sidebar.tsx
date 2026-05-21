'use client';

import { useProfile } from '@/app/features/profile/hooks/useProfile';
import { cn } from '@/lib/utils';
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Order History', icon: ShoppingCart },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'PaymentSettlement', label: 'Settlements', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { data: profile } = useProfile();
  const userData = profile?.data;

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] flex flex-col justify-between border-r border-gray-200">
      <div>
        <Link href="/" className="flex justify-center py-6">
          <Image src="/logo.svg" alt="Logo" width={70} height={70} />
        </Link>

        {/* WELCOME TEXT */}
        <div className="px-5 mb-5">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Welcome back <span className="animate-pulse">👋</span>
          </p>

          <p className="text-lg font-semibold text-gray-900 mt-1 tracking-tight">
            Supplier Dashboard
          </p>
        </div>

        {/* MENU */}
        <nav className="px-3 py-2 space-y-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-md font-semibold transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-[#09714e] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#09714e]',
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM PROFILE */}
      <div className="p-4 border-t border-gray-200 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#09714e] to-[#0aa06e] flex items-center justify-center overflow-hidden text-sm font-semibold text-white shadow-sm">
            {userData?.image?.url ? (
              <img src={userData.image.url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              userData?.firstName?.charAt(0) || 'U'
            )}
          </div>

          {/* USER INFO */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {userData?.firstName || userData?.lastName
                ? `${userData?.firstName ?? ''} ${userData?.lastName ?? ''}`.trim()
                : 'User'}
            </p>

            <p className="text-xs text-gray-500 capitalize">{userData?.role || 'Member'}</p>
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => signOut()}
            className="p-2 rounded-lg hover:bg-red-50 transition group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
