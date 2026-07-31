import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { getArticleBySlug, getAllPublishedArticleSlugs } from "@/lib/articles-data";
import { coverImageFor } from "@/lib/expeditions-shared";
import { buildHreflangAlternates, SITE_URL } from "@/lib/site-url";
import type { Locale } from "@/lib/supabase/database.types";

// Allows <iframe> (for pasted YouTube/Vimeo embed codes) on top of the
// default safe HTML tag list. Content only ever comes from the admin
// panel (never from public visitors), so this isn't a public XSS surface
// — sanitizing is still worthwhile defense in depth against a compromised
// admin session or a copy-pasted embed code with unexpected attributes.
const MARKDOWN_HTML_SCHEMA = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "iframe"],
  attributes: {
    ...defaultSchema.attributes,
    iframe: [
      "src",
      "width",
      "height",
      "frameBorder",
      "allow",
      "allowFullScreen",
      "title",
      "referrerPolicy",
    ],
  },
};

export async function generateStaticParams() {
  const slugs = await getAllPublishedArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale as Locale);
  if (!article) return {};

  const title = article.metaTitle || `${article.title} | CUMBRE`;
  const description = article.metaDescription || article.excerpt || undefined;

  return {
    title,
    description,
    alternates: { languages: buildHreflangAlternates(`/blog/${slug}`) },
    openGraph: {
      title,
      description,
      images: article.coverUrl ? [article.coverUrl] : undefined,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const article = await getArticleBySlug(slug, locale as Locale);

  if (!article) notFound();

  const cover = article.coverUrl ?? coverImageFor(slug.split("").reduce((s, c) => s + c.charCodeAt(0), 0));
  const pageUrl = `${SITE_URL}/${locale}/blog/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    image: cover,
    url: pageUrl,
    ...(article.publishedAt && { datePublished: article.publishedAt }),
    ...(article.authorName && { author: { "@type": "Person", name: article.authorName } }),
    publisher: { "@type": "Organization", name: "CUMBRE", url: SITE_URL },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "CUMBRE", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("pageTitle"), item: `${SITE_URL}/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: pageUrl },
    ],
  };

  return (
    <main className="bg-obsidian">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navbar />

      <section className="relative h-[55vh] min-h-[380px] flex items-end">
        <img src={cover} alt={article.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/10" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 pb-14 w-full">
          <Link href="/blog" className="text-xs uppercase tracking-widest2 text-glacier-light">
            ← {t("backLink")}
          </Link>
          <h1 className="mt-4 font-display font-bold uppercase text-3xl md:text-5xl text-snow">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 font-mono text-xs text-mist">
            {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString(locale)}</span>}
            {article.authorName && (
              <span>
                {t("byAuthor")}: {article.authorName}
              </span>
            )}
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, [rehypeSanitize, MARKDOWN_HTML_SCHEMA]]}
          components={{
            h1: (props) => <h2 className="font-display font-bold uppercase text-2xl text-snow mt-10 mb-4" {...props} />,
            h2: (props) => <h2 className="font-display font-bold uppercase text-2xl text-snow mt-10 mb-4" {...props} />,
            h3: (props) => <h3 className="font-display font-bold uppercase text-xl text-snow mt-8 mb-3" {...props} />,
            p: (props) => <p className="text-mist text-base leading-relaxed mb-5" {...props} />,
            a: (props) => <a className="text-glacier-light hover:underline" {...props} />,
            ul: (props) => <ul className="list-disc list-inside text-mist text-base leading-relaxed mb-5 space-y-1" {...props} />,
            ol: (props) => <ol className="list-decimal list-inside text-mist text-base leading-relaxed mb-5 space-y-1" {...props} />,
            blockquote: (props) => (
              <blockquote className="border-l-2 border-glacier-light pl-4 italic text-snow my-6" {...props} />
            ),
            img: (props) => <img className="w-full my-6" loading="lazy" {...props} />,
            iframe: (props) => (
              <span className="block relative w-full my-6 aspect-video">
                <iframe {...props} className="absolute inset-0 w-full h-full" />
              </span>
            ),
            strong: (props) => <strong className="text-snow font-semibold" {...props} />,
          }}
        >
          {article.content}
        </ReactMarkdown>
      </article>

      <Footer />
    </main>
  );
}
