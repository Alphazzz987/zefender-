import React from 'react';
import { CreditCard, Smartphone, AlertTriangle, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';
import { Kiosk, Notification } from '../../types';

interface DashboardOverviewProps {
  kiosks: Kiosk[];
  notifications: Notification[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ kiosks, notifications }) => {
  const totalRevenue = kiosks.reduce((sum, kiosk) => sum + (kiosk.totalRevenue ?? 0), 0);
  const totalPayments = kiosks.reduce((sum, kiosk) => sum + (kiosk.totalPayments ?? 0), 0);
  const activeKiosks = kiosks.filter(k => k.status === 'active').length;
  const refillNeeded = kiosks.filter(k => k.needsRefill).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your kiosk network performance and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          change="+12.5% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-green-500"
        />
        <StatsCard
          title="Total Payments"
          value={totalPayments.toLocaleString()}
          change="+8.2% from last month"
          changeType="positive"
          icon={CreditCard}
          iconColor="bg-blue-500"
        />
        <StatsCard
          title="Active Kiosks"
          value={activeKiosks}
          change={`${kiosks.length} total kiosks`}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {notifications.slice(0, 5).map((notification) => {
              const kiosk = kiosks.find(k => k.id === notification.kioskId);
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
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kiosk Status</h3>
          <div className="space-y-4">
            {kiosks.map((kiosk) => (
              <div key={kiosk.id} className="flex items-center justify-between">
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
                  <p className="text-sm font-medium text-gray-900">₹{(kiosk.totalRevenue ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{(kiosk.totalPayments ?? 0)} payments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;