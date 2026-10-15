-- ============================================================
-- Supabase Schema Update: Coupons, Payment Metadata & Relational Links
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- URL: https://supabase.com/dashboard/project/yklbuzaysppzmwdohlvf/sql/new
-- ============================================================

-- 1. Create the coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('flat', 'percentage')),
  discount_value integer NOT NULL,
  max_uses integer DEFAULT NULL,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  valid_until timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Seed initial coupon codes
INSERT INTO public.coupons (code, discount_type, discount_value) VALUES
  ('SAARTHI100', 'percentage', 100),
  ('SHADI10', 'percentage', 10),
  ('SHADI790', 'flat', 790),
  ('TEST9', 'flat', 790)
ON CONFLICT (code) DO NOTHING;

-- Enable RLS on coupons (Read-only for public if needed, full access for service_role)
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service role full access on coupons" ON public.coupons;
CREATE POLICY "Allow service role full access on coupons"
  ON public.coupons FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow anon read active coupons" ON public.coupons;
CREATE POLICY "Allow anon read active coupons"
  ON public.coupons FOR SELECT
  USING (is_active = true);


-- 2. Add relational links and Razorpay metadata to payment_orders
ALTER TABLE public.payment_orders
  ADD COLUMN IF NOT EXISTS coupon_id uuid REFERENCES public.coupons(id),
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS discount_amount_inr integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_method text,             -- 'upi', 'card', 'netbanking'
  ADD COLUMN IF NOT EXISTS payment_method_details text,     -- e.g. 'UPI: user@okhdfcbank'
  ADD COLUMN IF NOT EXISTS razorpay_metadata jsonb,         -- Full Razorpay entity (card last4, bank, fee, tax)
  ADD COLUMN IF NOT EXISTS gateway_fee_inr numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gateway_tax_inr numeric(10,2) DEFAULT 0;


-- 3. Link weddings directly to payment_orders
ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS payment_order_id uuid REFERENCES public.payment_orders(id);


-- 4. Create performance indexes for instant lookups
CREATE INDEX IF NOT EXISTS idx_payment_orders_coupon_id ON public.payment_orders(coupon_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_razorpay_pay_id ON public.payment_orders(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_weddings_payment_order_id ON public.weddings(payment_order_id);
