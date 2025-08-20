import React, { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Payment, RefundRequest, Kiosk } from '../../types';

interface RefundManagementProps {
  kiosks: Kiosk[];
  onProcessRefund: (refundRequest: RefundRequest) => void;
}

const RefundManagement: React.FC<RefundManagementProps> = ({ kiosks, onProcessRefund }) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundReason, setRefundReason] = useState('');
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');

  const completedPayments = kiosks.flatMap(kiosk => 
    kiosk.payments
      .filter(payment => payment.status === 'completed')
      .map(payment => ({ ...payment, kioskName: kiosk.name }))
  );

  const refundedPayments = kiosks.flatMap(kiosk => 
    kiosk.payments
      .filter(payment => payment.status === 'refunded' || payment.status === 'partial_refund')
      .map(payment => ({ ...payment, kioskName: kiosk.name }))
  );

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    const refundRequest: RefundRequest = {
      paymentId: selectedPayment.id,
      amount: refundType === 'full' ? selectedPayment.amount : parseFloat(refundAmount),
      reason: refundReason,
      type: refundType
    };

    onProcessRefund(refundRequest);
    setSelectedPayment(null);
    setRefundAmount('');
    setRefundReason('');
    setRefundType('full');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Refund Management</h2>
        <p className="text-gray-600">Process full and partial refunds for customer payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligible for Refund */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
            Eligible for Refund ({completedPayments.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {completedPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {(payment as any).kioskName}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {(payment.razorpayPaymentId || '').substring(0, 20)}...
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(payment.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right mr-3">
                  <p className="text-sm font-semibold text-gray-900">₹{payment.amount}</p>
                  {payment.customerPhone && (
                    <p className="text-xs text-gray-500">{payment.customerPhone}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPayment(payment)}
                  className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                >
                  Refund
                </button>
              </div>
            ))}
            {completedPayments.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">No payments eligible for refund</p>
              </div>
            )}
          </div>
        </div>

        {/* Refund History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Refund History ({refundedPayments.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {refundedPayments.map((payment) => (
              <div key={payment.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">
                    {(payment as any).kioskName}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'refunded' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {payment.status === 'refunded' ? 'Full Refund' : 'Partial Refund'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Original: ₹{payment.amount}</span>
                  <span>Refunded: ₹{payment.refundAmount}</span>
                </div>
                {payment.refundReason && (
                  <p className="text-xs text-gray-600 mt-1">{payment.refundReason}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(payment.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
            {refundedPayments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No refunds processed yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Process Refund</h3>
            </div>

            <form onSubmit={handleRefundSubmit} className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Payment Details</p>
                <p className="text-sm font-medium text-gray-900">
                  {(selectedPayment as any).kioskName} - ₹{selectedPayment.amount}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {selectedPayment.razorpayPaymentId || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="refundType"
                      value="full"
                      checked={refundType === 'full'}
                      onChange={(e) => setRefundType('full')}
                      className="mr-2"
                    />
                    <span className="text-sm">Full Refund (₹{selectedPayment.amount})</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="refundType"
                      value="partial"
                      checked={refundType === 'partial'}
                      onChange={(e) => setRefundType('partial')}
                      className="mr-2"
                    />
                    <span className="text-sm">Partial Refund</span>
                  </label>
                </div>
              </div>

              {refundType === 'partial' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refund Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedPayment.amount}
                    step="0.01"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Refund
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter reason for refund"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Process Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundManagement;