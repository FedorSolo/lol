-- Client portal — Stage A: authentication foundation.
--
-- Clients use the same Supabase Auth as the admin, but are distinguished
-- by having a row here (the admin does not). Accounts are created by an
-- admin action (never public self-signup), from an approved application.

create table client_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  expedition_id uuid references expeditions(id) on delete set null,
  application_id uuid references applications(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table client_profiles enable row level security;

-- A client can read and update only their own row. No insert/delete
-- policy is defined for the anon/authenticated roles — only the
-- service_role key (used by /admin's "Пригласить клиента" action) can
-- create or remove client accounts.
create policy "clients read own profile" on client_profiles
  for select using (auth.uid() = id);

create policy "clients update own profile" on client_profiles
  for update using (auth.uid() = id);

NOTIFY pgrst, 'reload schema';
