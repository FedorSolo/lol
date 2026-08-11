"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  saveItineraryDay,
  deleteItineraryDay,
  type ItineraryDayFormData,
} from "./content-actions";
import type { Locale } from "@/lib/supabase/database.types";
import type { RowHandle, ManagerHandle } from "./save-handle-types";

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

const DayCard = forwardRef<
  RowHandle,
  { day: ItineraryDayFormData; onRemoved: () => void }
>(function DayCard({ day, onRemoved }, ref) {
  const [form, setForm] = useState(day);
  const [locale, setLocale] = useState<Locale>("ru");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    save: async () => {
      setErrorMsg(null);
      const result = await saveItineraryDay(form);
      if (!result.ok) {
        setErrorMsg(result.error);
        return { ok: false, error: `День ${form.day_number}: ${result.error}` };
      }
      setForm((f) => ({ ...f, id: result.data.id }));
      return { ok: true };
    },
  }));

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";

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
        <button onClick={handleDelete} className="text-mist hover:text-red-400" title="Удалить день">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

const ItineraryManager = forwardRef<
  ManagerHandle,
  { expeditionId: string; initialDays: ItineraryDayFormData[] }
>(function ItineraryManager({ expeditionId, initialDays }, ref) {
  const [days, setDays] = useState(initialDays);
  const rowRefs = useRef<Map<string, RowHandle>>(new Map());

  useImperativeHandle(ref, () => ({
    saveAll: async () => {
      const errors: string[] = [];
      for (const handle of rowRefs.current.values()) {
        const result = await handle.save();
        if (!result.ok && result.error) errors.push(result.error);
      }
      return { ok: errors.length === 0, errors };
    },
  }));

  function addDay() {
    const nextNumber = days.length > 0 ? Math.max(...days.map((d) => d.day_number)) + 1 : 1;
    setDays((d) => [...d, blankDay(expeditionId, nextNumber)]);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {days.map((day, i) => {
          const key = day.id ?? `new-${i}`;
          return (
            <DayCard
              key={key}
              ref={(el) => {
                if (el) rowRefs.current.set(key, el);
                else rowRefs.current.delete(key);
              }}
              day={day}
              onRemoved={() => {
                rowRefs.current.delete(key);
                setDays((d) => d.filter((_, idx) => idx !== i));
              }}
            />
          );
        })}
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
});

export default ItineraryManager;
