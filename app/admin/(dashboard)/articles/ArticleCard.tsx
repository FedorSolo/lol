"use client";

import { useRef, useState } from "react";
import { Trash2, Save, ImagePlus, ChevronDown, ChevronUp } from "lucide-react";
import ImageUploadField from "../ImageUploadField";
import { uploadMedia } from "../upload-actions";
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
  const [insertingPhoto, setInsertingPhoto] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const contentRefs = useRef<Partial<Record<Locale, HTMLTextAreaElement | null>>>({});
  const inlinePhotoInputRef = useRef<HTMLInputElement>(null);

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

  // Inserts markdown at the cursor position in the currently active
  // locale's content textarea (falls back to appending at the end).
  function insertIntoContent(snippet: string) {
    const el = contentRefs.current[locale];
    const current = form.i18n[locale]?.content ?? "";
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;
    const next = `${current.slice(0, start)}\n\n${snippet}\n\n${current.slice(end)}`;

    setForm((f) => ({
      ...f,
      i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], content: next } },
    }));
  }

  async function handleInlinePhotoUpload(file: File) {
    setInsertingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "articles");
    const result = await uploadMedia(formData);
    setInsertingPhoto(false);
    if ("error" in result) {
      alert(result.error);
      return;
    }
    insertIntoContent(`![описание фото](${result.url})`);
  }

  return (
    <div className="border border-white/10 p-6">
      <div className="mb-6">
        <label className={labelClass}>Обложка статьи</label>
        <ImageUploadField
          folder="articles"
          value={form.cover_storage_path}
          onChange={(url) => setForm((f) => ({ ...f, cover_storage_path: url }))}
          shape="wide"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className={labelClass}>Slug (необязательно)</label>
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
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass.replace("mb-1.5", "")}>Текст статьи</label>
            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              className="text-xs text-glacier-light hover:underline inline-flex items-center gap-1"
            >
              Как форматировать текст
              {showHelp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showHelp && (
            <div className="border border-white/10 bg-ash/50 p-4 mb-3 text-xs text-mist leading-relaxed">
              <p className="text-snow font-medium mb-2">Заголовки и текст</p>
              <ul className="mb-3 space-y-1">
                <li><code className="text-glacier-light">## Заголовок</code> — крупный заголовок раздела</li>
                <li><code className="text-glacier-light">### Подзаголовок</code> — заголовок поменьше</li>
                <li><code className="text-glacier-light">**жирный текст**</code> — <strong>жирный текст</strong></li>
                <li><code className="text-glacier-light">*курсив*</code> — курсив</li>
                <li><code className="text-glacier-light">- пункт списка</code> — маркированный список (по одному пункту на строку)</li>
                <li><code className="text-glacier-light">1. пункт списка</code> — нумерованный список</li>
                <li><code className="text-glacier-light">[текст ссылки](https://...)</code> — ссылка</li>
                <li><code className="text-glacier-light">&gt; цитата</code> — выделенная цитата</li>
                <li>Пустая строка между абзацами — так текст разбивается на отдельные абзацы</li>
              </ul>
              <p className="text-snow font-medium mb-2">Фото внутри текста</p>
              <p className="mb-3">
                Нажмите кнопку «Вставить фото» ниже — фото загрузится и автоматически вставится в
                то место текста, где стоит курсор.
              </p>
              <p className="text-snow font-medium mb-2">Видео внутри текста</p>
              <p>
                На YouTube: «Поделиться» → «Встроить» → скопируйте код (начинается с
                <code className="text-glacier-light"> &lt;iframe...</code>) и вставьте его прямо в
                текст статьи в нужном месте, на отдельной строке.
              </p>
            </div>
          )}

          <textarea
            ref={(el) => {
              contentRefs.current[locale] = el;
            }}
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

          <input
            ref={inlinePhotoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleInlinePhotoUpload(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inlinePhotoInputRef.current?.click()}
            disabled={insertingPhoto}
            className="mt-2 inline-flex items-center gap-1.5 text-xs border border-white/20 text-snow px-3 py-1.5 hover:border-glacier-light transition-colors disabled:opacity-50"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            {insertingPhoto ? "Загрузка…" : "Вставить фото в текст"}
          </button>
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
