"use client";

import { useProfile } from "@/app/features/profile/hooks/useProfile";
import { ProfileForm } from "@/components/ui/profile-form";
import { SecurityForm } from "@/components/ui/security-form";
import { useState } from "react";

type TabType = "profile" | "security";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const { data: profile } = useProfile();

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {profile?.data?.firstName || "Admin"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 font-medium text-sm rounded-t-md cursor-pointer transition-colors ${
            activeTab === "profile"
              ? "bg-[#E6F5F2] text-[#1B7D6E] border-b-2 border-[#1B7D6E]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Profile Settings
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-6 py-3 font-medium text-sm cursor-pointer rounded-t-md transition-colors ${
            activeTab === "security"
              ? "bg-[#E6F5F2] text-[#1B7D6E] border-b-2 border-[#1B7D6E]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Security Settings
        </button>
      </div>

      {/* Subtext */}
      <p className="text-gray-600 text-sm mb-6">
        Manage your account settings and preferences
      </p>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {activeTab === "profile" && <ProfileForm />}
        {activeTab === "security" && <SecurityForm />}
      </div>
    </div>
  );
}
