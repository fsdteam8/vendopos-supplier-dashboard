'use client';

import { Bell, Package, Eye, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAllNotifications, useMarkNotificationAsViewed } from '@/hooks/useNotification';
import { Notification } from '@/types/notification';
import { Pagination } from '../ui/pagination';

const NotificationListener = () => {
  const { message: wsMessage } = useWebSocket();
  const { data: session } = useSession();
  const userId = session?.user?.id || '';

  const { data, isLoading, isError, refetch } = useAllNotifications(userId);
  const { mutate: markAsViewed } = useMarkNotificationAsViewed();

  if (wsMessage) {
    refetch();
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMarkAsViewed = () => {
    markAsViewed();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <Bell className="w-12 h-12 mb-4" />
        <p>Error loading notifications</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const notifications: Notification[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-lime-50">
            <Bell className="w-6 h-6 text-lime-600" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Notifications</h1>
            <p className="text-sm text-gray-500">Stay updated with your latest activities</p>
          </div>
        </div>

        {meta && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {notifications.length > 0 && (
              <Button
                onClick={() => handleMarkAsViewed()}
                className="bg-[#086646] hover:bg-[#07533c] rounded-xl px-4 py-2 text-sm shadow-sm"
              >
                Mark all as read
              </Button>
            )}

            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{meta.total} total</span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[320px] rounded-2xl bg-gray-50 border border-gray-100">
          <div className="p-3 rounded-full bg-white shadow-sm mb-4">
            <Bell className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`group relative p-4 rounded-2xl transition-all duration-200 ${
                notification.isViewed
                  ? 'bg-white border border-gray-100 hover:shadow-sm'
                  : 'bg-lime-50/60 border border-lime-100 hover:shadow-md'
              }`}
            >
              {/* Unread dot */}
              {!notification.isViewed && (
                <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-lime-500 rounded-full animate-pulse" />
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-2.5 rounded-xl ${
                    notification.isViewed ? 'bg-gray-100' : 'bg-lime-100'
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p
                    className={`text-sm leading-relaxed ${
                      notification.isViewed ? 'text-gray-600' : 'text-gray-900 font-medium'
                    }`}
                  >
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(notification.createdAt)}
                    </div>

                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                      {notification.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination />
    </div>
  );
};

export default NotificationListener;
