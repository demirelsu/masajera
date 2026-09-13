-- Masajera expert profile access rules.
-- Run this migration in the Supabase SQL editor/migrations before using the admin CRUD in production.

enable row level security on public.expert_profiles;

drop policy if exists "Public can view published expert profiles" on public.expert_profiles;
drop policy if exists "Experts can view own profile" on public.expert_profiles;
drop policy if exists "Experts can create own profile" on public.expert_profiles;
drop policy if exists "Experts can update own profile" on public.expert_profiles;
drop policy if exists "Admin can view all expert profiles" on public.expert_profiles;
drop policy if exists "Admin can update all expert profiles" on public.expert_profiles;
drop policy if exists "Admin can delete expert profiles" on public.expert_profiles;

create policy "Public can view published expert profiles"
on public.expert_profiles
for select
to anon, authenticated
using (is_published = true);

create policy "Experts can view own profile"
on public.expert_profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Experts can create own profile"
on public.expert_profiles
for insert
to authenticated
with check (
  auth.uid() = id
  and is_published = false
  and is_verified = false
);

create policy "Experts can update own profile"
on public.expert_profiles
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and is_published = false
  and is_verified = false
);

create policy "Admin can view all expert profiles"
on public.expert_profiles
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'demirelminesu1@gmail.com');

create policy "Admin can update all expert profiles"
on public.expert_profiles
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'demirelminesu1@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'demirelminesu1@gmail.com');

create policy "Admin can delete expert profiles"
on public.expert_profiles
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'demirelminesu1@gmail.com');
