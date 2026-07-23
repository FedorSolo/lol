import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
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

  return expeditions.map((exp) => {
    const t = i18n?.find((row) => row.expedition_id === exp.id);
    const level = levelNames?.find((row) => row.level_id === exp.difficulty_level_id);

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
    };
  });
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
