"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2, AlertTriangle } from "lucide-react";
import ExpeditionForm from "../ExpeditionForm";
import ItineraryManager from "../ItineraryManager";
import SimpleListManager from "../SimpleListManager";
import EquipmentManager from "../EquipmentManager";
import UpdatesManager from "../UpdatesManager";
import { saveInclusion, deleteInclusion, saveExclusion, deleteExclusion } from "../content-actions";
import type { RowHandle, ManagerHandle } from "../save-handle-types";
import type { ItineraryDayFormData, EquipmentFormData, ExpeditionUpdateFormData } from "../content-actions";
import type { Locale } from "@/lib/supabase/database.types";

interface SimpleItem {
  id?: string;
  expedition_id: string;
  sort_order: number;
  i18n: Record<Locale, { text: string }>;
}

export default function ExpeditionEditor({
  expeditionId,
  levels,
  initial,
  itineraryDays,
  inclusions,
  exclusions,
  equipment,
  updates,
}: {
  expeditionId: string;
  levels: { id: string; i18n: { locale: string; name: string }[] }[];
  initial: { expedition: Record<string, any>; i18n: Record<Locale, any> };
  itineraryDays: ItineraryDayFormData[];
  inclusions: SimpleItem[];
  exclusions: SimpleItem[];
  equipment: EquipmentFormData[];
  updates: ExpeditionUpdateFormData[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; errors: string[] } | null>(null);

  const formRef = useRef<RowHandle>(null);
  const itineraryRef = useRef<ManagerHandle>(null);
  const inclusionsRef = useRef<ManagerHandle>(null);
  const exclusionsRef = useRef<ManagerHandle>(null);
  const equipmentRef = useRef<ManagerHandle>(null);
  const updatesRef = useRef<ManagerHandle>(null);

  async function handleSaveAll() {
    setSaving(true);
    setResult(null);

    const errors: string[] = [];

    const formResult = await formRef.current?.save();
    if (formResult && !formResult.ok && formResult.error) errors.push(formResult.error);

    for (const ref of [itineraryRef, inclusionsRef, exclusionsRef, equipmentRef, updatesRef]) {
      const r = await ref.current?.saveAll();
      if (r) errors.push(...r.errors);
    }

    setSaving(false);
    setResult({ ok: errors.length === 0, errors });
    router.refresh();

    if (errors.length === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="pb-32">
      <ExpeditionForm ref={formRef} levels={levels} initial={initial as any} standalone={false} />

      <div className="max-w-3xl mt-16 pt-10 border-t border-white/10">
        <h2 className="font-display text-xl uppercase text-snow tracking-wide mb-2">
          Программа по дням
        </h2>
        <p className="text-mist text-sm mb-5">
          Появится на детальной странице экспедиции вместо тестовых данных, как только добавите
          хотя бы один день.
        </p>
        <ItineraryManager ref={itineraryRef} expeditionId={expeditionId} initialDays={itineraryDays} />
      </div>

      <div className="max-w-3xl mt-16 pt-10 border-t border-white/10">
        <h2 className="font-display text-xl uppercase text-snow tracking-wide mb-5">Что входит</h2>
        <SimpleListManager
          ref={inclusionsRef}
          expeditionId={expeditionId}
          initialItems={inclusions}
          addLabel="Добавить пункт"
          save={saveInclusion}
          remove={deleteInclusion}
        />
      </div>

      <div className="max-w-3xl mt-16 pt-10 border-t border-white/10">
        <h2 className="font-display text-xl uppercase text-snow tracking-wide mb-5">
          Что не входит
        </h2>
        <SimpleListManager
          ref={exclusionsRef}
          expeditionId={expeditionId}
          initialItems={exclusions}
          addLabel="Добавить пункт"
          save={saveExclusion}
          remove={deleteExclusion}
        />
      </div>

      <div className="max-w-3xl mt-16 pt-10 border-t border-white/10">
        <h2 className="font-display text-xl uppercase text-snow tracking-wide mb-2">Снаряжение</h2>
        <p className="text-mist text-sm mb-5">
          Показывается на публичной странице экспедиции, а клиентам в личном кабинете — как чек-лист
          с галочками.
        </p>
        <EquipmentManager ref={equipmentRef} expeditionId={expeditionId} initialItems={equipment} />
      </div>

      <div className="max-w-3xl mt-16 pt-10 border-t border-white/10">
        <h2 className="font-display text-xl uppercase text-snow tracking-wide mb-2">
          Новости для клиентов
        </h2>
        <p className="text-mist text-sm mb-5">
          Видны только тем клиентам, у кого в профиле привязана эта экспедиция — в их личном
          кабинете, на странице «Новости».
        </p>
        <UpdatesManager ref={updatesRef} expeditionId={expeditionId} initialUpdates={updates} />
      </div>

      {/* Single save button for the whole page — sticky so it's reachable
          no matter how far down the person has scrolled through all the
          sections above. */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-obsidian/95 backdrop-blur border-t border-white/10 px-6 py-4 z-40">
        <div className="max-w-3xl flex items-center gap-4">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-snow text-obsidian px-6 py-3 text-sm tracking-wide font-medium hover:bg-glacier-light transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? "Сохранение…" : "Сохранить всё"}
          </button>

          {result && result.ok && (
            <span className="inline-flex items-center gap-1.5 text-glacier-light text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Всё сохранено
            </span>
          )}
          {result && !result.ok && (
            <div className="flex items-start gap-1.5 text-red-400 text-xs max-h-16 overflow-y-auto">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                {result.errors.map((e, i) => (
                  <div key={i}>{e}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
