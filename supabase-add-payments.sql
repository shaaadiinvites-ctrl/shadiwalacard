-- ============================================================
-- Wedding Invites SaaS — Payments, Templates & Edit-Link Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- (Run AFTER supabase-schema.sql and supabase-storage-setup.sql)
-- ============================================================

-- 1. New columns on weddings
alter table weddings
  add column if not exists price_inr integer,
  add column if not exists edit_token text unique,
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_payment_id text;

-- template_id already exists (default 'default') — repoint the default to a
-- real template id so old rows / manual inserts don't break.
alter table weddings
  alter column template_id set default 'royal-heritage';

create index if not exists weddings_edit_token_idx on weddings (edit_token);

-- 2. Payment orders — tracks a Razorpay order from creation through
--    verification, BEFORE a weddings row exists. The couple pays first,
--    then fills the form; submit-wedding checks this table for a
--    'verified' + unused order before it will insert.
create table if not exists payment_orders (
  id                   uuid primary key default gen_random_uuid(),
  razorpay_order_id    text unique not null,
  razorpay_payment_id  text,
  template_id          text not null,
  amount_inr           integer not null,
  status               text not null default 'created'
                         check (status in ('created', 'verified', 'used')),
  wedding_id           uuid references weddings(id),
  created_at           timestamptz default now(),
  verified_at          timestamptz,
  used_at              timestamptz
);

alter table payment_orders enable row level security;
-- No public policies — this table is only ever touched by API routes using
-- the service-role key (createServerSupabaseClient), which bypasses RLS.
-- Enabling RLS with zero policies just means anon/authenticated clients are
-- flatly denied if they ever try to hit it directly.

-- 3. Lock down direct public inserts into weddings now that submissions are
--    gated behind a verified payment inside the API route (which uses the
--    service-role key and bypasses RLS anyway). This prevents anyone from
--    bypassing payment by inserting straight from the browser with the
--    anon key.
drop policy if exists "Public can insert" on weddings;

-- Service role already has full access via the "Service role full access"
-- policy created in supabase-schema.sql — no changes needed there.
