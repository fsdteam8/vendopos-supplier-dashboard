'use client';

import { useChangePassword } from '@/app/features/auth/hooks/useChangePassword';
import { CheckCircle2, Circle, Eye, EyeOff, Lock } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function SecurityForm() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
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
      toast.error('New passwords do not match');
      return;
    }

    if (Object.values(passwordChecks).includes(false)) {
      toast.error('Password does not meet requirements');
      return;
    }

    changePassword(
      {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      },
      {
        onSuccess: () => {
          toast.success('Password updated successfully');
          setPasswords({ current: '', new: '', confirm: '' });
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to update password');
        },
      },
    );
  };

  const renderCheck = (label: string, valid: boolean) => (
    <li
      className={`flex items-center gap-2 text-xs transition-colors ${valid ? 'text-red-600' : 'text-gray-400'}`}
    >
      {valid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
      {label}
    </li>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Security Settings</h3>

        <p className="text-sm text-gray-500 mb-6">
          Update your password to keep your account secure
        </p>

        <div className="space-y-6">
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="current"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              Current Password
            </label>

            <div className="relative">
              <input
                id="current"
                name="current"
                type={showPassword.current ? 'text' : 'password'}
                value={passwords.current}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#1B7D6E] focus:ring-4 focus:ring-[#1B7D6E]/10"
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() => handleSeePassword('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B7D6E] transition-colors"
              >
                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="new"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              New Password
            </label>

            <div className="relative">
              <input
                id="new"
                name="new"
                type={showPassword.new ? 'text' : 'password'}
                value={passwords.new}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-[#1B7D6E] focus:ring-4 focus:ring-[#1B7D6E]/10"
                placeholder="Create a strong password"
              />

              <button
                type="button"
                onClick={() => handleSeePassword('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B7D6E] transition-colors"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Checklist UI */}
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-3">Password requirements</p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                {renderCheck('Minimum 6 characters', passwordChecks.minLength)}
                {renderCheck('At least one uppercase letter', passwordChecks.uppercase)}
                {renderCheck('At least one lowercase letter', passwordChecks.lowercase)}
                {renderCheck('Include at least one number', passwordChecks.number)}
                {renderCheck('Include a special character', passwordChecks.special)}
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              Confirm New Password
            </label>

            <div className="relative">
              <input
                id="confirm"
                name="confirm"
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={handleChange}
                required
                className={`w-full pl-4 pr-10 py-3 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#1B7D6E]/10 ${
                  passwords.confirm && passwords.new !== passwords.confirm
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#1B7D6E]'
                }`}
                placeholder="Re-enter new password"
              />

              <button
                type="button"
                onClick={() => handleSeePassword('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B7D6E] transition-colors"
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {passwords.confirm && passwords.new !== passwords.confirm && (
              <span className="text-xs text-red-500 ml-1">Passwords do not match</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#09714e] text-white text-sm font-semibold shadow-sm hover:bg-[#075a3e] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </form>
  );
}
