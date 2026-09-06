-- ============================================================
-- Supabase Migration: Allow Nullable Email in customer_pii
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Since checkout is now phone-first (one-click with WhatsApp delivery),
-- email is optional and collected post-purchase on the success page for tax invoices.
-- This command allows the email column in customer_pii to be NULL.

ALTER TABLE public.customer_pii ALTER COLUMN email DROP NOT NULL;

-- Add customer_phone to payment_orders for instant phone-based recovery
ALTER TABLE public.payment_orders ADD COLUMN IF NOT EXISTS customer_phone varchar(20);
