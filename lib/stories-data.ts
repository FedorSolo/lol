import "server-only";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { PublicStorySummary, PublicStoryDetail } from "./stories-shared";

export async function getPublicStories(locale: Locale): Promise<PublicStorySummary[]> {
  const supabase = createServerSupabaseClient();

  const { data: stories } = await supabase
    .from("gallery_stories")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  if (!stories || stories.length === 0) return [];

  const { data: i18n } = await supabase
    .from("gallery_stories_i18n")
    .select("*")
    .in(
      "story_id",
      stories.map((s) => s.id)
    )
    .eq("locale", locale);

  return stories
    .map((s) => {
      const t = i18n?.find((row) => row.story_id === s.id);
      if (!t) return null;
      return {
        id: s.id,
        slug: s.slug,
        year: s.year,
        coverUrl: s.cover_storage_path,
        title: t.title,
        description: t.description,
      };
    })
    .filter((s): s is PublicStorySummary => s !== null);
}

export async function getStoryBySlug(slug: string, locale: Locale): Promise<PublicStoryDetail | null> {
  const supabase = createServerSupabaseClient();

  const { data: story } = await supabase
    .from("gallery_stories")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!story) return null;

  const { data: t } = await supabase
    .from("gallery_stories_i18n")
    .select("*")
    .eq("story_id", story.id)
    .eq("locale", locale)
    .maybeSingle();

  const { data: photos } = await supabase
    .from("gallery_story_photos")
    .select("*")
    .eq("story_id", story.id)
    .order("sort_order");

  let expeditionTitle: string | null = null;
  let expeditionSlug: string | null = null;
  if (story.expedition_id) {
    const { data: exp } = await supabase
      .from("expeditions")
      .select("*")
      .eq("id", story.expedition_id)
      .maybeSingle();
    if (exp) {
      expeditionSlug = exp.slug;
      const { data: expT } = await supabase
        .from("expedition_i18n")
        .select("*")
        .eq("expedition_id", exp.id)
        .eq("locale", locale)
        .maybeSingle();
      expeditionTitle = expT?.title ?? exp.slug;
    }
  }

  return {
    id: story.id,
    slug: story.slug,
    year: story.year,
    coverUrl: story.cover_storage_path,
    title: t?.title ?? story.slug,
    description: t?.description ?? null,
    expeditionTitle,
    expeditionSlug,
    photoUrls: (photos ?? []).map((p) => p.storage_path),
  };
}

export async function getAllPublishedStorySlugs(): Promise<string[]> {
  // Cookie-free admin client on purpose — see getAllPublishedSlugs in
  // expeditions-data.ts for why (runs during build-time static generation).
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from("gallery_stories").select("slug").eq("is_published", true);
  return (data ?? []).map((row) => row.slug);
}
