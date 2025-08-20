import React from 'react';
import { TrendingUp, DollarSign, Calendar, Smartphone } from 'lucide-react';
import { Kiosk } from '../../types';
import StatsCard from '../Dashboard/StatsCard';

interface CustomerRevenueProps {
  kiosks: Kiosk[];
}

const CustomerRevenue: React.FC<CustomerRevenueProps> = ({ kiosks }) => {
  const totalRevenue = kiosks.reduce((sum, kiosk) => sum + (kiosk.ownerRevenue ?? 0), 0);
  const totalPayments = kiosks.reduce((sum, kiosk) => sum + (kiosk.totalPayments ?? 0), 0);
  const averagePerKiosk = kiosks.length > 0 ? totalRevenue / kiosks.length : 0;
  const averagePerPayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

  const sortedKiosks = [...kiosks].sort((a, b) => (b.ownerRevenue ?? 0) - (a.ownerRevenue ?? 0));

  // Mock monthly data for demonstration
  const monthlyData = [
    { month: 'Jan', revenue: Math.round(totalRevenue * 0.6) },
    { month: 'Feb', revenue: Math.round(totalRevenue * 0.7) },
    { month: 'Mar', revenue: Math.round(totalRevenue * 0.8) },
    { month: 'Apr', revenue: Math.round(totalRevenue * 0.9) },
    { month: 'May', revenue: totalRevenue },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Revenue Analytics</h2>
        <p className="text-gray-600">Track your earnings and kiosk performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue (90%)"
          value={`₹${totalRevenue.toLocaleString()}`}
          change="+18.2% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-green-500"
        />
        <StatsCard
          title="Total Payments"
          value={totalPayments.toLocaleString()}
          change="+12.5% from last month"
          changeType="positive"
          icon={Smartphone}
          iconColor="bg-blue-500"
        />
        <StatsCard
          title="Avg per Kiosk"
          value={`₹${averagePerKiosk.toLocaleString()}`}
          change={`${kiosks.length} active kiosks`}
          changeType="neutral"
          icon={DollarSign}
          iconColor="bg-purple-500"
        />
        <StatsCard
          title="Avg per Payment"
          value={`₹${averagePerPayment.toFixed(0)}`}
          change="Your 90% share"
          changeType="neutral"
          icon={Calendar}
          iconColor="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => {
              const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
              const percentage = (data.revenue / maxRevenue) * 100;
              
              return (
                <div key={data.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-sm font-medium text-gray-900 text-right">
                    ₹{data.revenue.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kiosk Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kiosk Performance</h3>
          <div className="space-y-4">
            {sortedKiosks.map((kiosk, index) => (
              <div key={kiosk.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{kiosk.name}</p>
                    <p className="text-xs text-gray-500">{(kiosk.totalPayments ?? 0)} payments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">₹{(kiosk.ownerRevenue ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">₹{(kiosk.pricePerCleaning ?? 0)}/clean</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Revenue Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Kiosk</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Price/Clean</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Payments</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Your Share (90%)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Platform Fee (10%)</th>
              </tr>
            </thead>
            <tbody>
              {kiosks.map((kiosk) => (
                <tr key={kiosk.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900">{kiosk.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{kiosk.location}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900">₹{(kiosk.pricePerCleaning ?? 0)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{(kiosk.totalPayments ?? 0)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-gray-900">₹{(kiosk.totalRevenue ?? 0).toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-green-600">₹{(kiosk.ownerRevenue ?? 0).toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-blue-600">₹{(kiosk.platformRevenue ?? 0).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Your Total Earnings (90%)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">₹{kiosks.reduce((sum, k) => sum + (k.platformRevenue ?? 0), 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Platform Fees (10%)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">₹{kiosks.reduce((sum, k) => sum + (k.totalRevenue ?? 0), 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Generated Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRevenue;