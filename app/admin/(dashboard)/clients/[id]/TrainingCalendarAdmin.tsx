"use client";

import { useState } from "react";
import { Save, Trash2, Link as LinkIcon } from "lucide-react";
import TrainingCalendarGrid, { type CalendarSessionSummary } from "@/components/TrainingCalendarGrid";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { saveSession, deleteSession, type SessionFormData } from "./sessions-actions";

export interface SessionRow {
  id: string;
  session_date: string;
  title: string;
  session_type: string;
  duration_minutes: number | null;
  distance_km: number | null;
  elevation_gain_m: number | null;
  description: string | null;
  is_completed: boolean;
  garmin_link: string | null;
  video_url: string | null;
}

const SESSION_TYPES = [
  { value: "cardio", label: "Кардио" },
  { value: "strength", label: "Силовая" },
  { value: "hike", label: "Поход" },
  { value: "altitude", label: "Высотная" },
  { value: "rest", label: "Отдых" },
  { value: "other", label: "Другое" },
];

function blankForm(clientId: string, date: string): SessionFormData {
  return {
    client_id: clientId,
    session_date: date,
    title: "",
    session_type: "cardio",
    duration_minutes: "",
    distance_km: "",
    elevation_gain_m: "",
    description: "",
    video_url: "",
  };
}

export default function TrainingCalendarAdmin({
  clientId,
  initialSessions,
}: {
  clientId: string;
  initialSessions: SessionRow[];
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sessionsByDate: Record<string, CalendarSessionSummary> = {};
  for (const s of sessions) {
    sessionsByDate[s.session_date] = {
      date: s.session_date,
      title: s.title,
      session_type: s.session_type,
      is_completed: s.is_completed,
    };
  }

  const existing = selectedDate ? sessions.find((s) => s.session_date === selectedDate) : undefined;
  const [form, setForm] = useState<SessionFormData | null>(null);

  function selectDate(date: string) {
    setSelectedDate(date);
    setErrorMsg(null);
    const found = sessions.find((s) => s.session_date === date);
    setForm(
      found
        ? {
            id: found.id,
            client_id: clientId,
            session_date: date,
            title: found.title,
            session_type: found.session_type,
            duration_minutes: found.duration_minutes?.toString() ?? "",
            distance_km: found.distance_km?.toString() ?? "",
            elevation_gain_m: found.elevation_gain_m?.toString() ?? "",
            description: found.description ?? "",
            video_url: found.video_url ?? "",
          }
        : blankForm(clientId, date)
    );
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setErrorMsg(null);
    const result = await saveSession(form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }

    const savedSession: SessionRow = {
      id: result.data.id,
      session_date: form.session_date,
      title: form.title,
      session_type: form.session_type,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      distance_km: form.distance_km ? Number(form.distance_km) : null,
      elevation_gain_m: form.elevation_gain_m ? Number(form.elevation_gain_m) : null,
      description: form.description || null,
      is_completed: existing?.is_completed ?? false,
      garmin_link: existing?.garmin_link ?? null,
      video_url: form.video_url || null,
    };
    setSessions((prev) => [...prev.filter((s) => s.session_date !== form.session_date), savedSession]);
    setForm((f) => (f ? { ...f, id: result.data.id } : f));
  }

  async function handleDelete() {
    if (!existing) return;
    if (!confirm("Удалить тренировку на этот день?")) return;
    const result = await deleteSession(existing.id, clientId);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== existing.id));
    setSelectedDate(null);
    setForm(null);
  }

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-1.5";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <TrainingCalendarGrid
        year={view.year}
        month={view.month}
        sessionsByDate={sessionsByDate}
        selectedDate={selectedDate}
        onSelectDate={selectDate}
        onMonthChange={(year, month) => setView({ year, month })}
      />

      <div>
        {!form ? (
          <p className="text-mist text-sm">Выберите день в календаре, чтобы добавить тренировку.</p>
        ) : (
          <div className="border border-white/10 p-5">
            <p className="text-xs text-mist uppercase mb-4">{form.session_date}</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className={labelClass}>Название</label>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setForm((f) => f && { ...f, title: e.target.value })}
                  placeholder="Например «Бег на выносливость»"
                />
              </div>
              <div>
                <label className={labelClass}>Тип</label>
                <select
                  className={inputClass}
                  value={form.session_type}
                  onChange={(e) => setForm((f) => f && { ...f, session_type: e.target.value })}
                >
                  {SESSION_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-obsidian">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={labelClass}>Минут</label>
                  <input type="number" className={inputClass} value={form.duration_minutes} onChange={(e) => setForm((f) => f && { ...f, duration_minutes: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Км</label>
                  <input type="number" className={inputClass} value={form.distance_km} onChange={(e) => setForm((f) => f && { ...f, distance_km: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Набор высоты, м</label>
                  <input type="number" className={inputClass} value={form.elevation_gain_m} onChange={(e) => setForm((f) => f && { ...f, elevation_gain_m: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Описание / инструкции</label>
                <textarea
                  rows={4}
                  className={`${inputClass} resize-none`}
                  value={form.description}
                  onChange={(e) => setForm((f) => f && { ...f, description: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Видео с примером упражнения (ссылка на YouTube)</label>
                <input
                  className={inputClass}
                  value={form.video_url}
                  onChange={(e) => setForm((f) => f && { ...f, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {form.video_url && (
                  <div className="mt-2">
                    <YouTubeEmbed url={form.video_url} title={form.title || "Пример упражнения"} />
                  </div>
                )}
              </div>
            </div>

            {errorMsg && <p className="text-xs text-red-400 mt-3">{errorMsg}</p>}

            {existing?.garmin_link && (
              <a
                href={existing.garmin_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-glacier-light hover:underline mt-3"
              >
                <LinkIcon className="w-3 h-3" />
                Клиент прикрепил активность в Garmin Connect
              </a>
            )}

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleSave}
                disabled={saving || !form.title}
                className="inline-flex items-center gap-1.5 bg-snow text-obsidian px-4 py-2 text-xs hover:bg-glacier-light transition-colors disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "…" : "Сохранить"}
              </button>
              {existing && (
                <button onClick={handleDelete} className="inline-flex items-center gap-1.5 text-mist hover:text-red-400 text-xs">
                  <Trash2 className="w-3.5 h-3.5" />
                  Удалить
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
