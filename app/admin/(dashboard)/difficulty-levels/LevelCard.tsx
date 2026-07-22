"use client";

import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import { saveDifficultyLevel, deleteDifficultyLevel } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export interface LevelData {
  id?: string;
  slug: string;
  sort_order: number;
  i18n: Record<Locale, { name: string; description: string }>;
}

export default function LevelCard({ level, onSaved }: { level: LevelData; onSaved?: () => void }) {
  const [form, setForm] = useState(level);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await saveDifficultyLevel(form);
      onSaved?.();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!confirm("Удалить уровень сложности?")) return;
    await deleteDifficultyLevel(form.id);
    onSaved?.();
  }

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";

  return (
    <div className="border border-white/10 p-6">
      <div className="flex items-center gap-4 mb-5">
        <div className="flex-1">
          <label className="block text-xs uppercase tracking-wide text-mist mb-1.5">Slug</label>
          <input
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="level-1"
          />
        </div>
        <div className="w-28">
          <label className="block text-xs uppercase tracking-wide text-mist mb-1.5">Порядок</label>
          <input
            type="number"
            className={inputClass}
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
          />
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

      <div className="flex flex-col gap-3 mb-5">
        <input
          className={inputClass}
          placeholder="Название уровня"
          value={form.i18n[locale]?.name ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], name: e.target.value } } }))
          }
        />
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          placeholder="Описание уровня"
          value={form.i18n[locale]?.description ?? ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], description: e.target.value } },
            }))
          }
        />
      </div>

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
