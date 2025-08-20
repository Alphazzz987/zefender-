/*
  # Add Demo Users for Testing

  1. New Data
    - Add demo admin user
    - Add demo customer user
  
  2. Security
    - Users added with simple password hashes for demo purposes
    - In production, use proper password hashing
*/

-- Insert demo admin user
INSERT INTO admin_users (id, email, password_hash, name, role) 
VALUES (
  gen_random_uuid(),
  'admin@kioskpay.com',
  'admin123',
  'System Administrator',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert demo customer user
INSERT INTO customers (id, name, email, phone, password_hash, status) 
VALUES (
  gen_random_uuid(),
  'Demo Customer',
  'customer@example.com',
  '+91-9876543210',
  'customer123',
  'active'
) ON CONFLICT (email) DO NOTHING;