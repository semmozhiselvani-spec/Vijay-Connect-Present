-- Vijay Connect customer accounts + booking history
-- Run this once in Supabase SQL Editor.
create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  booking_id text not null unique,
  service text,
  vehicle text,
  fare text,
  pickup text,
  dropoff text,
  travel_date text,
  pickup_time text,
  mobile text,
  status text not null default 'Request created',
  created_at timestamptz not null default now()
);

alter table public.customer_profiles enable row level security;
alter table public.customer_bookings enable row level security;

drop policy if exists "customer_profiles_select_own" on public.customer_profiles;
create policy "customer_profiles_select_own" on public.customer_profiles for select using (auth.uid() = id);

drop policy if exists "customer_profiles_insert_own" on public.customer_profiles;
create policy "customer_profiles_insert_own" on public.customer_profiles for insert with check (auth.uid() = id);

drop policy if exists "customer_profiles_update_own" on public.customer_profiles;
create policy "customer_profiles_update_own" on public.customer_profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "customer_bookings_select_own" on public.customer_bookings;
create policy "customer_bookings_select_own" on public.customer_bookings for select using (auth.uid() = customer_id);

drop policy if exists "customer_bookings_insert_own" on public.customer_bookings;
create policy "customer_bookings_insert_own" on public.customer_bookings for insert with check (auth.uid() = customer_id);

create index if not exists customer_bookings_customer_id_idx on public.customer_bookings(customer_id, created_at desc);
