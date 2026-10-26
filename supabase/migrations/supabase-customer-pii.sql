-- ============================================================
-- Supabase Schema: customer_pii
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS public.customer_pii (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id varchar(6) UNIQUE NOT NULL,
  phone_number varchar(20) UNIQUE NOT NULL,
  email varchar(255) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Auto-update updated_at on any row change
DROP TRIGGER IF EXISTS customer_pii_updated_at ON customer_pii;
CREATE TRIGGER customer_pii_updated_at
  BEFORE UPDATE ON customer_pii
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.customer_pii ENABLE ROW LEVEL SECURITY;

-- Allow the Service Role full access (Next.js API uses service role)
DROP POLICY IF EXISTS "Service role full access on customer_pii" ON public.customer_pii;
CREATE POLICY "Service role full access on customer_pii"
  ON public.customer_pii FOR ALL
  USING (auth.role() = 'service_role');
