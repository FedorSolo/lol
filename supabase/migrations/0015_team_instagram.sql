alter table team_members add column if not exists instagram_url text;

NOTIFY pgrst, 'reload schema';
