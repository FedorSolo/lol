-- Replaces the single video_url per session with a list — one YouTube
-- video per exercise, since a workout usually covers several exercises.

create table session_exercise_videos (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references training_sessions(id) on delete cascade,
  exercise_name text not null,
  video_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table session_exercise_videos enable row level security;

-- A client can read the exercise videos for their own sessions only. No
-- insert/update/delete policy — only the admin (service_role) manages
-- these.
create policy "clients read own session exercise videos" on session_exercise_videos
  for select using (
    exists (
      select 1 from training_sessions ts
      where ts.id = session_id and ts.client_id = auth.uid()
    )
  );

NOTIFY pgrst, 'reload schema';
