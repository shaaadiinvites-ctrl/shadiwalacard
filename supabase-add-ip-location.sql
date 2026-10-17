-- ============================================================
-- Add IP & Geolocation tracking columns
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Add location columns to weddings table
ALTER TABLE weddings
ADD COLUMN IF NOT EXISTS client_ip text,
ADD COLUMN IF NOT EXISTS client_city text,
ADD COLUMN IF NOT EXISTS client_region text,
ADD COLUMN IF NOT EXISTS client_country text;

-- 2. Add location columns to payment_orders table
ALTER TABLE payment_orders
ADD COLUMN IF NOT EXISTS client_ip text,
ADD COLUMN IF NOT EXISTS client_city text,
ADD COLUMN IF NOT EXISTS client_region text,
ADD COLUMN IF NOT EXISTS client_country text;

-- 3. Add location columns to customer_pii table
ALTER TABLE customer_pii
ADD COLUMN IF NOT EXISTS client_ip text,
ADD COLUMN IF NOT EXISTS client_city text,
ADD COLUMN IF NOT EXISTS client_region text,
ADD COLUMN IF NOT EXISTS client_country text;

-- 4. Backfill existing records with known locations:

-- Vishal Yadav & Pooja
UPDATE weddings
SET 
  client_ip = '103.211.53.166',
  client_city = 'New Delhi',
  client_region = 'DL',
  client_country = 'IN'
WHERE slug = 'vishal-yadav-weds-pooja-2026';

UPDATE payment_orders
SET 
  client_ip = '103.211.53.166',
  client_city = 'New Delhi',
  client_region = 'DL',
  client_country = 'IN'
WHERE id = 'd493b588-6510-446e-8502-edc989199b3a';

-- Priya & Vikas
UPDATE weddings
SET 
  client_ip = '49.43.168.67',
  client_city = 'Dehradun',
  client_region = 'UK',
  client_country = 'IN'
WHERE slug = 'priya-weds-vikas-2026';

UPDATE payment_orders
SET 
  client_ip = '49.43.168.67',
  client_city = 'Dehradun',
  client_region = 'UK',
  client_country = 'IN'
WHERE id = 'b40c9fce-788d-4384-9ad8-59511d8f4f79';
