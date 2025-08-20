import React, { useState } from 'react';
import { Wrench, AlertTriangle, Clock, CheckCircle, User, Calendar } from 'lucide-react';
import { MaintenanceRequest, Kiosk, Customer } from '../../types';

interface MaintenanceManagementProps {
  maintenanceRequests: MaintenanceRequest[];
  kiosks: Kiosk[];
  customers: Customer[];
  onUpdateRequest: (request: MaintenanceRequest) => void;
}

const MaintenanceManagement: React.FC<MaintenanceManagementProps> = ({
  maintenanceRequests,
  kiosks,
  customers,
  onUpdateRequest
}) => {
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getKioskName = (kioskId: string) => {
    return kiosks.find(k => k.id === kioskId)?.name || 'Unknown Kiosk';
  };

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'Unknown Customer';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'refill': return '💧';
      case 'repair': return '🔧';
      case 'cleaning': return '🧽';
      default: return '⚙️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Maintenance Management</h2>
          <p className="text-gray-600">Track and manage maintenance requests from customers</p>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xl font-bold text-yellow-600">
              {maintenanceRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-xl font-bold text-blue-600">
              {maintenanceRequests.filter(r => r.status === 'in_progress').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-xl font-bold text-green-600">
              {maintenanceRequests.filter(r => r.status === 'completed').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Urgent</p>
            <p className="text-xl font-bold text-red-600">
              {maintenanceRequests.filter(r => r.priority === 'urgent').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(request.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getKioskName(request.kioskId)} • {getCustomerName(request.customerId)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{request.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{request.requestDate.toLocaleDateString()}</span>
                    </div>
                    {request.assignedTechnician && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{request.assignedTechnician}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                    {request.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-gray-500">No maintenance requests found</p>
          </div>
        )}
      </div>

      {/* Request Management Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Request</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, status: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Assigned Technician</label>
                <input
                  type="text"
                  value={selectedRequest.assignedTechnician || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, assignedTechnician: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter technician ID or name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Cost (₹)</label>
                <input
                  type="number"
                  value={selectedRequest.cost || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, cost: parseFloat(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter service cost"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={selectedRequest.notes || ''}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add notes about the service"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updatedRequest = {
                    ...selectedRequest,
                    completedDate: selectedRequest.status === 'completed' ? new Date() : selectedRequest.completedDate
                  };
                  onUpdateRequest(updatedRequest);
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceManagement;