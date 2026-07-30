import { getTestimonials, getExpeditionsForPicker } from "./actions";
import TestimonialsBoard from "./TestimonialsBoard";
import BackToContentHub from "../BackToContentHub";
import type { TestimonialFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

export default async function TestimonialsPage() {
  const [rows, expeditions] = await Promise.all([getTestimonials(), getExpeditionsForPicker()]);

  const data: TestimonialFormData[] = rows.map((row) => ({
    id: row.id,
    author_name: row.author_name,
    author_photo_url: row.author_photo_url,
    expedition_id: row.expedition_id ?? "",
    rating: row.rating,
    is_published: row.is_published,
    sort_order: row.sort_order,
    i18n: {
      ru: row.i18n.find((r) => r.locale === "ru") ?? { quote: "", role_context: "" },
      es: row.i18n.find((r) => r.locale === "es") ?? { quote: "", role_context: "" },
      en: row.i18n.find((r) => r.locale === "en") ?? { quote: "", role_context: "" },
    } as Record<Locale, { quote: string; role_context: string }>,
  }));

  return (
    <div>
      <BackToContentHub />
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-4">Отзывы</h1>
      <p className="text-mist text-sm max-w-lg mb-8">
        Появляются на главной странице сайта. Можно привязать отзыв к конкретной экспедиции —
        необязательно.
      </p>
      <TestimonialsBoard testimonials={data} expeditions={expeditions} />
    </div>
  );
}
