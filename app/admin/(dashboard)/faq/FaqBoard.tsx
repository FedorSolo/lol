"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import FaqItemCard from "./FaqItemCard";
import type { FaqFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

function blankFaq(sortOrder: number): FaqFormData {
  return {
    sort_order: sortOrder,
    is_published: true,
    i18n: {
      ru: { question: "", answer: "" },
      es: { question: "", answer: "" },
      en: { question: "", answer: "" },
    } as Record<Locale, { question: string; answer: string }>,
  };
}

export default function FaqBoard({ items }: { items: FaqFormData[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<FaqFormData[]>([]);

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <FaqItemCard key={item.id} item={item} onSaved={() => router.refresh()} />
      ))}
      {drafts.map((draft, i) => (
        <FaqItemCard
          key={`draft-${i}`}
          item={draft}
          onSaved={() => {
            setDrafts((d) => d.filter((_, idx) => idx !== i));
            router.refresh();
          }}
        />
      ))}

      <button
        onClick={() => setDrafts((d) => [...d, blankFaq(items.length + d.length)])}
        className="inline-flex items-center gap-2 self-start border border-white/20 text-snow px-5 py-2.5 text-sm hover:border-glacier-light transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить вопрос
      </button>
    </div>
  );
}
