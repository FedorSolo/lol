alter table training_sessions add column if not exists video_url text;

NOTIFY pgrst, 'reload schema';
