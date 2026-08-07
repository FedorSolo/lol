import "server-only";
import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type {
  HomepageContent,
  HeroContent,
  PhilosophyContent,
  WhyContent,
  LevelsContent,
  TrainingProgramContent,
  TimelineContent,
  AudienceContent,
  ProcessContent,
  PhilosophyExtendedContent,
} from "./site-content-shared";

async function fetchRaw(locale: Locale): Promise<Record<string, unknown>> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("site_settings_i18n").select("*").eq("locale", locale);
  const map: Record<string, unknown> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}

export async function getHomepageContent(locale: Locale): Promise<HomepageContent> {
  const [
    raw,
    tHero,
    tPhilosophy,
    tWhy,
    tLevels,
    tTrainingProgram,
    tTimeline,
    tAudience,
    tProcess,
    tPhilosophyExtended,
  ] = await Promise.all([
    fetchRaw(locale),
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "philosophy" }),
    getTranslations({ locale, namespace: "why" }),
    getTranslations({ locale, namespace: "levels" }),
    getTranslations({ locale, namespace: "trainingProgram" }),
    getTranslations({ locale, namespace: "timeline" }),
    getTranslations({ locale, namespace: "audience" }),
    getTranslations({ locale, namespace: "process" }),
    getTranslations({ locale, namespace: "philosophyExtended" }),
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

  const whySaved = raw.home_why as WhyContent | undefined;
  const why: WhyContent = whySaved
    ? {
        ...whySaved,
        // Comparison fields shipped after some sites may have already
        // saved a custom "why" block — backfill from translations if
        // the saved value predates them, rather than showing nothing.
        comparisonTitle: whySaved.comparisonTitle ?? tWhy("comparisonTitle"),
        comparisonTitleUs: whySaved.comparisonTitleUs ?? tWhy("comparisonTitleUs"),
        comparisonRows: whySaved.comparisonRows ?? tWhy.raw("comparisonRows"),
      }
    : {
        eyebrow: tWhy("eyebrow"),
        title1: tWhy("title1"),
        title2: tWhy("title2"),
        items: tWhy.raw("items"),
        comparisonTitle: tWhy("comparisonTitle"),
        comparisonTitleUs: tWhy("comparisonTitleUs"),
        comparisonRows: tWhy.raw("comparisonRows"),
      };

  const levels =
    (raw.home_levels as LevelsContent) ??
    ({
      eyebrow: tLevels("eyebrow"),
      title: tLevels("title"),
      levels: tLevels.raw("levels"),
    } satisfies LevelsContent);

  const trainingProgram =
    (raw.home_training_program as TrainingProgramContent) ??
    ({
      title1: tTrainingProgram("title1"),
      title2: tTrainingProgram("title2"),
      intro: tTrainingProgram("intro"),
      skills: tTrainingProgram.raw("skills"),
      onlineTitle: tTrainingProgram("onlineTitle"),
      onlineIntro: tTrainingProgram("onlineIntro"),
      onlineItems: tTrainingProgram.raw("onlineItems"),
      closing: tTrainingProgram("closing"),
    } satisfies TrainingProgramContent);

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

  const philosophyExtended =
    (raw.home_philosophy_extended as PhilosophyExtendedContent) ??
    ({
      title: tPhilosophyExtended("title"),
      paragraphs: tPhilosophyExtended.raw("paragraphs"),
    } satisfies PhilosophyExtendedContent);

  return { hero, philosophy, why, levels, trainingProgram, timeline, audience, process, philosophyExtended };
}
