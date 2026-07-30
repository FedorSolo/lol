"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import {
  saveItineraryDay,
  deleteItineraryDay,
  type ItineraryDayFormData,
} from "./content-actions";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

function blankDay(expeditionId: string, dayNumber: number): ItineraryDayFormData {
  return {
    expedition_id: expeditionId,
    day_number: dayNumber,
    sort_order: dayNumber,
    i18n: {
      ru: { title: "", description: "" },
      es: { title: "", description: "" },
      en: { title: "", description: "" },
    } as Record<Locale, { title: string; description: string }>,
  };
}

function DayCard({
  day,
  onSaved,
  onRemoved,
}: {
  day: ItineraryDayFormData;
  onSaved: (id: string) => void;
  onRemoved: () => void;
}) {
  const [form, setForm] = useState(day);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveItineraryDay(form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setForm((f) => ({ ...f, id: result.data.id }));
    onSaved(result.data.id);
  }

  async function handleDelete() {
    if (!form.id) {
      onRemoved();
      return;
    }
    if (!confirm("Удалить день программы?")) return;
    const result = await deleteItineraryDay(form.id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    onRemoved();
  }

  return (
    <div className="border border-white/10 p-4">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-20">
          <label className="block text-[11px] uppercase tracking-wide text-mist mb-1">День №</label>
          <input
            type="number"
            className={inputClass}
            value={form.day_number}
            onChange={(e) => setForm((f) => ({ ...f, day_number: Number(e.target.value) }))}
          />
        </div>
        <div className="flex gap-1 mt-4">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code)}
              className={`px-2.5 py-1 text-xs border-b-2 ${
                locale === l.code ? "border-glacier-light text-snow" : "border-transparent text-mist"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <input
        className={`${inputClass} mb-2`}
        placeholder="Заголовок дня, например «Заброска к базовому лагерю»"
        value={form.i18n[locale]?.title ?? ""}
        onChange={(e) =>
          setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], title: e.target.value } } }))
        }
      />
      <textarea
        rows={2}
        className={`${inputClass} resize-none`}
        placeholder="Описание дня"
        value={form.i18n[locale]?.description ?? ""}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], description: e.target.value } },
          }))
        }
      />

      {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-snow text-obsidian px-3 py-1.5 text-xs hover:bg-glacier-light transition-colors disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "…" : "Сохранить"}
        </button>
        <button onClick={handleDelete} className="text-mist hover:text-red-400">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ItineraryManager({
  expeditionId,
  initialDays,
}: {
  expeditionId: string;
  initialDays: ItineraryDayFormData[];
}) {
  const [days, setDays] = useState(initialDays);

  function addDay() {
    const nextNumber = days.length > 0 ? Math.max(...days.map((d) => d.day_number)) + 1 : 1;
    setDays((d) => [...d, blankDay(expeditionId, nextNumber)]);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {days.map((day, i) => (
          <DayCard
            key={day.id ?? `new-${i}`}
            day={day}
            onSaved={() => {}}
            onRemoved={() => setDays((d) => d.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
      <button
        onClick={addDay}
        className="mt-4 inline-flex items-center gap-2 border border-white/20 text-snow px-4 py-2 text-xs hover:border-glacier-light transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Добавить день
      </button>
    </div>
  );
}
