alter table expeditions add column if not exists group_chat_url text;

NOTIFY pgrst, 'reload schema';
