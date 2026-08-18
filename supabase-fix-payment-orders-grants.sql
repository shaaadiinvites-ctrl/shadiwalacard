-- Fix: "permission denied for table payment_orders" (Postgres error 42501)
-- The table was created without explicit grants to service_role.
-- Run this once in Supabase SQL editor.

grant select, insert, update on public.payment_orders to service_role;

-- Also make sure future tables in public don't hit this again:
alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;
