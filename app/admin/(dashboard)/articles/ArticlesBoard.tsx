"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import ArticleCard from "./ArticleCard";
import type { ArticleFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

const emptyI18n = { title: "", excerpt: "", content: "", meta_title: "", meta_description: "" };

function blankArticle(sortOrder: number): ArticleFormData {
  return {
    slug: "",
    cover_storage_path: null,
    author_name: "",
    is_published: false,
    published_at: new Date().toISOString().slice(0, 10),
    sort_order: sortOrder,
    i18n: {
      ru: { ...emptyI18n },
      es: { ...emptyI18n },
      en: { ...emptyI18n },
    } as Record<Locale, typeof emptyI18n>,
  };
}

export default function ArticlesBoard({ articles }: { articles: ArticleFormData[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<ArticleFormData[]>([]);

  return (
    <div className="flex flex-col gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} onSaved={() => router.refresh()} />
      ))}
      {drafts.map((draft, i) => (
        <ArticleCard
          key={`draft-${i}`}
          article={draft}
          onSaved={() => {
            setDrafts((d) => d.filter((_, idx) => idx !== i));
            router.refresh();
          }}
        />
      ))}

      <button
        onClick={() => setDrafts((d) => [...d, blankArticle(articles.length + d.length)])}
        className="inline-flex items-center gap-2 self-start border border-white/20 text-snow px-5 py-2.5 text-sm hover:border-glacier-light transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить статью
      </button>
    </div>
  );
}
