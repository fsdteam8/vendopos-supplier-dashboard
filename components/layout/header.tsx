import { Bell, Search } from "lucide-react"
import { useProfile } from "@/app/features/profile/hooks/useProfile"

export function Header() {
  const { data: profile } = useProfile()
  const userData = profile?.data

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-80">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B7D6E]"
            aria-label="Search the admin panel"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{userData ? `${userData.firstName} ${userData.lastName}` : "User"}</p>
            <p className="text-xs text-gray-500 capitalize">{userData?.role || "Member"}</p>
          </div>
          <div
            className="w-10 h-10 rounded-full bg-[#1B7D6E] text-white flex items-center justify-center font-semibold text-sm overflow-hidden"
            role="img"
            aria-label={`User avatar with name ${userData?.firstName}`}
          >
             {userData?.image?.url ? (
                <img src={userData.image.url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userData?.firstName?.charAt(0) || "U"
              )}
          </div>
        </div>
      </div>
    </header>
  )
}
