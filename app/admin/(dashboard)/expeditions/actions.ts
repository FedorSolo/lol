"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: Locale[] = ["ru", "es", "en"];

export async function getDifficultyLevels() {
  const supabase = createAdminSupabaseClient();
  const { data: levels } = await supabase
    .from("difficulty_levels")
    .select("*")
    .order("sort_order");
  const { data: i18n } = await supabase.from("difficulty_level_i18n").select("*");

  return (levels ?? []).map((level) => ({
    ...level,
    i18n: (i18n ?? []).filter((row) => row.level_id === level.id),
  }));
}

export async function getExpeditions() {
  const supabase = createAdminSupabaseClient();
  const { data: expeditions } = await supabase
    .from("expeditions")
    .select("*")
    .order("sort_order");
  const { data: i18n } = await supabase.from("expedition_i18n").select("*");
  const { data: levels } = await supabase.from("difficulty_levels").select("*");
  const { data: levelI18n } = await supabase.from("difficulty_level_i18n").select("*");

  return (expeditions ?? []).map((exp) => {
    const level = (levels ?? []).find((l) => l.id === exp.difficulty_level_id);
    const levelName =
      (levelI18n ?? []).find((r) => r.level_id === level?.id && r.locale === "ru")?.name ??
      level?.slug ??
      "—";
    return {
      ...exp,
      titleRu: (i18n ?? []).find((row) => row.expedition_id === exp.id && row.locale === "ru")?.title,
      levelName,
    };
  });
}

export async function getExpeditionById(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data: expedition } = await supabase.from("expeditions").select("*").eq("id", id).single();
  const { data: i18nRows } = await supabase.from("expedition_i18n").select("*").eq("expedition_id", id);

  if (!expedition) return null;

  const i18n = Object.fromEntries(LOCALES.map((l) => [l, i18nRows?.find((r) => r.locale === l) ?? null]));

  return { expedition, i18n };
}

export interface ExpeditionFormData {
  id?: string;
  slug: string;
  difficulty_level_id: string;
  country: string;
  altitude_m: string;
  duration_days: string;
  group_size_min: string;
  group_size_max: string;
  price_from: string;
  currency: string;
  best_season: string;
  is_published: boolean;
  sort_order: string;
  i18n: Record<Locale, { title: string; short_description: string; hero_text: string }>;
}

export async function upsertExpedition(form: ExpeditionFormData) {
  const supabase = createAdminSupabaseClient();

  const payload = {
    slug: form.slug,
    difficulty_level_id: form.difficulty_level_id || null,
    country: form.country || null,
    altitude_m: form.altitude_m ? Number(form.altitude_m) : null,
    duration_days: form.duration_days ? Number(form.duration_days) : null,
    group_size_min: form.group_size_min ? Number(form.group_size_min) : null,
    group_size_max: form.group_size_max ? Number(form.group_size_max) : null,
    price_from: form.price_from ? Number(form.price_from) : null,
    currency: form.currency || "USD",
    best_season: form.best_season || null,
    is_published: form.is_published,
    sort_order: form.sort_order ? Number(form.sort_order) : 0,
  };

  let expeditionId = form.id;

  if (expeditionId) {
    const { error } = await supabase.from("expeditions").update(payload).eq("id", expeditionId);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from("expeditions").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    expeditionId = data.id;
  }

  for (const locale of LOCALES) {
    const t = form.i18n[locale];
    if (!t?.title) continue;
    const { error } = await supabase.from("expedition_i18n").upsert(
      {
        expedition_id: expeditionId,
        locale,
        title: t.title,
        short_description: t.short_description || null,
        hero_text: t.hero_text || null,
      },
      { onConflict: "expedition_id,locale" }
    );
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/expeditions");
  redirect("/admin/expeditions");
}

export async function deleteExpedition(id: string) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("expeditions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/expeditions");
}
