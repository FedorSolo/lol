import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { PublicTestimonial } from "./testimonials-shared";

export async function getPublicTestimonials(locale: Locale): Promise<PublicTestimonial[]> {
  const supabase = createServerSupabaseClient();

  const { data: rows } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  if (!rows || rows.length === 0) return [];

  const { data: i18n } = await supabase
    .from("testimonials_i18n")
    .select("*")
    .in(
      "testimonial_id",
      rows.map((r) => r.id)
    )
    .eq("locale", locale);

  const expeditionIds = rows.map((r) => r.expedition_id).filter((id): id is string => Boolean(id));
  const { data: expeditionI18n } =
    expeditionIds.length > 0
      ? await supabase
          .from("expedition_i18n")
          .select("*")
          .in("expedition_id", expeditionIds)
          .eq("locale", locale)
      : { data: [] as { expedition_id: string; title: string }[] };

  return rows
    .map((row) => {
      const t = i18n?.find((r) => r.testimonial_id === row.id);
      if (!t) return null;

      const expTitle = row.expedition_id
        ? expeditionI18n?.find((e) => e.expedition_id === row.expedition_id)?.title ?? null
        : null;

      return {
        id: row.id,
        authorName: row.author_name,
        authorPhotoUrl: row.author_photo_url,
        rating: row.rating,
        quote: t.quote,
        roleContext: t.role_context,
        expeditionTitle: expTitle,
      };
    })
    .filter((t): t is PublicTestimonial => t !== null);
}
