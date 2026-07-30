"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import StoryCard, { type StoryPhotoRow, type ExpeditionOption } from "./StoryCard";
import type { StoryFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

function blankStory(sortOrder: number): StoryFormData {
  return {
    slug: "",
    year: new Date().getFullYear().toString(),
    expedition_id: "",
    cover_storage_path: null,
    is_published: true,
    sort_order: sortOrder,
    i18n: {
      ru: { title: "", description: "" },
      es: { title: "", description: "" },
      en: { title: "", description: "" },
    } as Record<Locale, { title: string; description: string }>,
  };
}

export default function StoriesBoard({
  stories,
  photosByStory,
  expeditions,
}: {
  stories: StoryFormData[];
  photosByStory: Record<string, StoryPhotoRow[]>;
  expeditions: ExpeditionOption[];
}) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<StoryFormData[]>([]);

  return (
    <div className="flex flex-col gap-6">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          photos={photosByStory[story.id!] ?? []}
          expeditions={expeditions}
          onSaved={() => router.refresh()}
        />
      ))}
      {drafts.map((draft, i) => (
        <StoryCard
          key={`draft-${i}`}
          story={draft}
          photos={[]}
          expeditions={expeditions}
          onSaved={() => {
            setDrafts((d) => d.filter((_, idx) => idx !== i));
            router.refresh();
          }}
        />
      ))}

      <button
        onClick={() => setDrafts((d) => [...d, blankStory(stories.length + d.length)])}
        className="inline-flex items-center gap-2 self-start border border-white/20 text-snow px-5 py-2.5 text-sm hover:border-glacier-light transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить историю
      </button>
    </div>
  );
}
