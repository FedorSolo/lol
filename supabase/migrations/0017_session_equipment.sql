alter table training_sessions add column if not exists equipment_needed text;

NOTIFY pgrst, 'reload schema';
