-- Vijay Connect live cab tracking setup for the existing Supabase project.
-- Run this once in Supabase SQL Editor before using track.html / driver-track.html.
create table if not exists public.cab_locations (
  booking_code text primary key,
  lat double precision not null,
  lng double precision not null,
  status text not null default 'Live',
  driver_name text,
  updated_at timestamptz not null default now()
);

alter table public.cab_locations enable row level security;

-- Customers can read live locations. The driver page uses the publishable key to upsert.
drop policy if exists "cab_locations_public_read" on public.cab_locations;
create policy "cab_locations_public_read" on public.cab_locations for select to anon, authenticated using (true);

drop policy if exists "cab_locations_public_upsert" on public.cab_locations;
create policy "cab_locations_public_upsert" on public.cab_locations for insert to anon, authenticated with check (true);

drop policy if exists "cab_locations_public_update" on public.cab_locations;
create policy "cab_locations_public_update" on public.cab_locations for update to anon, authenticated using (true) with check (true);

-- Optional cleanup: old locations can be removed periodically.
-- delete from public.cab_locations where updated_at < now() - interval '24 hours';
