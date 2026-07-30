"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { ActionResult } from "../action-result";
import { type SiteSettingsKey } from "@/lib/site-content-shared";

const LOCALES: Locale[] = ["ru", "es", "en"];

export async function saveSiteSetting(
  key: SiteSettingsKey,
  valuesByLocale: Record<Locale, unknown>
): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();

  for (const locale of LOCALES) {
    const value = valuesByLocale[locale];
    if (!value) continue;
    const { error } = await supabase
      .from("site_settings_i18n")
      .upsert({ key, locale, value: value as Record<string, unknown> }, { onConflict: "key,locale" });
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/content");
  revalidatePath("/[locale]", "page");
  return { ok: true };
}

export async function resetSiteSetting(key: SiteSettingsKey): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("site_settings_i18n").delete().eq("key", key);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/content");
  revalidatePath("/[locale]", "page");
  return { ok: true };
}
