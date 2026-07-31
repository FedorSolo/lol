"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { ActionResult, ActionResultWithData } from "../action-result";
import { slugify } from "@/lib/slugify";

const LOCALES: Locale[] = ["ru", "es", "en"];

export async function getArticles() {
  const supabase = createAdminSupabaseClient();
  const { data: articles } = await supabase.from("articles").select("*").order("sort_order");
  const { data: i18n } = await supabase.from("articles_i18n").select("*");

  return (articles ?? []).map((a) => ({
    ...a,
    i18n: (i18n ?? []).filter((row) => row.article_id === a.id),
  }));
}

export interface ArticleFormData {
  id?: string;
  slug: string;
  cover_storage_path: string | null;
  author_name: string;
  is_published: boolean;
  published_at: string; // yyyy-mm-dd from <input type="date">
  sort_order: number;
  i18n: Record<
    Locale,
    { title: string; excerpt: string; content: string; meta_title: string; meta_description: string }
  >;
}

function friendlySlugError(message: string): string {
  if (message.includes("articles_slug_key") || message.includes("duplicate key")) {
    return "Такой slug уже используется другой статьёй — придумайте уникальный.";
  }
  return message;
}

export async function saveArticle(
  form: ArticleFormData
): Promise<ActionResultWithData<{ id: string }>> {
  const supabase = createAdminSupabaseClient();

  const anyTitle = form.i18n.ru.title || form.i18n.es.title || form.i18n.en.title;
  const normalizedSlug = slugify(form.slug) || slugify(anyTitle) || `article-${Date.now()}`;

  const payload = {
    slug: normalizedSlug,
    cover_storage_path: form.cover_storage_path,
    author_name: form.author_name || null,
    is_published: form.is_published,
    published_at: form.published_at || null,
    sort_order: form.sort_order,
  };

  let articleId = form.id;
  if (articleId) {
    const { error } = await supabase.from("articles").update(payload).eq("id", articleId);
    if (error) return { ok: false, error: friendlySlugError(error.message) };
  } else {
    const { data, error } = await supabase.from("articles").insert(payload).select("id").single();
    if (error) return { ok: false, error: friendlySlugError(error.message) };
    articleId = data.id;
  }

  for (const locale of LOCALES) {
    const t = form.i18n[locale];
    if (!t?.title) continue;
    const { error } = await supabase
      .from("articles_i18n")
      .upsert(
        {
          article_id: articleId,
          locale,
          title: t.title,
          excerpt: t.excerpt || null,
          content: t.content || "",
          meta_title: t.meta_title || null,
          meta_description: t.meta_description || null,
        },
        { onConflict: "article_id,locale" }
      );
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/[locale]/blog", "page");
  return { ok: true, data: { id: articleId } };
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/articles");
  revalidatePath("/[locale]/blog", "page");
  return { ok: true };
}
