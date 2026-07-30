import "server-only";
import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type {
  HomepageContent,
  HeroContent,
  PhilosophyContent,
  WhyContent,
  TimelineContent,
  AudienceContent,
  ProcessContent,
} from "./site-content-shared";

async function fetchRaw(locale: Locale): Promise<Record<string, unknown>> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("site_settings_i18n").select("*").eq("locale", locale);
  const map: Record<string, unknown> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}

export async function getHomepageContent(locale: Locale): Promise<HomepageContent> {
  const [raw, tHero, tPhilosophy, tWhy, tTimeline, tAudience, tProcess] = await Promise.all([
    fetchRaw(locale),
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "philosophy" }),
    getTranslations({ locale, namespace: "why" }),
    getTranslations({ locale, namespace: "timeline" }),
    getTranslations({ locale, namespace: "audience" }),
    getTranslations({ locale, namespace: "process" }),
  ]);

  const hero =
    (raw.home_hero as HeroContent) ??
    ({
      eyebrow: tHero("eyebrow"),
      line1: tHero("line1"),
      line2: tHero("line2"),
      line3: tHero("line3"),
      subtitle: tHero("subtitle"),
      applyButton: tHero("applyButton"),
      viewButton: tHero("viewButton"),
    } satisfies HeroContent);

  const philosophy =
    (raw.home_philosophy as PhilosophyContent) ??
    ({ line1: tPhilosophy("line1"), line2: tPhilosophy("line2") } satisfies PhilosophyContent);

  const why =
    (raw.home_why as WhyContent) ??
    ({
      eyebrow: tWhy("eyebrow"),
      title1: tWhy("title1"),
      title2: tWhy("title2"),
      items: tWhy.raw("items"),
    } satisfies WhyContent);

  const timeline =
    (raw.home_timeline as TimelineContent) ??
    ({
      eyebrow: tTimeline("eyebrow"),
      title1: tTimeline("title1"),
      title2: tTimeline("title2"),
      steps: tTimeline.raw("steps"),
    } satisfies TimelineContent);

  const audience =
    (raw.home_audience as AudienceContent) ??
    ({
      eyebrow: tAudience("eyebrow"),
      title1: tAudience("title1"),
      title2: tAudience("title2"),
      items: tAudience.raw("items"),
    } satisfies AudienceContent);

  const process =
    (raw.home_process as ProcessContent) ??
    ({
      eyebrow: tProcess("eyebrow"),
      title1: tProcess("title1"),
      title2: tProcess("title2"),
      steps: tProcess.raw("steps"),
      trustNote: tProcess("trustNote"),
    } satisfies ProcessContent);

  return { hero, philosophy, why, timeline, audience, process };
}
