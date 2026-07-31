"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import {
  saveExpeditionUpdate,
  deleteExpeditionUpdate,
  type ExpeditionUpdateFormData,
} from "./content-actions";

function blankUpdate(expeditionId: string): ExpeditionUpdateFormData {
  return {
    expedition_id: expeditionId,
    title: "",
    body: "",
    is_published: true,
    published_at: new Date().toISOString().slice(0, 10),
    sort_order: 0,
  };
}

function UpdateCard({
  update,
  onSaved,
  onRemoved,
}: {
  update: ExpeditionUpdateFormData;
  onSaved: () => void;
  onRemoved: () => void;
}) {
  const [form, setForm] = useState(update);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveExpeditionUpdate(form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setForm((f) => ({ ...f, id: result.data.id }));
    onSaved();
  }

  async function handleDelete() {
    if (!form.id) {
      onRemoved();
      return;
    }
    if (!confirm("Удалить новость?")) return;
    const result = await deleteExpeditionUpdate(form.id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    onRemoved();
  }

  return (
    <div className="border border-white/10 p-4">
      <div className="flex items-center gap-4 mb-3">
        <input
          type="date"
          className={`${inputClass} w-auto`}
          value={form.published_at}
          onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`pub-${form.id ?? "new"}`}
            checked={form.is_published}
            onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
            className="w-4 h-4"
          />
          <label htmlFor={`pub-${form.id ?? "new"}`} className="text-sm text-snow">
            Видна клиентам
          </label>
        </div>
      </div>

      <input
        className={`${inputClass} mb-2`}
        placeholder="Заголовок новости"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
      />
      <textarea
        rows={3}
        className={`${inputClass} resize-none`}
        placeholder="Текст новости — что изменилось, что нужно знать перед вылетом и т.п."
        value={form.body}
        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
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

export default function UpdatesManager({
  expeditionId,
  initialUpdates,
}: {
  expeditionId: string;
  initialUpdates: ExpeditionUpdateFormData[];
}) {
  const [updates, setUpdates] = useState(initialUpdates);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {updates.map((u, i) => (
          <UpdateCard
            key={u.id ?? `new-${i}`}
            update={u}
            onSaved={() => {}}
            onRemoved={() => setUpdates((d) => d.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
      <button
        onClick={() => setUpdates((d) => [blankUpdate(expeditionId), ...d])}
        className="mt-4 inline-flex items-center gap-2 border border-white/20 text-snow px-4 py-2 text-xs hover:border-glacier-light transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Добавить новость
      </button>
    </div>
  );
}
