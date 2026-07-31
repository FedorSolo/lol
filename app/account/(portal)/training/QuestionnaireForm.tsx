"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { saveMyQuestionnaire, type QuestionnaireData } from "./actions";

export default function QuestionnaireForm({ initial }: { initial: QuestionnaireData }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-1.5";

  function set<K extends keyof QuestionnaireData>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSavedMsg(false);
  }

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveMyQuestionnaire(form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setSavedMsg(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Контакт для экстренной связи — имя</label>
          <input className={inputClass} value={form.emergency_contact_name} onChange={(e) => set("emergency_contact_name", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Контакт для экстренной связи — телефон</label>
          <input className={inputClass} value={form.emergency_contact_phone} onChange={(e) => set("emergency_contact_phone", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Рост (см)</label>
          <input type="number" className={inputClass} value={form.height_cm} onChange={(e) => set("height_cm", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Вес (кг)</label>
          <input type="number" className={inputClass} value={form.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Пульс покоя</label>
          <input type="number" className={inputClass} value={form.resting_heart_rate} onChange={(e) => set("resting_heart_rate", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Хронические заболевания</label>
        <textarea rows={2} className={`${inputClass} resize-none`} value={form.chronic_conditions} onChange={(e) => set("chronic_conditions", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Принимаемые лекарства</label>
        <textarea rows={2} className={`${inputClass} resize-none`} value={form.current_medications} onChange={(e) => set("current_medications", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Аллергии</label>
        <textarea rows={2} className={`${inputClass} resize-none`} value={form.allergies} onChange={(e) => set("allergies", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Как сейчас готовитесь (что и как часто тренируетесь)</label>
        <textarea rows={3} className={`${inputClass} resize-none`} value={form.recent_training_summary} onChange={(e) => set("recent_training_summary", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Максимальная высота, на которой уже бывали (м)</label>
        <input type="number" className={inputClass} value={form.longest_altitude_reached_m} onChange={(e) => set("longest_altitude_reached_m", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Дополнительно, что стоит знать команде</label>
        <textarea rows={2} className={`${inputClass} resize-none`} value={form.additional_notes} onChange={(e) => set("additional_notes", e.target.value)} />
      </div>

      {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
      {savedMsg && <p className="text-xs text-glacier-light">Сохранено</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="self-start inline-flex items-center gap-2 bg-snow text-obsidian px-5 py-2.5 text-sm hover:bg-glacier-light transition-colors disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        {saving ? "Сохранение…" : "Сохранить"}
      </button>
    </div>
  );
}
