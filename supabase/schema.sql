create table public.user_profile (
  profile_id uuid primary key default gen_random_uuid(),
  profile varchar(255) not null unique
);

create table public.user_account (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_id uuid not null references public.user_profile(profile_id),
  email varchar(255) not null unique,
  username varchar(50) not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  full_name varchar(255),
  gender varchar(50),
  dob date,
  bio text,
  status varchar(50) not null default 'active',
  constraint user_account_status
    check (status in ('active', 'pending', 'suspended'))
);

create table public.registration_requests (
  reg_id uuid primary key default gen_random_uuid(),
  username varchar(255) not null,
  email varchar(255) not null,
  requested_profile_id uuid not null references public.user_profile(profile_id),
  status text not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint registration_requests_status
    check (status in ('pending', 'approved', 'rejected'))
);

create unique index registration_requests_one_pending_email
on public.registration_requests (lower(email))
where status = 'pending';

alter table public.user_profile enable row level security;
alter table public.user_account enable row level security;
alter table public.registration_requests enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_account ua
    join public.user_profile up on up.profile_id = ua.profile_id
    where ua.user_id = auth.uid()
    and lower(up.profile) = 'admin'
  );
$$;

create policy "Authenticated users can read user profiles"
on public.user_profile
for select
to authenticated
using (true);

create policy "Admins can manage user profiles"
on public.user_profile
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users can read own account"
on public.user_account
for select
using (user_id = auth.uid());

create policy "Admins can manage user accounts"
on public.user_account
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage registration requests"
on public.registration_requests
for all
using (public.is_admin())
with check (public.is_admin());

-- Bootstrap only the first admin profile/account manually.
-- After this, use the admin dashboard to create all other user profiles.
--
-- insert into public.user_profile (profile)
-- values ('Admin');
--
-- Create the first admin manually in Supabase Auth, then run this with that user's id.
-- insert into public.user_account (user_id, profile_id, full_name, email, username)
-- select 'AUTH_USER_ID_HERE', profile_id, 'Admin User', 'admin@example.com', 'admin'
-- from public.user_profile
-- where lower(profile) = 'admin';
