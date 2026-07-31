import { getArticles } from "./actions";
import ArticlesBoard from "./ArticlesBoard";
import BackToContentHub from "../BackToContentHub";
import type { ArticleFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

const emptyI18n = { title: "", excerpt: "", content: "", meta_title: "", meta_description: "" };

export default async function ArticlesPage() {
  const rows = await getArticles();

  const data: ArticleFormData[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    cover_storage_path: row.cover_storage_path,
    author_name: row.author_name ?? "",
    is_published: row.is_published,
    published_at: row.published_at ? row.published_at.slice(0, 10) : "",
    sort_order: row.sort_order,
    i18n: {
      ru: row.i18n.find((r) => r.locale === "ru") ?? { ...emptyI18n },
      es: row.i18n.find((r) => r.locale === "es") ?? { ...emptyI18n },
      en: row.i18n.find((r) => r.locale === "en") ?? { ...emptyI18n },
    } as Record<Locale, typeof emptyI18n>,
  }));

  return (
    <div>
      <BackToContentHub />
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-4">Статьи</h1>
      <p className="text-mist text-sm max-w-lg mb-8">
        Появляются в блоге на сайте. Текст поддерживает базовый Markdown.
      </p>
      <ArticlesBoard articles={data} />
    </div>
  );
}
