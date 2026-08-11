"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  saveExpeditionUpdate,
  deleteExpeditionUpdate,
  type ExpeditionUpdateFormData,
} from "./content-actions";
import type { RowHandle, ManagerHandle } from "./save-handle-types";

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

const UpdateCard = forwardRef<
  RowHandle,
  { update: ExpeditionUpdateFormData; onRemoved: () => void }
>(function UpdateCard({ update, onRemoved }, ref) {
  const [form, setForm] = useState(update);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    save: async () => {
      // Skip genuinely empty draft rows silently instead of erroring —
      // "Сохранить всё" shouldn't block on an update card nobody filled in.
      if (!form.title && !form.body) return { ok: true };
      setErrorMsg(null);
      const result = await saveExpeditionUpdate(form);
      if (!result.ok) {
        setErrorMsg(result.error);
        return { ok: false, error: `Новость «${form.title || "без названия"}»: ${result.error}` };
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
        <button onClick={handleDelete} className="text-mist hover:text-red-400" title="Удалить новость">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

const UpdatesManager = forwardRef<
  ManagerHandle,
  { expeditionId: string; initialUpdates: ExpeditionUpdateFormData[] }
>(function UpdatesManager({ expeditionId, initialUpdates }, ref) {
  const [updates, setUpdates] = useState(initialUpdates);
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
      <div className="flex flex-col gap-4">
        {updates.map((u, i) => {
          const key = u.id ?? `new-${i}`;
          return (
            <UpdateCard
              key={key}
              ref={(el) => {
                if (el) rowRefs.current.set(key, el);
                else rowRefs.current.delete(key);
              }}
              update={u}
              onRemoved={() => {
                rowRefs.current.delete(key);
                setUpdates((d) => d.filter((_, idx) => idx !== i));
              }}
            />
          );
        })}
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
});

export default UpdatesManager;
