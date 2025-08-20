/*
  # Add Dummy Data for Testing

  1. New Records
    - Add sample customers with realistic data
    - Add sample kiosks with different statuses and locations
    - Add sample payments including completed and refunded transactions
    - Add sample maintenance requests with various types and statuses
    - Add sample notifications for different scenarios
    - Add sample refill requests showing workflow stages

  2. Data Features
    - Proper foreign key relationships
    - Realistic revenue calculations (90% customer, 10% platform)
    - Various statuses and priorities for testing
    - Timestamps spread across different periods
    - Unique identifiers to avoid conflicts

  3. Conflict Handling
    - Uses ON CONFLICT clauses for all unique constraints
    - Checks for existing data before insertion
    - Ensures idempotent migration execution
*/

-- Insert sample customers (check for existing emails)
INSERT INTO customers (id, name, email, phone, password_hash, registration_date, total_kiosks, total_revenue, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', 'rajesh.kumar@email.com', '+91-9876543210', encode(digest('customer123', 'sha256'), 'base64'), now() - interval '30 days', 2, 19575, 'active', now() - interval '30 days'),
('550e8400-e29b-41d4-a716-446655440002', 'Priya Sharma', 'priya.sharma@email.com', '+91-9876543211', encode(digest('customer123', 'sha256'), 'base64'), now() - interval '15 days', 1, 3015, 'active', now() - interval '15 days'),
('550e8400-e29b-41d4-a716-446655440003', 'Amit Patel', 'amit.patel@email.com', '+91-9876543212', encode(digest('customer123', 'sha256'), 'base64'), now() - interval '45 days', 1, 0, 'inactive', now() - interval '45 days')
ON CONFLICT (email) DO NOTHING;

-- Insert sample kiosks (check for existing QR codes and IDs)
INSERT INTO kiosks (id, name, location, qr_code, status, total_payments, liquid_level, needs_refill, last_maintenance, total_revenue, owner_revenue, platform_revenue, customer_id, price_per_cleaning, refill_limit, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Mall Central Kiosk', 'Phoenix Mall, Bangalore - Ground Floor', 'QR_MALL_CENTRAL_001_DEMO', 'active', 245, 15, true, now() - interval '7 days', 12250, 11025, 1225, '550e8400-e29b-41d4-a716-446655440001', 50, 250, now() - interval '25 days'),
('660e8400-e29b-41d4-a716-446655440002', 'Airport Terminal Kiosk', 'Kempegowda Airport, Terminal 1 - Departure Gate', 'QR_AIRPORT_T1_002_DEMO', 'active', 189, 65, false, now() - interval '3 days', 11340, 10206, 1134, '550e8400-e29b-41d4-a716-446655440001', 60, 250, now() - interval '20 days'),
('660e8400-e29b-41d4-a716-446655440003', 'Metro Station Kiosk', 'MG Road Metro Station - Platform 1', 'QR_METRO_MG_003_DEMO', 'maintenance', 67, 0, true, now() - interval '15 days', 3350, 3015, 335, '550e8400-e29b-41d4-a716-446655440002', 50, 250, now() - interval '12 days'),
('660e8400-e29b-41d4-a716-446655440004', 'Tech Park Kiosk', 'Electronic City, Bangalore - Building A', 'QR_TECH_PARK_004_DEMO', 'inactive', 0, 100, false, now(), 0, 0, 0, '550e8400-e29b-41d4-a716-446655440003', 45, 250, now() - interval '5 days')
ON CONFLICT (qr_code) DO NOTHING;

-- Insert sample payments (check for existing Razorpay payment IDs)
INSERT INTO payments (id, kiosk_id, amount, currency, status, razorpay_payment_id, timestamp, customer_phone, refund_amount, refund_reason, platform_fee, owner_revenue, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 50, 'INR', 'completed', 'pay_DEMO_MallCentral001_' || extract(epoch from now())::text, now() - interval '30 minutes', '+91XXXXX67890', null, null, 5, 45, now() - interval '30 minutes'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 50, 'INR', 'completed', 'pay_DEMO_MallCentral002_' || extract(epoch from now())::text, now() - interval '2 hours', '+91XXXXX12345', null, null, 5, 45, now() - interval '2 hours'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 60, 'INR', 'refunded', 'pay_DEMO_Airport001_' || extract(epoch from now())::text, now() - interval '1 day', '+91XXXXX98765', 60, 'Service not provided', 6, 54, now() - interval '1 day'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 60, 'INR', 'completed', 'pay_DEMO_Airport002_' || extract(epoch from now())::text, now() - interval '3 hours', '+91XXXXX11111', null, null, 6, 54, now() - interval '3 hours'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 50, 'INR', 'completed', 'pay_DEMO_Metro001_' || extract(epoch from now())::text, now() - interval '2 days', '+91XXXXX22222', null, null, 5, 45, now() - interval '2 days')
ON CONFLICT (razorpay_payment_id) DO NOTHING;

-- Insert sample maintenance requests
INSERT INTO maintenance_requests (id, kiosk_id, customer_id, type, priority, description, status, request_date, completed_date, assigned_technician, cost, notes, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'refill', 'high', 'Liquid level is very low, needs immediate refill', 'pending', now() - interval '2 hours', null, null, null, null, now() - interval '2 hours'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'repair', 'urgent', 'Payment system not working, customers unable to pay', 'in_progress', now() - interval '1 day', null, 'TECH001', 500, 'Diagnosed payment terminal issue', now() - interval '1 day'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'cleaning', 'medium', 'Regular deep cleaning maintenance', 'completed', now() - interval '5 days', now() - interval '3 days', 'TECH002', 200, 'Completed thorough cleaning and inspection', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (id, type, kiosk_id, customer_id, message, timestamp, read, priority, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'refill', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Mall Central Kiosk needs liquid refill (245 payments completed)', now() - interval '15 minutes', false, 'high', now() - interval '15 minutes'),
('990e8400-e29b-41d4-a716-446655440002', 'maintenance', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Metro Station Kiosk requires urgent maintenance - payment system failure', now() - interval '2 hours', false, 'urgent', now() - interval '2 hours'),
('990e8400-e29b-41d4-a716-446655440003', 'payment', null, null, 'Monthly revenue report: ₹2,694 platform fees collected', now() - interval '1 day', true, 'medium', now() - interval '1 day'),
('990e8400-e29b-41d4-a716-446655440004', 'customer', null, '550e8400-e29b-41d4-a716-446655440001', 'New maintenance request from Rajesh Kumar for Mall Central Kiosk', now() - interval '3 hours', false, 'medium', now() - interval '3 hours'),
('990e8400-e29b-41d4-a716-446655440005', 'payment', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'New payment received: ₹60 for Airport Terminal Kiosk', now() - interval '3 hours', false, 'low', now() - interval '3 hours')
ON CONFLICT (id) DO NOTHING;

-- Insert sample refill requests
INSERT INTO refill_requests (id, kiosk_id, customer_id, requested_amount, status, request_date, approved_date, completed_date, cost, notes, created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 100, 'pending', now() - interval '1 hour', null, null, null, 'Urgent refill needed - reached payment limit', now() - interval '1 hour'),
('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 100, 'approved', now() - interval '2 days', now() - interval '1 day', null, 300, 'Approved for full refill service', now() - interval '2 days'),
('aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 50, 'completed', now() - interval '7 days', now() - interval '6 days', now() - interval '5 days', 150, 'Partial refill completed successfully', now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;