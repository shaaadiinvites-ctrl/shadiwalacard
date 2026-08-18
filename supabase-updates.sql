-- Update for Royal Heritage Template editables
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query

ALTER TABLE weddings
ADD COLUMN IF NOT EXISTS name_order text default 'groom_first' check (name_order in ('groom_first', 'bride_first')),
ADD COLUMN IF NOT EXISTS rsvp1_name text,
ADD COLUMN IF NOT EXISTS rsvp1_phone text,
ADD COLUMN IF NOT EXISTS rsvp2_name text,
ADD COLUMN IF NOT EXISTS rsvp2_phone text;
