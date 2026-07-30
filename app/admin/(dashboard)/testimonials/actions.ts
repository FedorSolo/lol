"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { ActionResult, ActionResultWithData } from "../action-result";

const LOCALES: Locale[] = ["ru", "es", "en"];

export async function getExpeditionsForPicker() {
  const supabase = createAdminSupabaseClient();
  const { data: expeditions } = await supabase.from("expeditions").select("*").order("sort_order");
  const { data: i18n } = await supabase.from("expedition_i18n").select("*").eq("locale", "ru");
  return (expeditions ?? []).map((exp) => ({
    id: exp.id,
    title: i18n?.find((row) => row.expedition_id === exp.id)?.title ?? exp.slug,
  }));
}

export async function getTestimonials() {
  const supabase = createAdminSupabaseClient();
  const { data: rows } = await supabase.from("testimonials").select("*").order("sort_order");
  const { data: i18n } = await supabase.from("testimonials_i18n").select("*");

  return (rows ?? []).map((row) => ({
    ...row,
    i18n: (i18n ?? []).filter((r) => r.testimonial_id === row.id),
  }));
}

export interface TestimonialFormData {
  id?: string;
  author_name: string;
  author_photo_url: string | null;
  expedition_id: string;
  rating: number;
  is_published: boolean;
  sort_order: number;
  i18n: Record<Locale, { quote: string; role_context: string }>;
}

export async function saveTestimonial(
  form: TestimonialFormData
): Promise<ActionResultWithData<{ id: string }>> {
  const supabase = createAdminSupabaseClient();

  const payload = {
    author_name: form.author_name,
    author_photo_url: form.author_photo_url,
    expedition_id: form.expedition_id || null,
    rating: form.rating,
    is_published: form.is_published,
    sort_order: form.sort_order,
  };

  let id = form.id;
  if (id) {
    const { error } = await supabase.from("testimonials").update(payload).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase.from("testimonials").insert(payload).select("id").single();
    if (error) return { ok: false, error: error.message };
    id = data.id;
  }

  for (const locale of LOCALES) {
    const t = form.i18n[locale];
    if (!t?.quote) continue;
    const { error } = await supabase
      .from("testimonials_i18n")
      .upsert(
        { testimonial_id: id, locale, quote: t.quote, role_context: t.role_context || null },
        { onConflict: "testimonial_id,locale" }
      );
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/[locale]", "page");
  return { ok: true, data: { id } };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/[locale]", "page");
  return { ok: true };
}
