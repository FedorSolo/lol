"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { saveEquipment, deleteEquipment, type EquipmentFormData } from "./content-actions";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

const CATEGORIES = [
  { value: "clothing", label: "Одежда" },
  { value: "footwear", label: "Обувь" },
  { value: "gear", label: "Снаряжение" },
  { value: "documents", label: "Документы" },
  { value: "other", label: "Другое" },
];

function blank(expeditionId: string, sortOrder: number): EquipmentFormData {
  return {
    expedition_id: expeditionId,
    category: "gear",
    is_rentable: false,
    sort_order: sortOrder,
    i18n: {
      ru: { text: "" },
      es: { text: "" },
      en: { text: "" },
    } as Record<Locale, { text: string }>,
  };
}

function ItemRow({
  item,
  onRemoved,
}: {
  item: EquipmentFormData;
  onRemoved: () => void;
}) {
  const [form, setForm] = useState(item);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "bg-transparent border border-white/20 px-2 py-1.5 text-snow text-xs focus:border-glacier-light outline-none transition-colors";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveEquipment(form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setForm((f) => ({ ...f, id: result.data.id }));
  }

  async function handleDelete() {
    if (!form.id) {
      onRemoved();
      return;
    }
    const result = await deleteEquipment(form.id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    onRemoved();
  }

  return (
    <div className="border border-white/10 p-3">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="flex gap-1 shrink-0">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code)}
              className={`px-2 py-1 text-[11px] border-b-2 ${
                locale === l.code ? "border-glacier-light text-snow" : "border-transparent text-mist"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <input
          className={`${inputClass} flex-1 min-w-[160px]`}
          value={form.i18n[locale]?.text ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { text: e.target.value } } }))
          }
        />
        <select
          className={inputClass}
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} className="bg-obsidian">
              {c.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-mist shrink-0">
          <input
            type="checkbox"
            checked={form.is_rentable}
            onChange={(e) => setForm((f) => ({ ...f, is_rentable: e.target.checked }))}
            className="w-3.5 h-3.5"
          />
          Есть в аренду
        </label>
        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 p-1.5 bg-snow text-obsidian hover:bg-glacier-light transition-colors disabled:opacity-50"
          title="Сохранить"
        >
          <Save className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleDelete} className="shrink-0 text-mist hover:text-red-400 p-1.5" title="Удалить">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
    </div>
  );
}

export default function EquipmentManager({
  expeditionId,
  initialItems,
}: {
  expeditionId: string;
  initialItems: EquipmentFormData[];
}) {
  const [items, setItems] = useState(initialItems);

  return (
    <div>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <ItemRow
            key={item.id ?? `new-${i}`}
            item={item}
            onRemoved={() => setItems((d) => d.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
      <button
        onClick={() => setItems((d) => [...d, blank(expeditionId, d.length)])}
        className="mt-3 inline-flex items-center gap-2 border border-white/20 text-snow px-4 py-2 text-xs hover:border-glacier-light transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Добавить пункт снаряжения
      </button>
    </div>
  );
}
