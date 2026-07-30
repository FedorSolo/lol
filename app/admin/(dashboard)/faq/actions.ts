"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: Locale[] = ["ru", "es", "en"];

export async function getFaqItems() {
  const supabase = createAdminSupabaseClient();
  const { data: items } = await supabase
    .from("faq")
    .select("*")
    .is("expedition_id", null)
    .order("sort_order");
  const { data: i18n } = await supabase.from("faq_i18n").select("*");

  return (items ?? []).map((item) => ({
    ...item,
    i18n: (i18n ?? []).filter((row) => row.faq_id === item.id),
  }));
}

export interface FaqFormData {
  id?: string;
  sort_order: number;
  is_published: boolean;
  i18n: Record<Locale, { question: string; answer: string }>;
}

export async function saveFaqItem(form: FaqFormData) {
  const supabase = createAdminSupabaseClient();

  const payload = { sort_order: form.sort_order, is_published: form.is_published, expedition_id: null };

  let faqId = form.id;
  if (faqId) {
    const { error } = await supabase.from("faq").update(payload).eq("id", faqId);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from("faq").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    faqId = data.id;
  }

  for (const locale of LOCALES) {
    const t = form.i18n[locale];
    if (!t?.question) continue;
    const { error } = await supabase
      .from("faq_i18n")
      .upsert(
        { faq_id: faqId, locale, question: t.question, answer: t.answer },
        { onConflict: "faq_id,locale" }
      );
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/faq");
  revalidatePath("/[locale]", "page");
}

export async function deleteFaqItem(id: string) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("faq").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faq");
  revalidatePath("/[locale]", "page");
}
