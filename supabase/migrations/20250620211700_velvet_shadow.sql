/*
  # Initial KioskPay Database Schema

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `name` (text)
      - `role` (text, default 'admin')
      - `created_at` (timestamp)
    
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `password_hash` (text)
      - `registration_date` (timestamp)
      - `total_kiosks` (integer, default 0)
      - `total_revenue` (decimal, default 0)
      - `status` (text, default 'active')
      - `created_at` (timestamp)
    
    - `kiosks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `qr_code` (text, unique)
      - `status` (text, default 'active')
      - `total_payments` (integer, default 0)
      - `liquid_level` (integer, default 100)
      - `needs_refill` (boolean, default false)
      - `last_maintenance` (timestamp)
      - `total_revenue` (decimal, default 0)
      - `owner_revenue` (decimal, default 0)
      - `platform_revenue` (decimal, default 0)
      - `customer_id` (uuid, references customers)
      - `price_per_cleaning` (decimal, default 50)
      - `refill_limit` (integer, default 250)
      - `created_at` (timestamp)
    
    - `payments`
      - `id` (uuid, primary key)
      - `kiosk_id` (uuid, references kiosks)
      - `amount` (decimal)
      - `currency` (text, default 'INR')
      - `status` (text)
      - `razorpay_payment_id` (text, unique)
      - `timestamp` (timestamp)
      - `customer_phone` (text)
      - `refund_amount` (decimal)
      - `refund_reason` (text)
      - `platform_fee` (decimal)
      - `owner_revenue` (decimal)
      - `created_at` (timestamp)
    
    - `maintenance_requests`
      - `id` (uuid, primary key)
      - `kiosk_id` (uuid, references kiosks)
      - `customer_id` (uuid, references customers)
      - `type` (text)
      - `priority` (text)
      - `description` (text)
      - `status` (text, default 'pending')
      - `request_date` (timestamp)
      - `completed_date` (timestamp)
      - `assigned_technician` (text)
      - `cost` (decimal)
      - `notes` (text)
      - `created_at` (timestamp)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `type` (text)
      - `kiosk_id` (uuid, references kiosks)
      - `customer_id` (uuid, references customers)
      - `message` (text)
      - `timestamp` (timestamp)
      - `read` (boolean, default false)
      - `priority` (text, default 'medium')
      - `created_at` (timestamp)
    
    - `refill_requests`
      - `id` (uuid, primary key)
      - `kiosk_id` (uuid, references kiosks)
      - `customer_id` (uuid, references customers)
      - `requested_amount` (integer)
      - `status` (text, default 'pending')
      - `request_date` (timestamp)
      - `approved_date` (timestamp)
      - `completed_date` (timestamp)
      - `cost` (decimal)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and customer access
    - Create authentication triggers
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  password_hash text NOT NULL,
  registration_date timestamptz DEFAULT now(),
  total_kiosks integer DEFAULT 0,
  total_revenue decimal DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create kiosks table
CREATE TABLE IF NOT EXISTS kiosks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  qr_code text UNIQUE NOT NULL,
  status text DEFAULT 'active',
  total_payments integer DEFAULT 0,
  liquid_level integer DEFAULT 100,
  needs_refill boolean DEFAULT false,
  last_maintenance timestamptz DEFAULT now(),
  total_revenue decimal DEFAULT 0,
  owner_revenue decimal DEFAULT 0,
  platform_revenue decimal DEFAULT 0,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  price_per_cleaning decimal DEFAULT 50,
  refill_limit integer DEFAULT 250,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kiosk_id uuid REFERENCES kiosks(id) ON DELETE CASCADE,
  amount decimal NOT NULL,
  currency text DEFAULT 'INR',
  status text NOT NULL,
  razorpay_payment_id text UNIQUE NOT NULL,
  timestamp timestamptz DEFAULT now(),
  customer_phone text,
  refund_amount decimal,
  refund_reason text,
  platform_fee decimal NOT NULL,
  owner_revenue decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create maintenance_requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kiosk_id uuid REFERENCES kiosks(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  type text NOT NULL,
  priority text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending',
  request_date timestamptz DEFAULT now(),
  completed_date timestamptz,
  assigned_technician text,
  cost decimal,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  kiosk_id uuid REFERENCES kiosks(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  priority text DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

-- Create refill_requests table
CREATE TABLE IF NOT EXISTS refill_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kiosk_id uuid REFERENCES kiosks(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  requested_amount integer NOT NULL,
  status text DEFAULT 'pending',
  request_date timestamptz DEFAULT now(),
  approved_date timestamptz,
  completed_date timestamptz,
  cost decimal,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE kiosks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE refill_requests ENABLE ROW LEVEL SECURITY;

-- Admin policies (full access)
CREATE POLICY "Admins can manage all admin_users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all kiosks"
  ON kiosks
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all maintenance_requests"
  ON maintenance_requests
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all refill_requests"
  ON refill_requests
  FOR ALL
  TO authenticated
  USING (true);

-- Customer policies (restricted access)
CREATE POLICY "Customers can read their own data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update their own data"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can read their kiosks"
  ON kiosks
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can read their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM kiosks 
      WHERE kiosks.id = payments.kiosk_id 
      AND kiosks.customer_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Customers can manage their maintenance requests"
  ON maintenance_requests
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can read their notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can update their notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can create refill requests"
  ON refill_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can read their refill requests"
  ON refill_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = customer_id::text);

-- Insert default admin user
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('admin@kioskpay.com', '$2b$10$example_hash', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;