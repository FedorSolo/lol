import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getExpeditionBySlug } from "@/lib/expeditions-data";
import { requireClient } from "../auth-actions";
import { Mountain, Gauge, CalendarDays, Users2, Check, X } from "lucide-react";

export default async function TripPage() {
  const profile = await requireClient();

  if (!profile.expedition_id) {
    return (
      <div>
        <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-4">
          Моя экспедиция
        </h1>
        <p className="text-mist text-sm">
          К вашему профилю пока не привязана экспедиция — свяжитесь с командой CUMBRE.
        </p>
      </div>
    );
  }

  const supabase = createServerSupabaseClient();
  const { data: exp } = await supabase
    .from("expeditions")
    .select("*")
    .eq("id", profile.expedition_id)
    .maybeSingle();

  const expedition = exp ? await getExpeditionBySlug(exp.slug, "ru") : null;

  if (!expedition) {
    return (
      <div>
        <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-4">
          Моя экспедиция
        </h1>
        <p className="text-mist text-sm">Информация об экспедиции временно недоступна.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display font-bold uppercase text-3xl md:text-4xl text-snow mb-8">
        {expedition.title}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border border-white/10 p-6">
        <div>
          <Mountain className="w-4 h-4 text-glacier-light mb-2" strokeWidth={1.5} />
          <div className="text-snow text-sm">{expedition.altitudeM ? `${expedition.altitudeM} м` : "—"}</div>
          <div className="text-[11px] text-mist uppercase">Высота</div>
        </div>
        <div>
          <Gauge className="w-4 h-4 text-glacier-light mb-2" strokeWidth={1.5} />
          <div className="text-snow text-sm">{expedition.difficultyName ?? "—"}</div>
          <div className="text-[11px] text-mist uppercase">Сложность</div>
        </div>
        <div>
          <CalendarDays className="w-4 h-4 text-glacier-light mb-2" strokeWidth={1.5} />
          <div className="text-snow text-sm">{expedition.durationDays ? `${expedition.durationDays} дней` : "—"}</div>
          <div className="text-[11px] text-mist uppercase">Длительность</div>
        </div>
        <div>
          <Users2 className="w-4 h-4 text-glacier-light mb-2" strokeWidth={1.5} />
          <div className="text-snow text-sm">{expedition.bestSeason ?? "—"}</div>
          <div className="text-[11px] text-mist uppercase">Сезон</div>
        </div>
      </div>

      {expedition.preparationText && (
        <section className="mb-10">
          <h2 className="font-display text-lg uppercase text-snow mb-3">Как проходит подготовка</h2>
          <p className="text-mist text-sm leading-relaxed">{expedition.preparationText}</p>
        </section>
      )}

      {expedition.itinerary.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-lg uppercase text-snow mb-4">Программа по дням</h2>
          <div className="flex flex-col">
            {expedition.itinerary.map((day, i) => (
              <div key={day.title} className="flex gap-4 border-b border-white/10 py-4 last:border-0">
                <span className="font-mono text-glacier-light text-sm shrink-0 w-6">{i + 1}</span>
                <div>
                  <h3 className="text-snow text-sm font-medium">{day.title}</h3>
                  {day.description && <p className="text-mist text-sm mt-1">{day.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(expedition.inclusions.length > 0 || expedition.exclusions.length > 0) && (
        <section className="grid md:grid-cols-2 gap-8 mb-10">
          {expedition.inclusions.length > 0 && (
            <div>
              <h2 className="font-display text-lg uppercase text-snow mb-3">Что входит</h2>
              <ul className="flex flex-col gap-2">
                {expedition.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-mist text-sm">
                    <Check className="w-4 h-4 text-glacier-light shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {expedition.exclusions.length > 0 && (
            <div>
              <h2 className="font-display text-lg uppercase text-snow mb-3">Что не входит</h2>
              <ul className="flex flex-col gap-2">
                {expedition.exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-mist text-sm">
                    <X className="w-4 h-4 text-mist/60 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
