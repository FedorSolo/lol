-- Adds editable site-wide photo/poster URLs to the site_theme table.
-- Defaults match the URLs currently hardcoded in the components, so
-- nothing changes visually until an admin uploads a replacement.
-- Safe to run even if some/all columns already exist.

alter table site_theme add column if not exists hero_poster_url text
  not null default 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2400&auto=format&fit=crop';
alter table site_theme add column if not exists why_photo_url text
  not null default 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1200&auto=format&fit=crop';
alter table site_theme add column if not exists contact_photo_url text
  not null default 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2400&auto=format&fit=crop';

NOTIFY pgrst, 'reload schema';
