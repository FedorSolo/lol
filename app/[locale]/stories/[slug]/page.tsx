import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { getStoryBySlug, getAllPublishedStorySlugs } from "@/lib/stories-data";
import { coverImageFor } from "@/lib/expeditions-shared";
import PhotoLightboxGallery from "@/components/PhotoLightboxGallery";
import JsonLd from "@/components/JsonLd";
import { buildHreflangAlternates, SITE_URL } from "@/lib/site-url";
import type { Locale } from "@/lib/supabase/database.types";

export async function generateStaticParams() {
  const slugs = await getAllPublishedStorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const story = await getStoryBySlug(slug, locale as Locale);
  if (!story) return {};

  return {
    title: `${story.title}${story.year ? ` ${story.year}` : ""} | CUMBRE`,
    description: story.description ?? undefined,
    alternates: { languages: buildHreflangAlternates(`/stories/${slug}`) },
    openGraph: {
      title: story.title,
      description: story.description ?? undefined,
      images: story.coverUrl ? [story.coverUrl] : undefined,
      type: "article",
    },
  };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("stories");
  const story = await getStoryBySlug(slug, locale as Locale);

  if (!story) notFound();

  const cover = story.coverUrl ?? coverImageFor(slug.split("").reduce((s, c) => s + c.charCodeAt(0), 0));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "CUMBRE", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("pageTitle"), item: `${SITE_URL}/${locale}/stories` },
      { "@type": "ListItem", position: 3, name: story.title, item: `${SITE_URL}/${locale}/stories/${slug}` },
    ],
  };

  return (
    <main className="bg-obsidian">
      <JsonLd data={breadcrumbSchema} />
      <Navbar />

      <section className="relative h-[60vh] min-h-[420px] flex items-end">
        <img src={cover} alt={story.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/10" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 pb-14 w-full">
          <Link href="/stories" className="text-xs uppercase tracking-widest2 text-glacier-light">
            ← {t("backLink")}
          </Link>
          {story.year && (
            <div className="mt-4 font-mono text-sm text-glacier-light">{story.year}</div>
          )}
          <h1 className="mt-2 font-display font-bold uppercase text-4xl md:text-6xl text-snow">
            {story.title}
          </h1>
        </div>
      </section>

      {(story.description || story.expeditionTitle) && (
        <section className="max-w-3xl mx-auto px-6 md:px-10 py-16">
          {story.description && (
            <p className="text-mist text-base leading-relaxed">{story.description}</p>
          )}
          {story.expeditionSlug && (
            <div className="mt-8 flex items-center gap-3 text-sm">
              <span className="text-mist">{t("relatedExpedition")}:</span>
              <Link
                href={`/expeditions/${story.expeditionSlug}`}
                className="text-glacier-light hover:underline"
              >
                {story.expeditionTitle} — {t("viewExpedition")}
              </Link>
            </div>
          )}
        </section>
      )}

      {story.photoUrls.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
          <PhotoLightboxGallery photos={story.photoUrls} title={story.title} />
        </section>
      )}

      <Footer />
    </main>
  );
}
