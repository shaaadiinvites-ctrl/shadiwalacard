-- ============================================================
-- Wedding Invites SaaS — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Main weddings table
create table if not exists weddings (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text unique not null,       -- URL key: /ananya-weds-aditya-2026

  -- Section 1: The Happy Couple
  bride_name            text not null,
  groom_name            text not null,
  hashtag               text,
  contact_number        text,
  primary_email         text,

  -- Section 2: Events (stored as JSONB array — easy to map to frontend)
  events                jsonb not null default '[]'::jsonb,

  -- Section 3: Love Story & Media
  our_story             text,
  cover_photo_url       text,                       -- Supabase Storage URL
  gallery_urls          text[]  default '{}',       -- Array of Storage URLs
  video_link            text,
  music_link            text,

  -- Section 4: Family Details
  bride_family_details  text,
  groom_family_details  text,
  wedding_party         text,

  -- Section 5: Registry & Gifts
  gift_policy           text,
  gift_policy_custom    text,
  digital_shagun_details text,

  -- Section 6: Virtual Wedding
  live_stream_link      text,
  live_stream_notes     text,

  -- Section 7: Theme & Instructions
  visual_theme          text,
  special_instructions  text,

  -- Meta
  template_id           text    default 'default',
  payment_status        text    default 'pending'
                          check (payment_status in ('pending', 'paid', 'cancelled')),
  payment_reference     text,                       -- Razorpay/Stripe payment ID

  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- 2. Auto-update updated_at on any row change
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger weddings_updated_at
  before update on weddings
  for each row execute function update_updated_at_column();

-- 3. Row Level Security
alter table weddings enable row level security;

-- Public: insert allowed (form submission; lock this down once payment gate is live)
create policy "Public can insert"
  on weddings for insert
  with check (true);

-- Service role only: full read/update access (used by your API route)
create policy "Service role full access"
  on weddings for all
  using (auth.role() = 'service_role');

-- 4. Supabase Storage bucket for photos (run once)
-- insert into storage.buckets (id, name, public)
-- values ('wedding-media', 'wedding-media', true);
-- Uncomment and run the above if you want public photo URLs.
-- Then add a storage policy in Dashboard → Storage → Policies.
