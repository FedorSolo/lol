import { setRequestLocale } from "next-intl/server";
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
import { getPublishedExpeditions, getPublicDifficultyLevels } from "@/lib/expeditions-data";
import { getPublicTeamMembers } from "@/lib/team-data";
import { getPublicFaq } from "@/lib/faq-data";
import type { Locale } from "@/lib/supabase/database.types";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [expeditions, levels, teamMembers, faqItems] = await Promise.all([
    getPublishedExpeditions(locale as Locale),
    getPublicDifficultyLevels(locale as Locale),
    getPublicTeamMembers(locale as Locale),
    getPublicFaq(locale as Locale),
  ]);

  return (
    <main className="bg-obsidian">
      <Navbar />
      <Hero />
      <Philosophy />
      <WhyDifferent />
      <Expeditions expeditions={expeditions} levels={levels} />
      <Timeline />
      <Team members={teamMembers} />
      <Audience />
      <ApplicationProcess />
      <FAQ items={faqItems} />
      <Contact expeditions={expeditions} />
      <Footer />
    </main>
  );
}
