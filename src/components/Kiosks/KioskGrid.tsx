import React, { useState } from 'react';
import { Plus, MapPin, Battery, Droplets, Settings, Eye } from 'lucide-react';
import { Kiosk } from '../../types';

interface KioskGridProps {
  kiosks: Kiosk[];
  onKioskUpdate: (kiosk: Kiosk) => void;
}

const KioskGrid: React.FC<KioskGridProps> = ({ kiosks, onKioskUpdate }) => {
  const [selectedKiosk, setSelectedKiosk] = useState<Kiosk | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kiosk Management</h2>
          <p className="text-gray-600">Monitor and manage your helmet cleaning kiosks</p>
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
                <Eye className="w-4 h-4" />
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
                  <p className="text-sm text-gray-600">Total Payments</p>
                  <p className="text-lg font-semibold text-gray-900">{(kiosk.totalPayments ?? 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-lg font-semibold text-gray-900">₹{(kiosk.totalRevenue ?? 0).toLocaleString()}</p>
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

              <div className="flex items-center justify-between pt-3">
                <span className="text-xs text-gray-500">
                  Last maintenance: {kiosk.lastMaintenance?.toLocaleDateString() ?? 'N/A'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  kiosk.status === 'active' ? 'bg-green-100 text-green-800' :
                  kiosk.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {kiosk.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kiosk Details Modal */}
      {selectedKiosk && (
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

              <div>
                <label className="text-sm font-medium text-gray-700">QR Code</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                  {selectedKiosk.qrCode}
                </p>
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
                  <label className="text-sm font-medium text-gray-700">Liquid Level</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getLiquidLevelColor(selectedKiosk.liquidLevel ?? 0)}`}
                        style={{ width: `${selectedKiosk.liquidLevel ?? 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">{selectedKiosk.liquidLevel ?? 0}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Payments</label>
                  <p className="text-lg font-semibold text-gray-900">{(selectedKiosk.totalPayments ?? 0)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Revenue</label>
                  <p className="text-lg font-semibold text-gray-900">₹{(selectedKiosk.totalRevenue ?? 0).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Last Maintenance</label>
                <p className="text-sm text-gray-900">{selectedKiosk.lastMaintenance?.toLocaleDateString() ?? 'N/A'}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Payments</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {(selectedKiosk.payments || []).slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </span>
                      <span className="font-medium text-gray-900">₹{payment.amount}</span>
                    </div>
                  ))}
                  {(!selectedKiosk.payments || selectedKiosk.payments.length === 0) && (
                    <p className="text-xs text-gray-500">No recent payments</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    const updated = { ...selectedKiosk, needsRefill: false, liquidLevel: 100 };
                    onKioskUpdate(updated);
                    setSelectedKiosk(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark Refilled
                </button>
                <button
                  onClick={() => {
                    const updated = { 
                      ...selectedKiosk, 
                      status: selectedKiosk.status === 'active' ? 'maintenance' : 'active' as any,
                      lastMaintenance: new Date()
                    };
                    onKioskUpdate(updated);
                    setSelectedKiosk(updated);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Toggle Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KioskGrid;