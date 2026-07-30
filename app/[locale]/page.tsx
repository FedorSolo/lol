import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import WhyDifferent from "@/components/WhyDifferent";
import Expeditions from "@/components/Expeditions";
import Timeline from "@/components/Timeline";
import Team from "@/components/Team";
import Audience from "@/components/Audience";
import ApplicationProcess from "@/components/ApplicationProcess";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getPublishedExpeditions, getPublicDifficultyLevels } from "@/lib/expeditions-data";
import { getPublicTeamMembers } from "@/lib/team-data";
import { getPublicFaq } from "@/lib/faq-data";
import { getHomepageContent } from "@/lib/site-content-data";
import type { Locale } from "@/lib/supabase/database.types";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [expeditions, levels, teamMembers, faqItems, content, tFaq] = await Promise.all([
    getPublishedExpeditions(locale as Locale),
    getPublicDifficultyLevels(locale as Locale),
    getPublicTeamMembers(locale as Locale),
    getPublicFaq(locale as Locale),
    getHomepageContent(locale as Locale),
    getTranslations({ locale, namespace: "faq" }),
  ]);

  // Same real-data-or-fallback logic as components/FAQ.tsx, so the
  // structured data always matches what's actually rendered on the page.
  const faqForSchema =
    faqItems.length > 0
      ? faqItems.map((f) => ({ q: f.question, a: f.answer }))
      : (tFaq.raw("items") as { q: string; a: string }[]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqForSchema.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="bg-obsidian">
      <JsonLd data={faqSchema} />
      <Navbar />
      <Hero content={content.hero} />
      <Philosophy content={content.philosophy} />
      <WhyDifferent content={content.why} />
      <Expeditions expeditions={expeditions} levels={levels} />
      <Timeline content={content.timeline} />
      <Team members={teamMembers} />
      <Audience content={content.audience} />
      <ApplicationProcess content={content.process} />
      <FAQ items={faqItems} />
      <Contact expeditions={expeditions} />
      <Footer />
    </main>
  );
}
