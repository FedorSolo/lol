import { Newspaper } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireClient } from "../../auth-actions";

export default async function NewsPage() {
  const profile = await requireClient();

  let updates: { id: string; title: string; body: string; published_at: string }[] = [];
  if (profile.expedition_id) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("expedition_updates")
      .select("*")
      .eq("expedition_id", profile.expedition_id)
      .order("published_at", { ascending: false });
    updates = data ?? [];
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-2">Новости</h1>
      <p className="text-mist text-sm mb-10">Обновления по вашей экспедиции от команды CUMBRE.</p>

      {updates.length === 0 ? (
        <div className="border border-white/10 py-16 text-center text-mist flex flex-col items-center gap-3">
          <Newspaper className="w-6 h-6 text-mist/60" strokeWidth={1.5} />
          Пока новостей нет — здесь появятся важные обновления по вашей экспедиции.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {updates.map((u) => (
            <div key={u.id} className="border border-white/10 p-6">
              <div className="font-mono text-xs text-glacier-light mb-2">
                {new Date(u.published_at).toLocaleDateString("ru-RU")}
              </div>
              <h2 className="font-display text-lg uppercase text-snow mb-2">{u.title}</h2>
              <p className="text-mist text-sm leading-relaxed whitespace-pre-line">{u.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
