import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { getPublicStories } from "@/lib/stories-data";
import { coverImageFor } from "@/lib/expeditions-shared";
import type { Locale } from "@/lib/supabase/database.types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });
  const suffix: Record<string, string> = {
    ru: "фото восхождений на Аконкагуа и другие вершины Анд",
    es: "fotos de ascensos al Aconcagua y otras cumbres de los Andes",
    en: "photos from Aconcagua climbs and other Andes summits",
  };
  return {
    title: `${t("pageTitle")} — ${suffix[locale] ?? suffix.en} | CUMBRE`,
    description: t("pageSubtitle"),
  };
}

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("stories");
  const stories = await getPublicStories(locale as Locale);

  return (
    <main className="bg-obsidian">
      <Navbar />

      <section className="pt-36 pb-20 max-w-7xl mx-auto px-6 md:px-10">
        <h1 className="font-display font-bold uppercase text-5xl md:text-6xl text-snow">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 max-w-xl text-mist">{t("pageSubtitle")}</p>

        {stories.length === 0 ? (
          <div className="mt-16 border border-white/10 py-20 text-center text-mist">
            {t("empty")}
          </div>
        ) : (
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group relative h-80 overflow-hidden border border-white/10 block"
              >
                <img
                  src={story.coverUrl ?? coverImageFor(i)}
                  alt={story.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  {story.year && (
                    <span className="font-mono text-xs text-glacier-light mb-2">{story.year}</span>
                  )}
                  <h2 className="font-display font-bold uppercase text-2xl text-snow">
                    {story.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
