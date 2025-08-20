import { Kiosk, Payment, Notification, Customer, MaintenanceRequest } from '../types';

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const mockCustomers: Customer[] = [
  {
    id: 'customer-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91-9876543210',
    registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    totalKiosks: 2,
    totalRevenue: 19575, // 90% of total kiosk revenue
    status: 'active'
  },
  {
    id: 'customer-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-9876543211',
    registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    totalKiosks: 1,
    totalRevenue: 3015, // 90% of total kiosk revenue
    status: 'active'
  },
  {
    id: 'customer-3',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91-9876543212',
    registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    totalKiosks: 1,
    totalRevenue: 0,
    status: 'inactive'
  }
];

const mockPayments: Payment[] = [
  {
    id: generateId(),
    kioskId: 'kiosk-1',
    amount: 50,
    currency: 'INR',
    status: 'completed',
    razorpayPaymentId: 'pay_' + generateId(),
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    customerPhone: '+91XXXXX67890',
    platformFee: 5, // 10% of 50
    ownerRevenue: 45 // 90% of 50
  },
  {
    id: generateId(),
    kioskId: 'kiosk-1',
    amount: 50,
    currency: 'INR',
    status: 'completed',
    razorpayPaymentId: 'pay_' + generateId(),
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    customerPhone: '+91XXXXX12345',
    platformFee: 5,
    ownerRevenue: 45
  },
  {
    id: generateId(),
    kioskId: 'kiosk-2',
    amount: 60,
    currency: 'INR',
    status: 'refunded',
    razorpayPaymentId: 'pay_' + generateId(),
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    customerPhone: '+91XXXXX98765',
    refundAmount: 60,
    refundReason: 'Service not provided',
    platformFee: 6,
    ownerRevenue: 54
  }
];

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: generateId(),
    kioskId: 'kiosk-1',
    customerId: 'customer-1',
    type: 'refill',
    priority: 'high',
    description: 'Liquid level is very low, needs immediate refill',
    status: 'pending',
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: generateId(),
    kioskId: 'kiosk-3',
    customerId: 'customer-3',
    type: 'repair',
    priority: 'urgent',
    description: 'Payment system not working, customers unable to pay',
    status: 'in_progress',
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    assignedTechnician: 'Tech-001'
  }
];

export const mockKiosks: Kiosk[] = [
  {
    id: 'kiosk-1',
    name: 'Mall Central Kiosk',
    location: 'Phoenix Mall, Bangalore',
    qrCode: 'QR_MALL_CENTRAL_001',
    status: 'active',
    totalPayments: 245,
    liquidLevel: 15,
    needsRefill: true,
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    totalRevenue: 12250,
    ownerRevenue: 11025, // 90% of total
    platformRevenue: 1225, // 10% of total
    payments: mockPayments.filter(p => p.kioskId === 'kiosk-1'),
    customerId: 'customer-1',
    pricePerCleaning: 50,
    maintenanceRequests: mockMaintenanceRequests.filter(r => r.kioskId === 'kiosk-1')
  },
  {
    id: 'kiosk-2',
    name: 'Airport Terminal Kiosk',
    location: 'Kempegowda Airport, Terminal 1',
    qrCode: 'QR_AIRPORT_T1_002',
    status: 'active',
    totalPayments: 189,
    liquidLevel: 65,
    needsRefill: false,
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    totalRevenue: 11340, // 189 * 60
    ownerRevenue: 10206, // 90% of total
    platformRevenue: 1134, // 10% of total
    payments: mockPayments.filter(p => p.kioskId === 'kiosk-2'),
    customerId: 'customer-1',
    pricePerCleaning: 60,
    maintenanceRequests: []
  },
  {
    id: 'kiosk-3',
    name: 'Metro Station Kiosk',
    location: 'MG Road Metro Station',
    qrCode: 'QR_METRO_MG_003',
    status: 'maintenance',
    totalPayments: 67,
    liquidLevel: 0,
    needsRefill: true,
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    totalRevenue: 3350, // 67 * 50
    ownerRevenue: 3015, // 90% of total
    platformRevenue: 335, // 10% of total
    payments: [],
    customerId: 'customer-2',
    pricePerCleaning: 50,
    maintenanceRequests: mockMaintenanceRequests.filter(r => r.kioskId === 'kiosk-3')
  },
  {
    id: 'kiosk-4',
    name: 'Tech Park Kiosk',
    location: 'Electronic City, Bangalore',
    qrCode: 'QR_TECH_PARK_004',
    status: 'inactive',
    totalPayments: 0,
    liquidLevel: 100,
    needsRefill: false,
    lastMaintenance: new Date(),
    totalRevenue: 0,
    ownerRevenue: 0,
    platformRevenue: 0,
    payments: [],
    customerId: 'customer-3',
    pricePerCleaning: 45,
    maintenanceRequests: []
  }
];

export const mockNotifications: Notification[] = [
  {
    id: generateId(),
    type: 'refill',
    kioskId: 'kiosk-1',
    customerId: 'customer-1',
    message: 'Mall Central Kiosk needs liquid refill (245 payments completed)',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    priority: 'high'
  },
  {
    id: generateId(),
    type: 'maintenance',
    kioskId: 'kiosk-3',
    customerId: 'customer-2',
    message: 'Metro Station Kiosk requires urgent maintenance - payment system failure',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    priority: 'urgent'
  },
  {
    id: generateId(),
    type: 'revenue',
    message: 'Monthly revenue report: ₹2,694 platform fees collected',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    priority: 'medium'
  },
  {
    id: generateId(),
    type: 'customer',
    customerId: 'customer-1',
    message: 'New maintenance request from Rajesh Kumar for Mall Central Kiosk',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: false,
    priority: 'medium'
  }
];