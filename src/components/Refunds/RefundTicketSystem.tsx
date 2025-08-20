import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { createNotification, getAllPayments, processRefund } from '../../lib/supabase';

interface RefundTicket {
  id: string;
  payment_id: string;
  customer_id: string;
  kiosk_id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  created_at: string;
  admin_notes?: string;
  payment?: any;
  kiosk?: any;
}

interface RefundTicketSystemProps {
  userRole: 'admin' | 'customer';
  currentUserId: string;
}

const RefundTicketSystem: React.FC<RefundTicketSystemProps> = ({ userRole, currentUserId }) => {
  const [tickets, setTickets] = useState<RefundTicket[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<RefundTicket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newTicket, setNewTicket] = useState({
    payment_id: '',
    reason: '',
    refund_type: 'full' as 'full' | 'partial',
    partial_amount: ''
  });

  const [adminAction, setAdminAction] = useState({
    status: 'approved' as 'approved' | 'rejected',
    notes: '',
    refund_amount: ''
  });

  useEffect(() => {
    fetchData();
  }, [userRole, currentUserId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch payments for creating tickets
      const { data: paymentsData } = await getAllPayments();
      setPayments(paymentsData || []);

      // In a real implementation, you'd fetch refund tickets from a dedicated table
      // For now, we'll simulate this data
      setTickets([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payment = payments.find(p => p.id === newTicket.payment_id);
      if (!payment) return;

      const refundAmount = newTicket.refund_type === 'full' 
        ? payment.amount 
        : parseFloat(newTicket.partial_amount);

      // Create notification for admin
      await createNotification({
        type: 'refund',
        kiosk_id: payment.kiosk_id,
        customer_id: currentUserId,
        message: `Refund request: ₹${refundAmount} for payment ${payment.razorpay_payment_id.substring(0, 15)}...`,
        priority: 'medium'
      });

      // In a real implementation, you'd create a refund ticket in the database
      const newRefundTicket: RefundTicket = {
        id: `ticket_${Date.now()}`,
        payment_id: newTicket.payment_id,
        customer_id: currentUserId,
        kiosk_id: payment.kiosk_id,
        amount: refundAmount,
        reason: newTicket.reason,
        status: 'pending',
        created_at: new Date().toISOString(),
        payment: payment
      };

      setTickets(prev => [newRefundTicket, ...prev]);
      setShowCreateForm(false);
      setNewTicket({ payment_id: '', reason: '', refund_type: 'full', partial_amount: '' });
      
      alert('Refund ticket created successfully!');
    } catch (error) {
      console.error('Error creating refund ticket:', error);
      alert('Failed to create refund ticket');
    }
  };

  const handleAdminAction = async (ticket: RefundTicket) => {
    try {
      if (adminAction.status === 'approved') {
        // Process the refund
        const refundAmount = parseFloat(adminAction.refund_amount) || ticket.amount;
        
        await processRefund(ticket.payment_id, {
          refund_amount: refundAmount,
          refund_reason: ticket.reason,
          status: refundAmount === ticket.payment?.amount ? 'refunded' : 'partial_refund'
        });

        // Create notification for customer
        await createNotification({
          type: 'refund',
          kiosk_id: ticket.kiosk_id,
          customer_id: ticket.customer_id,
          message: `Refund processed: ₹${refundAmount} has been refunded to your account`,
          priority: 'high'
        });
      }

      // Update ticket status
      const updatedTickets = tickets.map(t => 
        t.id === ticket.id 
          ? { ...t, status: adminAction.status, admin_notes: adminAction.notes }
          : t
      );
      setTickets(updatedTickets);
      setSelectedTicket(null);
      setAdminAction({ status: 'approved', notes: '', refund_amount: '' });
      
      alert(`Refund ticket ${adminAction.status} successfully!`);
    } catch (error) {
      console.error('Error processing admin action:', error);
      alert('Failed to process refund ticket');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'processed': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const customerPayments = userRole === 'customer' 
    ? payments.filter(p => p.kiosks?.customer_id === currentUserId && p.status === 'completed')
    : payments.filter(p => p.status === 'completed');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {userRole === 'admin' ? 'Refund Ticket Management' : 'My Refund Requests'}
          </h2>
          <p className="text-gray-600">
            {userRole === 'admin' 
              ? 'Review and process customer refund requests'
              : 'Submit and track your refund requests'
            }
          </p>
        </div>
        
        {userRole === 'customer' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Refund Request
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {tickets.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {tickets.filter(t => t.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {tickets.filter(t => t.status === 'rejected').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{tickets.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Tickets</h3>
        
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const StatusIcon = getStatusIcon(ticket.status);
            
            return (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <StatusIcon className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          Refund Request #{ticket.id.substring(0, 8)}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Payment: {ticket.payment?.razorpay_payment_id?.substring(0, 15)}...
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="font-medium">₹{ticket.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reason</p>
                        <p className="font-medium">{ticket.reason}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-medium">{new Date(ticket.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Kiosk</p>
                        <p className="font-medium">{ticket.payment?.kiosks?.name || 'Unknown'}</p>
                      </div>
                    </div>

                    {ticket.admin_notes && (
                      <div className="bg-gray-50 rounded p-2 mt-2">
                        <p className="text-xs text-gray-600">Admin Notes:</p>
                        <p className="text-sm text-gray-800">{ticket.admin_notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.toUpperCase()}
                    </span>
                    
                    {userRole === 'admin' && ticket.status === 'pending' && (
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No refund tickets found</p>
          </div>
        )}
      </div>

      {/* Create Refund Ticket Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Refund Request</h3>
            
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Payment
                </label>
                <select
                  value={newTicket.payment_id}
                  onChange={(e) => setNewTicket({ ...newTicket, payment_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a payment</option>
                  {customerPayments.map((payment) => (
                    <option key={payment.id} value={payment.id}>
                      ₹{payment.amount} - {payment.razorpay_payment_id.substring(0, 15)}... ({new Date(payment.created_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="refundType"
                      value="full"
                      checked={newTicket.refund_type === 'full'}
                      onChange={(e) => setNewTicket({ ...newTicket, refund_type: 'full' })}
                      className="mr-2"
                    />
                    <span className="text-sm">Full Refund</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="refundType"
                      value="partial"
                      checked={newTicket.refund_type === 'partial'}
                      onChange={(e) => setNewTicket({ ...newTicket, refund_type: 'partial' })}
                      className="mr-2"
                    />
                    <span className="text-sm">Partial Refund</span>
                  </label>
                </div>
              </div>

              {newTicket.refund_type === 'partial' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refund Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={newTicket.partial_amount}
                    onChange={(e) => setNewTicket({ ...newTicket, partial_amount: e.target.value })}
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
                  value={newTicket.reason}
                  onChange={(e) => setNewTicket({ ...newTicket, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Explain why you need a refund"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTicket.payment_id || !newTicket.reason}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Review Modal */}
      {selectedTicket && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Refund Request</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Request Details</p>
                <p className="font-medium">Amount: ₹{selectedTicket.amount}</p>
                <p className="text-sm text-gray-600">Reason: {selectedTicket.reason}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="adminAction"
                      value="approved"
                      checked={adminAction.status === 'approved'}
                      onChange={(e) => setAdminAction({ ...adminAction, status: 'approved' })}
                      className="mr-2"
                    />
                    <span className="text-sm">Approve Refund</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="adminAction"
                      value="rejected"
                      checked={adminAction.status === 'rejected'}
                      onChange={(e) => setAdminAction({ ...adminAction, status: 'rejected' })}
                      className="mr-2"
                    />
                    <span className="text-sm">Reject Refund</span>
                  </label>
                </div>
              </div>

              {adminAction.status === 'approved' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refund Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTicket.amount}
                    step="0.01"
                    value={adminAction.refund_amount}
                    onChange={(e) => setAdminAction({ ...adminAction, refund_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Max: ${selectedTicket.amount}`}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes
                </label>
                <textarea
                  value={adminAction.notes}
                  onChange={(e) => setAdminAction({ ...adminAction, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add notes for the customer"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAdminAction(selectedTicket)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {adminAction.status === 'approved' ? 'Approve & Process' : 'Reject Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundTicketSystem;