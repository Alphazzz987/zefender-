import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import PaymentsList from './components/Payments/PaymentsList';
import KioskGrid from './components/Kiosks/KioskGrid';
import RefundManagement from './components/Refunds/RefundManagement';
import RefundTicketSystem from './components/Refunds/RefundTicketSystem';
import NotificationCenter from './components/Notifications/NotificationCenter';
import AddKioskForm from './components/AddKiosk/AddKioskForm';
import CustomerManagement from './components/Customers/CustomerManagement';
import AddCustomerForm from './components/Customers/AddCustomerForm';
import MaintenanceManagement from './components/Maintenance/MaintenanceManagement';
import RevenueAnalytics from './components/Revenue/RevenueAnalytics';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import CustomerKiosks from './components/Customer/CustomerKiosks';
import CustomerRevenue from './components/Customer/CustomerRevenue';
import CustomerNotifications from './components/Customer/CustomerNotifications';
import RefillManagement from './components/Refill/RefillManagement';
import RazorpayIntegration from './components/Payments/RazorpayIntegration';
import { 
  supabase, 
  getAllKiosks,
  getAllCustomers,
  getAllNotifications,
  getAllPayments,
  getMaintenanceRequests,
  createCustomer,
  createKiosk,
  updateKiosk,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  createNotification,
  markNotificationAsRead
} from './lib/supabase';
import { reviveDates } from './utils/dateUtils';
import { Kiosk, Notification, Payment, RefundRequest, Customer, MaintenanceRequest } from './types';

function App() {
  const [userRole, setUserRole] = useState<'admin' | 'customer'>('admin');
  const [currentCustomerId, setCurrentCustomerId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Database-driven state
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);

  // Mock user object for the app
  const mockUser = {
    id: userRole === 'admin' ? 'admin-user-1' : currentCustomerId,
    email: userRole === 'admin' ? 'admin@kioskpay.com' : 'customer@example.com',
    name: userRole === 'admin' ? 'Admin User' : 'Demo Customer'
  };

  useEffect(() => {
    fetchAllData();
  }, [userRole]);

  const fetchAllData = async () => {
    try {
      // Fetch all data from database
      const [kioskData, customerData, notificationData, paymentData, maintenanceData] = await Promise.all([
        getAllKiosks(),
        getAllCustomers(),
        userRole === 'admin' ? getAllNotifications() : Promise.resolve({ data: [] }),
        getAllPayments(),
        getMaintenanceRequests(userRole === 'customer' ? currentCustomerId : undefined)
      ]);

      // Convert date strings to Date objects using reviveDates utility
      setKiosks(reviveDates(kioskData.data || []));
      setCustomers(reviveDates(customerData.data || []));
      setNotifications(reviveDates(notificationData.data || []));
      setPayments(reviveDates(paymentData.data || []));
      setMaintenanceRequests(reviveDates(maintenanceData.data || []));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    // Reset to admin view
    setUserRole('admin');
    setCurrentCustomerId('');
    setActiveTab('dashboard');
    console.log('Switched to admin view');
  };

  const handleRefund = (payment: Payment) => {
    setActiveTab('refund-tickets');
  };

  const handleProcessRefund = (refundRequest: RefundRequest) => {
    // This will be handled by the RefundTicketSystem component
    fetchAllData(); // Refresh data
  };

  const handleKioskUpdate = async (updatedKiosk: any) => {
    try {
      await updateKiosk(updatedKiosk.id, updatedKiosk);
      
      // Create notification for refill completion
      if (updatedKiosk.liquid_level === 100 && !updatedKiosk.needs_refill) {
        await createNotification({
          type: 'maintenance',
          kiosk_id: updatedKiosk.id,
          customer_id: updatedKiosk.customer_id,
          message: `${updatedKiosk.name} has been refilled and is ready for service`,
          priority: 'low'
        });
      }
      
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error updating kiosk:', error);
    }
  };

  const handleAddKiosk = async (newKioskData: any) => {
    try {
      const { data: newKiosk } = await createKiosk(newKioskData);
      
      if (newKiosk) {
        await createNotification({
          type: 'maintenance',
          kiosk_id: newKiosk.id,
          customer_id: newKiosk.customer_id,
          message: `New kiosk "${newKiosk.name}" has been added to the network`,
          priority: 'low'
        });
      }
      
      fetchAllData(); // Refresh data
      setActiveTab('kiosks');
    } catch (error) {
      console.error('Error adding kiosk:', error);
    }
  };

  const handleAddCustomer = async (newCustomerData: any) => {
    try {
      // Hash password (in production, this should be done securely on the backend)
      const hashedPassword = btoa(newCustomerData.email + ':password123'); // Simple encoding for demo
      
      const customerData = {
        ...newCustomerData,
        password_hash: hashedPassword
      };
      
      const { data: newCustomer } = await createCustomer(customerData);
      
      if (newCustomer) {
        await createNotification({
          type: 'customer',
          customer_id: newCustomer.id,
          message: `New customer "${newCustomer.name}" has been registered`,
          priority: 'low'
        });
      }
      
      fetchAllData(); // Refresh data
      setActiveTab('customers');
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleCustomerUpdate = async (updatedCustomer: any) => {
    try {
      // Update customer in database
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleCustomerDelete = async (customerId: string) => {
    try {
      // Delete customer and associated data
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleMaintenanceUpdate = async (updatedRequest: any) => {
    try {
      await updateMaintenanceRequest(updatedRequest.id, updatedRequest);

      // Add notification for completed maintenance
      if (updatedRequest.status === 'completed') {
        await createNotification({
          type: 'maintenance',
          kiosk_id: updatedRequest.kiosk_id,
          customer_id: updatedRequest.customer_id,
          message: `Maintenance completed for ${updatedRequest.type} request`,
          priority: 'low'
        });
      }
      
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error updating maintenance request:', error);
    }
  };

  const handleCustomerMaintenanceRequest = async (request: any) => {
    try {
      await createMaintenanceRequest(request);

      // Add notification for admin
      const kiosk = kiosks.find(k => k.id === request.kiosk_id);
      const customer = customers.find(c => c.id === request.customer_id);
      
      await createNotification({
        type: 'maintenance',
        kiosk_id: request.kiosk_id,
        customer_id: request.customer_id,
        message: `New ${request.type} request from ${customer?.name} for ${kiosk?.name}`,
        priority: request.priority
      });
      
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error creating maintenance request:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all notifications as read
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => markNotificationAsRead(n.id))
      );
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadNotifications = userRole === 'admin' 
    ? notifications.filter(n => !n.read).length
    : notifications.filter(n => !n.read && n.customer_id === currentCustomerId).length;

  // Get current customer data for customer role
  const currentCustomer = customers.find(c => c.id === currentCustomerId);
  const customerKiosks = kiosks.filter(k => k.customer_id === currentCustomerId);
  const customerNotifications = notifications.filter(n => n.customer_id === currentCustomerId);

  const renderContent = () => {
    if (userRole === 'customer') {
      if (!currentCustomer) {
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Customer not found</p>
          </div>
        );
      }

      switch (activeTab) {
        case 'dashboard':
          return <CustomerDashboard customer={currentCustomer} kiosks={customerKiosks} notifications={customerNotifications} />;
        case 'my-kiosks':
          return <CustomerKiosks kiosks={customerKiosks} onMaintenanceRequest={handleCustomerMaintenanceRequest} />;
        case 'my-payments':
          return <PaymentsList kiosks={customerKiosks} onRefund={handleRefund} />;
        case 'my-revenue':
          return <CustomerRevenue kiosks={customerKiosks} />;
        case 'maintenance-requests':
          const customerMaintenanceRequests = maintenanceRequests.filter(r => r.customer_id === currentCustomerId);
          return (
            <MaintenanceManagement
              maintenanceRequests={customerMaintenanceRequests}
              kiosks={customerKiosks}
              customers={[currentCustomer]}
              onUpdateRequest={handleMaintenanceUpdate}
            />
          );
        case 'refill-requests':
          return <RefillManagement userRole="customer" currentUserId={currentCustomerId} />;
        case 'refund-tickets':
          return <RefundTicketSystem userRole="customer" currentUserId={currentCustomerId} />;
        case 'notifications':
          return (
            <CustomerNotifications
              notifications={customerNotifications}
              kiosks={customerKiosks}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          );
        case 'razorpay-integration':
          return (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Integration</h2>
                <p className="text-gray-600">Test Razorpay integration for your kiosks</p>
              </div>
              {customerKiosks.map(kiosk => (
                <RazorpayIntegration
                  key={kiosk.id}
                  kioskId={kiosk.id}
                  kioskName={kiosk.name}
                  amount={kiosk.price_per_cleaning}
                  customerId={currentCustomerId}
                  onPaymentSuccess={() => fetchAllData()}
                />
              ))}
            </div>
          );
        case 'settings':
          return (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
                <p className="text-gray-600">Manage your account preferences and settings</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{currentCustomer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{currentCustomer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{currentCustomer.phone}</p>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Switch to Admin View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return <CustomerDashboard customer={currentCustomer} kiosks={customerKiosks} notifications={customerNotifications} />;
      }
    }

    // Admin views
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview kiosks={kiosks} notifications={notifications} />;
      case 'payments':
        return <PaymentsList kiosks={kiosks} onRefund={handleRefund} />;
      case 'kiosks':
        return <KioskGrid kiosks={kiosks} onKioskUpdate={handleKioskUpdate} />;
      case 'customers':
        return (
          <CustomerManagement
            customers={customers}
            kiosks={kiosks}
            onCustomerUpdate={handleCustomerUpdate}
            onCustomerDelete={handleCustomerDelete}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceManagement
            maintenanceRequests={maintenanceRequests}
            kiosks={kiosks}
            customers={customers}
            onUpdateRequest={handleMaintenanceUpdate}
          />
        );
      case 'revenue':
        return <RevenueAnalytics kiosks={kiosks} customers={customers} />;
      case 'refunds':
        return <RefundManagement kiosks={kiosks} onProcessRefund={handleProcessRefund} />;
      case 'refund-tickets':
        return <RefundTicketSystem userRole="admin" currentUserId={mockUser.id} />;
      case 'refill-management':
        return <RefillManagement userRole="admin" currentUserId={mockUser.id} />;
      case 'notifications':
        return (
          <NotificationCenter
            notifications={notifications}
            kiosks={kiosks}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        );
      case 'add-kiosk':
        return <AddKioskForm onAddKiosk={handleAddKiosk} customers={customers} />;
      case 'add-customer':
        return <AddCustomerForm onAddCustomer={handleAddCustomer} />;
      case 'razorpay-integration':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Razorpay Integration</h2>
              <p className="text-gray-600">Manage payment integration for all kiosks</p>
            </div>
            {kiosks.map(kiosk => (
              <RazorpayIntegration
                key={kiosk.id}
                kioskId={kiosk.id}
                kioskName={kiosk.name}
                amount={kiosk.price_per_cleaning}
                customerId={kiosk.customer_id}
                onPaymentSuccess={() => fetchAllData()}
              />
            ))}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Settings</h2>
              <p className="text-gray-600">Configure your KioskPay dashboard preferences</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Switching</h3>
                  <p className="text-sm text-gray-600 mb-4">Switch to customer view to see how customers experience the platform</p>
                  <div className="space-y-2">
                    {customers.map(customer => (
                      <button
                        key={customer.id}
                        onClick={() => {
                          setCurrentCustomerId(customer.id);
                          setUserRole('customer');
                          setActiveTab('dashboard');
                        }}
                        className="block w-full text-left px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Switch to {customer.name}'s view
                      </button>
                    ))}
                    {customers.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No customers available. Add customers first.</p>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refresh Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardOverview kiosks={kiosks} notifications={notifications} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading KioskPay Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        notificationCount={unreadNotifications}
        userRole={userRole}
      />
      
      <div className="ml-64">
        <Header 
          notificationCount={unreadNotifications} 
          user={mockUser}
          userRole={userRole}
          onLogout={handleLogout}
        />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;