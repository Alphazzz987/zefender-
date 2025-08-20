/*
  # Add Demo Users for Testing

  1. New Records
    - Add demo admin user (admin@kioskpay.com)
    - Add demo customer user (customer@example.com)
  
  2. Security
    - Uses simple password storage for demo purposes
    - In production, passwords should be properly hashed
  
  3. Notes
    - These are demo accounts for testing the application
    - Passwords are stored as plain text for simplicity in demo
*/

-- Insert demo admin user
INSERT INTO admin_users (
  email,
  password_hash,
  name,
  role,
  created_at
) VALUES (
  'admin@kioskpay.com',
  'admin123',
  'Demo Admin',
  'admin',
  now()
) ON CONFLICT (email) DO NOTHING;

-- Insert demo customer user
INSERT INTO customers (
  email,
  password_hash,
  name,
  phone,
  registration_date,
  total_kiosks,
  total_revenue,
  status,
  created_at
) VALUES (
  'customer@example.com',
  'customer123',
  'Demo Customer',
  '+91-9999999999',
  now(),
  0,
  0,
  'active',
  now()
) ON CONFLICT (email) DO NOTHING;