import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using demo mode.');
  // For demo purposes, we'll use placeholder values
  const demoUrl = 'https://demo.supabase.co';
  const demoKey = 'demo_key';
  
  supabase = createClient<Database>(demoUrl, demoKey, {
    auth: {
      persistSession: false
    }
  });
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Custom authentication for admin and customer tables
export const signInWithCustomAuth = async (email: string, password: string, userType: 'admin' | 'customer') => {
  try {
    console.log('Attempting login:', { email, userType });
    
    // First, try to find the user in the appropriate table
    const tableName = userType === 'admin' ? 'admin_users' : 'customers';
    
    console.log('Querying table:', tableName);
    
    const { data: userData, error: userError } = await supabase
      .from(tableName)
      .select('*')
      .eq('email', email);

    console.log('Query result:', { userData, userError });

    if (userError) {
      console.error('Database error:', userError);
      return { 
        data: null, 
        error: { message: 'Database query failed' }
      };
    }

    // Check if user was found
    if (!userData || userData.length === 0) {
      console.log('No user data found');
      return { 
        data: null, 
        error: { message: 'Invalid login credentials' }
      };
    }

    // Use the first (and should be only) user found
    const user = userData[0];

    // Apply the correct password hashing based on user type
    let encodedPassword: string;
    if (userType === 'customer') {
      // For customers, password is hashed as btoa(email + ':password123')
      encodedPassword = btoa(email + ':' + password);
    } else {
      // For admins, password is hashed as btoa(password)
      encodedPassword = btoa(password);
    }
    
    console.log('Checking password:', { provided: encodedPassword, stored: user.password_hash });
    
    if (user.password_hash !== encodedPassword) {
      console.log('Password mismatch');
      return { 
        data: null, 
        error: { message: 'Invalid login credentials' }
      };
    }

    console.log('Login successful');

    // Create a mock user object that matches Supabase Auth user structure
    const mockUser = {
      id: user.id,
      email: user.email,
      user_metadata: {
        name: user.name,
        user_type: userType,
        role: userType === 'admin' ? user.role : 'customer'
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: user.created_at,
      updated_at: user.created_at
    };

    return {
      data: { user: mockUser, session: null },
      error: null
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      data: null,
      error: { message: 'An unexpected error occurred during login' }
    };
  }
};

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Customer management
export const getCustomerByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userId);
  return { data, error };
};

export const getAdminByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', userId);
  return { data, error };
};

export const createCustomer = async (customerData: {
  name: string;
  email: string;
  phone: string;
  password_hash: string;
}) => {
  const { data, error } = await supabase
    .from('customers')
    .insert(customerData)
    .select()
    .single();
  return { data, error };
};

export const updateCustomer = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const getAllCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    return { data, error };
  }

  // Transform the data to match the Customer interface
  const transformedData = data?.map(customer => ({
    ...customer,
    registrationDate: customer.registration_date ? new Date(customer.registration_date) : new Date(),
    totalKiosks: customer.total_kiosks || 0,
    totalRevenue: customer.total_revenue || 0
  }));

  return { data: transformedData, error };
};

// Kiosk management
export const createKiosk = async (kioskData: {
  name: string;
  location: string;
  qr_code: string;
  customer_id: string;
  price_per_cleaning: number;
}) => {
  const { data, error } = await supabase
    .from('kiosks')
    .insert(kioskData)
    .select()
    .single();
  return { data, error };
};

export const updateKiosk = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('kiosks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const getKiosksByCustomerId = async (customerId: string) => {
  const { data, error } = await supabase
    .from('kiosks')
    .select(`
      *,
      payments(*),
      maintenance_requests(*),
      refill_requests(*)
    `)
    .eq('customer_id', customerId);
  return { data, error };
};

export const getAllKiosks = async () => {
  const { data, error } = await supabase
    .from('kiosks')
    .select(`
      *,
      customers(*),
      payments(*),
      maintenance_requests(*),
      refill_requests(*)
    `);
  return { data, error };
};

// Payment management
export const createPayment = async (paymentData: {
  kiosk_id: string;
  amount: number;
  status: string;
  razorpay_payment_id: string;
  customer_phone?: string;
  platform_fee: number;
  owner_revenue: number;
}) => {
  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single();
  return { data, error };
};

export const updatePayment = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const getPaymentsByKioskId = async (kioskId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('kiosk_id', kioskId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getAllPayments = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      kiosks(name, location, customer_id)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Refund management
export const processRefund = async (paymentId: string, refundData: {
  refund_amount: number;
  refund_reason: string;
  status: string;
}) => {
  const { data, error } = await supabase
    .from('payments')
    .update(refundData)
    .eq('id', paymentId)
    .select()
    .single();
  return { data, error };
};

// Maintenance requests
export const createMaintenanceRequest = async (requestData: {
  kiosk_id: string;
  customer_id: string;
  type: string;
  priority: string;
  description: string;
}) => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert(requestData)
    .select()
    .single();
  return { data, error };
};

export const updateMaintenanceRequest = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const getMaintenanceRequests = async (customerId?: string) => {
  let query = supabase
    .from('maintenance_requests')
    .select(`
      *,
      kiosks(name, location),
      customers(name, email)
    `)
    .order('created_at', { ascending: false });

  if (customerId) {
    query = query.eq('customer_id', customerId);
  }

  const { data, error } = await query;
  return { data, error };
};

// Refill requests
export const createRefillRequest = async (refillRequest: {
  kiosk_id: string;
  customer_id: string;
  requested_amount: number;
  notes?: string;
}) => {
  const { data, error } = await supabase
    .from('refill_requests')
    .insert(refillRequest)
    .select()
    .single();
  return { data, error };
};

export const updateRefillRequest = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('refill_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const getRefillRequests = async (customerId?: string) => {
  let query = supabase
    .from('refill_requests')
    .select(`
      *,
      kiosks(name, location, liquid_level, refill_limit),
      customers(name, email)
    `)
    .order('created_at', { ascending: false });

  if (customerId) {
    query = query.eq('customer_id', customerId);
  }

  const { data, error } = await query;
  return { data, error };
};

// Notifications
export const createNotification = async (notificationData: {
  type: string;
  kiosk_id?: string;
  customer_id?: string;
  message: string;
  priority?: string;
}) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single();
  return { data, error };
};

export const getNotificationsByCustomerId = async (customerId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getAllNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const markNotificationAsRead = async (id: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// Razorpay integration helpers
export const createRazorpayOrder = async (amount: number, kioskId: string) => {
  // This would typically call your backend API that creates a Razorpay order
  // For now, we'll simulate the order creation
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  return {
    id: orderId,
    amount: amount * 100, // Razorpay expects amount in paise
    currency: 'INR',
    receipt: `receipt_${kioskId}_${Date.now()}`
  };
};

export const verifyRazorpayPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  // This would typically call your backend API to verify the payment signature
  // For now, we'll simulate successful verification
  return { verified: true };
};

// Debug function to check if users exist
export const checkUsersExist = async () => {
  try {
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('email');
    
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('email');

    console.log('Admin users:', adminUsers);
    console.log('Customers:', customers);
    console.log('Admin error:', adminError);
    console.log('Customer error:', customerError);

    return { adminUsers, customers, adminError, customerError };
  } catch (error) {
    console.error('Error checking users:', error);
    return { error };
  }
};