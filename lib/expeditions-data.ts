import "server-only";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { PublicExpedition, PublicDifficultyLevel } from "./expeditions-shared";

export async function getPublishedExpeditions(locale: Locale): Promise<PublicExpedition[]> {
  const supabase = createServerSupabaseClient();

  const { data: expeditions } = await supabase
    .from("expeditions")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  if (!expeditions || expeditions.length === 0) return [];

  const ids = expeditions.map((e) => e.id);

  const { data: i18n } = await supabase
    .from("expedition_i18n")
    .select("*")
    .in("expedition_id", ids)
    .eq("locale", locale);

  const levelIds = expeditions
    .map((e) => e.difficulty_level_id)
    .filter((id): id is string => Boolean(id));

  const { data: levelNames } =
    levelIds.length > 0
      ? await supabase
          .from("difficulty_level_i18n")
          .select("*")
          .in("level_id", levelIds)
          .eq("locale", locale)
      : { data: [] as { level_id: string; name: string }[] };

  const { data: coverPhotos } = await supabase
    .from("expedition_photos")
    .select("*")
    .in("expedition_id", ids)
    .eq("is_cover", true);

  return expeditions.map((exp) => {
    const t = i18n?.find((row) => row.expedition_id === exp.id);
    const level = levelNames?.find((row) => row.level_id === exp.difficulty_level_id);
    const cover = coverPhotos?.find((row) => row.expedition_id === exp.id);

    return {
      id: exp.id,
      slug: exp.slug,
      title: t?.title ?? exp.slug,
      shortDescription: t?.short_description ?? null,
      country: exp.country,
      altitudeM: exp.altitude_m,
      durationDays: exp.duration_days,
      bestSeason: exp.best_season,
      priceFrom: exp.price_from,
      currency: exp.currency,
      groupSizeMax: exp.group_size_max,
      difficultyLevelId: exp.difficulty_level_id,
      difficultyName: level?.name ?? null,
      coverUrl: cover?.storage_path ?? null,
    };
  });
}

export interface FullPublicExpedition extends PublicExpedition {
  galleryUrls: string[];
  heroText: string | null;
  fitnessRequirements: string | null;
  experienceRequirements: string | null;
  preparationText: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export async function getExpeditionBySlug(
  slug: string,
  locale: Locale
): Promise<FullPublicExpedition | null> {
  const supabase = createServerSupabaseClient();

  const { data: exp } = await supabase
    .from("expeditions")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!exp) return null;

  const { data: t } = await supabase
    .from("expedition_i18n")
    .select("*")
    .eq("expedition_id", exp.id)
    .eq("locale", locale)
    .maybeSingle();

  let levelName: string | null = null;
  if (exp.difficulty_level_id) {
    const { data: level } = await supabase
      .from("difficulty_level_i18n")
      .select("*")
      .eq("level_id", exp.difficulty_level_id)
      .eq("locale", locale)
      .maybeSingle();
    levelName = level?.name ?? null;
  }

  const { data: cover } = await supabase
    .from("expedition_photos")
    .select("*")
    .eq("expedition_id", exp.id)
    .eq("is_cover", true)
    .maybeSingle();

  const { data: gallery } = await supabase
    .from("expedition_photos")
    .select("*")
    .eq("expedition_id", exp.id)
    .order("sort_order");

  return {
    id: exp.id,
    slug: exp.slug,
    title: t?.title ?? exp.slug,
    shortDescription: t?.short_description ?? null,
    country: exp.country,
    altitudeM: exp.altitude_m,
    durationDays: exp.duration_days,
    bestSeason: exp.best_season,
    priceFrom: exp.price_from,
    currency: exp.currency,
    groupSizeMax: exp.group_size_max,
    difficultyLevelId: exp.difficulty_level_id,
    difficultyName: levelName,
    coverUrl: cover?.storage_path ?? null,
    galleryUrls: (gallery ?? []).map((p) => p.storage_path),
    heroText: t?.hero_text ?? null,
    fitnessRequirements: t?.fitness_requirements ?? null,
    experienceRequirements: t?.experience_requirements ?? null,
    preparationText: t?.preparation_text ?? null,
    metaTitle: t?.meta_title ?? null,
    metaDescription: t?.meta_description ?? null,
  };
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  // Uses the admin (cookie-free) client on purpose: this runs inside
  // generateStaticParams at BUILD time, before any request exists, so
  // cookies() (used by createServerSupabaseClient) throws
  // "cookies was called outside a request scope". The data itself is
  // public (published expedition slugs), so bypassing RLS here is safe.
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from("expeditions").select("slug").eq("is_published", true);
  return (data ?? []).map((row) => row.slug);
}

export async function getPublicDifficultyLevels(locale: Locale): Promise<PublicDifficultyLevel[]> {
  const supabase = createServerSupabaseClient();

  const { data: levels } = await supabase.from("difficulty_levels").select("*").order("sort_order");
  if (!levels || levels.length === 0) return [];

  const { data: i18n } = await supabase
    .from("difficulty_level_i18n")
    .select("*")
    .in(
      "level_id",
      levels.map((l) => l.id)
    )
    .eq("locale", locale);

  return levels.map((level) => ({
    id: level.id,
    slug: level.slug,
    name: i18n?.find((row) => row.level_id === level.id)?.name ?? level.slug,
  }));
}
