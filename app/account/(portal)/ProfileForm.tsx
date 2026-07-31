"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { updateMyPhone } from "./actions";

export default function ProfileForm({ initialPhone }: { initialPhone: string }) {
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    setSavedMsg(false);
    const result = await updateMyPhone(phone);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setSavedMsg(true);
  }

  return (
    <div>
      <label className="block text-sm text-mist mb-1.5">Телефон</label>
      <div className="flex gap-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 999 000-00-00"
          className="flex-1 bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 inline-flex items-center gap-1.5 bg-snow text-obsidian px-3 py-2 text-xs hover:bg-glacier-light transition-colors disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
        </button>
      </div>
      {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}
      {savedMsg && <p className="text-xs text-glacier-light mt-2">Сохранено</p>}
    </div>
  );
}
