"use client"

import type React from "react"
import { useState } from "react"
import { Lock } from "lucide-react"

export function SecurityForm() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords((prev) => ({
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
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              name="current"
              value={passwords.current}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              name="new"
              value={passwords.new}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm bg-gray-50"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-[#1B7D6E] text-white rounded-lg hover:bg-[#155D5C] transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B7D6E]"
          >
            Update Password
          </button>
        </div>
      </div>
    </form>
  )
}
