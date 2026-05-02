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

alter table public.user_profile enable row level security;
alter table public.user_account enable row level security;

create policy "Authenticated users can read user profiles"
on public.user_profile
for select
to authenticated
using (true);

create policy "Users can read own account"
on public.user_account
for select
using (user_id = auth.uid());
