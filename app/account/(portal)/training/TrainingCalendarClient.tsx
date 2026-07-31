"use client";

import { useState } from "react";
import { Check, Clock, Ruler, TrendingUp, Link as LinkIcon, Save } from "lucide-react";
import TrainingCalendarGrid, { type CalendarSessionSummary, typeLabel } from "@/components/TrainingCalendarGrid";
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
  is_completed: boolean;
  garmin_link: string | null;
}

export default function TrainingCalendarClient({ sessions: initialSessions }: { sessions: ClientSessionRow[] }) {
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
