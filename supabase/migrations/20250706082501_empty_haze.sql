/*
  # Comprehensive Demo Data for KioskPay Application

  1. Demo Data Added
    - 5 customers with varied profiles and statuses
    - 8 kiosks across different locations and statuses
    - 25+ payments with various statuses and scenarios
    - 12 maintenance requests covering all types and priorities
    - 15 notifications for different scenarios
    - 8 refill requests in various stages
    - Additional admin users

  2. Realistic Scenarios
    - Active customers with multiple kiosks
    - Kiosks needing refills and maintenance
    - Payment history with refunds and failures
    - Urgent maintenance requests
    - Revenue distribution across customers
*/

-- Insert additional customers for a more comprehensive demo
INSERT INTO customers (id, name, email, phone, password_hash, registration_date, total_kiosks, total_revenue, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'Sunita Reddy', 'sunita.reddy@email.com', '+91-9876543213', encode(digest('customer123', 'sha256'), 'base64'), now() - interval '60 days', 2, 28350, 'active', now() - interval '60 days'),
('550e8400-e29b-41d4-a716-446655440005', 'Vikram Singh', 'vikram.singh@email.com', '+91-9876543214', encode(digest('customer123', 'sha256'), 'base64'), now() - interval '90 days', 3, 45720, 'active', now() - interval '90 days'),
('550e8400-e29b-41d4-a716-446655440006', 'Meera Joshi', 'meera.joshi@email.com', '+91-9876543215', encode(digest('customer123', 'sha256'), 'base64'), now() - interval '20 days', 1, 8100, 'active', now() - interval '20 days'),
('550e8400-e29b-41d4-a716-446655440007', 'Arjun Nair', 'arjun.nair@email.com', '+91-9876543216', encode(digest('customer123', 'sha256'), 'base64'), now() - interval '120 days', 0, 0, 'suspended', now() - interval '120 days')
ON CONFLICT (email) DO NOTHING;

-- Insert additional kiosks for comprehensive coverage
INSERT INTO kiosks (id, name, location, qr_code, status, total_payments, liquid_level, needs_refill, last_maintenance, total_revenue, owner_revenue, platform_revenue, customer_id, price_per_cleaning, refill_limit, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440005', 'Forum Mall Kiosk', 'Forum Mall, Koramangala - Food Court Level', 'QR_FORUM_MALL_005_DEMO', 'active', 320, 85, false, now() - interval '2 days', 19200, 17280, 1920, '550e8400-e29b-41d4-a716-446655440004', 60, 250, now() - interval '55 days'),
('660e8400-e29b-41d4-a716-446655440006', 'Orion Mall Kiosk', 'Orion Mall, Brigade Gateway - Main Entrance', 'QR_ORION_MALL_006_DEMO', 'active', 189, 45, false, now() - interval '5 days', 10206, 9185.4, 1020.6, '550e8400-e29b-41d4-a716-446655440004', 54, 250, now() - interval '50 days'),
('660e8400-e29b-41d4-a716-446655440007', 'Whitefield Metro Kiosk', 'Whitefield Metro Station - Entry Gate', 'QR_WHITEFIELD_007_DEMO', 'active', 425, 25, true, now() - interval '1 day', 21250, 19125, 2125, '550e8400-e29b-41d4-a716-446655440005', 50, 250, now() - interval '85 days'),
('660e8400-e29b-41d4-a716-446655440008', 'HSR Layout Kiosk', 'HSR Layout, Sector 1 - Bus Stop', 'QR_HSR_LAYOUT_008_DEMO', 'active', 298, 70, false, now() - interval '4 days', 16192, 14572.8, 1619.2, '550e8400-e29b-41d4-a716-446655440005', 54.3, 250, now() - interval '80 days'),
('660e8400-e29b-41d4-a716-446655440009', 'Indiranagar Kiosk', 'Indiranagar 100 Feet Road - Near Metro', 'QR_INDIRANAGAR_009_DEMO', 'maintenance', 156, 5, true, now() - interval '10 days', 8268, 7441.2, 826.8, '550e8400-e29b-41d4-a716-446655440005', 53, 250, now() - interval '75 days'),
('660e8400-e29b-41d4-a716-446655440010', 'Jayanagar Kiosk', 'Jayanagar 4th Block - Shopping Complex', 'QR_JAYANAGAR_010_DEMO', 'active', 162, 90, false, now() - interval '1 day', 8100, 7290, 810, '550e8400-e29b-41d4-a716-446655440006', 50, 250, now() - interval '18 days'),
('660e8400-e29b-41d4-a716-446655440011', 'Koramangala Kiosk', 'Koramangala 5th Block - Main Road', 'QR_KORAMANGALA_011_DEMO', 'inactive', 0, 100, false, now() - interval '30 days', 0, 0, 0, '550e8400-e29b-41d4-a716-446655440007', 55, 250, now() - interval '115 days')
ON CONFLICT (qr_code) DO NOTHING;

-- Insert comprehensive payment data
INSERT INTO payments (id, kiosk_id, amount, currency, status, razorpay_payment_id, timestamp, customer_phone, refund_amount, refund_reason, platform_fee, owner_revenue, created_at) VALUES
-- Mall Central Kiosk payments (more recent activity)
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', 50, 'INR', 'completed', 'pay_DEMO_Mall001_' || extract(epoch from now())::text, now() - interval '15 minutes', '+91XXXXX33333', null, null, 5, 45, now() - interval '15 minutes'),
('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440001', 50, 'INR', 'completed', 'pay_DEMO_Mall002_' || extract(epoch from now())::text, now() - interval '45 minutes', '+91XXXXX44444', null, null, 5, 45, now() - interval '45 minutes'),
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440001', 50, 'INR', 'failed', 'pay_DEMO_Mall003_' || extract(epoch from now())::text, now() - interval '1 hour', '+91XXXXX55555', null, 'Payment gateway timeout', 0, 0, now() - interval '1 hour'),

-- Airport Terminal payments
('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440002', 60, 'INR', 'completed', 'pay_DEMO_Airport003_' || extract(epoch from now())::text, now() - interval '20 minutes', '+91XXXXX66666', null, null, 6, 54, now() - interval '20 minutes'),
('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440002', 60, 'INR', 'partial_refund', 'pay_DEMO_Airport004_' || extract(epoch from now())::text, now() - interval '4 hours', '+91XXXXX77777', 30, 'Service partially completed', 6, 54, now() - interval '4 hours'),

-- Forum Mall Kiosk payments (high volume)
('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440005', 60, 'INR', 'completed', 'pay_DEMO_Forum001_' || extract(epoch from now())::text, now() - interval '10 minutes', '+91XXXXX88888', null, null, 6, 54, now() - interval '10 minutes'),
('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440005', 60, 'INR', 'completed', 'pay_DEMO_Forum002_' || extract(epoch from now())::text, now() - interval '25 minutes', '+91XXXXX99999', null, null, 6, 54, now() - interval '25 minutes'),
('770e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440005', 60, 'INR', 'completed', 'pay_DEMO_Forum003_' || extract(epoch from now())::text, now() - interval '35 minutes', '+91XXXXX00000', null, null, 6, 54, now() - interval '35 minutes'),

-- Whitefield Metro payments
('770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440007', 50, 'INR', 'completed', 'pay_DEMO_Whitefield001_' || extract(epoch from now())::text, now() - interval '5 minutes', '+91XXXXX11122', null, null, 5, 45, now() - interval '5 minutes'),
('770e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440007', 50, 'INR', 'completed', 'pay_DEMO_Whitefield002_' || extract(epoch from now())::text, now() - interval '18 minutes', '+91XXXXX22233', null, null, 5, 45, now() - interval '18 minutes'),

-- HSR Layout payments
('770e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440008', 54.3, 'INR', 'completed', 'pay_DEMO_HSR001_' || extract(epoch from now())::text, now() - interval '12 minutes', '+91XXXXX33344', null, null, 5.43, 48.87, now() - interval '12 minutes'),
('770e8400-e29b-41d4-a716-446655440017', '660e8400-e29b-41d4-a716-446655440008', 54.3, 'INR', 'completed', 'pay_DEMO_HSR002_' || extract(epoch from now())::text, now() - interval '28 minutes', '+91XXXXX44455', null, null, 5.43, 48.87, now() - interval '28 minutes'),

-- Jayanagar payments
('770e8400-e29b-41d4-a716-446655440018', '660e8400-e29b-41d4-a716-446655440010', 50, 'INR', 'completed', 'pay_DEMO_Jayanagar001_' || extract(epoch from now())::text, now() - interval '8 minutes', '+91XXXXX55566', null, null, 5, 45, now() - interval '8 minutes'),
('770e8400-e29b-41d4-a716-446655440019', '660e8400-e29b-41d4-a716-446655440010', 50, 'INR', 'completed', 'pay_DEMO_Jayanagar002_' || extract(epoch from now())::text, now() - interval '22 minutes', '+91XXXXX66677', null, null, 5, 45, now() - interval '22 minutes'),

-- Orion Mall payments
('770e8400-e29b-41d4-a716-446655440020', '660e8400-e29b-41d4-a716-446655440006', 54, 'INR', 'completed', 'pay_DEMO_Orion001_' || extract(epoch from now())::text, now() - interval '40 minutes', '+91XXXXX77788', null, null, 5.4, 48.6, now() - interval '40 minutes'),
('770e8400-e29b-41d4-a716-446655440021', '660e8400-e29b-41d4-a716-446655440006', 54, 'INR', 'refunded', 'pay_DEMO_Orion002_' || extract(epoch from now())::text, now() - interval '2 hours', '+91XXXXX88899', 54, 'Customer complaint - poor service quality', 5.4, 48.6, now() - interval '2 hours')

ON CONFLICT (razorpay_payment_id) DO NOTHING;

-- Insert comprehensive maintenance requests
INSERT INTO maintenance_requests (id, kiosk_id, customer_id, type, priority, description, status, request_date, completed_date, assigned_technician, cost, notes, created_at) VALUES
-- Recent urgent requests
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 'refill', 'urgent', 'Kiosk reached 250 payment limit, needs immediate refill', 'pending', now() - interval '30 minutes', null, null, null, 'Customer reports kiosk stopped accepting payments', now() - interval '30 minutes'),
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', 'repair', 'urgent', 'Display screen not working, customers confused', 'in_progress', now() - interval '3 hours', null, 'TECH003', null, 'Technician dispatched, ETA 1 hour', now() - interval '3 hours'),
('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'cleaning', 'high', 'Heavy usage area, needs deep cleaning', 'approved', now() - interval '1 day', null, 'TECH002', 250, 'Scheduled for tomorrow morning', now() - interval '1 day'),

-- Regular maintenance
('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', 'cleaning', 'medium', 'Weekly maintenance cleaning', 'completed', now() - interval '2 days', now() - interval '1 day', 'TECH001', 150, 'Routine cleaning completed successfully', now() - interval '2 days'),
('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440006', 'refill', 'medium', 'Preventive refill before reaching limit', 'completed', now() - interval '3 days', now() - interval '2 days', 'TECH004', 200, 'Refill completed, kiosk operational', now() - interval '3 days'),
('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 'repair', 'low', 'Minor cosmetic damage to outer panel', 'pending', now() - interval '5 days', null, null, null, 'Non-critical, can be scheduled during next maintenance window', now() - interval '5 days'),

-- Historical requests
('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'other', 'medium', 'Update QR code stickers - faded due to weather', 'completed', now() - interval '7 days', now() - interval '5 days', 'TECH002', 100, 'New weather-resistant QR stickers installed', now() - interval '7 days'),
('880e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'repair', 'high', 'Payment terminal intermittent connectivity issues', 'completed', now() - interval '10 days', now() - interval '8 days', 'TECH003', 800, 'Replaced network module, connectivity stable', now() - interval '10 days'),
('880e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440007', 'other', 'low', 'Initial setup and configuration', 'cancelled', now() - interval '115 days', null, null, null, 'Customer account suspended, setup cancelled', now() - interval '115 days')

ON CONFLICT (id) DO NOTHING;

-- Insert comprehensive notifications
INSERT INTO notifications (id, type, kiosk_id, customer_id, message, timestamp, read, priority, created_at) VALUES
-- Recent urgent notifications
('990e8400-e29b-41d4-a716-446655440006', 'refill', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 'URGENT: Whitefield Metro Kiosk reached payment limit and stopped accepting payments', now() - interval '30 minutes', false, 'urgent', now() - interval '30 minutes'),
('990e8400-e29b-41d4-a716-446655440007', 'maintenance', '660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', 'Indiranagar Kiosk display malfunction - technician dispatched', now() - interval '3 hours', false, 'urgent', now() - interval '3 hours'),
('990e8400-e29b-41d4-a716-446655440008', 'payment', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'High payment volume detected at Forum Mall Kiosk - ₹180 in last hour', now() - interval '1 hour', false, 'medium', now() - interval '1 hour'),

-- Payment notifications
('990e8400-e29b-41d4-a716-446655440009', 'payment', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'New payment received: ₹50 for Mall Central Kiosk', now() - interval '15 minutes', false, 'low', now() - interval '15 minutes'),
('990e8400-e29b-41d4-a716-446655440010', 'refund', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 'Refund processed: ₹54 refunded for Orion Mall Kiosk payment', now() - interval '2 hours', false, 'medium', now() - interval '2 hours'),
('990e8400-e29b-41d4-a716-446655440011', 'payment', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440006', 'Payment milestone: Jayanagar Kiosk reached 150 total payments', now() - interval '4 hours', true, 'low', now() - interval '4 hours'),

-- System notifications
('990e8400-e29b-41d4-a716-446655440012', 'system', null, null, 'Weekly revenue report: ₹8,547 total platform fees collected', now() - interval '1 day', true, 'medium', now() - interval '1 day'),
('990e8400-e29b-41d4-a716-446655440013', 'customer', null, '550e8400-e29b-41d4-a716-446655440006', 'Welcome! Your Jayanagar Kiosk is now active and accepting payments', now() - interval '18 days', true, 'low', now() - interval '18 days'),
('990e8400-e29b-41d4-a716-446655440014', 'maintenance', '660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', 'Maintenance completed: HSR Layout Kiosk cleaning service finished', now() - interval '1 day', true, 'low', now() - interval '1 day'),

-- Older notifications
('990e8400-e29b-41d4-a716-446655440015', 'customer', null, '550e8400-e29b-41d4-a716-446655440004', 'Monthly performance report: Your kiosks generated ₹1,728 revenue this month', now() - interval '3 days', true, 'medium', now() - interval '3 days'),
('990e8400-e29b-41d4-a716-446655440016', 'system', null, null, 'Platform update: New payment analytics dashboard available', now() - interval '5 days', true, 'low', now() - interval '5 days'),
('990e8400-e29b-41d4-a716-446655440017', 'maintenance', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Network connectivity issue resolved at Airport Terminal Kiosk', now() - interval '8 days', true, 'medium', now() - interval '8 days')

ON CONFLICT (id) DO NOTHING;

-- Insert comprehensive refill requests
INSERT INTO refill_requests (id, kiosk_id, customer_id, requested_amount, status, request_date, approved_date, completed_date, cost, notes, created_at) VALUES
-- Recent urgent requests
('aa0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 100, 'pending', now() - interval '30 minutes', null, null, null, 'URGENT: Kiosk stopped accepting payments due to reaching limit', now() - interval '30 minutes'),
('aa0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 100, 'approved', now() - interval '2 hours', now() - interval '1 hour', null, 350, 'High priority due to mall location - approved for immediate service', now() - interval '2 hours'),

-- Regular refill requests
('aa0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', 100, 'approved', now() - interval '1 day', now() - interval '12 hours', null, 300, 'Scheduled with maintenance repair work', now() - interval '1 day'),
('aa0e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 75, 'completed', now() - interval '3 days', now() - interval '2 days', now() - interval '1 day', 280, 'Partial refill completed - sufficient for current usage', now() - interval '3 days'),
('aa0e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', 50, 'completed', now() - interval '5 days', now() - interval '4 days', now() - interval '3 days', 200, 'Preventive refill - completed successfully', now() - interval '5 days'),

-- Historical requests
('aa0e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 100, 'completed', now() - interval '10 days', now() - interval '9 days', now() - interval '8 days', 320, 'Full refill service completed', now() - interval '10 days'),
('aa0e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440006', 100, 'completed', now() - interval '15 days', now() - interval '14 days', now() - interval '13 days', 300, 'Initial setup refill for new kiosk', now() - interval '15 days'),
('aa0e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440007', 100, 'rejected', now() - interval '110 days', null, null, null, 'Customer account suspended - request rejected', now() - interval '110 days')

ON CONFLICT (id) DO NOTHING;

-- Insert additional admin users
INSERT INTO admin_users (id, email, password_hash, name, role, created_at) VALUES
('440e8400-e29b-41d4-a716-446655440001', 'manager@kioskpay.com', encode(digest('manager123', 'sha256'), 'base64'), 'Operations Manager', 'manager', now() - interval '180 days'),
('440e8400-e29b-41d4-a716-446655440002', 'support@kioskpay.com', encode(digest('support123', 'sha256'), 'base64'), 'Customer Support', 'support', now() - interval '90 days'),
('440e8400-e29b-41d4-a716-446655440003', 'tech@kioskpay.com', encode(digest('tech123', 'sha256'), 'base64'), 'Technical Lead', 'admin', now() - interval '200 days')
ON CONFLICT (email) DO NOTHING;

-- Update customer totals based on actual kiosk data
UPDATE customers SET 
  total_kiosks = (SELECT COUNT(*) FROM kiosks WHERE customer_id = customers.id),
  total_revenue = (SELECT COALESCE(SUM(owner_revenue), 0) FROM kiosks WHERE customer_id = customers.id)
WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002', 
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440007'
);