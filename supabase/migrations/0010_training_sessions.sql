-- Replaces the single free-text training_plan with a proper calendar of
-- individual training sessions per day, so the client portal can show a
-- TrainingPeaks-style calendar instead of one block of text.

create table training_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references client_profiles(id) on delete cascade,
  session_date date not null,
  title text not null,
  session_type text not null default 'other'
    check (session_type in ('cardio', 'strength', 'hike', 'altitude', 'rest', 'other')),
  duration_minutes int,
  distance_km numeric,
  elevation_gain_m int,
  description text,
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index training_sessions_client_date_idx on training_sessions (client_id, session_date);

alter table training_sessions enable row level security;

-- A client can read all their own sessions, and update them (in practice
-- our own client-facing code only ever changes is_completed — full
-- column-level write restriction isn't set up, matching the trust level
-- of the rest of this schema). No client insert/delete policy: only the
-- admin (service_role) creates/removes sessions.
create policy "clients read own sessions" on training_sessions
  for select using (auth.uid() = client_id);

create policy "clients update own sessions" on training_sessions
  for update using (auth.uid() = client_id) with check (auth.uid() = client_id);

NOTIFY pgrst, 'reload schema';
