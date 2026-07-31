"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { updateClient, deleteClient, type ClientEditData } from "./actions";
import { resendClientInvite } from "../applications/actions";

export interface ClientRow {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  expedition_id: string | null;
  expeditionTitle: string | null;
  created_at: string;
}

export interface ExpeditionOption {
  id: string;
  title: string;
}

function EditRow({
  client,
  expeditions,
  onCancel,
  onSaved,
}: {
  client: ClientRow;
  expeditions: ExpeditionOption[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ClientEditData>({
    full_name: client.full_name,
    phone: client.phone ?? "",
    expedition_id: client.expedition_id ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "w-full bg-transparent border border-white/20 px-2 py-1.5 text-snow text-xs focus:border-glacier-light outline-none transition-colors";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await updateClient(client.id, form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    onSaved();
  }

  return (
    <tr className="border-b border-white/5 bg-ash/50">
      <td colSpan={5} className="px-5 py-4">
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-[10px] uppercase text-mist">Имя</label>
            <input className={inputClass} value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] uppercase text-mist">Телефон</label>
            <input className={inputClass} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
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

function ResendButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ password: string; emailSent: boolean; emailError?: string } | null>(null);

  async function handleClick() {
    setLoading(true);
    const res = await resendClientInvite(email);
    setLoading(false);
    if (!res.ok) {
      alert(res.error);
      return;
    }
    setResult(res.data);
  }

  return (
    <>
      <button onClick={handleClick} disabled={loading} className="text-xs text-glacier-light hover:underline disabled:opacity-50">
        {loading ? "Отправляем…" : "Новый пароль + письмо"}
      </button>
      {result && (
        <div className="fixed inset-0 z-[100] bg-obsidian/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-ash border border-white/10 max-w-sm w-full p-6 relative">
            <button onClick={() => setResult(null)} className="absolute top-4 right-4 text-mist hover:text-snow">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-display text-lg uppercase text-snow mb-3">Пароль обновлён</h3>
            {result.emailSent ? (
              <p className="text-glacier-light text-xs mb-4">Письмо отправлено на {email}</p>
            ) : (
              <p className="text-amber-400 text-xs mb-4">
                Письмо не отправилось{result.emailError ? ` (${result.emailError})` : ""} — передайте пароль вручную.
              </p>
            )}
            <div className="border border-white/10 p-3 text-sm">
              <div className="text-mist text-xs uppercase mb-1">Новый пароль</div>
              <div className="text-snow font-mono">{result.password}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ClientsTable({
  clients,
  expeditions,
}: {
  clients: ClientRow[];
  expeditions: ExpeditionOption[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Удалить клиента ${email} безвозвратно? Он потеряет доступ к личному кабинету.`)) return;
    const result = await deleteClient(id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="border border-white/10 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-mist text-xs uppercase tracking-wide">
            <th className="px-5 py-3 font-normal">Имя</th>
            <th className="px-5 py-3 font-normal">Email / телефон</th>
            <th className="px-5 py-3 font-normal">Экспедиция</th>
            <th className="px-5 py-3 font-normal">Доступ</th>
            <th className="px-5 py-3 font-normal w-16"></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) =>
            editingId === client.id ? (
              <EditRow
                key={client.id}
                client={client}
                expeditions={expeditions}
                onCancel={() => setEditingId(null)}
                onSaved={() => {
                  setEditingId(null);
                  router.refresh();
                }}
              />
            ) : (
              <tr key={client.id} className="border-b border-white/5 text-snow align-top">
                <td className="px-5 py-3">
                  <Link href={`/admin/clients/${client.id}`} className="hover:text-glacier-light">
                    {client.full_name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-xs text-mist">
                  <div>{client.email}</div>
                  {client.phone && <div>{client.phone}</div>}
                </td>
                <td className="px-5 py-3 text-xs text-mist">{client.expeditionTitle ?? "—"}</td>
                <td className="px-5 py-3">
                  <ResendButton email={client.email} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingId(client.id)} className="text-mist hover:text-snow" title="Редактировать">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(client.id, client.email)} className="text-mist hover:text-red-400" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
          {clients.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-mist">
                Клиентов пока нет — приглашайте их из «Заявки».
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
