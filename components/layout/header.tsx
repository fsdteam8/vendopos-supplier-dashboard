import { useProfile } from "@/app/features/profile/hooks/useProfile"
import { Bell, Package, CreditCard, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useAllNotifications } from "@/hooks/useNotification";
import { useSession } from "next-auth/react";
import { Notification } from "@/types/notification";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "order":
      return <Package className="w-4 h-4" />;
    case "payment":
      return <CreditCard className="w-4 h-4" />;
    case "success":
      return <CheckCircle className="w-4 h-4" />;
    case "warning":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "order":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "payment":
      return "bg-[#086646]/10 text-[#086646] border-[#086646]/30";
    case "success":
      return "bg-[#086646]/10 text-[#086646] border-[#086646]/30";
    case "warning":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

interface HeaderProps {
  setCurrentPage: (page: any) => void;
}

export function Header({ setCurrentPage }: HeaderProps) {
  const { data: profile } = useProfile()
  const { data: session } = useSession();

  const userId = session?.user?.id || '';
  const { data } = useAllNotifications(userId);
  
  const notifications: Notification[] = data?.data || [];
  const unreadCount = notifications.filter(n => !n.isViewed).length;
  const userData = profile?.data

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-end">
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setCurrentPage("notifications")}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>

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
