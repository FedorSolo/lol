import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEFAULT_THEME, type SiteTheme } from "./theme-shared";

export async function getSiteTheme(): Promise<SiteTheme> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("site_theme").select("*").eq("id", true).maybeSingle();
    if (error || !data) return DEFAULT_THEME;

    return {
      backgroundColor: data.background_color,
      accentColor: data.accent_color,
      fontDisplay: data.font_display,
      fontBody: data.font_body,
    };
  } catch {
    // Table might not exist yet if the 0002_site_theme.sql migration
    // hasn't been run — fail open with defaults rather than break the site.
    return DEFAULT_THEME;
  }
}
