-- Adds editable contact info to the existing site_theme singleton table.
-- Safe to run even if some/all columns already exist.

alter table site_theme add column if not exists contact_email text not null default '';
alter table site_theme add column if not exists contact_phone text not null default '';
alter table site_theme add column if not exists whatsapp_number text not null default '';
alter table site_theme add column if not exists instagram_url text not null default '';
alter table site_theme add column if not exists facebook_url text not null default '';

NOTIFY pgrst, 'reload schema';
