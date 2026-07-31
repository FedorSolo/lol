"use client";

import { useState } from "react";
import { UserPlus, Copy, X, CheckCircle2, Mail, AlertTriangle, RotateCw } from "lucide-react";
import { inviteClient, resendClientInvite } from "./actions";

type Credentials = {
  email: string;
  password: string;
  emailSent: boolean;
  emailError?: string;
};

export default function InviteClientButton({
  applicationId,
  email,
  alreadyInvited,
}: {
  applicationId: string;
  email: string;
  alreadyInvited: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setErrorMsg(null);
    const result = alreadyInvited ? await resendClientInvite(email) : await inviteClient(applicationId);
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
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 text-xs disabled:opacity-50 ${
          alreadyInvited ? "text-mist hover:text-snow" : "text-glacier-light hover:underline"
        }`}
      >
        {alreadyInvited ? (
          <>
            <RotateCw className="w-3.5 h-3.5" />
            {loading ? "Отправляем…" : "✓ Приглашён · отправить письмо ещё раз"}
          </>
        ) : (
          <>
            <UserPlus className="w-3.5 h-3.5" />
            {loading ? "Создаём…" : "Пригласить клиента"}
          </>
        )}
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
            <h3 className="font-display text-lg uppercase text-snow mb-2">
              {alreadyInvited ? "Пароль обновлён" : "Клиент приглашён"}
            </h3>

            {credentials.emailSent ? (
              <p className="text-glacier-light text-xs mb-4 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Письмо с данными для входа отправлено на {credentials.email}
              </p>
            ) : (
              <p className="text-amber-400 text-xs mb-4 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Письмо не отправилось{credentials.emailError ? ` (${credentials.emailError})` : ""} —
                отправьте данные ниже клиенту вручную.
              </p>
            )}

            <p className="text-mist text-xs mb-4">
              Данные показываются только один раз — на всякий случай скопируйте их тоже.
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
