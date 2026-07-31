"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { ActionResult, ActionResultWithData } from "@/lib/action-result";

const LOCALES: Locale[] = ["ru", "es", "en"];

function revalidateExpedition() {
  revalidatePath("/admin/expeditions");
  revalidatePath("/[locale]/expeditions/[slug]", "page");
}

// ---------- Itinerary (программа по дням) ----------

export async function getItineraryDays(expeditionId: string) {
  const supabase = createAdminSupabaseClient();
  const { data: days } = await supabase
    .from("expedition_itinerary_days")
    .select("*")
    .eq("expedition_id", expeditionId)
    .order("day_number");
  const { data: i18n } = await supabase.from("expedition_itinerary_i18n").select("*");

  return (days ?? []).map((day) => ({
    ...day,
    i18n: (i18n ?? []).filter((row) => row.day_id === day.id),
  }));
}

export interface ItineraryDayFormData {
  id?: string;
  expedition_id: string;
  day_number: number;
  sort_order: number;
  i18n: Record<Locale, { title: string; description: string }>;
}

export async function saveItineraryDay(
  form: ItineraryDayFormData
): Promise<ActionResultWithData<{ id: string }>> {
  const supabase = createAdminSupabaseClient();

  let dayId = form.id;
  if (dayId) {
    const { error } = await supabase
      .from("expedition_itinerary_days")
      .update({ day_number: form.day_number, sort_order: form.sort_order })
      .eq("id", dayId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("expedition_itinerary_days")
      .insert({
        expedition_id: form.expedition_id,
        day_number: form.day_number,
        sort_order: form.sort_order,
      })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    dayId = data.id;
  }

  for (const locale of LOCALES) {
    const t = form.i18n[locale];
    if (!t?.title) continue;
    const { error } = await supabase
      .from("expedition_itinerary_i18n")
      .upsert(
        { day_id: dayId, locale, title: t.title, description: t.description || null },
        { onConflict: "day_id,locale" }
      );
    if (error) return { ok: false, error: error.message };
  }

  revalidateExpedition();
  return { ok: true, data: { id: dayId } };
}

export async function deleteItineraryDay(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("expedition_itinerary_days").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateExpedition();
  return { ok: true };
}

// ---------- Inclusions (что входит) ----------

export async function getInclusions(expeditionId: string) {
  const supabase = createAdminSupabaseClient();
  const { data: rows } = await supabase
    .from("expedition_inclusions")
    .select("*")
    .eq("expedition_id", expeditionId)
    .order("sort_order");
  const { data: i18n } = await supabase.from("expedition_inclusions_i18n").select("*");

  return (rows ?? []).map((row) => ({
    ...row,
    i18n: (i18n ?? []).filter((r) => r.inclusion_id === row.id),
  }));
}

export interface InclusionFormData {
  id?: string;
  expedition_id: string;
  sort_order: number;
  i18n: Record<Locale, { text: string }>;
}

export async function saveInclusion(
  form: InclusionFormData
): Promise<ActionResultWithData<{ id: string }>> {
  const supabase = createAdminSupabaseClient();

  let rowId = form.id;
  if (rowId) {
    const { error } = await supabase
      .from("expedition_inclusions")
      .update({ sort_order: form.sort_order })
      .eq("id", rowId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("expedition_inclusions")
      .insert({ expedition_id: form.expedition_id, sort_order: form.sort_order })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    rowId = data.id;
  }

  for (const locale of LOCALES) {
    const t = form.i18n[locale];
    if (!t?.text) continue;
    const { error } = await supabase
      .from("expedition_inclusions_i18n")
      .upsert({ inclusion_id: rowId, locale, text: t.text }, { onConflict: "inclusion_id,locale" });
    if (error) return { ok: false, error: error.message };
  }

  revalidateExpedition();
  return { ok: true, data: { id: rowId } };
}

export async function deleteInclusion(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("expedition_inclusions").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateExpedition();
  return { ok: true };
}

// ---------- Exclusions (что не входит) ----------

export async function getExclusions(expeditionId: string) {
  const supabase = createAdminSupabaseClient();
  const { data: rows } = await supabase
    .from("expedition_exclusions")
    .select("*")
    .eq("expedition_id", expeditionId)
    .order("sort_order");
  const { data: i18n } = await supabase.from("expedition_exclusions_i18n").select("*");

  return (rows ?? []).map((row) => ({
    ...row,
    i18n: (i18n ?? []).filter((r) => r.exclusion_id === row.id),
  }));
}

export interface ExclusionFormData {
  id?: string;
  expedition_id: string;
  sort_order: number;
  i18n: Record<Locale, { text: string }>;
}

export async function saveExclusion(
  form: ExclusionFormData
): Promise<ActionResultWithData<{ id: string }>> {
  const supabase = createAdminSupabaseClient();

  let rowId = form.id;
  if (rowId) {
    const { error } = await supabase
      .from("expedition_exclusions")
      .update({ sort_order: form.sort_order })
      .eq("id", rowId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("expedition_exclusions")
      .insert({ expedition_id: form.expedition_id, sort_order: form.sort_order })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    rowId = data.id;
  }

  for (const locale of LOCALES) {
    const t = form.i18n[locale];
    if (!t?.text) continue;
    const { error } = await supabase
      .from("expedition_exclusions_i18n")
      .upsert({ exclusion_id: rowId, locale, text: t.text }, { onConflict: "exclusion_id,locale" });
    if (error) return { ok: false, error: error.message };
  }

  revalidateExpedition();
  return { ok: true, data: { id: rowId } };
}

export async function deleteExclusion(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("expedition_exclusions").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateExpedition();
  return { ok: true };
}
