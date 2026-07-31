import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { getPublicArticles } from "@/lib/articles-data";
import { coverImageFor } from "@/lib/expeditions-shared";
import { buildHreflangAlternates } from "@/lib/site-url";
import type { Locale } from "@/lib/supabase/database.types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: `${t("pageTitle")} — CUMBRE`,
    description: t("pageSubtitle"),
    alternates: { languages: buildHreflangAlternates("/blog") },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const articles = await getPublicArticles(locale as Locale);

  return (
    <main className="bg-obsidian">
      <Navbar />

      <section className="pt-36 pb-20 max-w-7xl mx-auto px-6 md:px-10">
        <h1 className="font-display font-bold uppercase text-5xl md:text-6xl text-snow">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 max-w-xl text-mist">{t("pageSubtitle")}</p>

        {articles.length === 0 ? (
          <div className="mt-16 border border-white/10 py-20 text-center text-mist">
            {t("empty")}
          </div>
        ) : (
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group border border-white/10 flex flex-col hover:border-glacier-light/40 transition-colors"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={article.coverUrl ?? coverImageFor(i)}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {article.publishedAt && (
                    <span className="font-mono text-xs text-glacier-light mb-2">
                      {new Date(article.publishedAt).toLocaleDateString(locale)}
                    </span>
                  )}
                  <h2 className="font-display font-bold uppercase text-xl text-snow mb-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-mist text-sm leading-relaxed">{article.excerpt}</p>
                  )}
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
