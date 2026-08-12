"use client";

import { useState } from "react";
import { Check, Clock, Ruler, TrendingUp, Link as LinkIcon, Save, CalendarPlus, Dumbbell } from "lucide-react";
import TrainingCalendarGrid, { type CalendarSessionSummary, typeLabel } from "@/components/TrainingCalendarGrid";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { googleCalendarLink } from "@/lib/calendar";
import { toggleSessionCompleted, updateGarminLink } from "./actions";

export interface ClientSessionRow {
  id: string;
  session_date: string;
  title: string;
  session_type: string;
  duration_minutes: number | null;
  distance_km: number | null;
  elevation_gain_m: number | null;
  description: string | null;
  equipment_needed: string | null;
  is_completed: boolean;
  garmin_link: string | null;
}

export interface ExerciseVideo {
  id: string;
  exercise_name: string;
  video_url: string;
}

export default function TrainingCalendarClient({
  sessions: initialSessions,
  videosBySession,
}: {
  sessions: ClientSessionRow[];
  videosBySession: Record<string, ExerciseVideo[]>;
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [garminInput, setGarminInput] = useState("");
  const [savingLink, setSavingLink] = useState(false);
  const [linkSavedMsg, setLinkSavedMsg] = useState(false);

  const sessionsByDate: Record<string, CalendarSessionSummary> = {};
  for (const s of sessions) {
    sessionsByDate[s.session_date] = {
      date: s.session_date,
      title: s.title,
      session_type: s.session_type,
      is_completed: s.is_completed,
    };
  }

  const selected = selectedDate ? sessions.find((s) => s.session_date === selectedDate) : undefined;

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setLinkSavedMsg(false);
    const found = sessions.find((s) => s.session_date === date);
    setGarminInput(found?.garmin_link ?? "");
  }

  async function handleSaveLink() {
    if (!selected) return;
    setSavingLink(true);
    setLinkSavedMsg(false);
    const result = await updateGarminLink(selected.id, garminInput.trim());
    setSavingLink(false);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    setSessions((prev) =>
      prev.map((s) => (s.id === selected.id ? { ...s, garmin_link: garminInput.trim() || null } : s))
    );
    setLinkSavedMsg(true);
  }

  async function handleToggle() {
    if (!selected) return;
    setToggling(true);
    const next = !selected.is_completed;
    const result = await toggleSessionCompleted(selected.id, next);
    setToggling(false);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    setSessions((prev) => prev.map((s) => (s.id === selected.id ? { ...s, is_completed: next } : s)));
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <TrainingCalendarGrid
        year={view.year}
        month={view.month}
        sessionsByDate={sessionsByDate}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onMonthChange={(year, month) => setView({ year, month })}
      />

      <div>
        {!selectedDate ? (
          <p className="text-mist text-sm">Выберите день в календаре, чтобы увидеть тренировку.</p>
        ) : !selected ? (
          <p className="text-mist text-sm">На этот день тренировка не запланирована.</p>
        ) : (
          <div className="border border-white/10 p-5">
            <p className="text-xs text-glacier-light uppercase mb-1">{typeLabel(selected.session_type)}</p>
            <h3 className="font-display text-lg uppercase text-snow mb-4">{selected.title}</h3>

            <div className="flex gap-5 mb-4 text-mist text-sm">
              {selected.duration_minutes && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {selected.duration_minutes} мин
                </span>
              )}
              {selected.distance_km && (
                <span className="flex items-center gap-1.5">
                  <Ruler className="w-4 h-4" /> {selected.distance_km} км
                </span>
              )}
              {selected.elevation_gain_m && (
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> {selected.elevation_gain_m} м
                </span>
              )}
            </div>

            {selected.description && (
              <p className="text-mist text-sm leading-relaxed whitespace-pre-line mb-5">{selected.description}</p>
            )}

            {selected.equipment_needed && (
              <div className="mb-5 flex items-start gap-2 border border-white/10 bg-ash/50 px-3 py-2.5">
                <Dumbbell className="w-4 h-4 text-glacier-light shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs uppercase text-mist tracking-wide mb-0.5">Понадобится</div>
                  <div className="text-snow text-sm">{selected.equipment_needed}</div>
                </div>
              </div>
            )}

            {(videosBySession[selected.id] ?? []).length > 0 && (
              <div className="mb-5 flex flex-col gap-4">
                {(videosBySession[selected.id] ?? []).map((v) => (
                  <div key={v.id}>
                    <p className="text-xs text-mist uppercase tracking-wide mb-1.5">{v.exercise_name}</p>
                    <YouTubeEmbed url={v.video_url} title={v.exercise_name} />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors disabled:opacity-60 ${
                  selected.is_completed
                    ? "border border-glacier-light text-glacier-light"
                    : "bg-snow text-obsidian hover:bg-glacier-light"
                }`}
              >
                <Check className="w-4 h-4" />
                {selected.is_completed ? "Выполнено" : "Отметить выполненным"}
              </button>

              <a
                href={googleCalendarLink({
                  title: selected.title,
                  dateStr: selected.session_date,
                  description: selected.description ?? undefined,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-mist hover:text-glacier-light border border-white/15 hover:border-glacier-light/40 px-3 py-2 transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                В Google Календарь
              </a>
            </div>

            <div className="mt-5 pt-5 border-t border-white/10">
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-mist mb-2">
                <LinkIcon className="w-3.5 h-3.5" />
                Ссылка на активность в Garmin Connect
              </label>
              <div className="flex gap-2">
                <input
                  value={garminInput}
                  onChange={(e) => setGarminInput(e.target.value)}
                  placeholder="https://connect.garmin.com/modern/activity/..."
                  className="flex-1 bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors"
                />
                <button
                  onClick={handleSaveLink}
                  disabled={savingLink}
                  className="shrink-0 inline-flex items-center gap-1.5 bg-snow text-obsidian px-3 py-2 text-xs hover:bg-glacier-light transition-colors disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              </div>
              {linkSavedMsg && <p className="text-xs text-glacier-light mt-2">Сохранено</p>}
              {selected.garmin_link && (
                <a
                  href={selected.garmin_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-glacier-light hover:underline mt-2"
                >
                  <LinkIcon className="w-3 h-3" />
                  Открыть активность в Garmin Connect
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
