import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { PublicFaqItem } from "./faq-shared";

export async function getPublicFaq(locale: Locale): Promise<PublicFaqItem[]> {
  const supabase = createServerSupabaseClient();

  const { data: items } = await supabase
    .from("faq")
    .select("*")
    .is("expedition_id", null)
    .eq("is_published", true)
    .order("sort_order");

  if (!items || items.length === 0) return [];

  const { data: i18n } = await supabase
    .from("faq_i18n")
    .select("*")
    .in(
      "faq_id",
      items.map((f) => f.id)
    )
    .eq("locale", locale);

  return items
    .map((item) => {
      const t = i18n?.find((row) => row.faq_id === item.id);
      if (!t) return null;
      return { id: item.id, question: t.question, answer: t.answer };
    })
    .filter((f): f is PublicFaqItem => f !== null);
}
