export interface Payment {
  id: string;
  kioskId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'partial_refund';
  razorpayPaymentId: string;
  timestamp: Date;
  customerPhone?: string;
  refundAmount?: number;
  refundReason?: string;
  platformFee: number; // 10% platform fee
  ownerRevenue: number; // 90% to kiosk owner
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: Date;
  totalKiosks: number;
  totalRevenue: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Kiosk {
  id: string;
  name: string;
  location: string;
  qrCode: string;
  status: 'active' | 'inactive' | 'maintenance';
  totalPayments: number | null;
  liquidLevel: number | null; // percentage
  needsRefill: boolean | null;
  lastMaintenance: Date | null;
  totalRevenue: number | null;
  ownerRevenue: number | null; // 90% of total revenue
  platformRevenue: number | null; // 10% of total revenue
  payments: Payment[];
  customerId: string; // Owner of the kiosk
  pricePerCleaning: number; // Dynamic pricing per kiosk
  maintenanceRequests: MaintenanceRequest[];
}

export interface MaintenanceRequest {
  id: string;
  kioskId: string;
  customerId: string;
  type: 'refill' | 'repair' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requestDate: Date;
  completedDate?: Date;
  assignedTechnician?: string;
  cost?: number;
  notes?: string;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
  type: 'full' | 'partial';
}

export interface Notification {
  id: string;
  type: 'refill' | 'maintenance' | 'payment' | 'error' | 'revenue' | 'customer';
  kioskId?: string;
  customerId?: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface RevenueReport {
  period: string;
  totalRevenue: number;
  platformRevenue: number;
  customerRevenue: number;
  totalPayments: number;
  averageTransactionValue: number;
}