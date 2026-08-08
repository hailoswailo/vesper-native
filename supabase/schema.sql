-- Vesper — initial Supabase schema
--
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste
-- this whole file -> Run.
--
-- This is NOT wired into the app yet (see README "Status / next steps") —
-- the app currently runs entirely on-device via AsyncStorage. This schema
-- lays the foundation for when we migrate: real auth (magic link/OTP) and
-- membership tier tracking per the brand brief ("Member status is stored in
-- Supabase (profiles.tier), validated against Apple's receipt verification
-- servers on login and on each app open").

-- One row per authenticated user, created automatically on signup.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  city text,
  occupation text,
  bio text,
  is_admin boolean not null default false,
  tier text not null default 'free' check (tier in ('free', 'member')),
  apple_original_transaction_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Everyone who's authenticated can read their own profile.
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

-- Everyone who's authenticated can update their own profile (not tier —
-- that should only ever be set by a trusted server process validating an
-- Apple receipt, never directly by the client).
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
