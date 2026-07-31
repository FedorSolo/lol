import "server-only";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { PublicArticleSummary, PublicArticleDetail } from "./articles-shared";

export async function getPublicArticles(locale: Locale): Promise<PublicArticleSummary[]> {
  const supabase = createServerSupabaseClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (!articles || articles.length === 0) return [];

  const { data: i18n } = await supabase
    .from("articles_i18n")
    .select("*")
    .in(
      "article_id",
      articles.map((a) => a.id)
    )
    .eq("locale", locale);

  return articles
    .map((a) => {
      const t = i18n?.find((row) => row.article_id === a.id);
      if (!t) return null;
      return {
        id: a.id,
        slug: a.slug,
        title: t.title,
        excerpt: t.excerpt,
        coverUrl: a.cover_storage_path,
        authorName: a.author_name,
        publishedAt: a.published_at,
      };
    })
    .filter((a): a is PublicArticleSummary => a !== null);
}

export async function getArticleBySlug(slug: string, locale: Locale): Promise<PublicArticleDetail | null> {
  const supabase = createServerSupabaseClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) return null;

  const { data: t } = await supabase
    .from("articles_i18n")
    .select("*")
    .eq("article_id", article.id)
    .eq("locale", locale)
    .maybeSingle();

  if (!t) return null;

  return {
    id: article.id,
    slug: article.slug,
    title: t.title,
    excerpt: t.excerpt,
    coverUrl: article.cover_storage_path,
    authorName: article.author_name,
    publishedAt: article.published_at,
    content: t.content,
    metaTitle: t.meta_title,
    metaDescription: t.meta_description,
  };
}

export async function getAllPublishedArticleSlugs(): Promise<string[]> {
  // Cookie-free admin client on purpose — runs during build-time static
  // generation, before any request/cookie context exists.
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from("articles").select("slug").eq("is_published", true);
  return (data ?? []).map((row) => row.slug);
}
