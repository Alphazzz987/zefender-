import React, { useState } from 'react';
import { MapPin, Droplets, Settings, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import { Kiosk, MaintenanceRequest } from '../../types';

interface CustomerKiosksProps {
  kiosks: Kiosk[];
  onMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id'>) => void;
}

const CustomerKiosks: React.FC<CustomerKiosksProps> = ({ kiosks, onMaintenanceRequest }) => {
  const [selectedKiosk, setSelectedKiosk] = useState<Kiosk | null>(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintenanceType, setMaintenanceType] = useState<'refill' | 'repair' | 'cleaning' | 'other'>('refill');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-red-500';
      case 'inactive': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getLiquidLevelColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKiosk) return;

    const request: Omit<MaintenanceRequest, 'id'> = {
      kioskId: selectedKiosk.id,
      customerId: selectedKiosk.customerId,
      type: maintenanceType,
      priority,
      description,
      status: 'pending',
      requestDate: new Date()
    };

    onMaintenanceRequest(request);
    setShowMaintenanceForm(false);
    setSelectedKiosk(null);
    setDescription('');
    setMaintenanceType('refill');
    setPriority('medium');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Kiosks</h2>
          <p className="text-gray-600">Manage and monitor your helmet cleaning kiosks</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Kiosks</p>
          <p className="text-2xl font-bold text-gray-900">{kiosks.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kiosks.map((kiosk) => (
          <div key={kiosk.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(kiosk.status)}`} />
                <h3 className="text-lg font-semibold text-gray-900">{kiosk.name}</h3>
              </div>
              <button
                onClick={() => setSelectedKiosk(kiosk)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{kiosk.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Liquid Level</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getLiquidLevelColor(kiosk.liquidLevel ?? 0)} transition-all duration-300`}
                      style={{ width: `${kiosk.liquidLevel ?? 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{kiosk.liquidLevel ?? 0}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-600">Your Revenue</p>
                  <p className="text-lg font-semibold text-green-600">₹{(kiosk.ownerRevenue ?? 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payments</p>
                  <p className="text-lg font-semibold text-gray-900">{kiosk.totalPayments ?? 0}</p>
                </div>
              </div>

              {kiosk.needsRefill && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Refill Required</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    {(kiosk.totalPayments ?? 0) >= 250 ? 'Reached 250 payment limit' : 'Low liquid level'}
                  </p>
                </div>
              )}

              <div className="flex space-x-2 pt-3">
                <button
                  onClick={() => {
                    setSelectedKiosk(kiosk);
                    setMaintenanceType('refill');
                    setShowMaintenanceForm(true);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  Request Refill
                </button>
                <button
                  onClick={() => {
                    setSelectedKiosk(kiosk);
                    setMaintenanceType('repair');
                    setShowMaintenanceForm(true);
                  }}
                  className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                >
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kiosk Details Modal */}
      {selectedKiosk && !showMaintenanceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedKiosk.name}</h3>
              <button
                onClick={() => setSelectedKiosk(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm text-gray-900">{selectedKiosk.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedKiosk.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedKiosk.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedKiosk.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Price per Clean</label>
                  <p className="text-sm text-gray-900">₹{selectedKiosk.pricePerCleaning}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Your Revenue (90%)</label>
                  <p className="text-lg font-semibold text-green-600">₹{(selectedKiosk.ownerRevenue ?? 0).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Platform Fee (10%)</label>
                  <p className="text-lg font-semibold text-blue-600">₹{(selectedKiosk.platformRevenue ?? 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Payments</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedKiosk.payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </span>
                      <span className="font-medium text-gray-900">₹{payment.ownerRevenue}</span>
                    </div>
                  ))}
                  {selectedKiosk.payments.length === 0 && (
                    <p className="text-xs text-gray-500">No recent payments</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setMaintenanceType('refill');
                    setShowMaintenanceForm(true);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Service
                </button>
                <button
                  onClick={() => setSelectedKiosk(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Request Form */}
      {showMaintenanceForm && selectedKiosk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Maintenance</h3>
            
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kiosk
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedKiosk.name} - {selectedKiosk.location}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <select
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="refill">Liquid Refill</option>
                  <option value="repair">Technical Repair</option>
                  <option value="cleaning">Deep Cleaning</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the issue or service needed"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowMaintenanceForm(false);
                    setSelectedKiosk(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerKiosks;