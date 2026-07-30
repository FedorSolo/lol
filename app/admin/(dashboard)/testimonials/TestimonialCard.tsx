"use client";

import { useState } from "react";
import { Trash2, Save, Star } from "lucide-react";
import ImageUploadField from "../ImageUploadField";
import { saveTestimonial, deleteTestimonial, type TestimonialFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export interface ExpeditionOption {
  id: string;
  title: string;
}

export default function TestimonialCard({
  testimonial,
  expeditions,
  onSaved,
}: {
  testimonial: TestimonialFormData;
  expeditions: ExpeditionOption[];
  onSaved: () => void;
}) {
  const [form, setForm] = useState(testimonial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-1.5";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveTestimonial(form);
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
    if (!confirm("Удалить отзыв?")) return;
    const result = await deleteTestimonial(form.id);
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
          folder="testimonials"
          value={form.author_photo_url}
          onChange={(url) => setForm((f) => ({ ...f, author_photo_url: url }))}
          shape="circle"
        />

        <div className="flex-1 min-w-[220px] grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Имя автора</label>
            <input
              className={inputClass}
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Экспедиция (необязательно)</label>
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

        <div>
          <label className={labelClass}>Оценка</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
                className="p-0.5"
              >
                <Star
                  className={`w-5 h-5 ${n <= form.rating ? "text-glacier-light" : "text-white/20"}`}
                  fill={n <= form.rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
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
            Опубликован
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
        <label className={labelClass}>Текст отзыва</label>
        <textarea
          rows={3}
          className={`${inputClass} resize-none`}
          value={form.i18n[locale]?.quote ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], quote: e.target.value } } }))
          }
        />
      </div>
      <div className="mb-5">
        <label className={labelClass}>Подпись (например «Аконкагуа, 2025»)</label>
        <input
          className={inputClass}
          value={form.i18n[locale]?.role_context ?? ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], role_context: e.target.value } },
            }))
          }
        />
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
