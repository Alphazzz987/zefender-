import React, { useState, useEffect } from 'react';
import { Droplets, Clock, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { supabase, createRefillRequest, updateRefillRequest } from '../../lib/supabase';

interface RefillRequest {
  id: string;
  kiosk_id: string;
  customer_id: string;
  requested_amount: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  request_date: string;
  approved_date?: string;
  completed_date?: string;
  cost?: number;
  notes?: string;
  kiosk?: {
    name: string;
    location: string;
    liquid_level: number;
    refill_limit: number;
  };
  customer?: {
    name: string;
    email: string;
  };
}

interface RefillManagementProps {
  userRole: 'admin' | 'customer';
  currentUserId: string;
}

const RefillManagement: React.FC<RefillManagementProps> = ({ userRole, currentUserId }) => {
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RefillRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalData, setApprovalData] = useState({
    cost: '',
    notes: '',
    approved_amount: ''
  });

  useEffect(() => {
    fetchRefillRequests();
  }, [userRole, currentUserId]);

  const fetchRefillRequests = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('refill_requests')
        .select(`
          *,
          kiosks (name, location, liquid_level, refill_limit),
          customers (name, email)
        `)
        .order('request_date', { ascending: false });

      if (userRole === 'customer') {
        query = query.eq('customer_id', currentUserId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setRefillRequests(data || []);
    } catch (error) {
      console.error('Error fetching refill requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async (request: RefillRequest) => {
    try {
      const updates = {
        status: 'approved',
        approved_date: new Date().toISOString(),
        cost: parseFloat(approvalData.cost),
        notes: approvalData.notes
      };

      const { error } = await updateRefillRequest(request.id, updates);
      if (error) throw error;

      // Create notification for customer
      await supabase.from('notifications').insert({
        type: 'refill',
        kiosk_id: request.kiosk_id,
        customer_id: request.customer_id,
        message: `Refill request approved for ${request.kiosk?.name}. Cost: ₹${approvalData.cost}`,
        priority: 'medium'
      });

      setShowApprovalForm(false);
      setSelectedRequest(null);
      setApprovalData({ cost: '', notes: '', approved_amount: '' });
      fetchRefillRequests();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleCompleteRefill = async (request: RefillRequest) => {
    try {
      const updates = {
        status: 'completed',
        completed_date: new Date().toISOString()
      };

      const { error } = await updateRefillRequest(request.id, updates);
      if (error) throw error;

      // Update kiosk liquid level
      await supabase
        .from('kiosks')
        .update({
          liquid_level: 100,
          needs_refill: false,
          total_payments: 0 // Reset payment counter after refill
        })
        .eq('id', request.kiosk_id);

      // Create notification
      await supabase.from('notifications').insert({
        type: 'refill',
        kiosk_id: request.kiosk_id,
        customer_id: request.customer_id,
        message: `Refill completed for ${request.kiosk?.name}. Kiosk is ready for service.`,
        priority: 'low'
      });

      fetchRefillRequests();
    } catch (error) {
      console.error('Error completing refill:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'rejected': return AlertTriangle;
      default: return Clock;
    }
  };

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
            {userRole === 'admin' ? 'Refill Management' : 'My Refill Requests'}
          </h2>
          <p className="text-gray-600">
            {userRole === 'admin' 
              ? 'Manage liquid refill requests from customers'
              : 'Track your kiosk refill requests and status'
            }
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xl font-bold text-yellow-600">
              {refillRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-xl font-bold text-blue-600">
              {refillRequests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-xl font-bold text-green-600">
              {refillRequests.filter(r => r.status === 'completed').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Cost</p>
            <p className="text-xl font-bold text-gray-900">
              ₹{refillRequests.reduce((sum, r) => sum + (r.cost || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {refillRequests.map((request) => {
            const StatusIcon = getStatusIcon(request.status);
            
            return (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.kiosk?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {request.kiosk?.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Requested Amount</p>
                        <p className="font-medium">{request.requested_amount}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Current Level</p>
                        <p className="font-medium">{request.kiosk?.liquid_level}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Request Date</p>
                        <p className="font-medium">{new Date(request.request_date).toLocaleDateString()}</p>
                      </div>
                      {request.cost && (
                        <div>
                          <p className="text-gray-600">Cost</p>
                          <p className="font-medium text-green-600">₹{request.cost}</p>
                        </div>
                      )}
                    </div>

                    {userRole === 'admin' && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Customer: <span className="font-medium">{request.customer?.name}</span>
                        </p>
                      </div>
                    )}

                    {request.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{request.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="w-4 h-4" />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {userRole === 'admin' && (
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowApprovalForm(true);
                              }}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateRefillRequest(request.id, { status: 'rejected' })}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <button
                            onClick={() => handleCompleteRefill(request)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {refillRequests.length === 0 && (
          <div className="text-center py-8">
            <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No refill requests found</p>
          </div>
        )}
      </div>

      {/* Approval Form Modal */}
      {showApprovalForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Refill Request</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Request Details</p>
                <p className="font-medium">{selectedRequest.kiosk?.name}</p>
                <p className="text-sm text-gray-600">
                  Requested: {selectedRequest.requested_amount}% refill
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Cost (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    value={approvalData.cost}
                    onChange={(e) => setApprovalData({ ...approvalData, cost: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter service cost"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={approvalData.notes}
                  onChange={(e) => setApprovalData({ ...approvalData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any notes about the refill service"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowApprovalForm(false);
                  setSelectedRequest(null);
                  setApprovalData({ cost: '', notes: '', approved_amount: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproveRequest(selectedRequest)}
                disabled={!approvalData.cost}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefillManagement;