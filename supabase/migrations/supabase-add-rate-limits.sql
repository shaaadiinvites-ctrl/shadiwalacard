-- ============================================================
-- Rate limiting — run this in: Supabase Dashboard → SQL Editor → New Query
-- Backs the per-IP rate limiter used by the payment/submission API routes.
-- ============================================================

create table if not exists rate_limits (
  bucket_key  text primary key,
  count       integer not null default 1,
  created_at  timestamptz not null default now()
);

create index if not exists rate_limits_created_at_idx on rate_limits (created_at);

grant select, insert, update, delete on rate_limits to service_role;

-- Atomic increment-and-read: a single statement, so concurrent requests
-- from the same IP/route/window can't race each other past the limit.
create or replace function increment_rate_limit(p_key text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into rate_limits (bucket_key, count)
  values (p_key, 1)
  on conflict (bucket_key) do update set count = rate_limits.count + 1
  returning count into v_count;
  return v_count;
end;
$$;

grant execute on function increment_rate_limit(text) to service_role;

-- Optional housekeeping: old buckets are harmless (they're just small rows
-- keyed by a time-bucketed string) but you can periodically clear stale ones,
-- e.g. run this occasionally or put it on a cron:
-- delete from rate_limits where created_at < now() - interval '1 day';
