"use client";

import { useState, useTransition } from "react";
import { Trash2, Save, X } from "lucide-react";
import ImageUploadField from "../ImageUploadField";
import {
  saveStory,
  deleteStory,
  addStoryPhoto,
  deleteStoryPhoto,
  type StoryFormData,
} from "./actions";
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
    try {
      const id = await saveStory(form);
      setForm((f) => ({ ...f, id }));
      onSaved();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!confirm("Удалить историю?")) return;
    await deleteStory(form.id);
    onSaved();
  }

  async function handleAddPhoto(url: string | null) {
    if (!url || !form.id) return;
    await addStoryPhoto(form.id, url);
    setPhotos((p) => [...p, { id: `temp-${Date.now()}`, storage_path: url }]);
  }

  function handleDeletePhoto(photoId: string) {
    startTransition(async () => {
      await deleteStoryPhoto(photoId);
      setPhotos((p) => p.filter((ph) => ph.id !== photoId));
    });
  }

  return (
    <div className="border border-white/10 p-6">
      <div className="flex flex-wrap items-start gap-6 mb-6">
        <ImageUploadField
          folder="stories"
          value={form.cover_storage_path}
          onChange={(url) => setForm((f) => ({ ...f, cover_storage_path: url }))}
          shape="wide"
        />

        <div className="flex-1 min-w-[240px] grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Slug</label>
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

        <div className="flex items-center gap-2 pt-1">
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

      {form.id ? (
        <div className="mb-6">
          <label className={labelClass}>Фотографии истории</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative w-20 h-20 group">
                <img src={photo.storage_path} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  disabled={pending}
                  className="absolute -top-2 -right-2 bg-obsidian border border-white/20 text-snow p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <ImageUploadField folder="stories" value={null} onChange={handleAddPhoto} />
          </div>
        </div>
      ) : (
        <p className="text-xs text-mist mb-6">Сохраните историю, чтобы добавить к ней фотографии.</p>
      )}

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
