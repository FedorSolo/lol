"use client";

import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import { saveTeamMember, deleteTeamMember, type TeamMemberFormData } from "./actions";
import ImageUploadField from "../ImageUploadField";
import type { Locale } from "@/lib/supabase/database.types";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export default function TeamMemberCard({
  member,
  onSaved,
}: {
  member: TeamMemberFormData;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(member);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-1.5";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveTeamMember(form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    onSaved();
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!confirm("Удалить участника команды?")) return;
    const result = await deleteTeamMember(form.id);
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
          folder="team"
          value={form.storage_path}
          onChange={(url) => setForm((f) => ({ ...f, storage_path: url }))}
          shape="circle"
        />

        <div className="flex-1 min-w-[200px] grid sm:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Лет опыта</label>
            <input
              type="number"
              className={inputClass}
              value={form.years_experience}
              onChange={(e) => setForm((f) => ({ ...f, years_experience: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Доп. показатель (число)</label>
            <input
              className={inputClass}
              placeholder="50+"
              value={form.stat_secondary_value}
              onChange={(e) => setForm((f) => ({ ...f, stat_secondary_value: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Подпись показателя</label>
            <input
              className={inputClass}
              placeholder="восхождений"
              value={form.stat_secondary_label_key}
              onChange={(e) => setForm((f) => ({ ...f, stat_secondary_label_key: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Instagram (ссылка)</label>
            <input
              className={inputClass}
              placeholder="https://instagram.com/..."
              value={form.instagram_url}
              onChange={(e) => setForm((f) => ({ ...f, instagram_url: e.target.value }))}
            />
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

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>Имя</label>
          <input
            className={inputClass}
            value={form.i18n[locale]?.name ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], name: e.target.value } } }))
            }
          />
        </div>
        <div>
          <label className={labelClass}>Роль</label>
          <input
            className={inputClass}
            value={form.i18n[locale]?.role ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], role: e.target.value } } }))
            }
          />
        </div>
      </div>
      <div className="mb-5">
        <label className={labelClass}>Биография</label>
        <textarea
          rows={2}
          className={`${inputClass} resize-none`}
          value={form.i18n[locale]?.bio ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], bio: e.target.value } } }))
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
