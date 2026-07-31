import { createAdminSupabaseClient } from "@/lib/supabase/server";
import StatusSelect from "./StatusSelect";
import InviteClientButton from "./InviteClientButton";
import { getInvitedEmails } from "./actions";

export default async function ApplicationsPage() {
  const supabase = createAdminSupabaseClient();
  const [{ data: applications }, invitedEmails] = await Promise.all([
    supabase.from("applications").select("*, expeditions(slug)").order("created_at", { ascending: false }),
    getInvitedEmails(),
  ]);

  const invited = new Set(invitedEmails);

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">Заявки</h1>

      <div className="border border-white/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-mist text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-normal">Имя</th>
              <th className="px-5 py-3 font-normal">Экспедиция</th>
              <th className="px-5 py-3 font-normal">Контакты</th>
              <th className="px-5 py-3 font-normal">Дата</th>
              <th className="px-5 py-3 font-normal">Статус</th>
              <th className="px-5 py-3 font-normal">Клиентский доступ</th>
            </tr>
          </thead>
          <tbody>
            {(applications ?? []).map((app: any) => (
              <tr key={app.id} className="border-b border-white/5 text-snow align-top">
                <td className="px-5 py-3">
                  {app.first_name} {app.last_name}
                  <div className="text-xs text-mist mt-0.5">{app.country}</div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-mist">{app.expeditions?.slug ?? "—"}</td>
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
                  {invited.has(app.email) ? (
                    <span className="text-xs text-glacier-light">✓ Приглашён</span>
                  ) : app.status === "APPROVED" || app.status === "COMPLETED" ? (
                    <InviteClientButton applicationId={app.id} />
                  ) : (
                    <span className="text-xs text-mist/60">
                      Доступно после статуса «Одобрено» или «Завершено»
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {(!applications || applications.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-mist">
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
