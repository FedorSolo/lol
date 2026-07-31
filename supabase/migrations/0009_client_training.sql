-- Client portal — Stage C: questionnaire, training plan, training videos.

alter table client_profiles add column if not exists training_plan text;

create table client_questionnaire_responses (
  client_id uuid primary key references client_profiles(id) on delete cascade,
  emergency_contact_name text,
  emergency_contact_phone text,
  height_cm int,
  weight_kg int,
  resting_heart_rate int,
  chronic_conditions text,
  current_medications text,
  allergies text,
  recent_training_summary text,
  longest_altitude_reached_m int,
  additional_notes text,
  updated_at timestamptz not null default now()
);

create table client_training_videos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references client_profiles(id) on delete cascade,
  storage_path text not null,
  note text,
  uploaded_at timestamptz not null default now()
);

alter table client_questionnaire_responses enable row level security;
alter table client_training_videos enable row level security;

-- A client can read/write only their own questionnaire row.
create policy "clients manage own questionnaire" on client_questionnaire_responses
  for all using (auth.uid() = client_id) with check (auth.uid() = client_id);

-- A client can read, add, and remove only their own videos.
create policy "clients read own videos" on client_training_videos
  for select using (auth.uid() = client_id);
create policy "clients insert own videos" on client_training_videos
  for insert with check (auth.uid() = client_id);
create policy "clients delete own videos" on client_training_videos
  for delete using (auth.uid() = client_id);

-- Storage: training videos are uploaded directly from the client's
-- browser to Supabase Storage (not proxied through a Vercel serverless
-- function, which has a ~4.5MB request body limit — far too small for
-- video). These policies let an authenticated client read/write/delete
-- only objects under their own folder: training-videos/{their user id}/...
create policy "clients upload own training videos" on storage.objects
  for insert
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'training-videos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "clients read own training videos" on storage.objects
  for select
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'training-videos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "clients delete own training video files" on storage.objects
  for delete
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'training-videos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

NOTIFY pgrst, 'reload schema';
