-- =====================================================================
-- FIT MONK ECOMMERCE D1 DATABASE SEED
-- Migration: 0002_seed_data.sql
-- =====================================================================

-- Roles
INSERT OR IGNORE INTO roles (id, name, description) VALUES
  ('super_admin', 'Super Admin', 'Full administrative access to all modules and settings'),
  ('admin', 'Admin', 'Can manage products, orders, coupons, media, and customers'),
  ('manager', 'Manager', 'Can manage orders, fulfillment, and customer inquiries'),
  ('content_manager', 'Content Manager', 'Can manage products, articles, and media');

-- Default Delivery Methods
INSERT OR IGNORE INTO delivery_methods (id, name, code, description, price_paise, free_threshold_paise, estimated_days_min, estimated_days_max, is_active, sort_order) VALUES
  ('del-std', 'Standard Delivery', 'standard', 'Standard courier delivery across India', 4900, 50000, 3, 5, 1, 1),
  ('del-free', 'Free Shipping Offer', 'free', 'Free shipping on orders above ₹500 or multi-packs', 0, 50000, 3, 5, 1, 2),
  ('del-exp', 'Express Courier', 'express', 'Priority delivery for urgent orders', 9900, NULL, 1, 2, 0, 3);

-- Default Payment Methods
INSERT OR IGNORE INTO payment_methods (id, code, name, description, is_enabled, instructions, sort_order) VALUES
  ('pm-wa', 'whatsapp_manual', 'WhatsApp Confirmation & Payment', 'Direct order confirmation with seller via WhatsApp. Payment link or QR provided personally.', 1, 'Send order on WhatsApp to confirm availability and receive QR/Payment link.', 1),
  ('pm-cod', 'cod', 'Cash on Delivery (COD)', 'Pay cash upon delivery. Subject to courier serviceability in your PIN code.', 1, 'Verify your phone number to enable Cash on Delivery.', 2),
  ('pm-upi', 'upi_qr', 'Direct UPI / QR Code', 'Instant UPI payment via GPay, PhonePe, Paytm, or BHIM.', 1, 'Scan the official Fit Monk UPI QR code upon confirmation.', 3),
  ('pm-gateway', 'online_gateway', 'Online Payment Gateway', 'Credit Card, Debit Card, Netbanking, UPI (Razorpay/Cashfree)', 0, 'Currently in testing. Use WhatsApp checkout for instant ordering.', 4);

-- Shipping Provider configuration
INSERT OR IGNORE INTO shipping_providers (id, code, name, is_enabled, settings) VALUES
  ('sp-rapidshyp', 'rapidshyp', 'RapidShyp B2C Logistics', 0, '{"api_base_url":"https://api.rapidshyp.com/rapidshyp/apis/v1","pickup_location_name":"Fit Monk Central Warehouse","default_channel":"Fit Monk Website"}'),
  ('sp-manual', 'manual', 'Manual Courier / Self-Fulfillment', 1, '{"mode":"manual"}');

-- Notification Templates
INSERT OR IGNORE INTO notification_templates (id, code, channel, title, body_template, is_active) VALUES
  ('nt-order-placed', 'order_placed', 'whatsapp', 'Order Received', 'Hi {{customer_name}}, thank you for your order #{{order_number}} at Fit Monk! Subtotal: ₹{{order_total}}. We are preparing your pantry picks.', 1),
  ('nt-order-shipped', 'order_shipped', 'whatsapp', 'Shipment Dispatched', 'Hi {{customer_name}}, your Fit Monk package is on the way! Courier: {{courier_name}}. Tracking AWB: {{tracking_number}}. Track live: {{tracking_url}}', 1),
  ('nt-order-delivered', 'order_delivered', 'whatsapp', 'Delivered', 'Hi {{customer_name}}, your Fit Monk package has been delivered! Enjoy your pure pantry foods. We would love your feedback!', 1);

-- Default System Settings
INSERT OR IGNORE INTO settings (id, group_name, key_name, value) VALUES
  ('set-store-name', 'store', 'store_name', 'Fit Monk Health Foods'),
  ('set-store-phone', 'store', 'seller_phone', '+91 98713 16958'),
  ('set-store-email', 'store', 'seller_email', 'contact@fitmonk.co.in'),
  ('set-currency-code', 'currency', 'currency_code', 'INR'),
  ('set-currency-symbol', 'currency', 'currency_symbol', '₹'),
  ('set-tax-enabled', 'tax', 'tax_inclusive_pricing', 'true'),
  ('set-default-shipping-rate', 'shipping', 'default_shipping_paise', '4900'),
  ('set-free-shipping-threshold', 'shipping', 'free_shipping_threshold_paise', '50000'),
  ('set-rapidshyp-active', 'shipping', 'rapidshyp_enabled', 'false');
