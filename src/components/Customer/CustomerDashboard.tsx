import React from 'react';
import { Smartphone, TrendingUp, AlertTriangle, Droplets } from 'lucide-react';
import { Kiosk, Notification, Customer } from '../../types';
import StatsCard from '../Dashboard/StatsCard';

interface CustomerDashboardProps {
  customer: Customer;
  kiosks: Kiosk[];
  notifications: Notification[];
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ customer, kiosks, notifications }) => {
  const customerKiosks = kiosks.filter(k => k.customerId === customer.id);
  const activeKiosks = customerKiosks.filter(k => k.status === 'active').length;
  const totalRevenue = customerKiosks.reduce((sum, kiosk) => sum + (kiosk.ownerRevenue ?? 0), 0);
  const totalPayments = customerKiosks.reduce((sum, kiosk) => sum + (kiosk.totalPayments ?? 0), 0);
  const refillNeeded = customerKiosks.filter(k => k.needsRefill).length;

  const recentNotifications = notifications
    .filter(n => n.customerId === customer.id)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {customer.name}!</h2>
        <p className="text-gray-600">Monitor your kiosk network performance and earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Your Revenue (90%)"
          value={`₹${totalRevenue.toLocaleString()}`}
          change="+15.2% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-green-500"
        />
        <StatsCard
          title="Total Payments"
          value={totalPayments.toLocaleString()}
          change="+8.7% from last month"
          changeType="positive"
          icon={Smartphone}
          iconColor="bg-blue-500"
        />
        <StatsCard
          title="Active Kiosks"
          value={activeKiosks}
          change={`${customerKiosks.length} total kiosks`}
          changeType="neutral"
          icon={Smartphone}
          iconColor="bg-purple-500"
        />
        <StatsCard
          title="Refill Alerts"
          value={refillNeeded}
          change="Immediate attention needed"
          changeType={refillNeeded > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
          iconColor={refillNeeded > 0 ? "bg-red-500" : "bg-green-500"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Kiosks Performance</h3>
          <div className="space-y-4">
            {customerKiosks.map((kiosk) => (
              <div key={kiosk.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    kiosk.status === 'active' ? 'bg-green-500' :
                    kiosk.status === 'maintenance' ? 'bg-red-500' :
                    'bg-gray-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{kiosk.name}</p>
                    <p className="text-xs text-gray-500">{kiosk.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">₹{(kiosk.ownerRevenue ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{(kiosk.totalPayments ?? 0)} payments</p>
                  {kiosk.needsRefill && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Droplets className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-600">Refill needed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
          <div className="space-y-4">
            {recentNotifications.map((notification) => {
              const kiosk = customerKiosks.find(k => k.id === notification.kioskId);
              return (
                <div key={notification.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'refill' ? 'bg-red-500' :
                    notification.type === 'payment' ? 'bg-green-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {kiosk?.name} • {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
            {recentNotifications.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No recent notifications</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Request Refill</p>
            <p className="text-xs text-gray-500">Submit liquid refill request</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Smartphone className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Report Issue</p>
            <p className="text-xs text-gray-500">Report technical problems</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">View Analytics</p>
            <p className="text-xs text-gray-500">Detailed performance metrics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;