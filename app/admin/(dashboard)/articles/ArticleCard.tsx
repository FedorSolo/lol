"use client";

import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import ImageUploadField from "../ImageUploadField";
import { saveArticle, deleteArticle, type ArticleFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export default function ArticleCard({
  article,
  onSaved,
}: {
  article: ArticleFormData;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(article);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-1.5";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveArticle(form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setForm((f) => ({ ...f, id: result.data.id }));
    onSaved();
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!confirm("Удалить статью?")) return;
    const result = await deleteArticle(form.id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    onSaved();
  }

  return (
    <div className="border border-white/10 p-6">
      <div className="flex flex-wrap items-start gap-6 mb-6">
        <ImageUploadField
          folder="articles"
          value={form.cover_storage_path}
          onChange={(url) => setForm((f) => ({ ...f, cover_storage_path: url }))}
          shape="wide"
        />

        <div className="flex-1 min-w-[240px] grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Slug (необязательно — сгенерируем из названия)</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="kak-podgotovitsya-k-aconcagua"
            />
          </div>
          <div>
            <label className={labelClass}>Автор</label>
            <input
              className={inputClass}
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Дата публикации</label>
            <input
              type="date"
              className={inputClass}
              value={form.published_at}
              onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id={`pub-${form.id ?? "new"}`}
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor={`pub-${form.id ?? "new"}`} className="text-sm text-snow">
              Опубликована
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-4 border-b border-white/10">
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            className={`px-3 py-1.5 text-xs border-b-2 -mb-px ${
              locale === l.code ? "border-glacier-light text-snow" : "border-transparent text-mist"
            }`}
          >
            {l.label}
            {!form.i18n[l.code].title && <span className="ml-1.5 text-red-400">•</span>}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className={labelClass}>Название</label>
          <input
            className={inputClass}
            value={form.i18n[locale]?.title ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], title: e.target.value } } }))
            }
          />
        </div>
        <div>
          <label className={labelClass}>Краткое описание (для карточки в списке)</label>
          <textarea
            rows={2}
            className={`${inputClass} resize-none`}
            value={form.i18n[locale]?.excerpt ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], excerpt: e.target.value } },
              }))
            }
          />
        </div>
        <div>
          <label className={labelClass}>
            Текст статьи (Markdown — ## для заголовка, **жирный**, списки через -)
          </label>
          <textarea
            rows={12}
            className={`${inputClass} resize-y font-mono text-xs`}
            value={form.i18n[locale]?.content ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], content: e.target.value } },
              }))
            }
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-5 mb-6">
        <p className="font-mono text-xs tracking-widest2 uppercase text-glacier-light mb-4">
          SEO ({locale.toUpperCase()})
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Meta title</label>
            <input
              className={inputClass}
              value={form.i18n[locale]?.meta_title ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], meta_title: e.target.value } },
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>Meta description</label>
            <textarea
              rows={2}
              className={`${inputClass} resize-none`}
              value={form.i18n[locale]?.meta_description ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], meta_description: e.target.value } },
                }))
              }
            />
          </div>
        </div>
      </div>

      {errorMsg && <p className="text-xs text-red-400 mb-3">{errorMsg}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-snow text-obsidian px-4 py-2 text-xs hover:bg-glacier-light transition-colors disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
        {form.id && (
          <button onClick={handleDelete} className="text-mist hover:text-red-400">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
