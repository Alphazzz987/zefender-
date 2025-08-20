import React, { useState } from 'react';
import { Plus, MapPin, QrCode, Save, DollarSign, User } from 'lucide-react';
import { Kiosk, Customer } from '../../types';

interface AddKioskFormProps {
  onAddKiosk: (kiosk: Omit<Kiosk, 'id'>) => void;
  customers: Customer[];
}

const AddKioskForm: React.FC<AddKioskFormProps> = ({ onAddKiosk, customers }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    qrCode: '',
    status: 'active' as const,
    customerId: '',
    pricePerCleaning: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newKiosk: Omit<Kiosk, 'id'> = {
        ...formData,
        totalPayments: 0,
        liquidLevel: 100,
        needsRefill: false,
        lastMaintenance: new Date(),
        totalRevenue: 0,
        ownerRevenue: 0,
        platformRevenue: 0,
        payments: [],
        maintenanceRequests: []
      };

      onAddKiosk(newKiosk);
      
      // Reset form
      setFormData({
        name: '',
        location: '',
        qrCode: '',
        status: 'active',
        customerId: '',
        pricePerCleaning: 50
      });
    } catch (error) {
      console.error('Error adding kiosk:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateQRCode = () => {
    const qrCode = `QR_${formData.name.toUpperCase().replace(/\s+/g, '_')}_${generateId().toUpperCase()}`;
    setFormData({ ...formData, qrCode });
  };

  const activeCustomers = customers.filter(c => c.status === 'active');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Kiosk</h2>
        <p className="text-gray-600">Set up a new helmet cleaning kiosk and assign to a customer</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kiosk Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mall Central Kiosk"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Customer *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a customer</option>
                  {activeCustomers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Cleaning *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={formData.pricePerCleaning}
                  onChange={(e) => setFormData({ ...formData, pricePerCleaning: parseInt(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Revenue split: Customer gets 90%, Platform gets 10%
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Phoenix Mall, Bangalore - Ground Floor"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Identifier *
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.qrCode}
                  onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="QR Code identifier for Razorpay"
                  required
                />
              </div>
              <button
                type="button"
                onClick={generateQRCode}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This identifier will be used to link Razorpay payments to this kiosk
            </p>
          </div>

          {formData.customerId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">Revenue Sharing Details</h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-green-800">
                <div>
                  <p className="font-medium">Customer Revenue (90%)</p>
                  <p>₹{Math.round(formData.pricePerCleaning * 0.9)} per cleaning</p>
                </div>
                <div>
                  <p className="font-medium">Platform Fee (10%)</p>
                  <p>₹{Math.round(formData.pricePerCleaning * 0.1)} per cleaning</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions</h4>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Create a QR code in your Razorpay dashboard using the identifier above</li>
              <li>Set the amount to ₹{formData.pricePerCleaning} (helmet cleaning fee)</li>
              <li>Configure the payment webhook to include the QR code identifier</li>
              <li>Print and attach the QR code to the physical kiosk</li>
              <li>Customer will receive 90% of revenue, platform keeps 10%</li>
            </ol>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setFormData({ name: '', location: '', qrCode: '', status: 'active', customerId: '', pricePerCleaning: 50 })}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting || activeCustomers.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Add Kiosk</span>
                </>
              )}
            </button>
          </div>

          {activeCustomers.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                No active customers available. Please add a customer first before creating a kiosk.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddKioskForm;