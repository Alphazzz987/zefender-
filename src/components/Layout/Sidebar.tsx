import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Smartphone, 
  RefreshCw, 
  Bell, 
  Settings,
  PlusCircle,
  Users,
  Wrench,
  TrendingUp,
  UserPlus,
  Droplets,
  Ticket,
  QrCode
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount: number;
  userRole: 'admin' | 'customer';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, notificationCount, userRole }) => {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'kiosks', label: 'Kiosks', icon: Smartphone },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'refill-management', label: 'Refill Management', icon: Droplets },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'refunds', label: 'Refunds', icon: RefreshCw },
    { id: 'refund-tickets', label: 'Refund Tickets', icon: Ticket },
    { id: 'razorpay-integration', label: 'Razorpay Integration', icon: QrCode },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationCount },
    { id: 'add-kiosk', label: 'Add Kiosk', icon: PlusCircle },
    { id: 'add-customer', label: 'Add Customer', icon: UserPlus },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const customerMenuItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'my-kiosks', label: 'My Kiosks', icon: Smartphone },
    { id: 'my-payments', label: 'Payment History', icon: CreditCard },
    { id: 'my-revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'maintenance-requests', label: 'Maintenance', icon: Wrench },
    { id: 'refill-requests', label: 'Refill Requests', icon: Droplets },
    { id: 'refund-tickets', label: 'Refund Requests', icon: Ticket },
    { id: 'razorpay-integration', label: 'Payment Integration', icon: QrCode },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationCount },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : customerMenuItems;

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">KioskPay</h1>
            <p className="text-gray-400 text-sm">
              {userRole === 'admin' ? 'Admin Panel' : 'Customer Portal'}
            </p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;