import { getStories, getExpeditionsForPicker } from "./actions";
import StoriesBoard from "./StoriesBoard";
import type { StoryFormData } from "./actions";
import type { StoryPhotoRow } from "./StoryCard";
import type { Locale } from "@/lib/supabase/database.types";
import BackToContentHub from "../BackToContentHub";

export default async function StoriesPage() {
  const [stories, expeditions] = await Promise.all([getStories(), getExpeditionsForPicker()]);

  const data: StoryFormData[] = stories.map((s) => ({
    id: s.id,
    slug: s.slug,
    year: s.year?.toString() ?? "",
    expedition_id: s.expedition_id ?? "",
    cover_storage_path: s.cover_storage_path,
    is_published: s.is_published,
    sort_order: s.sort_order,
    i18n: {
      ru: s.i18n.find((r) => r.locale === "ru") ?? { title: "", description: "" },
      es: s.i18n.find((r) => r.locale === "es") ?? { title: "", description: "" },
      en: s.i18n.find((r) => r.locale === "en") ?? { title: "", description: "" },
    } as Record<Locale, { title: string; description: string }>,
  }));

  const photosByStory: Record<string, StoryPhotoRow[]> = {};
  for (const s of stories) {
    photosByStory[s.id] = s.photos.map((p) => ({ id: p.id, storage_path: p.storage_path }));
  }

  return (
    <div>
      <BackToContentHub />
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-4">
        Истории экспедиций
      </h1>
      <p className="text-mist text-sm max-w-lg mb-8">
        Отдельные фотоистории — например, «Аконкагуа 2026» — с обложкой, описанием и своей
        галереей. Можно привязать к конкретной экспедиции или оставить свободной.
      </p>
      <StoriesBoard stories={data} photosByStory={photosByStory} expeditions={expeditions} />
    </div>
  );
}
