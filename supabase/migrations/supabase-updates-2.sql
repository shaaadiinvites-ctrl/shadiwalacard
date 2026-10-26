-- Update for individual Mother and Father names
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query

ALTER TABLE weddings
ADD COLUMN IF NOT EXISTS bride_mother_name text,
ADD COLUMN IF NOT EXISTS bride_father_name text,
ADD COLUMN IF NOT EXISTS groom_mother_name text,
ADD COLUMN IF NOT EXISTS groom_father_name text;
