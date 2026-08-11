"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Locale } from "@/lib/supabase/database.types";
import type { ActionResult, ActionResultWithData } from "@/lib/action-result";
import type { RowHandle, ManagerHandle } from "./save-handle-types";

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

const ItemRow = forwardRef<
  RowHandle,
  {
    item: ItemFormData;
    onSave: (form: ItemFormData) => Promise<ActionResultWithData<{ id: string }>>;
    onDelete: (id: string) => Promise<ActionResult>;
    onRemoved: () => void;
  }
>(function ItemRow({ item, onSave, onDelete, onRemoved }, ref) {
  const [form, setForm] = useState(item);
  const [locale, setLocale] = useState<Locale>("ru");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    save: async () => {
      setErrorMsg(null);
      const result = await onSave(form);
      if (!result.ok) {
        setErrorMsg(result.error);
        return { ok: false, error: result.error };
      }
      setForm((f) => ({ ...f, id: result.data.id }));
      return { ok: true };
    },
  }));

  const inputClass =
    "flex-1 bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";

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
        <button onClick={handleDelete} className="shrink-0 text-mist hover:text-red-400 p-2" title="Удалить">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}
    </div>
  );
});

const SimpleListManager = forwardRef<
  ManagerHandle,
  {
    expeditionId: string;
    initialItems: ItemFormData[];
    addLabel: string;
    save: (form: ItemFormData) => Promise<ActionResultWithData<{ id: string }>>;
    remove: (id: string) => Promise<ActionResult>;
  }
>(function SimpleListManager({ expeditionId, initialItems, addLabel, save, remove }, ref) {
  const [items, setItems] = useState(initialItems);
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

  return (
    <div>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const key = item.id ?? `new-${i}`;
          return (
            <ItemRow
              key={key}
              ref={(el) => {
                if (el) rowRefs.current.set(key, el);
                else rowRefs.current.delete(key);
              }}
              item={item}
              onSave={save}
              onDelete={remove}
              onRemoved={() => {
                rowRefs.current.delete(key);
                setItems((d) => d.filter((_, idx) => idx !== i));
              }}
            />
          );
        })}
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
});

export default SimpleListManager;
