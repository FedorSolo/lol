create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_photo_url text,
  expedition_id uuid references expeditions(id) on delete set null,
  rating smallint not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table testimonials_i18n (
  testimonial_id uuid not null references testimonials(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  quote text not null,
  role_context text, -- e.g. "участник экспедиции, Аконкагуа 2025"
  primary key (testimonial_id, locale)
);

alter table testimonials enable row level security;
alter table testimonials_i18n enable row level security;

create policy "public read published testimonials" on testimonials
  for select using (is_published = true);

create policy "public read testimonials_i18n" on testimonials_i18n
  for select using (
    exists (select 1 from testimonials t where t.id = testimonial_id and t.is_published = true)
  );

NOTIFY pgrst, 'reload schema';
