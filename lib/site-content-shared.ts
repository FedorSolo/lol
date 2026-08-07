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

export interface ComparisonRow {
  label: string;
  generic: string;
  us: string;
}

export interface WhyContent {
  eyebrow: string;
  title1: string;
  title2: string;
  items: TextItem[];
  comparisonTitle?: string;
  comparisonTitleUs?: string;
  comparisonRows?: ComparisonRow[];
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

export interface LevelItem {
  number: string;
  subtitle: string;
  title: string;
  text: string;
}

export interface LevelsContent {
  eyebrow: string;
  title: string;
  levels: LevelItem[];
}

export interface TrainingProgramContent {
  title1: string;
  title2: string;
  intro: string;
  skills: string[];
  onlineTitle: string;
  onlineIntro: string;
  onlineItems: string[];
  closing: string;
  linkLabel?: string;
}

export interface PhilosophyExtendedContent {
  title: string;
  paragraphs: string[];
}

export interface HomepageContent {
  hero: HeroContent;
  philosophy: PhilosophyContent;
  why: WhyContent;
  levels: LevelsContent;
  trainingProgram: TrainingProgramContent;
  timeline: TimelineContent;
  audience: AudienceContent;
  process: ProcessContent;
  philosophyExtended: PhilosophyExtendedContent;
}

export const SITE_SETTINGS_KEYS = [
  "home_hero",
  "home_philosophy",
  "home_why",
  "home_levels",
  "home_training_program",
  "home_timeline",
  "home_audience",
  "home_process",
  "home_philosophy_extended",
] as const;

export type SiteSettingsKey = (typeof SITE_SETTINGS_KEYS)[number];
