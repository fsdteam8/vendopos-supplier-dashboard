import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useChangePassword } from "@/app/features/auth/hooks/useChangePassword"
import { toast } from "sonner"
import { Button } from "./button"

export function SecurityForm() {
  const { mutate: changePassword, isPending } = useChangePassword()
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleSeePassword = (type: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match")
      return
    }

    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    changePassword({
      currentPassword: passwords.current,
      newPassword: passwords.new
    }, {
      onSuccess: () => {
        toast.success("Password updated successfully")
        setPasswords({ current: "", new: "", confirm: "" })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update password")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>

        <div className="space-y-6">
          <div className="relative">
            <label
              htmlFor="current-password"
              className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              Current Password
            </label>
            <input
              id="current-password"
              type={showPassword.current ? "text" : "password"}
              name="current"
              value={passwords.current}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm bg-gray-50"
            />
            <Button
              type="button"
              onClick={() => handleSeePassword("current")}
              className="absolute right-2 top-1/2 transform bg-transparent hover:bg-transparent -mt-1"
            >
              {showPassword.current ? (
                <Eye className="w-4 h-4 text-green-600" aria-hidden="true" />
              ) : (
                <EyeOff className="w-4 h-4 text-green-600" aria-hidden="true" />
              )}
            </Button>
          </div>

          <div className="relative">
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              New Password
            </label>
            <input
              id="new-password"
              type={showPassword.new ? "text" : "password"}
              name="new"
              value={passwords.new}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm bg-gray-50"
            />
            <Button type="button" onClick={() => handleSeePassword("new")} className="absolute right-2 top-1/2 transform bg-transparent hover:bg-transparent -translate-y-1/2 mt-3">
              {showPassword.new ? (
                <Eye className="w-4 h-4 text-green-600" aria-hidden="true"  />
              ) : (
                <EyeOff className="w-4 h-4 text-green-600" aria-hidden="true" />
              )}
            </Button>
          </div>

          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type={showPassword.confirm ? "text" : "password"}
              name="confirm"
              value={passwords.confirm}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D6E] text-sm bg-gray-50"
            />
            <Button type="button" onClick={() => handleSeePassword("confirm")} className="absolute right-2 top-1/2 transform bg-transparent hover:bg-transparent -mt-1">
              {showPassword.confirm ? (
                <Eye className="w-4 h-4 text-green-600" aria-hidden="true" />
              ) : (
                <EyeOff className="w-4 h-4 text-green-600" aria-hidden="true" />
              )}
            </Button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-[#1B7D6E] text-white rounded-lg hover:bg-[#155D5C] transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B7D6E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </form>
  )
}
