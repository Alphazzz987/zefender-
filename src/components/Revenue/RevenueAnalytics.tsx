import React from 'react';
import { TrendingUp, DollarSign, Users, Smartphone } from 'lucide-react';
import { Kiosk, Customer } from '../../types';
import StatsCard from '../Dashboard/StatsCard';

interface RevenueAnalyticsProps {
  kiosks: Kiosk[];
  customers: Customer[];
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ kiosks, customers }) => {
  const totalRevenue = kiosks.reduce((sum, kiosk) => sum + (kiosk.totalRevenue ?? 0), 0);
  const platformRevenue = kiosks.reduce((sum, kiosk) => sum + (kiosk.platformRevenue ?? 0), 0);
  const customerRevenue = kiosks.reduce((sum, kiosk) => sum + (kiosk.ownerRevenue ?? 0), 0);
  const totalPayments = kiosks.reduce((sum, kiosk) => sum + (kiosk.totalPayments ?? 0), 0);
  const averageTransactionValue = totalPayments > 0 ? totalRevenue / totalPayments : 0;

  const topPerformingKiosks = [...kiosks]
    .sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0))
    .slice(0, 5);

  const topCustomers = [...customers]
    .sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Revenue Analytics</h2>
        <p className="text-gray-600">Track platform revenue and customer earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          change="+15.3% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-green-500"
        />
        <StatsCard
          title="Platform Revenue (10%)"
          value={`₹${platformRevenue.toLocaleString()}`}
          change="+12.8% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-blue-500"
        />
        <StatsCard
          title="Customer Revenue (90%)"
          value={`₹${customerRevenue.toLocaleString()}`}
          change="+15.7% from last month"
          changeType="positive"
          icon={Users}
          iconColor="bg-purple-500"
        />
        <StatsCard
          title="Avg. Transaction"
          value={`₹${averageTransactionValue.toFixed(0)}`}
          change={`${totalPayments} total payments`}
          changeType="neutral"
          icon={Smartphone}
          iconColor="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Kiosks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Kiosks</h3>
          <div className="space-y-4">
            {topPerformingKiosks.map((kiosk, index) => {
              const customer = customers.find(c => c.id === kiosk.customerId);
              return (
                <div key={kiosk.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{kiosk.name}</p>
                      <p className="text-xs text-gray-500">{customer?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹{(kiosk.totalRevenue ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{(kiosk.totalPayments ?? 0)} payments</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Earning Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Earning Customers</h3>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => {
              const customerKiosks = kiosks.filter(k => k.customerId === customer.id);
              const activeKiosks = customerKiosks.filter(k => k.status === 'active').length;
              
              return (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{activeKiosks} active kiosks</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">₹{(customer.totalRevenue ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">90% share</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown by Kiosk</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Kiosk</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Owner</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Price/Clean</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Platform (10%)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer (90%)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Payments</th>
              </tr>
            </thead>
            <tbody>
              {kiosks.map((kiosk) => {
                const customer = customers.find(c => c.id === kiosk.customerId);
                return (
                  <tr key={kiosk.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{kiosk.name}</p>
                        <p className="text-xs text-gray-500">{kiosk.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{customer?.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">₹{(kiosk.pricePerCleaning ?? 0)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-gray-900">₹{(kiosk.totalRevenue ?? 0).toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-blue-600">₹{(kiosk.platformRevenue ?? 0).toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-green-600">₹{(kiosk.ownerRevenue ?? 0).toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{(kiosk.totalPayments ?? 0)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;