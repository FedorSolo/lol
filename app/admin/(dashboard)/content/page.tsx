import { getHomepageContent } from "@/lib/site-content-data";
import { getDifficultyLevels } from "../expeditions/actions";
import ContentEditor from "./ContentEditor";
import type { Locale } from "@/lib/supabase/database.types";
import BackToContentHub from "../BackToContentHub";

const LOCALES: Locale[] = ["ru", "es", "en"];

export default async function ContentPage() {
  const [content, difficultyLevels] = await Promise.all([
    Promise.all(LOCALES.map((l) => getHomepageContent(l))),
    getDifficultyLevels(),
  ]);
  const [ru, es, en] = content;

  const difficultyOptions = difficultyLevels.map((level) => ({
    value: level.id,
    label: level.i18n.find((i) => i.locale === "ru")?.name ?? level.id,
  }));

  return (
    <div>
      <BackToContentHub />
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-2">
        Тексты главной страницы
      </h1>
      <p className="text-mist text-sm max-w-lg mb-10">
        Сейчас показан текущий текст (либо ваш сохранённый, либо стандартный, если ещё не
        редактировали). Меняете что нужно в любом количестве блоков и жмёте одну кнопку «Сохранить
        всё» внизу экрана. «Сбросить» у отдельного блока вернёт именно его к исходному тексту на
        всех трёх языках.
      </p>

      <ContentEditor ru={ru as any} es={es as any} en={en as any} difficultyOptions={difficultyOptions} />
    </div>
  );
}
