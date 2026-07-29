"use client";

import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import { saveFaqItem, deleteFaqItem, type FaqFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export default function FaqItemCard({ item, onSaved }: { item: FaqFormData; onSaved: () => void }) {
  const [form, setForm] = useState(item);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-1.5";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    try {
      await saveFaqItem(form);
      onSaved();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!confirm("Удалить вопрос?")) return;
    await deleteFaqItem(form.id);
    onSaved();
  }

  return (
    <div className="border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 border-b border-white/10">
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
        <label className="flex items-center gap-2 text-xs text-snow">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
            className="w-3.5 h-3.5"
          />
          Опубликован
        </label>
      </div>

      <div className="mb-4">
        <label className={labelClass}>Вопрос</label>
        <input
          className={inputClass}
          value={form.i18n[locale]?.question ?? ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], question: e.target.value } },
            }))
          }
        />
      </div>
      <div className="mb-5">
        <label className={labelClass}>Ответ</label>
        <textarea
          rows={3}
          className={`${inputClass} resize-none`}
          value={form.i18n[locale]?.answer ?? ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], answer: e.target.value } },
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
