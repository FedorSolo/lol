create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  cover_storage_path text,
  author_name text,
  is_published boolean not null default false,
  published_at timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table articles_i18n (
  article_id uuid not null references articles(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  title text not null,
  excerpt text,
  content text not null default '', -- Markdown
  meta_title text,
  meta_description text,
  primary key (article_id, locale)
);

create or replace function set_updated_at_articles()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_articles_updated_at
  before update on articles
  for each row execute function set_updated_at_articles();

alter table articles enable row level security;
alter table articles_i18n enable row level security;

create policy "public read published articles" on articles
  for select using (is_published = true);

create policy "public read articles_i18n" on articles_i18n
  for select using (
    exists (select 1 from articles a where a.id = article_id and a.is_published = true)
  );

NOTIFY pgrst, 'reload schema';
