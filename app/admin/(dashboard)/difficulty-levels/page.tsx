import { createAdminSupabaseClient } from "@/lib/supabase/server";
import LevelsBoard from "./LevelsBoard";
import type { Locale } from "@/lib/supabase/database.types";

export default async function DifficultyLevelsPage() {
  const supabase = createAdminSupabaseClient();
  const { data: levels } = await supabase.from("difficulty_levels").select("*").order("sort_order");
  const { data: i18n } = await supabase.from("difficulty_level_i18n").select("*");

  const data = (levels ?? []).map((level) => ({
    id: level.id,
    slug: level.slug,
    sort_order: level.sort_order,
    i18n: {
      ru: (i18n ?? []).find((r) => r.level_id === level.id && r.locale === "ru") ?? { name: "", description: "" },
      es: (i18n ?? []).find((r) => r.level_id === level.id && r.locale === "es") ?? { name: "", description: "" },
      en: (i18n ?? []).find((r) => r.level_id === level.id && r.locale === "en") ?? { name: "", description: "" },
    } as Record<Locale, { name: string; description: string }>,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">
        Уровни сложности
      </h1>
      <LevelsBoard levels={data} />
    </div>
  );
}
