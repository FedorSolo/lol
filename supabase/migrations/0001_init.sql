-- =========================================================
-- Tu Expedición — initial schema
-- i18n approach: separate *_i18n tables, one row per locale.
-- locale values used throughout: 'ru' | 'es' | 'en'
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- difficulty_levels
-- ---------------------------------------------------------
create table difficulty_levels (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,           -- 'level-1' | 'level-2' | 'level-3'
  sort_order int not null default 0,
  color_token text,                    -- e.g. 'glacier', maps to a Tailwind token
  created_at timestamptz not null default now()
);

create table difficulty_level_i18n (
  level_id uuid not null references difficulty_levels(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  name text not null,
  description text,
  primary key (level_id, locale)
);

-- ---------------------------------------------------------
-- expeditions
-- ---------------------------------------------------------
create table expeditions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,           -- used identically across all three locales
  difficulty_level_id uuid references difficulty_levels(id) on delete set null,
  country text,
  altitude_m int,
  duration_days int,
  group_size_min int,
  group_size_max int,
  price_from numeric(10,2),
  currency text default 'USD',
  best_season text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table expedition_i18n (
  expedition_id uuid not null references expeditions(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  title text not null,
  short_description text,
  hero_text text,
  fitness_requirements text,
  experience_requirements text,
  preparation_text text,
  meta_title text,
  meta_description text,
  primary key (expedition_id, locale)
);

-- ---------------------------------------------------------
-- expedition itinerary (day-by-day program)
-- ---------------------------------------------------------
create table expedition_itinerary_days (
  id uuid primary key default gen_random_uuid(),
  expedition_id uuid not null references expeditions(id) on delete cascade,
  day_number int not null,
  sort_order int not null default 0
);

create table expedition_itinerary_i18n (
  day_id uuid not null references expedition_itinerary_days(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  title text not null,
  description text,
  primary key (day_id, locale)
);

-- ---------------------------------------------------------
-- inclusions / exclusions ("what's included" / "what's not")
-- ---------------------------------------------------------
create table expedition_inclusions (
  id uuid primary key default gen_random_uuid(),
  expedition_id uuid not null references expeditions(id) on delete cascade,
  icon text,
  sort_order int not null default 0
);

create table expedition_inclusions_i18n (
  inclusion_id uuid not null references expedition_inclusions(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  text text not null,
  primary key (inclusion_id, locale)
);

create table expedition_exclusions (
  id uuid primary key default gen_random_uuid(),
  expedition_id uuid not null references expeditions(id) on delete cascade,
  sort_order int not null default 0
);

create table expedition_exclusions_i18n (
  exclusion_id uuid not null references expedition_exclusions(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  text text not null,
  primary key (exclusion_id, locale)
);

-- ---------------------------------------------------------
-- photos (Supabase Storage paths, not the files themselves)
-- ---------------------------------------------------------
create table expedition_photos (
  id uuid primary key default gen_random_uuid(),
  expedition_id uuid not null references expeditions(id) on delete cascade,
  storage_path text not null,          -- path inside the 'media' bucket
  alt_text text,
  is_cover boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- gallery / expedition stories
-- ---------------------------------------------------------
create table gallery_stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  expedition_id uuid references expeditions(id) on delete set null,
  year int,
  cover_storage_path text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table gallery_stories_i18n (
  story_id uuid not null references gallery_stories(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  title text not null,
  description text,
  primary key (story_id, locale)
);

create table gallery_story_photos (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references gallery_stories(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0
);

-- ---------------------------------------------------------
-- team
-- ---------------------------------------------------------
create table team_members (
  id uuid primary key default gen_random_uuid(),
  storage_path text,
  years_experience int,
  stat_secondary_value text,           -- e.g. "140+"
  stat_secondary_label_key text,       -- free text, translated via i18n table below if needed
  is_published boolean not null default true,
  sort_order int not null default 0
);

create table team_members_i18n (
  member_id uuid not null references team_members(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  name text not null,
  role text not null,
  bio text,
  primary key (member_id, locale)
);

-- ---------------------------------------------------------
-- FAQ (global, or scoped to one expedition)
-- ---------------------------------------------------------
create table faq (
  id uuid primary key default gen_random_uuid(),
  expedition_id uuid references expeditions(id) on delete cascade, -- null = global FAQ
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table faq_i18n (
  faq_id uuid not null references faq(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  question text not null,
  answer text not null,
  primary key (faq_id, locale)
);

-- ---------------------------------------------------------
-- applications (client submissions)
-- ---------------------------------------------------------
create type application_status as enum (
  'NEW', 'CONTACTED', 'INTERVIEW', 'APPROVED', 'REJECTED', 'COMPLETED'
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  whatsapp text,
  telegram text,
  country text,
  age int,
  expedition_id uuid references expeditions(id) on delete set null,
  hiking_experience text,
  climbing_experience text,
  altitude_experience text,
  fitness_level text,
  trainings_per_week text,
  sports_practiced text,
  medical_notes text,
  extra_info text,
  consent_given boolean not null default false,
  status application_status not null default 'NEW',
  locale text check (locale in ('ru','es','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- site settings (homepage blocks, footer, global translated strings)
-- key/value with a jsonb payload, one row per locale
-- ---------------------------------------------------------
create table site_settings_i18n (
  key text not null,                   -- e.g. 'homepage_hero', 'footer', 'preparation_intro'
  locale text not null check (locale in ('ru','es','en')),
  value jsonb not null,
  primary key (key, locale)
);

-- =========================================================
-- updated_at trigger for expeditions and applications
-- =========================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_expeditions_updated_at
  before update on expeditions
  for each row execute function set_updated_at();

create trigger trg_applications_updated_at
  before update on applications
  for each row execute function set_updated_at();

-- =========================================================
-- Row Level Security
-- Public (anon) role: read-only access to published content.
-- Write access is reserved for the service_role key, used only
-- from server-side code in /admin (never exposed to the browser).
-- =========================================================

alter table difficulty_levels enable row level security;
alter table difficulty_level_i18n enable row level security;
alter table expeditions enable row level security;
alter table expedition_i18n enable row level security;
alter table expedition_itinerary_days enable row level security;
alter table expedition_itinerary_i18n enable row level security;
alter table expedition_inclusions enable row level security;
alter table expedition_inclusions_i18n enable row level security;
alter table expedition_exclusions enable row level security;
alter table expedition_exclusions_i18n enable row level security;
alter table expedition_photos enable row level security;
alter table gallery_stories enable row level security;
alter table gallery_stories_i18n enable row level security;
alter table gallery_story_photos enable row level security;
alter table team_members enable row level security;
alter table team_members_i18n enable row level security;
alter table faq enable row level security;
alter table faq_i18n enable row level security;
alter table site_settings_i18n enable row level security;
alter table applications enable row level security;

-- Public read policies (published rows only where applicable)
create policy "public read difficulty_levels" on difficulty_levels for select using (true);
create policy "public read difficulty_level_i18n" on difficulty_level_i18n for select using (true);

create policy "public read published expeditions" on expeditions for select using (is_published = true);
create policy "public read expedition_i18n" on expedition_i18n for select using (
  exists (select 1 from expeditions e where e.id = expedition_id and e.is_published = true)
);

create policy "public read itinerary days" on expedition_itinerary_days for select using (
  exists (select 1 from expeditions e where e.id = expedition_id and e.is_published = true)
);
create policy "public read itinerary i18n" on expedition_itinerary_i18n for select using (
  exists (
    select 1 from expedition_itinerary_days d
    join expeditions e on e.id = d.expedition_id
    where d.id = day_id and e.is_published = true
  )
);

create policy "public read inclusions" on expedition_inclusions for select using (
  exists (select 1 from expeditions e where e.id = expedition_id and e.is_published = true)
);
create policy "public read inclusions i18n" on expedition_inclusions_i18n for select using (
  exists (
    select 1 from expedition_inclusions i
    join expeditions e on e.id = i.expedition_id
    where i.id = inclusion_id and e.is_published = true
  )
);

create policy "public read exclusions" on expedition_exclusions for select using (
  exists (select 1 from expeditions e where e.id = expedition_id and e.is_published = true)
);
create policy "public read exclusions i18n" on expedition_exclusions_i18n for select using (
  exists (
    select 1 from expedition_exclusions x
    join expeditions e on e.id = x.expedition_id
    where x.id = exclusion_id and e.is_published = true
  )
);

create policy "public read photos" on expedition_photos for select using (
  exists (select 1 from expeditions e where e.id = expedition_id and e.is_published = true)
);

create policy "public read gallery_stories" on gallery_stories for select using (is_published = true);
create policy "public read gallery_stories_i18n" on gallery_stories_i18n for select using (
  exists (select 1 from gallery_stories s where s.id = story_id and s.is_published = true)
);
create policy "public read gallery_story_photos" on gallery_story_photos for select using (
  exists (select 1 from gallery_stories s where s.id = story_id and s.is_published = true)
);

create policy "public read team_members" on team_members for select using (is_published = true);
create policy "public read team_members_i18n" on team_members_i18n for select using (
  exists (select 1 from team_members m where m.id = member_id and m.is_published = true)
);

create policy "public read faq" on faq for select using (is_published = true);
create policy "public read faq_i18n" on faq_i18n for select using (
  exists (select 1 from faq f where f.id = faq_id and f.is_published = true)
);

create policy "public read site_settings_i18n" on site_settings_i18n for select using (true);

-- Applications: no public read/update. Anyone (anon) may INSERT their own
-- application (the public application form), but may never read them back.
create policy "public can submit applications" on applications for insert with check (true);

-- No public select/update/delete policies are defined for `applications`,
-- and no write policies are defined for any CMS content table — by default
-- RLS denies everything not explicitly allowed. The admin panel talks to
-- Supabase using the service_role key from server-side route handlers,
-- which bypasses RLS entirely, so no extra "admin" policies are required
-- at this stage.
