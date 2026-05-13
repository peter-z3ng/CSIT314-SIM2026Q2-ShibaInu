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
  category_name varchar(255) not null unique,
  user_id uuid not null references public.user_account(user_id),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.fra (
  fra_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_account(user_id),
  category_id uuid not null references public.fra_category(category_id),
  title varchar(255) not null,
  description text,
  target_amount numeric(12, 2) not null default 0,
  current_amount numeric(12, 2) not null default 0,
  status varchar(50) not null default 'active',
  start_date date not null default current_date,
  view_count integer not null default 0,
  fav_count integer not null default 0,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.donation (
  donation_id uuid primary key default gen_random_uuid(),
  fra_id uuid not null references public.fra(fra_id),
  user_id uuid not null references public.user_account(user_id),
  amount numeric(12, 2) not null,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.favourite (
  fav_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_account(user_id) on delete cascade,
  fra_id uuid not null references public.fra(fra_id) on delete cascade,
  constraint favourite_user_fra_unique
    unique (user_id, fra_id)
);

alter table public.fra
add column if not exists category_id uuid references public.fra_category(category_id);

alter table public.fra
add column if not exists user_id uuid references public.user_account(user_id);

alter table public.fra
add column if not exists start_date date;

alter table public.fra
add column if not exists end_date date;

alter table public.fra
add column if not exists view_count integer not null default 0;

alter table public.fra
add column if not exists fav_count integer not null default 0;

alter table public.user_profile enable row level security;
alter table public.user_account enable row level security;
alter table public.fra_category enable row level security;
alter table public.fra enable row level security;
alter table public.donation enable row level security;
alter table public.favourite enable row level security;

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

create policy "Authenticated users can read donations"
on public.donation
for select
to authenticated
using (true);

create policy "Users can read own favourites"
on public.favourite
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can save own favourites"
on public.favourite
for insert
to authenticated
with check (user_id = auth.uid());
