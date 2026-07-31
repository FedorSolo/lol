"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Save, X } from "lucide-react";
import StatusSelect from "./StatusSelect";
import InviteClientButton from "./InviteClientButton";
import { updateApplicationDetails, deleteApplication, deleteApplications } from "./actions";
import type { ApplicationEditData } from "./actions";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

export interface ApplicationRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string | null;
  telegram: string | null;
  country: string | null;
  age: number | null;
  expedition_id: string | null;
  expedition_slug: string | null;
  status: ApplicationStatus;
  created_at: string;
}

export interface ExpeditionOption {
  id: string;
  title: string;
}

function EditForm({
  app,
  expeditions,
  onCancel,
  onSaved,
}: {
  app: ApplicationRow;
  expeditions: ExpeditionOption[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ApplicationEditData>({
    first_name: app.first_name,
    last_name: app.last_name,
    email: app.email,
    whatsapp: app.whatsapp ?? "",
    telegram: app.telegram ?? "",
    country: app.country ?? "",
    age: app.age?.toString() ?? "",
    expedition_id: app.expedition_id ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-2 py-1.5 text-snow text-xs focus:border-glacier-light outline-none transition-colors";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await updateApplicationDetails(app.id, form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    onSaved();
  }

  return (
    <tr className="border-b border-white/5 bg-ash/50">
      <td colSpan={7} className="px-5 py-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="text-[10px] uppercase text-mist">Имя</label>
            <input className={inputClass} value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase text-mist">Фамилия</label>
            <input className={inputClass} value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase text-mist">Email</label>
            <input className={inputClass} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase text-mist">WhatsApp</label>
            <input className={inputClass} value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase text-mist">Telegram</label>
            <input className={inputClass} value={form.telegram} onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase text-mist">Страна</label>
            <input className={inputClass} value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase text-mist">Возраст</label>
            <input type="number" className={inputClass} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase text-mist">Экспедиция</label>
            <select className={inputClass} value={form.expedition_id} onChange={(e) => setForm((f) => ({ ...f, expedition_id: e.target.value }))}>
              <option value="" className="bg-obsidian">— не выбрано —</option>
              {expeditions.map((exp) => (
                <option key={exp.id} value={exp.id} className="bg-obsidian">{exp.title}</option>
              ))}
            </select>
          </div>
        </div>
        {errorMsg && <p className="text-xs text-red-400 mb-2">{errorMsg}</p>}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 bg-snow text-obsidian px-3 py-1.5 text-xs hover:bg-glacier-light transition-colors disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "…" : "Сохранить"}
          </button>
          <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-mist hover:text-snow text-xs">
            <X className="w-3.5 h-3.5" />
            Отмена
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ApplicationsTable({
  applications,
  expeditions,
  invitedEmails,
}: {
  applications: ApplicationRow[];
  expeditions: ExpeditionOption[];
  invitedEmails: string[];
}) {
  const router = useRouter();
  const invited = new Set(invitedEmails);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  function toggleSelected(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((s) => (s.size === applications.length ? new Set() : new Set(applications.map((a) => a.id))));
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить заявку безвозвратно?")) return;
    const result = await deleteApplication(id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Удалить ${selected.size} заявок безвозвратно?`)) return;
    setBulkDeleting(true);
    const result = await deleteApplications(Array.from(selected));
    setBulkDeleting(false);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    setSelected(new Set());
    router.refresh();
  }

  return (
    <div>
      {selected.size > 0 && (
        <div className="flex items-center justify-between border border-white/10 bg-ash px-5 py-3 mb-3">
          <span className="text-sm text-snow">Выбрано: {selected.size}</span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {bulkDeleting ? "Удаление…" : "Удалить выбранное"}
          </button>
        </div>
      )}

      <div className="border border-white/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-mist text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-normal w-8">
                <input
                  type="checkbox"
                  checked={selected.size > 0 && selected.size === applications.length}
                  onChange={toggleAll}
                  className="w-4 h-4"
                />
              </th>
              <th className="px-5 py-3 font-normal">Имя</th>
              <th className="px-5 py-3 font-normal">Экспедиция</th>
              <th className="px-5 py-3 font-normal">Контакты</th>
              <th className="px-5 py-3 font-normal">Дата</th>
              <th className="px-5 py-3 font-normal">Статус</th>
              <th className="px-5 py-3 font-normal">Клиентский доступ</th>
              <th className="px-5 py-3 font-normal w-16"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) =>
              editingId === app.id ? (
                <EditForm
                  key={app.id}
                  app={app}
                  expeditions={expeditions}
                  onCancel={() => setEditingId(null)}
                  onSaved={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                />
              ) : (
                <tr key={app.id} className="border-b border-white/5 text-snow align-top">
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(app.id)}
                      onChange={() => toggleSelected(app.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-5 py-3">
                    {app.first_name} {app.last_name}
                    <div className="text-xs text-mist mt-0.5">{app.country}</div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-mist">{app.expedition_slug ?? "—"}</td>
                  <td className="px-5 py-3 text-xs text-mist">
                    <div>{app.email}</div>
                    {app.whatsapp && <div>WA: {app.whatsapp}</div>}
                    {app.telegram && <div>TG: {app.telegram}</div>}
                  </td>
                  <td className="px-5 py-3 text-xs text-mist">
                    {new Date(app.created_at).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-5 py-3">
                    <StatusSelect id={app.id} status={app.status} />
                  </td>
                  <td className="px-5 py-3">
                    {app.status === "APPROVED" || app.status === "COMPLETED" ? (
                      <InviteClientButton
                        applicationId={app.id}
                        email={app.email}
                        alreadyInvited={invited.has(app.email)}
                      />
                    ) : (
                      <span className="text-xs text-mist/60">
                        Доступно после статуса «Одобрено» или «Завершено»
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingId(app.id)} className="text-mist hover:text-snow" title="Редактировать">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(app.id)} className="text-mist hover:text-red-400" title="Удалить">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
            {applications.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-mist">
                  Заявок пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
