"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { ActionResult, ActionResultWithData } from "../action-result";
import { slugify } from "@/lib/slugify";

const LOCALES: Locale[] = ["ru", "es", "en"];

export async function getExpeditionsForPicker() {
  const supabase = createAdminSupabaseClient();
  const { data: expeditions } = await supabase.from("expeditions").select("*").order("sort_order");
  const { data: i18n } = await supabase.from("expedition_i18n").select("*").eq("locale", "ru");
  return (expeditions ?? []).map((exp) => ({
    id: exp.id,
    title: i18n?.find((row) => row.expedition_id === exp.id)?.title ?? exp.slug,
  }));
}

export async function getStories() {
  const supabase = createAdminSupabaseClient();
  const { data: stories } = await supabase.from("gallery_stories").select("*").order("sort_order");
  const { data: i18n } = await supabase.from("gallery_stories_i18n").select("*");
  const { data: photos } = await supabase.from("gallery_story_photos").select("*").order("sort_order");

  return (stories ?? []).map((story) => ({
    ...story,
    i18n: (i18n ?? []).filter((row) => row.story_id === story.id),
    photos: (photos ?? []).filter((p) => p.story_id === story.id),
  }));
}

export interface StoryFormData {
  id?: string;
  slug: string;
  year: string;
  expedition_id: string;
  cover_storage_path: string | null;
  is_published: boolean;
  sort_order: number;
  i18n: Record<Locale, { title: string; description: string }>;
}

export async function saveStory(
  form: StoryFormData
): Promise<ActionResultWithData<{ id: string }>> {
  const supabase = createAdminSupabaseClient();

  const anyTitle = form.i18n.ru.title || form.i18n.es.title || form.i18n.en.title;
  const normalizedSlug = slugify(form.slug) || slugify(anyTitle) || `story-${Date.now()}`;

  const payload = {
    slug: normalizedSlug,
    year: form.year ? Number(form.year) : null,
    expedition_id: form.expedition_id || null,
    cover_storage_path: form.cover_storage_path,
    is_published: form.is_published,
    sort_order: form.sort_order,
  };

  let storyId = form.id;
  if (storyId) {
    const { error } = await supabase.from("gallery_stories").update(payload).eq("id", storyId);
    if (error) return { ok: false, error: friendlyStoryError(error.message) };
  } else {
    const { data, error } = await supabase.from("gallery_stories").insert(payload).select("id").single();
    if (error) return { ok: false, error: friendlyStoryError(error.message) };
    storyId = data.id;
  }

  for (const locale of LOCALES) {
    const t = form.i18n[locale];
    if (!t?.title) continue;
    const { error } = await supabase
      .from("gallery_stories_i18n")
      .upsert(
        { story_id: storyId, locale, title: t.title, description: t.description || null },
        { onConflict: "story_id,locale" }
      );
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/stories");
  revalidatePath("/[locale]/stories", "page");
  return { ok: true, data: { id: storyId } };
}

function friendlyStoryError(message: string): string {
  if (message.includes("gallery_stories_slug_key") || message.includes("duplicate key")) {
    return "Такой slug уже используется другой историей — придумайте уникальный (например, добавьте год: aconcagua-2026).";
  }
  return message;
}

export async function deleteStory(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("gallery_stories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/stories");
  revalidatePath("/[locale]/stories", "page");
  return { ok: true };
}

export async function addStoryPhoto(storyId: string, url: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { count } = await supabase
    .from("gallery_story_photos")
    .select("*", { count: "exact", head: true })
    .eq("story_id", storyId);

  const { error } = await supabase.from("gallery_story_photos").insert({
    story_id: storyId,
    storage_path: url,
    sort_order: count ?? 0,
  });
  if (error) return { ok: false, error: error.message };

  // First photo becomes the cover automatically, same as expedition photos.
  if ((count ?? 0) === 0) {
    await supabase.from("gallery_stories").update({ cover_storage_path: url }).eq("id", storyId);
  }

  revalidatePath("/admin/stories");
  revalidatePath("/[locale]/stories", "page");
  return { ok: true };
}

export async function setStoryCover(storyId: string, url: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("gallery_stories")
    .update({ cover_storage_path: url })
    .eq("id", storyId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/stories");
  revalidatePath("/[locale]/stories", "page");
  return { ok: true };
}

export async function deleteStoryPhoto(photoId: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("gallery_story_photos").delete().eq("id", photoId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/stories");
  revalidatePath("/[locale]/stories", "page");
  return { ok: true };
}
