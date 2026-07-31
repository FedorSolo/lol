"use client";

import { useState } from "react";
import { Check, Clock, Ruler, TrendingUp } from "lucide-react";
import TrainingCalendarGrid, { type CalendarSessionSummary, typeLabel } from "@/components/TrainingCalendarGrid";
import { toggleSessionCompleted } from "./actions";

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
}

export default function TrainingCalendarClient({ sessions: initialSessions }: { sessions: ClientSessionRow[] }) {
  const [sessions, setSessions] = useState(initialSessions);
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

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
        onSelectDate={setSelectedDate}
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
          </div>
        )}
      </div>
    </div>
  );
}
