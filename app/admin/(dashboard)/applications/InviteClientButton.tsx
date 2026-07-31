"use client";

import { useState } from "react";
import { UserPlus, Copy, X, CheckCircle2 } from "lucide-react";
import { inviteClient } from "./actions";

export default function InviteClientButton({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleInvite() {
    setLoading(true);
    setErrorMsg(null);
    const result = await inviteClient(applicationId);
    setLoading(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setCredentials(result.data);
  }

  function copyAll() {
    if (!credentials) return;
    navigator.clipboard.writeText(
      `Логин: ${credentials.email}\nПароль: ${credentials.password}\nВход: /account/login`
    );
  }

  return (
    <>
      <button
        onClick={handleInvite}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs text-glacier-light hover:underline disabled:opacity-50"
      >
        <UserPlus className="w-3.5 h-3.5" />
        {loading ? "Создаём…" : "Пригласить клиента"}
      </button>
      {errorMsg && <p className="text-xs text-red-400 mt-1">{errorMsg}</p>}

      {credentials && (
        <div className="fixed inset-0 z-[100] bg-obsidian/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-ash border border-white/10 max-w-sm w-full p-6 relative">
            <button
              onClick={() => setCredentials(null)}
              className="absolute top-4 right-4 text-mist hover:text-snow"
            >
              <X className="w-4 h-4" />
            </button>
            <CheckCircle2 className="w-8 h-8 text-glacier-light mb-4" strokeWidth={1.5} />
            <h3 className="font-display text-lg uppercase text-snow mb-2">Клиент приглашён</h3>
            <p className="text-mist text-xs mb-4">
              Отправьте эти данные клиенту вручную (WhatsApp, email) — они показываются только
              один раз.
            </p>
            <div className="border border-white/10 p-3 mb-4 text-sm">
              <div className="text-mist text-xs uppercase mb-1">Логин (email)</div>
              <div className="text-snow mb-3">{credentials.email}</div>
              <div className="text-mist text-xs uppercase mb-1">Пароль</div>
              <div className="text-snow font-mono">{credentials.password}</div>
            </div>
            <button
              onClick={copyAll}
              className="w-full inline-flex items-center justify-center gap-2 bg-snow text-obsidian px-4 py-2.5 text-sm hover:bg-glacier-light transition-colors"
            >
              <Copy className="w-4 h-4" />
              Скопировать всё
            </button>
          </div>
        </div>
      )}
    </>
  );
}
