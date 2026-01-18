"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Camera, Mail, Phone, MapPin } from "lucide-react"
import { useProfile } from "@/app/features/profile/hooks/useProfile"

export function ProfileForm() {
  const { data: profile } = useProfile()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (profile?.data) {
      setFormData({
        firstName: profile.data.firstName || "",
        lastName: profile.data.lastName || "",
        email: profile.data.email || "",
        phone: "", // API doesn't seem to return phone/address yet based on types, keeping empty or preserving if it was there
        address: "",
      })
    }
  }, [profile])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div
              className="w-24 h-24 rounded-full bg-[#1B7D6E] text-white flex items-center justify-center text-3xl font-bold flex-shrink-0 uppercase"
              role="img"
              aria-label="User avatar"
            >
              {profile?.data?.firstName?.charAt(0) || "U"}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Change Avatar</h4>
              <p className="text-xs text-gray-600 mb-3">JPG, PNG or GIF. Max size 2MB</p>
              <label htmlFor="avatar-upload" className="inline-flex">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  <Camera className="w-4 h-4" aria-hidden="true" />
                  Upload
                </button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className="hidden"
                  aria-label="Upload avatar"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" aria-hidden="true" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" aria-hidden="true" />
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-[#1B7D6E] text-white rounded-lg hover:bg-[#155D5C] transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B7D6E]"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}
