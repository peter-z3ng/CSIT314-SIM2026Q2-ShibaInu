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

create table if not exists public.fra_category (
  category_id uuid primary key default gen_random_uuid(),
  category_name varchar(255) not null unique
);

create table if not exists public.fra (
  fra_id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  description text,
  category_id uuid references public.fra_category(category_id),
  target_amount numeric(12, 2) not null default 0,
  current_amount numeric(12, 2) not null default 0,
  status varchar(50) not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table public.fra
add column if not exists category_id uuid references public.fra_category(category_id);

alter table public.user_profile enable row level security;
alter table public.user_account enable row level security;
alter table public.fra_category enable row level security;
alter table public.fra enable row level security;

create policy "Authenticated users can read user profiles"
on public.user_profile
for select
to authenticated
using (true);

create policy "Users can read own account"
on public.user_account
for select
using (user_id = auth.uid());

create policy "Authenticated users can read categories"
on public.fra_category
for select
to authenticated
using (true);

create policy "Authenticated users can read FRA"
on public.fra
for select
to authenticated
using (true);
