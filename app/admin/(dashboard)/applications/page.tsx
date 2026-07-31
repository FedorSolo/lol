import { createAdminSupabaseClient } from "@/lib/supabase/server";
import ApplicationsTable, { type ApplicationRow, type ExpeditionOption } from "./ApplicationsTable";
import { getInvitedEmails } from "./actions";

export default async function ApplicationsPage() {
  const supabase = createAdminSupabaseClient();
  const [{ data: applications }, { data: expeditions }, { data: expeditionI18n }, invitedEmails] =
    await Promise.all([
      supabase.from("applications").select("*, expeditions(slug)").order("created_at", { ascending: false }),
      supabase.from("expeditions").select("*").order("sort_order"),
      supabase.from("expedition_i18n").select("*").eq("locale", "ru"),
      getInvitedEmails(),
    ]);

  const expeditionOptions: ExpeditionOption[] = (expeditions ?? []).map((exp) => ({
    id: exp.id,
    title: expeditionI18n?.find((t) => t.expedition_id === exp.id)?.title ?? exp.slug,
  }));

  const rows: ApplicationRow[] = (applications ?? []).map((app: any) => ({
    id: app.id,
    first_name: app.first_name,
    last_name: app.last_name,
    email: app.email,
    whatsapp: app.whatsapp,
    telegram: app.telegram,
    country: app.country,
    age: app.age,
    expedition_id: app.expedition_id,
    expedition_slug: app.expeditions?.slug ?? null,
    status: app.status,
    created_at: app.created_at,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">Заявки</h1>
      <ApplicationsTable applications={rows} expeditions={expeditionOptions} invitedEmails={invitedEmails} />
    </div>
  );
}
