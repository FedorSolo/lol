import { getFaqItems } from "./actions";
import FaqBoard from "./FaqBoard";
import type { FaqFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

export default async function FaqPage() {
  const items = await getFaqItems();

  const data: FaqFormData[] = items.map((item) => ({
    id: item.id,
    sort_order: item.sort_order,
    is_published: item.is_published,
    i18n: {
      ru: item.i18n.find((r) => r.locale === "ru") ?? { question: "", answer: "" },
      es: item.i18n.find((r) => r.locale === "es") ?? { question: "", answer: "" },
      en: item.i18n.find((r) => r.locale === "en") ?? { question: "", answer: "" },
    } as Record<Locale, { question: string; answer: string }>,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">FAQ</h1>
      <FaqBoard items={data} />
    </div>
  );
}
