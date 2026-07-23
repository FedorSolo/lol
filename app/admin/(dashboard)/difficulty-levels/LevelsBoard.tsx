"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import LevelCard, { type LevelData } from "./LevelCard";
import type { Locale } from "@/lib/supabase/database.types";

const emptyI18n = { name: "", description: "" };

function blankLevel(sortOrder: number): LevelData {
  return {
    slug: "",
    sort_order: sortOrder,
    i18n: { ru: { ...emptyI18n }, es: { ...emptyI18n }, en: { ...emptyI18n } } as Record<
      Locale,
      { name: string; description: string }
    >,
  };
}

export default function LevelsBoard({ levels }: { levels: LevelData[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<LevelData[]>([]);

  function addDraft() {
    setDrafts((d) => [...d, blankLevel(levels.length + d.length)]);
  }

  return (
    <div className="flex flex-col gap-6">
      {levels.map((level) => (
        <LevelCard key={level.id} level={level} onSaved={() => router.refresh()} />
      ))}
      {drafts.map((draft, i) => (
        <LevelCard
          key={`draft-${i}`}
          level={draft}
          onSaved={() => {
            setDrafts((d) => d.filter((_, idx) => idx !== i));
            router.refresh();
          }}
        />
      ))}

      <button
        onClick={addDraft}
        className="inline-flex items-center gap-2 self-start border border-white/20 text-snow px-5 py-2.5 text-sm hover:border-glacier-light transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить уровень
      </button>
    </div>
  );
}
