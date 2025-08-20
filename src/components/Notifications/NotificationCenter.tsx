import React from 'react';
import { Bell, AlertTriangle, CreditCard, Settings, CheckCircle, Clock } from 'lucide-react';
import { Notification, Kiosk } from '../../types';

interface NotificationCenterProps {
  notifications: Notification[];
  kiosks: Kiosk[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  kiosks,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'refill': return AlertTriangle;
      case 'payment': return CreditCard;
      case 'maintenance': return Settings;
      case 'error': return AlertTriangle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'refill': return 'text-red-600 bg-red-100';
      case 'payment': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
          <p className="text-gray-600">Stay updated with kiosk alerts and system updates</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
            <span className="text-sm text-gray-500">
              {unreadCount} unread of {notifications.length} total
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-500">No notifications at this time</p>
              <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const kiosk = kiosks.find(k => k.id === notification.kioskId);
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <span>{kiosk?.name || 'Unknown Kiosk'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{notification.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {notification.type === 'refill' && kiosk && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg">
                          <p className="text-xs text-red-700">
                            Action Required: Refill liquid tank (Current level: {kiosk.liquidLevel ?? 0}%)
                          </p>
                        </div>
                      )}
                      
                      {notification.type === 'maintenance' && kiosk && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                          <p className="text-xs text-yellow-700">
                            Maintenance needed: Last service {kiosk.lastMaintenance?.toLocaleDateString() ?? 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Schedule Refill</p>
            <p className="text-xs text-gray-500">Mark kiosks for liquid refill</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Schedule Maintenance</p>
            <p className="text-xs text-gray-500">Plan maintenance activities</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Bell className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Notification Settings</p>
            <p className="text-xs text-gray-500">Configure alert preferences</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;