-- Interactive equipment checklist.
--
-- expedition_equipment: the master list per expedition (admin-managed,
-- translated, publicly visible — same pattern as inclusions/exclusions).
--
-- client_equipment_checks: which items a specific client has personally
-- ticked off in their portal. Separate from the master list so each
-- client's checkmarks are independent even though they share the same
-- underlying items.

create table expedition_equipment (
  id uuid primary key default gen_random_uuid(),
  expedition_id uuid not null references expeditions(id) on delete cascade,
  category text not null default 'other'
    check (category in ('clothing', 'footwear', 'gear', 'documents', 'other')),
  is_rentable boolean not null default false,
  sort_order int not null default 0
);

create table expedition_equipment_i18n (
  equipment_id uuid not null references expedition_equipment(id) on delete cascade,
  locale text not null check (locale in ('ru','es','en')),
  text text not null,
  primary key (equipment_id, locale)
);

create table client_equipment_checks (
  client_id uuid not null references client_profiles(id) on delete cascade,
  equipment_id uuid not null references expedition_equipment(id) on delete cascade,
  is_checked boolean not null default true,
  primary key (client_id, equipment_id)
);

alter table expedition_equipment enable row level security;
alter table expedition_equipment_i18n enable row level security;
alter table client_equipment_checks enable row level security;

-- Public read, same as inclusions/exclusions/itinerary — the checklist
-- is also shown (read-only) on the public expedition page.
create policy "public read expedition_equipment" on expedition_equipment
  for select using (
    exists (select 1 from expeditions e where e.id = expedition_id and e.is_published = true)
  );

create policy "public read expedition_equipment_i18n" on expedition_equipment_i18n
  for select using (
    exists (
      select 1 from expedition_equipment ee
      join expeditions e on e.id = ee.expedition_id
      where ee.id = equipment_id and e.is_published = true
    )
  );

-- A client can read and write only their own checkmarks.
create policy "clients manage own equipment checks" on client_equipment_checks
  for all using (auth.uid() = client_id) with check (auth.uid() = client_id);

NOTIFY pgrst, 'reload schema';
