import { notFound } from "next/navigation";
import { getDifficultyLevels, getExpeditionById } from "../actions";
import {
  getItineraryDays,
  getInclusions,
  getExclusions,
  getExpeditionUpdates,
  getEquipment,
} from "../content-actions";
import ExpeditionEditor from "./ExpeditionEditor";
import type { Locale } from "@/lib/supabase/database.types";

export default async function EditExpeditionPage({ params }: { params: { id: string } }) {
  const [levels, data, itineraryRows, inclusionRows, exclusionRows, updateRows, equipmentRows] =
    await Promise.all([
      getDifficultyLevels(),
      getExpeditionById(params.id),
      getItineraryDays(params.id),
      getInclusions(params.id),
      getExclusions(params.id),
      getExpeditionUpdates(params.id),
      getEquipment(params.id),
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

  const equipment = equipmentRows.map((row) => ({
    id: row.id,
    expedition_id: row.expedition_id,
    category: row.category,
    is_rentable: row.is_rentable,
    sort_order: row.sort_order,
    i18n: {
      ru: { text: row.i18n.find((r) => r.locale === "ru")?.text ?? "" },
      es: { text: row.i18n.find((r) => r.locale === "es")?.text ?? "" },
      en: { text: row.i18n.find((r) => r.locale === "en")?.text ?? "" },
    } as Record<Locale, { text: string }>,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">
        Редактировать экспедицию
      </h1>
      <ExpeditionEditor
        expeditionId={params.id}
        levels={levels}
        initial={data as any}
        itineraryDays={itineraryDays}
        inclusions={inclusions}
        exclusions={exclusions}
        equipment={equipment}
        updates={updates}
      />
    </div>
  );
}
