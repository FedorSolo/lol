export interface HeroContent {
  eyebrow: string;
  line1: string;
  line2: string;
  line3: string;
  subtitle: string;
  applyButton: string;
  viewButton: string;
}

export interface PhilosophyContent {
  line1: string;
  line2: string;
}

export interface TextItem {
  title: string;
  text: string;
}

export interface WhyContent {
  eyebrow: string;
  title1: string;
  title2: string;
  items: TextItem[];
}

export interface TimelineStep {
  label: string;
  title: string;
  text: string;
}

export interface TimelineContent {
  eyebrow: string;
  title1: string;
  title2: string;
  steps: TimelineStep[];
}

export interface AudienceContent {
  eyebrow: string;
  title1: string;
  title2: string;
  items: TextItem[];
}

export interface ProcessStep {
  title: string;
  text: string;
}

export interface ProcessContent {
  eyebrow: string;
  title1: string;
  title2: string;
  steps: ProcessStep[];
  trustNote: string;
}

export interface HomepageContent {
  hero: HeroContent;
  philosophy: PhilosophyContent;
  why: WhyContent;
  timeline: TimelineContent;
  audience: AudienceContent;
  process: ProcessContent;
}

export const SITE_SETTINGS_KEYS = [
  "home_hero",
  "home_philosophy",
  "home_why",
  "home_timeline",
  "home_audience",
  "home_process",
] as const;

export type SiteSettingsKey = (typeof SITE_SETTINGS_KEYS)[number];
