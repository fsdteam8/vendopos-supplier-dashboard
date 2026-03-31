"use client";

import { useChangePassword } from "@/app/features/auth/hooks/useChangePassword";
import { CheckCircle2, Circle, Eye, EyeOff, Lock } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function SecurityForm() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSeePassword = (type: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordChecks = useMemo(() => {
    const newPass = passwords.new;
    return {
      minLength: newPass.length >= 6,
      uppercase: /[A-Z]/.test(newPass),
      lowercase: /[a-z]/.test(newPass),
      number: /[0-9]/.test(newPass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPass),
    };
  }, [passwords.new]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    if (Object.values(passwordChecks).includes(false)) {
      toast.error("Password does not meet requirements");
      return;
    }

    changePassword(
      {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          setPasswords({ current: "", new: "", confirm: "" });
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update password",
          );
        },
      },
    );
  };

  const renderCheck = (label: string, valid: boolean) => (
    <li
      className={`flex items-center gap-2 text-xs transition-colors ${valid ? "text-red-600" : "text-gray-400"}`}
    >
      {valid ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <Circle className="w-3.5 h-3.5" />
      )}
      {label}
    </li>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Security Settings
        </h3>

        <div className="space-y-5">
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="current"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Current Password
            </label>
            <div className="relative">
              <input
                id="current"
                name="current"
                type={showPassword.current ? "text" : "password"}
                value={passwords.current}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7D6E] focus:border-transparent outline-none bg-gray-50 text-sm transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => handleSeePassword("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B7D6E] transition-colors"
              >
                {showPassword.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="new"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              New Password
            </label>
            <div className="relative">
              <input
                id="new"
                name="new"
                type={showPassword.new ? "text" : "password"}
                value={passwords.new}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7D6E] focus:border-transparent outline-none bg-gray-50 text-sm transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => handleSeePassword("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B7D6E] transition-colors"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password Checklist UI */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3 ml-1">
              {renderCheck("Minimum 6 characters", passwordChecks.minLength)}
              {renderCheck(
                "At least one uppercase letter",
                passwordChecks.uppercase,
              )}
              {renderCheck(
                "At least one lowercase letter",
                passwordChecks.lowercase,
              )}
              {renderCheck(
                "Include at least one number",
                passwordChecks.number,
              )}
              {renderCheck(
                "Include a special character",
                passwordChecks.special,
              )}
            </ul>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm"
                name="confirm"
                type={showPassword.confirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={handleChange}
                required
                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#1B7D6E] focus:border-transparent outline-none bg-gray-50 text-sm transition-all ${
                  passwords.confirm && passwords.new !== passwords.confirm
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => handleSeePassword("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B7D6E] transition-colors"
              >
                {showPassword.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {passwords.confirm && passwords.new !== passwords.confirm && (
              <span className="text-[10px] text-red-500 font-medium ml-1">
                Passwords do not match
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-8 py-2.5 bg-[#09714e] text-white rounded-lg hover:bg-[#075a3e] transition-all cursor-pointer font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </form>
  );
}
