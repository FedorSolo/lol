"use client";

import { useState } from "react";
import { Plus, Save, Trash2, RotateCcw } from "lucide-react";
import { saveSiteSetting, resetSiteSetting } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";
import type { SiteSettingsKey } from "@/lib/site-content-shared";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "Русский" },
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: { value: string; label: string }[];
}

export interface ArrayFieldConfig {
  key: string;
  label: string;
  itemFields: FieldConfig[];
}

export interface StringArrayFieldConfig {
  key: string;
  label: string;
}

export default function ContentBlockEditor({
  settingsKey,
  title,
  description,
  scalarFields,
  arrayField,
  stringArrayFields,
  initialValues,
}: {
  settingsKey: SiteSettingsKey;
  title: string;
  description?: string;
  scalarFields: FieldConfig[];
  arrayField?: ArrayFieldConfig;
  stringArrayFields?: StringArrayFieldConfig[];
  initialValues: Record<Locale, Record<string, any>>;
}) {
  const [values, setValues] = useState(initialValues);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-1.5";

  function updateScalar(key: string, val: string) {
    setValues((v) => ({ ...v, [locale]: { ...v[locale], [key]: val } }));
    setSavedMsg(false);
  }

  function updateArrayItem(index: number, fieldKey: string, val: string) {
    if (!arrayField) return;
    setValues((v) => {
      const items = [...(v[locale][arrayField.key] ?? [])];
      items[index] = { ...items[index], [fieldKey]: val };
      return { ...v, [locale]: { ...v[locale], [arrayField.key]: items } };
    });
    setSavedMsg(false);
  }

  function addArrayItem() {
    if (!arrayField) return;
    const blank = Object.fromEntries(arrayField.itemFields.map((f) => [f.key, ""]));
    setValues((v) => ({
      ...v,
      [locale]: { ...v[locale], [arrayField.key]: [...(v[locale][arrayField.key] ?? []), blank] },
    }));
  }

  function removeArrayItem(index: number) {
    if (!arrayField) return;
    setValues((v) => {
      const items = [...(v[locale][arrayField.key] ?? [])];
      items.splice(index, 1);
      return { ...v, [locale]: { ...v[locale], [arrayField.key]: items } };
    });
  }

  function updateStringArrayItem(fieldKey: string, index: number, val: string) {
    setValues((v) => {
      const items = [...((v[locale][fieldKey] as string[]) ?? [])];
      items[index] = val;
      return { ...v, [locale]: { ...v[locale], [fieldKey]: items } };
    });
    setSavedMsg(false);
  }

  function addStringArrayItem(fieldKey: string) {
    setValues((v) => ({
      ...v,
      [locale]: { ...v[locale], [fieldKey]: [...(((v[locale][fieldKey] as string[]) ?? [])), ""] },
    }));
  }

  function removeStringArrayItem(fieldKey: string, index: number) {
    setValues((v) => {
      const items = [...((v[locale][fieldKey] as string[]) ?? [])];
      items.splice(index, 1);
      return { ...v, [locale]: { ...v[locale], [fieldKey]: items } };
    });
  }

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveSiteSetting(settingsKey, values);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setSavedMsg(true);
  }

  async function handleReset() {
    if (!confirm("Сбросить блок к тексту по умолчанию? Ваши правки на всех языках будут удалены.")) return;
    const result = await resetSiteSetting(settingsKey);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="border border-white/10 p-6">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h3 className="font-display text-lg uppercase text-snow tracking-wide">{title}</h3>
        <button onClick={handleReset} className="text-xs text-mist hover:text-red-400 inline-flex items-center gap-1 shrink-0">
          <RotateCcw className="w-3.5 h-3.5" />
          Сбросить
        </button>
      </div>
      {description && <p className="text-xs text-mist mb-4">{description}</p>}

      <div className="flex gap-1 mb-5 border-b border-white/10">
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

      <div className="flex flex-col gap-4">
        {scalarFields.map((field) => (
          <div key={field.key}>
            <label className={labelClass}>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={values[locale]?.[field.key] ?? ""}
                onChange={(e) => updateScalar(field.key, e.target.value)}
              />
            ) : (
              <input
                className={inputClass}
                value={values[locale]?.[field.key] ?? ""}
                onChange={(e) => updateScalar(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {arrayField && (
        <div className="mt-6">
          <label className={labelClass}>{arrayField.label}</label>
          <div className="flex flex-col gap-3 mt-2">
            {(values[locale]?.[arrayField.key] ?? []).map((item: Record<string, string>, i: number) => (
              <div key={i} className="border border-white/10 p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 flex flex-col gap-2">
                    {arrayField.itemFields.map((f) =>
                      f.type === "textarea" ? (
                        <textarea
                          key={f.key}
                          rows={2}
                          placeholder={f.label}
                          className={`${inputClass} resize-none`}
                          value={item[f.key] ?? ""}
                          onChange={(e) => updateArrayItem(i, f.key, e.target.value)}
                        />
                      ) : f.type === "select" ? (
                        <select
                          key={f.key}
                          className={inputClass}
                          value={item[f.key] ?? ""}
                          onChange={(e) => updateArrayItem(i, f.key, e.target.value)}
                        >
                          <option value="" className="bg-obsidian">{f.label} — не выбрано</option>
                          {f.options?.map((o) => (
                            <option key={o.value} value={o.value} className="bg-obsidian">
                              {o.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          key={f.key}
                          placeholder={f.label}
                          className={inputClass}
                          value={item[f.key] ?? ""}
                          onChange={(e) => updateArrayItem(i, f.key, e.target.value)}
                        />
                      )
                    )}
                  </div>
                  <button
                    onClick={() => removeArrayItem(i)}
                    className="shrink-0 text-mist hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addArrayItem}
            className="mt-3 inline-flex items-center gap-2 border border-white/20 text-snow px-3 py-1.5 text-xs hover:border-glacier-light transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Добавить пункт
          </button>
        </div>
      )}

      {stringArrayFields?.map((field) => (
        <div key={field.key} className="mt-6">
          <label className={labelClass}>{field.label}</label>
          <div className="flex flex-col gap-2 mt-2">
            {((values[locale]?.[field.key] as string[]) ?? []).map((val: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={inputClass}
                  value={val}
                  onChange={(e) => updateStringArrayItem(field.key, i, e.target.value)}
                />
                <button
                  onClick={() => removeStringArrayItem(field.key, i)}
                  className="shrink-0 text-mist hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => addStringArrayItem(field.key)}
            className="mt-3 inline-flex items-center gap-2 border border-white/20 text-snow px-3 py-1.5 text-xs hover:border-glacier-light transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Добавить пункт
          </button>
        </div>
      ))}

      {errorMsg && <p className="text-xs text-red-400 mt-4">{errorMsg}</p>}
      {savedMsg && <p className="text-xs text-glacier-light mt-4">Сохранено</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 inline-flex items-center gap-2 bg-snow text-obsidian px-4 py-2 text-xs hover:bg-glacier-light transition-colors disabled:opacity-60"
      >
        <Save className="w-3.5 h-3.5" />
        {saving ? "Сохранение…" : "Сохранить"}
      </button>
    </div>
  );
}
