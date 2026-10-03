-- =====================================================================
-- FIT MONK ECOMMERCE D1 DATABASE SCHEMA
-- Migration: 0001_initial_schema.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. CORE & ADMIN AUTHENTICATION
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  name TEXT NOT NULL,
  role_id TEXT NOT NULL DEFAULT 'admin' REFERENCES roles(id),
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at INTEGER,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- ---------------------------------------------------------------------
-- 2. MEDIA LIBRARY (R2 Metadata)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  uploader_admin_id TEXT REFERENCES admins(id),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_media_object_key ON media(object_key);

-- ---------------------------------------------------------------------
-- 3. CATALOG: CATEGORIES & PRODUCTS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  parent_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  catalog_number INTEGER,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  source_name TEXT,
  display_name TEXT,
  short_name TEXT,
  category_id TEXT REFERENCES categories(id),
  subcategory_id TEXT REFERENCES categories(id),
  description TEXT,
  price_paise INTEGER NOT NULL,
  compare_at_price_paise INTEGER,
  currency TEXT NOT NULL DEFAULT 'INR',
  pack_size TEXT,
  sku TEXT,
  weight_grams INTEGER,
  ingredients TEXT, -- JSON Array string
  allergens TEXT,   -- JSON Array string
  nutrition TEXT,   -- JSON Object string
  storage TEXT,
  shipping_text TEXT,
  status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'review', 'published', 'archived'
  is_available INTEGER NOT NULL DEFAULT 1,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_orderable INTEGER NOT NULL DEFAULT 1,
  kind TEXT NOT NULL DEFAULT 'product', -- 'product', 'bundle'
  learn_hub TEXT,
  seo_title TEXT,
  seo_description TEXT,
  source_raw TEXT, -- JSON Object string
  faqs TEXT,       -- JSON Array string
  promotions TEXT, -- JSON Array string
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);

CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_key TEXT NOT NULL, -- e.g. '250g', '500g', '1kg'
  pack_size TEXT NOT NULL,
  sku TEXT,
  price_paise INTEGER NOT NULL,
  compare_at_price_paise INTEGER,
  weight_grams INTEGER,
  is_available INTEGER NOT NULL DEFAULT 1,
  shipping_amount_paise INTEGER,
  shipping_free INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(product_id, variant_key)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

CREATE TABLE IF NOT EXISTS product_media (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  media_role TEXT NOT NULL DEFAULT 'gallery', -- 'primary', 'gallery', 'raw_photo', 'marketing_poster'
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, media_id)
);

CREATE TABLE IF NOT EXISTS product_related (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  related_product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, related_product_id)
);

-- ---------------------------------------------------------------------
-- 4. CUSTOMERS & ADDRESSES
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_pin ON customer_addresses(pin_code);

-- ---------------------------------------------------------------------
-- 5. COUPONS & DISCOUNTS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'percentage', 'fixed'
  discount_value INTEGER NOT NULL, -- Percentage (e.g. 10) or Paise (e.g. 5000 = ₹50)
  min_order_value_paise INTEGER NOT NULL DEFAULT 0,
  max_discount_paise INTEGER, -- Cap for percentage discounts
  start_at INTEGER,           -- Unix timestamp
  expires_at INTEGER,         -- Unix timestamp
  is_active INTEGER NOT NULL DEFAULT 1,
  max_total_uses INTEGER,     -- NULL = unlimited
  current_total_uses INTEGER NOT NULL DEFAULT 0,
  max_uses_per_customer INTEGER NOT NULL DEFAULT 1,
  scope TEXT NOT NULL DEFAULT 'store', -- 'store', 'category', 'product'
  target_ids TEXT,            -- JSON Array string: category or product IDs
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);

CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id TEXT PRIMARY KEY,
  coupon_id TEXT NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  order_id TEXT, -- References orders(id)
  customer_phone TEXT NOT NULL,
  discount_amount_paise INTEGER NOT NULL,
  order_subtotal_paise INTEGER NOT NULL,
  redeemed_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_phone ON coupon_redemptions(customer_phone);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon ON coupon_redemptions(coupon_id);

-- ---------------------------------------------------------------------
-- 6. DELIVERY METHODS & SHIPPING PROVIDERS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS delivery_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE, -- 'standard', 'express', 'free', 'local'
  description TEXT,
  price_paise INTEGER NOT NULL DEFAULT 0,
  free_threshold_paise INTEGER,
  estimated_days_min INTEGER DEFAULT 2,
  estimated_days_max INTEGER DEFAULT 5,
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS shipping_providers (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- 'rapidshyp', 'delhivery', 'shiprocket', 'manual'
  name TEXT NOT NULL,
  is_enabled INTEGER NOT NULL DEFAULT 0,
  settings TEXT, -- JSON Encrypted or masked provider config
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ---------------------------------------------------------------------
-- 7. ORDERS & ORDER ITEMS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id TEXT REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  -- Address snapshot
  delivery_address TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  -- Financial totals in paise
  subtotal_paise INTEGER NOT NULL,
  discount_paise INTEGER NOT NULL DEFAULT 0,
  coupon_code TEXT,
  shipping_paise INTEGER NOT NULL DEFAULT 0,
  tax_paise INTEGER NOT NULL DEFAULT 0,
  grand_total_paise INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  -- Statuses
  order_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'authorized', 'paid', 'failed', 'refunded'
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled', -- 'unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled'
  -- Methods & Providers
  payment_method_code TEXT NOT NULL DEFAULT 'whatsapp_manual', -- 'cod', 'upi_qr', 'bank_transfer', 'gateway', 'whatsapp_manual'
  delivery_method_code TEXT NOT NULL DEFAULT 'standard',
  shipping_provider_code TEXT,
  -- Tracking & Logistics
  shipment_tracking_number TEXT,
  shipment_awb TEXT,
  courier_name TEXT,
  -- Metadata
  order_source TEXT NOT NULL DEFAULT 'website', -- 'website', 'admin', 'whatsapp', 'manual', 'api'
  customer_note TEXT,
  admin_note TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT,
  product_name TEXT NOT NULL,
  pack_size TEXT,
  sku TEXT,
  unit_price_paise INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  line_total_paise INTEGER NOT NULL,
  discount_paise INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ---------------------------------------------------------------------
-- 8. PAYMENTS & TRANSACTIONS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- 'cod', 'upi_qr', 'bank_transfer', 'online_gateway'
  name TEXT NOT NULL,
  description TEXT,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  instructions TEXT,
  settings TEXT, -- JSON string
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_reference TEXT,
  amount_paise INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'authorized', 'paid', 'failed', 'refunded'
  payment_method TEXT NOT NULL,
  metadata TEXT, -- JSON string
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_payment_tx_order ON payment_transactions(order_id);

CREATE TABLE IF NOT EXISTS payment_events (
  id TEXT PRIMARY KEY,
  transaction_id TEXT REFERENCES payment_transactions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL, -- JSON string
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ---------------------------------------------------------------------
-- 9. SHIPMENTS & TRACKING
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider_code TEXT NOT NULL,
  provider_shipment_id TEXT,
  awb_number TEXT UNIQUE,
  courier_partner TEXT,
  status TEXT NOT NULL DEFAULT 'created', -- 'created', 'manifested', 'in_transit', 'out_for_delivery', 'delivered', 'rto', 'cancelled'
  pickup_token TEXT,
  shipping_label_url TEXT,
  manifest_url TEXT,
  shipped_at INTEGER,
  delivered_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_shipments_awb ON shipments(awb_number);
CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);

CREATE TABLE IF NOT EXISTS shipment_events (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT,
  remarks TEXT,
  event_time INTEGER NOT NULL DEFAULT (unixepoch()),
  raw_payload TEXT
);

-- ---------------------------------------------------------------------
-- 10. NOTIFICATIONS & WHATSAPP
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notification_templates (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- 'order_confirmation', 'order_shipped', 'out_for_delivery', 'order_delivered'
  channel TEXT NOT NULL DEFAULT 'whatsapp', -- 'whatsapp', 'email', 'sms'
  title TEXT NOT NULL,
  body_template TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  customer_phone TEXT NOT NULL,
  template_code TEXT REFERENCES notification_templates(code),
  message_body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'sent', 'delivered', 'read', 'failed'
  provider_message_id TEXT,
  error_message TEXT,
  sent_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_wa_messages_order ON whatsapp_messages(order_id);

-- ---------------------------------------------------------------------
-- 11. SYSTEM SETTINGS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  group_name TEXT NOT NULL, -- 'store', 'general', 'currency', 'tax', 'payments', 'delivery', 'shipping', 'whatsapp', 'seo'
  key_name TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,      -- String or JSON string
  is_encrypted INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_settings_group ON settings(group_name);

-- ---------------------------------------------------------------------
-- 12. AUDIT LOGS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  admin_id TEXT REFERENCES admins(id) ON DELETE SET NULL,
  action TEXT NOT NULL,     -- 'create', 'update', 'delete', 'login', 'status_change'
  entity_type TEXT NOT NULL,-- 'product', 'coupon', 'order', 'payment', 'setting', 'admin'
  entity_id TEXT,
  metadata TEXT,            -- JSON string (changes, old vs new, IP address)
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
