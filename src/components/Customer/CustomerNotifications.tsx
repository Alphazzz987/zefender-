import React from 'react';
import { Bell, AlertTriangle, Droplets, Settings, CheckCircle, Clock } from 'lucide-react';
import { Notification, Kiosk } from '../../types';

interface CustomerNotificationsProps {
  notifications: Notification[];
  kiosks: Kiosk[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

const CustomerNotifications: React.FC<CustomerNotificationsProps> = ({
  notifications,
  kiosks,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'refill': return Droplets;
      case 'payment': return Bell;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
          <p className="text-gray-600">Stay updated with your kiosk alerts and updates</p>
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
            <h3 className="text-lg font-semibold text-gray-900">Your Notifications</h3>
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
              const priorityClass = getPriorityColor(notification.priority);

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? `border-l-4 ${priorityClass}` : ''
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
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium ml-2"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <span>{kiosk?.name || 'System'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{notification.timestamp.toLocaleString()}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {notification.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      {notification.type === 'refill' && kiosk && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg">
                          <p className="text-xs text-red-700">
                            <strong>Action Required:</strong> Your kiosk needs liquid refill
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Current level: {kiosk.liquidLevel}% | Payments: {kiosk.totalPayments}/250
                          </p>
                        </div>
                      )}
                      
                      {notification.type === 'maintenance' && kiosk && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                          <p className="text-xs text-yellow-700">
                            <strong>Service Update:</strong> Maintenance status changed
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Last service: {kiosk.lastMaintenance.toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {notification.type === 'payment' && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-700">
                            <strong>Revenue Update:</strong> New payment received
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

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Refill Alerts</p>
              <p className="text-xs text-gray-500">Get notified when kiosks need liquid refill</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Payment Notifications</p>
              <p className="text-xs text-gray-500">Receive alerts for new payments</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Maintenance Updates</p>
              <p className="text-xs text-gray-500">Get updates on maintenance requests</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive important alerts via email</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerNotifications;