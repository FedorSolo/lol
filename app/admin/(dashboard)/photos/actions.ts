"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

export async function getExpeditionsList() {
  const supabase = createAdminSupabaseClient();
  const { data: expeditions } = await supabase
    .from("expeditions")
    .select("*")
    .order("sort_order");
  const { data: i18n } = await supabase.from("expedition_i18n").select("*").eq("locale", "ru");

  return (expeditions ?? []).map((exp) => ({
    id: exp.id,
    slug: exp.slug,
    title: i18n?.find((row) => row.expedition_id === exp.id)?.title ?? exp.slug,
  }));
}

export async function getExpeditionPhotos(expeditionId: string) {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("expedition_photos")
    .select("*")
    .eq("expedition_id", expeditionId)
    .order("sort_order");
  return data ?? [];
}

export async function addExpeditionPhoto(expeditionId: string, url: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { count } = await supabase
    .from("expedition_photos")
    .select("*", { count: "exact", head: true })
    .eq("expedition_id", expeditionId);

  const { error } = await supabase.from("expedition_photos").insert({
    expedition_id: expeditionId,
    storage_path: url,
    is_cover: (count ?? 0) === 0, // first photo becomes the cover automatically
    sort_order: count ?? 0,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/photos");
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/expeditions/[slug]", "page");
  return { ok: true };
}

export async function setCoverPhoto(expeditionId: string, photoId: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  await supabase.from("expedition_photos").update({ is_cover: false }).eq("expedition_id", expeditionId);
  const { error } = await supabase.from("expedition_photos").update({ is_cover: true }).eq("id", photoId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/photos");
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/expeditions/[slug]", "page");
  return { ok: true };
}

export async function deleteExpeditionPhoto(photoId: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("expedition_photos").delete().eq("id", photoId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/photos");
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/expeditions/[slug]", "page");
  return { ok: true };
}
