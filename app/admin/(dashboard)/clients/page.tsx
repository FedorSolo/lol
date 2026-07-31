import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { getClients } from "./actions";
import ClientsTable, { type ExpeditionOption } from "./ClientsTable";

export default async function ClientsPage() {
  const supabase = createAdminSupabaseClient();
  const [clients, { data: expeditions }, { data: expeditionI18n }] = await Promise.all([
    getClients(),
    supabase.from("expeditions").select("*").order("sort_order"),
    supabase.from("expedition_i18n").select("*").eq("locale", "ru"),
  ]);

  const expeditionOptions: ExpeditionOption[] = (expeditions ?? []).map((exp) => ({
    id: exp.id,
    title: expeditionI18n?.find((t) => t.expedition_id === exp.id)?.title ?? exp.slug,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-2">Клиенты</h1>
      <p className="text-mist text-sm max-w-lg mb-8">
        Аккаунты с доступом в личный кабинет (/account). Создаются из «Заявки» кнопкой «Пригласить
        клиента».
      </p>
      <ClientsTable clients={clients} expeditions={expeditionOptions} />
    </div>
  );
}
