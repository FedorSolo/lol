"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2, AlertTriangle } from "lucide-react";
import ContentBlockEditor from "./ContentBlockEditor";
import type { Locale } from "@/lib/supabase/database.types";
import type { RowHandle } from "../expeditions/save-handle-types";

export default function ContentEditor({
  ru,
  es,
  en,
  difficultyOptions,
}: {
  ru: Record<string, any>;
  es: Record<string, any>;
  en: Record<string, any>;
  difficultyOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; errors: string[] } | null>(null);

  const refs = {
    hero: useRef<RowHandle>(null),
    philosophy: useRef<RowHandle>(null),
    why: useRef<RowHandle>(null),
    levels: useRef<RowHandle>(null),
    trainingProgram: useRef<RowHandle>(null),
    timeline: useRef<RowHandle>(null),
    audience: useRef<RowHandle>(null),
    process: useRef<RowHandle>(null),
    philosophyExtended: useRef<RowHandle>(null),
  };

  async function handleSaveAll() {
    setSaving(true);
    setResult(null);
    const errors: string[] = [];

    for (const ref of Object.values(refs)) {
      const r = await ref.current?.save();
      if (r && !r.ok && r.error) errors.push(r.error);
    }

    setSaving(false);
    setResult({ ok: errors.length === 0, errors });
    router.refresh();

    if (errors.length === 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="pb-32">
      <div className="flex flex-col gap-8 max-w-3xl">
        <ContentBlockEditor
          ref={refs.hero}
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
          ref={refs.philosophy}
          settingsKey="home_philosophy"
          title="Философия"
          scalarFields={[
            { key: "line1", label: "Строка 1" },
            { key: "line2", label: "Строка 2 (выделена цветом)" },
          ]}
          initialValues={{ ru: ru.philosophy, es: es.philosophy, en: en.philosophy } as any}
        />

        <ContentBlockEditor
          ref={refs.why}
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
          ref={refs.levels}
          settingsKey="home_levels"
          title="«Три уровня. Один путь.»"
          description="Каждый уровень можно связать с реальным «уровнем сложности» — тогда на сайте под описанием уровня покажутся подходящие экспедиции."
          scalarFields={[
            { key: "eyebrow", label: "Надпись над заголовком" },
            { key: "title", label: "Заголовок" },
          ]}
          arrayField={{
            key: "levels",
            label: "Уровни (обычно 3)",
            itemFields: [
              { key: "number", label: "Номер (например «01»)" },
              { key: "subtitle", label: "Подпись (например «Level 1»)" },
              { key: "title", label: "Заголовок уровня" },
              { key: "text", label: "Описание уровня", type: "textarea" },
              {
                key: "difficultyLevelId",
                label: "Связанный уровень сложности (для показа экспедиций)",
                type: "select",
                options: difficultyOptions,
              },
            ],
          }}
          initialValues={{ ru: ru.levels, es: es.levels, en: en.levels } as any}
        />

        <ContentBlockEditor
          ref={refs.trainingProgram}
          settingsKey="home_training_program"
          title="Программа подготовки"
          scalarFields={[
            { key: "title1", label: "Заголовок, строка 1" },
            { key: "title2", label: "Заголовок, строка 2 (выделена цветом)" },
            { key: "intro", label: "Вступительный текст", type: "textarea" },
            { key: "onlineTitle", label: "Заголовок блока «Онлайн-подготовка»" },
            { key: "onlineIntro", label: "Текст перед списком онлайн-подготовки", type: "textarea" },
            { key: "closing", label: "Заключительный текст", type: "textarea" },
          ]}
          stringArrayFields={[
            { key: "skills", label: "Что мы помогаем развить (список)" },
            { key: "onlineItems", label: "Что входит в онлайн-подготовку (список)" },
          ]}
          initialValues={{ ru: ru.trainingProgram, es: es.trainingProgram, en: en.trainingProgram } as any}
        />

        <ContentBlockEditor
          ref={refs.timeline}
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
          ref={refs.audience}
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
          ref={refs.process}
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

        <ContentBlockEditor
          ref={refs.philosophyExtended}
          settingsKey="home_philosophy_extended"
          title="«Наша философия» (в конце страницы)"
          scalarFields={[{ key: "title", label: "Надпись над текстом" }]}
          stringArrayFields={[{ key: "paragraphs", label: "Абзацы (каждый — отдельным пунктом)" }]}
          initialValues={
            { ru: ru.philosophyExtended, es: es.philosophyExtended, en: en.philosophyExtended } as any
          }
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-obsidian/95 backdrop-blur border-t border-white/10 px-6 py-4 z-40">
        <div className="max-w-3xl flex items-center gap-4">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-snow text-obsidian px-6 py-3 text-sm tracking-wide font-medium hover:bg-glacier-light transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? "Сохранение…" : "Сохранить всё"}
          </button>

          {result && result.ok && (
            <span className="inline-flex items-center gap-1.5 text-glacier-light text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Всё сохранено
            </span>
          )}
          {result && !result.ok && (
            <div className="flex items-start gap-1.5 text-red-400 text-xs max-h-16 overflow-y-auto">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                {result.errors.map((e, i) => (
                  <div key={i}>{e}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
