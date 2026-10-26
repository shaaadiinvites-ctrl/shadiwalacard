-- ============================================================
-- Wedding Invites SaaS — Storage bucket for cover + gallery photos
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- (One-time setup — safe to re-run, uses IF NOT EXISTS / ON CONFLICT)
-- ============================================================

-- 1. Create a public bucket for wedding media
insert into storage.buckets (id, name, public)
values ('wedding-media', 'wedding-media', true)
on conflict (id) do update set public = true;

-- 2. Allow anyone to READ objects in this bucket (needed so the public
--    invitation pages can load the images via their public URL)
drop policy if exists "Public read access for wedding media" on storage.objects;
create policy "Public read access for wedding media"
  on storage.objects for select
  using (bucket_id = 'wedding-media');

-- 3. Uploads are done server-side with the service role key (via the
--    /api/submit-wedding route), which bypasses RLS automatically —
--    no insert/update policy is required for that path.
--    The policy below is only a safety net in case anon/auth clients
--    ever need to upload directly; remove it if you don't want that.
drop policy if exists "Service role can manage wedding media" on storage.objects;
create policy "Service role can manage wedding media"
  on storage.objects for all
  using (bucket_id = 'wedding-media' and auth.role() = 'service_role')
  with check (bucket_id = 'wedding-media' and auth.role() = 'service_role');
