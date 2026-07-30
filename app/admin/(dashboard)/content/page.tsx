import { getHomepageContent } from "@/lib/site-content-data";
import ContentBlockEditor from "./ContentBlockEditor";
import type { Locale } from "@/lib/supabase/database.types";
import BackToContentHub from "../BackToContentHub";

const LOCALES: Locale[] = ["ru", "es", "en"];

export default async function ContentPage() {
  const content = await Promise.all(LOCALES.map((l) => getHomepageContent(l)));
  const [ru, es, en] = content;

  return (
    <div>
      <BackToContentHub />
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-2">
        Тексты главной страницы
      </h1>
      <p className="text-mist text-sm max-w-lg mb-10">
        Сейчас показан текущий текст (либо ваш сохранённый, либо стандартный, если ещё не
        редактировали). Меняете — сохраняете — сайт обновляется. «Сбросить» вернёт блок к
        исходному тексту на всех трёх языках.
      </p>

      <div className="flex flex-col gap-8 max-w-3xl">
        <ContentBlockEditor
          settingsKey="home_hero"
          title="Hero (первый экран)"
          scalarFields={[
            { key: "eyebrow", label: "Надпись над заголовком" },
            { key: "line1", label: "Заголовок, строка 1" },
            { key: "line2", label: "Заголовок, строка 2" },
            { key: "line3", label: "Заголовок, строка 3" },
            { key: "subtitle", label: "Подзаголовок", type: "textarea" },
            { key: "applyButton", label: "Текст кнопки «Подать заявку»" },
            { key: "viewButton", label: "Текст кнопки «Смотреть экспедиции»" },
          ]}
          initialValues={{ ru: ru.hero, es: es.hero, en: en.hero } as any}
        />

        <ContentBlockEditor
          settingsKey="home_philosophy"
          title="Философия"
          scalarFields={[
            { key: "line1", label: "Строка 1" },
            { key: "line2", label: "Строка 2 (выделена цветом)" },
          ]}
          initialValues={{ ru: ru.philosophy, es: es.philosophy, en: en.philosophy } as any}
        />

        <ContentBlockEditor
          settingsKey="home_why"
          title="«Почему мы другие»"
          scalarFields={[
            { key: "eyebrow", label: "Надпись над заголовком" },
            { key: "title1", label: "Заголовок, строка 1" },
            { key: "title2", label: "Заголовок, строка 2" },
          ]}
          arrayField={{
            key: "items",
            label: "Карточки (иконки заданы в коде по порядку, лучше не менять число ниже 8)",
            itemFields: [
              { key: "title", label: "Заголовок карточки" },
              { key: "text", label: "Текст карточки", type: "textarea" },
            ],
          }}
          initialValues={{ ru: ru.why, es: es.why, en: en.why } as any}
        />

        <ContentBlockEditor
          settingsKey="home_timeline"
          title="Как устроена подготовка"
          scalarFields={[
            { key: "eyebrow", label: "Надпись над заголовком" },
            { key: "title1", label: "Заголовок, строка 1" },
            { key: "title2", label: "Заголовок, строка 2" },
          ]}
          arrayField={{
            key: "steps",
            label: "Шаги",
            itemFields: [
              { key: "label", label: "Метка (например «Неделя 1»)" },
              { key: "title", label: "Заголовок шага" },
              { key: "text", label: "Описание шага", type: "textarea" },
            ],
          }}
          initialValues={{ ru: ru.timeline, es: es.timeline, en: en.timeline } as any}
        />

        <ContentBlockEditor
          settingsKey="home_audience"
          title="«Кому это подходит»"
          scalarFields={[
            { key: "eyebrow", label: "Надпись над заголовком" },
            { key: "title1", label: "Заголовок, строка 1" },
            { key: "title2", label: "Заголовок, строка 2" },
          ]}
          arrayField={{
            key: "items",
            label: "Карточки (иконки заданы в коде по порядку, лучше не менять число ниже 6)",
            itemFields: [
              { key: "title", label: "Заголовок карточки" },
              { key: "text", label: "Текст карточки", type: "textarea" },
            ],
          }}
          initialValues={{ ru: ru.audience, es: es.audience, en: en.audience } as any}
        />

        <ContentBlockEditor
          settingsKey="home_process"
          title="Процесс отбора"
          scalarFields={[
            { key: "eyebrow", label: "Надпись над заголовком" },
            { key: "title1", label: "Заголовок, строка 1" },
            { key: "title2", label: "Заголовок, строка 2" },
            { key: "trustNote", label: "Текст о праве отклонить заявку", type: "textarea" },
          ]}
          arrayField={{
            key: "steps",
            label: "Шаги (нумерация — автоматически по порядку)",
            itemFields: [
              { key: "title", label: "Заголовок шага" },
              { key: "text", label: "Описание шага", type: "textarea" },
            ],
          }}
          initialValues={{ ru: ru.process, es: es.process, en: en.process } as any}
        />
      </div>
    </div>
  );
}
