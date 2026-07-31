-- Client portal — Stage B: private updates/news scoped to one expedition.
-- Russian-only (matches the rest of the client portal), no i18n table
-- needed. Never publicly readable — only a client whose client_profiles
-- row is linked to this expedition can see it.

create table expedition_updates (
  id uuid primary key default gen_random_uuid(),
  expedition_id uuid not null references expeditions(id) on delete cascade,
  title text not null,
  body text not null,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table expedition_updates enable row level security;

-- A client may read an update only if they have a client_profiles row
-- linked to the SAME expedition as the update, and it's published.
-- No public/anon policy exists at all for this table.
create policy "clients read own expedition updates" on expedition_updates
  for select using (
    is_published = true
    and exists (
      select 1 from client_profiles cp
      where cp.id = auth.uid()
      and cp.expedition_id = expedition_updates.expedition_id
    )
  );

NOTIFY pgrst, 'reload schema';
