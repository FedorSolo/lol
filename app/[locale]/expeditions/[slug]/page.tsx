import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Mountain,
  Gauge,
  CalendarDays,
  Users2,
  Wallet,
  ShieldCheck,
  Backpack,
  HeartPulse,
  Video,
  Check,
  X,
  Route as RouteIcon,
} from "lucide-react";
import PhotoLightboxGallery from "@/components/PhotoLightboxGallery";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { getExpeditionBySlug, getAllPublishedSlugs } from "@/lib/expeditions-data";
import { coverImageFor } from "@/lib/expeditions-shared";
import { buildHreflangAlternates, SITE_URL } from "@/lib/site-url";
import type { Locale } from "@/lib/supabase/database.types";

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

const FALLBACK_TITLE: Record<Locale, (t: string) => string> = {
  ru: (t) => `${t} — восхождение с полной подготовкой | CumbrePeak`,
  es: (t) => `${t} — ascenso con preparación completa | CumbrePeak`,
  en: (t) => `${t} — climb with full preparation | CumbrePeak`,
};

const FALLBACK_DESCRIPTION: Record<Locale, (t: string, alt: string) => string> = {
  ru: (t, alt) =>
    `Экспедиция на ${t}${alt ? ` (${alt})` : ""}: 8–10 недель физической подготовки, лицензированный горный гид, контроль здоровья и малые группы. Программа, требования и заявка на сайте CumbrePeak.`,
  es: (t, alt) =>
    `Expedición a ${t}${alt ? ` (${alt})` : ""}: 8–10 semanas de preparación física, guía de montaña con licencia, control médico y grupos pequeños. Programa, requisitos y postulación en CumbrePeak.`,
  en: (t, alt) =>
    `${t} expedition${alt ? ` (${alt})` : ""}: 8–10 weeks of physical preparation, a licensed mountain guide, medical monitoring, and small groups. Program, requirements, and application at CumbrePeak.`,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const expedition = await getExpeditionBySlug(slug, locale as Locale);
  if (!expedition) return {};

  const l = locale as Locale;
  const title = expedition.metaTitle || FALLBACK_TITLE[l](expedition.title);
  const description =
    expedition.metaDescription ||
    FALLBACK_DESCRIPTION[l](expedition.title, expedition.altitudeM ? `${expedition.altitudeM} м` : "");

  return {
    title,
    description,
    alternates: { languages: buildHreflangAlternates(`/expeditions/${slug}`) },
    openGraph: {
      title,
      description,
      images: expedition.coverUrl ? [expedition.coverUrl] : undefined,
      type: "website",
    },
  };
}

export default async function ExpeditionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("expeditionDetail");
  const expedition = await getExpeditionBySlug(slug, locale as Locale);

  if (!expedition) notFound();

  const cover =
    expedition.coverUrl ??
    coverImageFor(slug.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0));

  const inclusions =
    expedition.inclusions.length > 0
      ? expedition.inclusions
      : (t.raw("placeholder.inclusions") as string[]);
  const exclusions =
    expedition.exclusions.length > 0
      ? expedition.exclusions
      : (t.raw("placeholder.exclusions") as string[]);
  const itinerary =
    expedition.itinerary.length > 0
      ? expedition.itinerary.map((d) => ({ title: d.title, text: d.description ?? "" }))
      : (t.raw("placeholder.itinerary") as { title: string; text: string }[]);
  const equipment =
    expedition.equipment.length > 0
      ? expedition.equipment.map((e) => e.text)
      : (t.raw("placeholder.equipment") as string[]);
  const faq = t.raw("placeholder.faq") as { q: string; a: string }[];

  const stats = [
    { icon: Mountain, label: t("altitudeLabel"), value: expedition.altitudeM ? `${expedition.altitudeM.toLocaleString("ru-RU")} м` : "—" },
    { icon: Gauge, label: t("difficultyLabel"), value: expedition.difficultyName ?? "—" },
    { icon: CalendarDays, label: t("durationLabel"), value: expedition.durationDays ? `${expedition.durationDays} ${t("daysUnit")}` : "—" },
    { icon: Users2, label: t("groupSizeLabel"), value: expedition.groupSizeMax ? `${expedition.groupSizeMax} ${t("peopleUnit")}` : "—" },
    { icon: CalendarDays, label: t("seasonLabel"), value: expedition.bestSeason ?? "—" },
    { icon: Wallet, label: t("priceLabel"), value: expedition.priceFrom != null ? `${expedition.currency === "USD" ? "$" : expedition.currency} ${expedition.priceFrom.toLocaleString("ru-RU")}` : "—" },
  ];

  const pageUrl = `${SITE_URL}/${locale}/expeditions/${slug}`;

  const touristTripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: expedition.title,
    description: expedition.shortDescription ?? expedition.heroText ?? undefined,
    image: expedition.coverUrl ?? cover,
    url: pageUrl,
    provider: { "@type": "Organization", name: "CumbrePeak", url: SITE_URL },
    ...(expedition.priceFrom != null && {
      offers: {
        "@type": "Offer",
        price: expedition.priceFrom,
        priceCurrency: expedition.currency,
        url: pageUrl,
        availability: "https://schema.org/InStock",
      },
    }),
    ...(expedition.durationDays && { duration: `P${expedition.durationDays}D` }),
    itinerary: {
      "@type": "ItemList",
      itemListElement: itinerary.map((day, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: day.title,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "CumbrePeak", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: expedition.title, item: pageUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="bg-obsidian">
      <JsonLd data={touristTripSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <Navbar />

      {/* 1-3: Hero photo, title, strong short text */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end">
        <img src={cover} alt={expedition.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/10" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 pb-16 w-full">
          <Link href="/#expeditions" className="text-xs uppercase tracking-widest2 text-glacier-light">
            ← {t("backLink")}
          </Link>
          <h1 className="mt-4 font-display font-bold uppercase text-5xl md:text-7xl text-snow">
            {expedition.title}
          </h1>
          {expedition.shortDescription && (
            <p className="mt-4 max-w-2xl text-mist text-lg">{expedition.shortDescription}</p>
          )}
        </div>
      </section>

      {/* 4-9: difficulty, altitude, duration, season, group size, price */}
      <section className="bg-ash border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-6 gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <s.icon className="w-4 h-4 text-glacier-light mb-2" strokeWidth={1.5} />
              <div className="font-mono text-sm text-snow">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-mist mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {expedition.heroText && (
        <section className="max-w-3xl mx-auto px-6 md:px-10 py-16 text-mist text-base leading-relaxed">
          {expedition.heroText}
        </section>
      )}

      {/* 10-11: inclusions / exclusions */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display font-bold uppercase text-2xl text-snow mb-6">{t("inclusionsTitle")}</h2>
          <ul className="flex flex-col gap-3">
            {inclusions.map((item) => (
              <li key={item} className="flex items-start gap-3 text-mist text-sm">
                <Check className="w-4 h-4 text-glacier-light shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display font-bold uppercase text-2xl text-snow mb-6">{t("exclusionsTitle")}</h2>
          <ul className="flex flex-col gap-3">
            {exclusions.map((item) => (
              <li key={item} className="flex items-start gap-3 text-mist text-sm">
                <X className="w-4 h-4 text-mist shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 12: itinerary */}
      <section className="bg-ash py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2 className="font-display font-bold uppercase text-2xl text-snow mb-8">{t("itineraryTitle")}</h2>
          <div className="flex flex-col">
            {itinerary.map((day, i) => (
              <div key={day.title} className="flex gap-6 border-b border-white/10 py-5 last:border-0">
                <span className="font-mono text-glacier-light text-sm shrink-0 w-6">{i + 1}</span>
                <div>
                  <h3 className="text-snow font-medium">{day.title}</h3>
                  <p className="text-mist text-sm mt-1">{day.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13-14: route + altitude profile */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <div className="flex items-center gap-3 mb-6">
          <RouteIcon className="w-5 h-5 text-glacier-light" strokeWidth={1.5} />
          <h2 className="font-display font-bold uppercase text-2xl text-snow">{t("routeTitle")}</h2>
        </div>
        <p className="text-mist text-sm leading-relaxed">{t("routeText")}</p>

        <h3 className="font-display font-bold uppercase text-lg text-snow mt-10 mb-4">
          {t("altitudeProfileTitle")}
        </h3>
        <svg viewBox="0 0 600 160" className="w-full h-32" preserveAspectRatio="none">
          <polyline
            points="0,140 100,120 180,110 260,70 340,55 420,20 500,40 600,90"
            fill="none"
            stroke="#6FA0C2"
            strokeWidth="2"
          />
        </svg>
        <p className="text-xs text-mist/70 mt-2">{t("altitudeProfileNote")}</p>
      </section>

      {/* 15-16: fitness + experience requirements */}
      <section className="bg-ash py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display font-bold uppercase text-xl text-snow mb-4">{t("fitnessTitle")}</h2>
            <p className="text-mist text-sm leading-relaxed">
              {expedition.fitnessRequirements || t("fitnessFallback")}
            </p>
          </div>
          <div>
            <h2 className="font-display font-bold uppercase text-xl text-snow mb-4">{t("experienceTitle")}</h2>
            <p className="text-mist text-sm leading-relaxed">
              {expedition.experienceRequirements || t("experienceFallback")}
            </p>
          </div>
        </div>
      </section>

      {/* 17-19: preparation, training modes, medical control */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-16 flex flex-col gap-12">
        <div>
          <h2 className="font-display font-bold uppercase text-2xl text-snow mb-4">{t("preparationTitle")}</h2>
          <p className="text-mist text-sm leading-relaxed">
            {expedition.preparationText || t("preparationFallback")}
          </p>
        </div>
        <div className="flex gap-4">
          <Video className="w-5 h-5 text-glacier-light shrink-0 mt-1" strokeWidth={1.5} />
          <div>
            <h3 className="text-snow font-medium mb-2">{t("trainingModesTitle")}</h3>
            <p className="text-mist text-sm leading-relaxed">{t("trainingModesText")}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <HeartPulse className="w-5 h-5 text-glacier-light shrink-0 mt-1" strokeWidth={1.5} />
          <div>
            <h3 className="text-snow font-medium mb-2">{t("medicalControlTitle")}</h3>
            <p className="text-mist text-sm leading-relaxed">{t("medicalControlText")}</p>
          </div>
        </div>
      </section>

      {/* 20: equipment */}
      <section className="bg-ash py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-3 mb-6">
            <Backpack className="w-5 h-5 text-glacier-light" strokeWidth={1.5} />
            <h2 className="font-display font-bold uppercase text-2xl text-snow">{t("equipmentTitle")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {equipment.map((item) => (
              <div key={item} className="text-mist text-sm border border-white/10 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 21: gallery */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <h2 className="font-display font-bold uppercase text-2xl text-snow mb-6">{t("galleryTitle")}</h2>
        <PhotoLightboxGallery
          photos={
            expedition.galleryUrls.length > 0
              ? expedition.galleryUrls
              : [coverImageFor(1), coverImageFor(2), coverImageFor(3), coverImageFor(4)]
          }
          title={expedition.title}
        />
      </section>

      {/* 22: FAQ */}
      <section className="bg-ash py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2 className="font-display font-bold uppercase text-2xl text-snow mb-8">{t("faqTitle")}</h2>
          <div className="flex flex-col gap-6">
            {faq.map((item) => (
              <div key={item.q}>
                <h3 className="text-snow font-medium">{item.q}</h3>
                <p className="text-mist text-sm mt-1.5">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 23: CTA */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20 text-center">
        <ShieldCheck className="w-8 h-8 text-glacier-light mx-auto mb-5" strokeWidth={1.5} />
        <h2 className="font-display font-bold uppercase text-3xl md:text-4xl text-snow mb-8">
          {t("ctaTitle")}
        </h2>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 bg-snow text-obsidian px-8 py-4 text-sm tracking-wide font-medium hover:bg-glacier-light transition-colors"
        >
          {t("ctaButton")}
        </Link>
      </section>

      <Footer />
    </main>
  );
}
