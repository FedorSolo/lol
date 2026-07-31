import { notFound } from "next/navigation";
import { getDifficultyLevels, getExpeditionById } from "../actions";
import {
  getItineraryDays,
  getInclusions,
  getExclusions,
  getExpeditionUpdates,
  saveInclusion,
  deleteInclusion,
  saveExclusion,
  deleteExclusion,
} from "../content-actions";
import ExpeditionForm from "../ExpeditionForm";
import ItineraryManager from "../ItineraryManager";
import SimpleListManager from "../SimpleListManager";
import UpdatesManager from "../UpdatesManager";
import type { Locale } from "@/lib/supabase/database.types";

export default async function EditExpeditionPage({ params }: { params: { id: string } }) {
  const [levels, data, itineraryRows, inclusionRows, exclusionRows, updateRows] = await Promise.all([
    getDifficultyLevels(),
    getExpeditionById(params.id),
    getItineraryDays(params.id),
    getInclusions(params.id),
    getExclusions(params.id),
    getExpeditionUpdates(params.id),
  ]);

  if (!data) notFound();

  const itineraryDays = itineraryRows.map((day) => ({
    id: day.id,
    expedition_id: day.expedition_id,
    day_number: day.day_number,
    sort_order: day.sort_order,
    i18n: {
      ru: day.i18n.find((r) => r.locale === "ru") ?? { title: "", description: "" },
      es: day.i18n.find((r) => r.locale === "es") ?? { title: "", description: "" },
      en: day.i18n.find((r) => r.locale === "en") ?? { title: "", description: "" },
    } as Record<Locale, { title: string; description: string }>,
  }));

  const inclusions = inclusionRows.map((row) => ({
    id: row.id,
    expedition_id: row.expedition_id,
    sort_order: row.sort_order,
    i18n: {
      ru: { text: row.i18n.find((r) => r.locale === "ru")?.text ?? "" },
      es: { text: row.i18n.find((r) => r.locale === "es")?.text ?? "" },
      en: { text: row.i18n.find((r) => r.locale === "en")?.text ?? "" },
    } as Record<Locale, { text: string }>,
  }));

  const exclusions = exclusionRows.map((row) => ({
    id: row.id,
    expedition_id: row.expedition_id,
    sort_order: row.sort_order,
    i18n: {
      ru: { text: row.i18n.find((r) => r.locale === "ru")?.text ?? "" },
      es: { text: row.i18n.find((r) => r.locale === "es")?.text ?? "" },
      en: { text: row.i18n.find((r) => r.locale === "en")?.text ?? "" },
    } as Record<Locale, { text: string }>,
  }));

  const updates = updateRows.map((row) => ({
    id: row.id,
    expedition_id: row.expedition_id,
    title: row.title,
    body: row.body,
    is_published: row.is_published,
    published_at: row.published_at.slice(0, 10),
    sort_order: row.sort_order,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">
        Редактировать экспедицию
      </h1>
      <ExpeditionForm levels={levels} initial={data as any} />

      <div className="max-w-3xl mt-16 pt-10 border-t border-white/10">
        <h2 className="font-display text-xl uppercase text-snow tracking-wide mb-2">
          Программа по дням
        </h2>
        <p className="text-mist text-sm mb-5">
          Появится на детальной странице экспедиции вместо тестовых данных, как только добавите
          хотя бы один день.
        </p>
        <ItineraryManager expeditionId={params.id} initialDays={itineraryDays} />
      </div>

      <div className="max-w-3xl mt-16 pt-10 border-t border-white/10">
        <h2 className="font-display text-xl uppercase text-snow tracking-wide mb-5">Что входит</h2>
        <SimpleListManager
          expeditionId={params.id}
          initialItems={inclusions}
          addLabel="Добавить пункт"
          save={saveInclusion}
          remove={deleteInclusion}
        />
      </div>

      <div className="max-w-3xl mt-16 pt-10 border-t border-white/10">
        <h2 className="font-display text-xl uppercase text-snow tracking-wide mb-5">
          Что не входит
        </h2>
        <SimpleListManager
          expeditionId={params.id}
          initialItems={exclusions}
          addLabel="Добавить пункт"
          save={saveExclusion}
          remove={deleteExclusion}
        />
      </div>
      <div className="max-w-3xl mt-16 pt-10 border-t border-white/10">
        <h2 className="font-display text-xl uppercase text-snow tracking-wide mb-2">
          Новости для клиентов
        </h2>
        <p className="text-mist text-sm mb-5">
          Видны только тем клиентам, у кого в профиле привязана эта экспедиция — в их личном
          кабинете, на странице «Новости».
        </p>
        <UpdatesManager expeditionId={params.id} initialUpdates={updates} />
      </div>
    </div>
  );
}
