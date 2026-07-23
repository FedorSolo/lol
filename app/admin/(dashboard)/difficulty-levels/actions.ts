"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: Locale[] = ["ru", "es", "en"];

export async function saveDifficultyLevel(input: {
  id?: string;
  slug: string;
  sort_order: number;
  i18n: Record<Locale, { name: string; description: string }>;
}) {
  const supabase = createAdminSupabaseClient();

  let levelId = input.id;

  if (levelId) {
    const { error } = await supabase
      .from("difficulty_levels")
      .update({ slug: input.slug, sort_order: input.sort_order })
      .eq("id", levelId);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("difficulty_levels")
      .insert({ slug: input.slug, sort_order: input.sort_order })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    levelId = data.id;
  }

  for (const locale of LOCALES) {
    const t = input.i18n[locale];
    if (!t?.name) continue;
    const { error } = await supabase
      .from("difficulty_level_i18n")
      .upsert(
        { level_id: levelId, locale, name: t.name, description: t.description || null },
        { onConflict: "level_id,locale" }
      );
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/difficulty-levels");
}

export async function deleteDifficultyLevel(id: string) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("difficulty_levels").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/difficulty-levels");
}
