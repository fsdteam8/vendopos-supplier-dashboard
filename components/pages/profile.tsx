'use client';

import { useProfile } from '@/app/features/profile/hooks/useProfile';
import { ProfileForm } from '@/components/ui/profile-form';
import { SecurityForm } from '@/components/ui/security-form';
import { useState } from 'react';

type TabType = 'profile' | 'security';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { data: profile } = useProfile();

  return (
    <div className="max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {profile?.data?.firstName || 'Admin'}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 inline-flex rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2 text-sm font-medium cursor-pointer rounded-lg transition-all ${
            activeTab === 'profile'
              ? 'bg-white text-gray-900 cursor-pointer shadow-sm'
              : 'text-gray-500 cursor-pointer hover:text-gray-900'
          }`}
        >
          Profile Settings
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'security'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Security Settings
        </button>
      </div>

      {/* Subtext */}
      <p className="mb-6 text-sm text-gray-500">Manage your account settings and preferences</p>

      {/* Content Card */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="p-6">
          {activeTab === 'profile' && <ProfileForm />}
          {activeTab === 'security' && <SecurityForm />}
        </div>
      </div>
    </div>
  );
}
