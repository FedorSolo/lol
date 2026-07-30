"use client";

import { useState, useTransition } from "react";
import { Trash2, Save, X, Star } from "lucide-react";
import ImageUploadField from "../ImageUploadField";
import {
  saveStory,
  deleteStory,
  addStoryPhoto,
  deleteStoryPhoto,
  setStoryCover,
  type StoryFormData,
} from "./actions";
import { slugify } from "@/lib/slugify";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export interface StoryPhotoRow {
  id: string;
  storage_path: string;
}

export interface ExpeditionOption {
  id: string;
  title: string;
}

export default function StoryCard({
  story,
  photos: initialPhotos,
  expeditions,
  onSaved,
}: {
  story: StoryFormData;
  photos: StoryPhotoRow[];
  expeditions: ExpeditionOption[];
  onSaved: () => void;
}) {
  const [form, setForm] = useState(story);
  const [photos, setPhotos] = useState(initialPhotos);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-1.5";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);

    const anyTitle = form.i18n.ru.title || form.i18n.es.title || form.i18n.en.title;
    const finalSlug = form.slug.trim() || slugify(anyTitle || `story-${Date.now()}`);
    const submission = { ...form, slug: finalSlug };

    const result = await saveStory(submission);
    setSaving(false);

    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }

    setForm({ ...submission, id: result.data.id });
    onSaved();
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!confirm("Удалить историю?")) return;
    const result = await deleteStory(form.id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    onSaved();
  }

  async function handleAddPhoto(url: string | null) {
    if (!url || !form.id) return;
    const result = await addStoryPhoto(form.id, url);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    const isFirst = photos.length === 0;
    setPhotos((p) => [...p, { id: `temp-${Date.now()}`, storage_path: url }]);
    if (isFirst) setForm((f) => ({ ...f, cover_storage_path: url }));
  }

  function handleSetCover(url: string) {
    if (!form.id) return;
    startTransition(async () => {
      const result = await setStoryCover(form.id!, url);
      if (!result.ok) {
        alert(result.error);
        return;
      }
      setForm((f) => ({ ...f, cover_storage_path: url }));
    });
  }

  function handleDeletePhoto(photoId: string) {
    startTransition(async () => {
      const result = await deleteStoryPhoto(photoId);
      if (!result.ok) {
        alert(result.error);
        return;
      }
      setPhotos((p) => p.filter((ph) => ph.id !== photoId));
    });
  }

  return (
    <div className="border border-white/10 p-6">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className={labelClass}>Slug (необязательно — сгенерируем из названия)</label>
          <input
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="aconcagua-2026"
          />
        </div>
        <div>
          <label className={labelClass}>Год</label>
          <input
            type="number"
            className={inputClass}
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass}>Экспедиция</label>
          <select
            className={inputClass}
            value={form.expedition_id}
            onChange={(e) => setForm((f) => ({ ...f, expedition_id: e.target.value }))}
          >
            <option value="" className="bg-obsidian">— не выбрано —</option>
            {expeditions.map((exp) => (
              <option key={exp.id} value={exp.id} className="bg-obsidian">
                {exp.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
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
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className={labelClass}>Название</label>
        <input
          className={inputClass}
          value={form.i18n[locale]?.title ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], title: e.target.value } } }))
          }
        />
      </div>
      <div className="mb-6">
        <label className={labelClass}>Описание</label>
        <textarea
          rows={2}
          className={`${inputClass} resize-none`}
          value={form.i18n[locale]?.description ?? ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], description: e.target.value } },
            }))
          }
        />
      </div>

      {errorMsg && <p className="text-xs text-red-400 mb-4">{errorMsg}</p>}

      <div className="flex items-center gap-3 mb-8">
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

      {form.id ? (
        <div>
          <label className={labelClass}>
            Фотографии истории — нажмите на звёздочку, чтобы сделать фото обложкой
          </label>
          <div className="flex flex-wrap gap-3 mt-2">
            {photos.map((photo) => {
              const isCover = form.cover_storage_path === photo.storage_path;
              return (
                <div key={photo.id} className="relative w-24 h-24 group">
                  <img src={photo.storage_path} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleSetCover(photo.storage_path)}
                      disabled={pending}
                      title="Сделать обложкой"
                      className={`p-1.5 border ${isCover ? "border-glacier-light text-glacier-light" : "border-white/40 text-snow"}`}
                    >
                      <Star className="w-3.5 h-3.5" fill={isCover ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      disabled={pending}
                      title="Удалить"
                      className="p-1.5 border border-white/40 text-snow hover:border-red-400 hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {isCover && (
                    <span className="absolute top-1 left-1 bg-glacier-light text-obsidian text-[9px] uppercase px-1.5 py-0.5">
                      Обложка
                    </span>
                  )}
                </div>
              );
            })}
            <ImageUploadField folder="stories" value={null} onChange={handleAddPhoto} />
          </div>
        </div>
      ) : (
        <p className="text-xs text-mist">Сохраните историю, чтобы добавить к ней фотографии.</p>
      )}
    </div>
  );
}
