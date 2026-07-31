alter table training_sessions add column if not exists garmin_link text;

NOTIFY pgrst, 'reload schema';
