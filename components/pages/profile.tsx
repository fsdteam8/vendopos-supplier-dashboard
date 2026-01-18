"use client"

import { useState } from "react"
import { ProfileForm } from "@/components/ui/profile-form"
import { SecurityForm } from "@/components/ui/security-form"
import { useProfile } from "@/app/features/profile/hooks/useProfile"

type TabType = "profile" | "security"

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const { data: profile } = useProfile()

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Welcome back, {profile?.data?.firstName || "Admin"}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-[#1B7D6E] text-[#1B7D6E]"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Profile Settings
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "security"
              ? "border-[#1B7D6E] text-[#1B7D6E]"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Security Settings
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-8">Manage your account settings and preferences</p>

      {/* Tab Content */}
      <div>
        {activeTab === "profile" && <ProfileForm />}
        {activeTab === "security" && <SecurityForm />}
      </div>
    </div>
  )
}
