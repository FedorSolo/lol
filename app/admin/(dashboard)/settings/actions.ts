"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "../action-result";
import { DEFAULT_THEME, type SiteTheme } from "@/lib/theme-shared";

export async function getSiteThemeAdmin(): Promise<SiteTheme> {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from("site_theme").select("*").eq("id", true).maybeSingle();
  if (!data) return DEFAULT_THEME;
  return {
    backgroundColor: data.background_color,
    accentColor: data.accent_color,
    fontDisplay: data.font_display,
    fontBody: data.font_body,
    contactEmail: data.contact_email ?? "",
    contactPhone: data.contact_phone ?? "",
    whatsappNumber: data.whatsapp_number ?? "",
    instagramUrl: data.instagram_url ?? "",
    facebookUrl: data.facebook_url ?? "",
    heroPosterUrl: data.hero_poster_url ?? DEFAULT_THEME.heroPosterUrl,
    whyPhotoUrl: data.why_photo_url ?? DEFAULT_THEME.whyPhotoUrl,
    contactPhotoUrl: data.contact_photo_url ?? DEFAULT_THEME.contactPhotoUrl,
  };
}

export async function saveSiteTheme(theme: SiteTheme): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("site_theme")
    .update({
      background_color: theme.backgroundColor,
      accent_color: theme.accentColor,
      font_display: theme.fontDisplay,
      font_body: theme.fontBody,
      contact_email: theme.contactEmail,
      contact_phone: theme.contactPhone,
      whatsapp_number: theme.whatsappNumber,
      instagram_url: theme.instagramUrl,
      facebook_url: theme.facebookUrl,
      hero_poster_url: theme.heroPosterUrl,
      why_photo_url: theme.whyPhotoUrl,
      contact_photo_url: theme.contactPhotoUrl,
    })
    .eq("id", true);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]", "page");
  return { ok: true };
}

export async function resetSiteTheme(): Promise<ActionResult> {
  // Only resets background/accent/fonts — contact info and site images
  // are separate concerns and shouldn't be wiped by "reset design".
  const current = await getSiteThemeAdmin();
  return saveSiteTheme({
    ...current,
    backgroundColor: DEFAULT_THEME.backgroundColor,
    accentColor: DEFAULT_THEME.accentColor,
    fontDisplay: DEFAULT_THEME.fontDisplay,
    fontBody: DEFAULT_THEME.fontBody,
  });
}
