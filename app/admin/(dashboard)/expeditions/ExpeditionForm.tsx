"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { upsertExpedition, type ExpeditionFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "Русский" },
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

interface DifficultyLevel {
  id: string;
  i18n: { locale: string; name: string }[];
}

const emptyI18n = {
  title: "",
  short_description: "",
  hero_text: "",
  fitness_requirements: "",
  experience_requirements: "",
  preparation_text: "",
  meta_title: "",
  meta_description: "",
};

export default function ExpeditionForm({
  initial,
  levels,
}: {
  initial?: {
    expedition: Record<string, any>;
    i18n: Record<
      Locale,
      {
        title: string;
        short_description: string | null;
        hero_text: string | null;
        fitness_requirements: string | null;
        experience_requirements: string | null;
        preparation_text: string | null;
        meta_title: string | null;
        meta_description: string | null;
      } | null
    >;
  };
  levels: DifficultyLevel[];
}) {
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<ExpeditionFormData>({
    id: initial?.expedition.id,
    slug: initial?.expedition.slug ?? "",
    difficulty_level_id: initial?.expedition.difficulty_level_id ?? "",
    country: initial?.expedition.country ?? "",
    altitude_m: initial?.expedition.altitude_m?.toString() ?? "",
    duration_days: initial?.expedition.duration_days?.toString() ?? "",
    group_size_min: initial?.expedition.group_size_min?.toString() ?? "",
    group_size_max: initial?.expedition.group_size_max?.toString() ?? "",
    price_from: initial?.expedition.price_from?.toString() ?? "",
    currency: initial?.expedition.currency ?? "USD",
    best_season: initial?.expedition.best_season ?? "",
    is_published: initial?.expedition.is_published ?? false,
    sort_order: initial?.expedition.sort_order?.toString() ?? "0",
    i18n: {
      ru: initial?.i18n.ru
        ? {
            title: initial.i18n.ru.title,
            short_description: initial.i18n.ru.short_description ?? "",
            hero_text: initial.i18n.ru.hero_text ?? "",
            fitness_requirements: initial.i18n.ru.fitness_requirements ?? "",
            experience_requirements: initial.i18n.ru.experience_requirements ?? "",
            preparation_text: initial.i18n.ru.preparation_text ?? "",
            meta_title: initial.i18n.ru.meta_title ?? "",
            meta_description: initial.i18n.ru.meta_description ?? "",
          }
        : { ...emptyI18n },
      es: initial?.i18n.es
        ? {
            title: initial.i18n.es.title,
            short_description: initial.i18n.es.short_description ?? "",
            hero_text: initial.i18n.es.hero_text ?? "",
            fitness_requirements: initial.i18n.es.fitness_requirements ?? "",
            experience_requirements: initial.i18n.es.experience_requirements ?? "",
            preparation_text: initial.i18n.es.preparation_text ?? "",
            meta_title: initial.i18n.es.meta_title ?? "",
            meta_description: initial.i18n.es.meta_description ?? "",
          }
        : { ...emptyI18n },
      en: initial?.i18n.en
        ? {
            title: initial.i18n.en.title,
            short_description: initial.i18n.en.short_description ?? "",
            hero_text: initial.i18n.en.hero_text ?? "",
            fitness_requirements: initial.i18n.en.fitness_requirements ?? "",
            experience_requirements: initial.i18n.en.experience_requirements ?? "",
            preparation_text: initial.i18n.en.preparation_text ?? "",
            meta_title: initial.i18n.en.meta_title ?? "",
            meta_description: initial.i18n.en.meta_description ?? "",
          }
        : { ...emptyI18n },
    },
  });

  function updateField<K extends keyof ExpeditionFormData>(key: K, value: ExpeditionFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateI18n(locale: Locale, key: keyof (typeof emptyI18n), value: string) {
    setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], [key]: value } } }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    const result = await upsertExpedition(form);
    if (!result.ok) {
      setErrorMsg(result.error);
      setSaving(false);
      return;
    }
    router.push("/admin/expeditions");
    router.refresh();
  }

  const inputClass =
    "w-full bg-transparent border border-white/20 px-4 py-2.5 text-snow placeholder:text-mist/50 focus:border-glacier-light outline-none transition-colors text-sm";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-2";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <section className="grid sm:grid-cols-2 gap-5 mb-10">
        <div>
          <label className={labelClass}>
            Slug (одинаковый для всех языков — латиница, автоматически приведётся к безопасному виду)
          </label>
          <input
            required
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="aconcagua"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Уровень сложности</label>
          <select
            value={form.difficulty_level_id}
            onChange={(e) => updateField("difficulty_level_id", e.target.value)}
            className={inputClass}
          >
            <option value="" className="bg-obsidian">— не выбрано —</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id} className="bg-obsidian">
                {level.i18n.find((i) => i.locale === "ru")?.name ?? level.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Страна</label>
          <input value={form.country} onChange={(e) => updateField("country", e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Высота (м)</label>
          <input
            type="number"
            value={form.altitude_m}
            onChange={(e) => updateField("altitude_m", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Длительность (дней)</label>
          <input
            type="number"
            value={form.duration_days}
            onChange={(e) => updateField("duration_days", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Лучший сезон</label>
          <input
            value={form.best_season}
            onChange={(e) => updateField("best_season", e.target.value)}
            placeholder="Декабрь – февраль"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Группа: мин / макс</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={form.group_size_min}
              onChange={(e) => updateField("group_size_min", e.target.value)}
              className={inputClass}
            />
            <input
              type="number"
              value={form.group_size_max}
              onChange={(e) => updateField("group_size_max", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Цена от / валюта</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={form.price_from}
              onChange={(e) => updateField("price_from", e.target.value)}
              className={inputClass}
            />
            <input
              value={form.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className={`${inputClass} w-24`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-7">
          <input
            id="is_published"
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => updateField("is_published", e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="is_published" className="text-sm text-snow">
            Опубликовано на сайте
          </label>
        </div>
      </section>

      <section>
        <div className="flex gap-1 mb-5 border-b border-white/10">
          {LOCALES.map((l) => (
            <button
              type="button"
              key={l.code}
              onClick={() => setActiveLocale(l.code)}
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
                activeLocale === l.code
                  ? "border-glacier-light text-snow"
                  : "border-transparent text-mist hover:text-snow"
              }`}
            >
              {l.label}
              {!form.i18n[l.code].title && <span className="ml-1.5 text-red-400">•</span>}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Название</label>
            <input
              required={activeLocale === "ru"}
              value={form.i18n[activeLocale].title}
              onChange={(e) => updateI18n(activeLocale, "title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Короткое описание (для карточки)</label>
            <textarea
              rows={2}
              value={form.i18n[activeLocale].short_description}
              onChange={(e) => updateI18n(activeLocale, "short_description", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Текст на hero детальной страницы</label>
            <textarea
              rows={3}
              value={form.i18n[activeLocale].hero_text}
              onChange={(e) => updateI18n(activeLocale, "hero_text", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Требования к физической подготовке</label>
            <textarea
              rows={3}
              value={form.i18n[activeLocale].fitness_requirements}
              onChange={(e) => updateI18n(activeLocale, "fitness_requirements", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Требования к опыту</label>
            <textarea
              rows={3}
              value={form.i18n[activeLocale].experience_requirements}
              onChange={(e) => updateI18n(activeLocale, "experience_requirements", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Как проходит подготовка</label>
            <textarea
              rows={4}
              value={form.i18n[activeLocale].preparation_text}
              onChange={(e) => updateI18n(activeLocale, "preparation_text", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </section>

      <section className="mt-10 pt-8 border-t border-white/10">
        <p className="font-mono text-xs tracking-widest2 uppercase text-glacier-light mb-4">
          SEO ({activeLocale.toUpperCase()})
        </p>
        <div className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Meta title (заголовок в поиске, до ~60 символов)</label>
            <input
              value={form.i18n[activeLocale].meta_title}
              onChange={(e) => updateI18n(activeLocale, "meta_title", e.target.value)}
              placeholder="Восхождение на Аконкагуа — экспедиция с полной подготовкой | CumbrePeak"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Meta description (описание в поиске, до ~160 символов)</label>
            <textarea
              rows={2}
              value={form.i18n[activeLocale].meta_description}
              onChange={(e) => updateI18n(activeLocale, "meta_description", e.target.value)}
              placeholder="Экспедиция на Аконкагуа с 8-недельной физической подготовкой, лицензированным горным гидом и контролем здоровья. Узнайте программу и подайте заявку."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </section>

      {errorMsg && <p className="mt-6 text-sm text-red-400">{errorMsg}</p>}

      <div className="mt-10 flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-snow text-obsidian px-6 py-3 text-sm tracking-wide font-medium hover:bg-glacier-light transition-colors disabled:opacity-60"
        >
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/expeditions")}
          className="border border-white/20 text-snow px-6 py-3 text-sm hover:border-glacier-light transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
