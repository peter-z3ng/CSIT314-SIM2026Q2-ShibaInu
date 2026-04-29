create type public.account_role as enum (
  'admin',
  'donee',
  'fundraiser',
  'platform-management'
);

create type public.registration_request_status as enum (
  'pending',
  'approved',
  'rejected'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text not null unique,
  role public.account_role not null,
  created_at timestamptz not null default now()
);

create table public.registration_requests (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  email text not null,
  requested_role public.account_role not null,
  status public.registration_request_status not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint registration_requests_public_roles
    check (requested_role in ('donee', 'fundraiser', 'platform-management'))
);

create unique index registration_requests_one_pending_email
on public.registration_requests (lower(email))
where status = 'pending';

alter table public.profiles enable row level security;
alter table public.registration_requests enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

create policy "Users can read own profile"
on public.profiles
for select
using (id = auth.uid());

create policy "Admins can manage profiles"
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage registration requests"
on public.registration_requests
for all
using (public.is_admin())
with check (public.is_admin());

-- Create the first admin manually in Supabase Auth, then run this with that user's id.
-- insert into public.profiles (id, username, email, role)
-- values ('AUTH_USER_ID_HERE', 'Admin User', 'admin@example.com', 'admin');
