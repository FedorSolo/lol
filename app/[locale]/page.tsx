import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import WhyDifferent from "@/components/WhyDifferent";
import Levels from "@/components/Levels";
import TrainingProgramTeaser from "@/components/TrainingProgramTeaser";
import Expeditions from "@/components/Expeditions";
import Timeline from "@/components/Timeline";
import Team from "@/components/Team";
import Audience from "@/components/Audience";
import ApplicationProcess from "@/components/ApplicationProcess";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getPublishedExpeditions, getPublicDifficultyLevels } from "@/lib/expeditions-data";
import { getPublicTeamMembers } from "@/lib/team-data";
import { getPublicFaq } from "@/lib/faq-data";
import { getPublicTestimonials } from "@/lib/testimonials-data";
import { getHomepageContent } from "@/lib/site-content-data";
import { getSiteTheme } from "@/lib/theme-data";
import type { Locale } from "@/lib/supabase/database.types";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [expeditions, levels, teamMembers, faqItems, content, tFaq, theme, testimonials, tTestimonials] =
    await Promise.all([
      getPublishedExpeditions(locale as Locale),
      getPublicDifficultyLevels(locale as Locale),
      getPublicTeamMembers(locale as Locale),
      getPublicFaq(locale as Locale),
      getHomepageContent(locale as Locale),
      getTranslations({ locale, namespace: "faq" }),
      getSiteTheme(),
      getPublicTestimonials(locale as Locale),
      getTranslations({ locale, namespace: "testimonials" }),
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

  const testimonialsForSchema =
    testimonials.length > 0
      ? testimonials.map((t) => ({ quote: t.quote, author: t.authorName, rating: t.rating }))
      : (tTestimonials.raw("items") as { quote: string; author: string }[]).map((it) => ({
          ...it,
          rating: 5,
        }));

  const reviewSchema =
    testimonialsForSchema.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CumbrePeak",
          review: testimonialsForSchema.map((r) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            author: { "@type": "Person", name: r.author },
            reviewBody: r.quote,
          })),
        }
      : null;

  return (
    <main className="bg-obsidian">
      <JsonLd data={faqSchema} />
      {reviewSchema && <JsonLd data={reviewSchema} />}
      <Navbar />
      <Hero content={content.hero} posterUrl={theme.heroPosterUrl} />
      <Philosophy content={content.philosophy} extended={content.philosophyExtended} />
      <WhyDifferent content={content.why} photoUrl={theme.whyPhotoUrl} />
      <Levels content={content.levels} expeditions={expeditions} />
      <Expeditions expeditions={expeditions} levels={levels} />
      <TrainingProgramTeaser
        content={content.trainingProgram}
        linkLabel={content.trainingProgram.linkLabel ?? "Подробнее"}
      />
      <Timeline content={content.timeline} />
      <Team members={teamMembers} />
      <Testimonials items={testimonials} />
      <Audience content={content.audience} />
      <ApplicationProcess content={content.process} />
      <FAQ items={faqItems} />
      <Contact expeditions={expeditions} backgroundPhotoUrl={theme.contactPhotoUrl} />
      <Footer />
    </main>
  );
}
