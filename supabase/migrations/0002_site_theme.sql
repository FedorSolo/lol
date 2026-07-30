-- =========================================================
-- Site theme — singleton row (background color, accent color, fonts).
-- Not locale-specific, so it doesn't belong in site_settings_i18n.
-- =========================================================

create table site_theme (
  -- Singleton pattern: id is always `true`, so the table can only ever
  -- hold exactly one row (a second insert violates the primary key).
  id boolean primary key default true check (id = true),
  background_color text not null default '#0A0C0F',
  accent_color text not null default '#3E6C8E',
  font_display text not null default 'default',
  font_body text not null default 'default',
  updated_at timestamptz not null default now()
);

insert into site_theme (id) values (true);

create or replace function set_updated_at_site_theme()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_site_theme_updated_at
  before update on site_theme
  for each row execute function set_updated_at_site_theme();

alter table site_theme enable row level security;

-- Public read (every visitor's browser needs the current theme).
-- No public write policy — only /admin (service_role) can update it.
create policy "public read site_theme" on site_theme for select using (true);
