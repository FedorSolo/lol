"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import type { Locale } from "@/lib/supabase/database.types";
import type { ActionResult, ActionResultWithData } from "../action-result";

interface ItemFormData {
  id?: string;
  expedition_id: string;
  sort_order: number;
  i18n: Record<Locale, { text: string }>;
}

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

function blankItem(expeditionId: string, sortOrder: number): ItemFormData {
  return {
    expedition_id: expeditionId,
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
  onSave,
  onDelete,
  onRemoved,
}: {
  item: ItemFormData;
  onSave: (form: ItemFormData) => Promise<ActionResultWithData<{ id: string }>>;
  onDelete: (id: string) => Promise<ActionResult>;
  onRemoved: () => void;
}) {
  const [form, setForm] = useState(item);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "flex-1 bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await onSave(form);
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
    const result = await onDelete(form.id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    onRemoved();
  }

  return (
    <div className="border border-white/10 p-3">
      <div className="flex items-center gap-3">
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
          className={inputClass}
          value={form.i18n[locale]?.text ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { text: e.target.value } } }))
          }
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 p-2 bg-snow text-obsidian hover:bg-glacier-light transition-colors disabled:opacity-60"
          title="Сохранить"
        >
          <Save className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleDelete} className="shrink-0 text-mist hover:text-red-400 p-2" title="Удалить">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}
    </div>
  );
}

export default function SimpleListManager({
  expeditionId,
  initialItems,
  addLabel,
  save,
  remove,
}: {
  expeditionId: string;
  initialItems: ItemFormData[];
  addLabel: string;
  save: (form: ItemFormData) => Promise<ActionResultWithData<{ id: string }>>;
  remove: (id: string) => Promise<ActionResult>;
}) {
  const [items, setItems] = useState(initialItems);

  return (
    <div>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <ItemRow
            key={item.id ?? `new-${i}`}
            item={item}
            onSave={save}
            onDelete={remove}
            onRemoved={() => setItems((d) => d.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
      <button
        onClick={() => setItems((d) => [...d, blankItem(expeditionId, d.length)])}
        className="mt-3 inline-flex items-center gap-2 border border-white/20 text-snow px-4 py-2 text-xs hover:border-glacier-light transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {addLabel}
      </button>
    </div>
  );
}
