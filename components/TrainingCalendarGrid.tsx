"use client";

import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export interface CalendarSessionSummary {
  date: string; // yyyy-mm-dd
  title: string;
  session_type: string;
  is_completed: boolean;
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const TYPE_LABELS: Record<string, string> = {
  cardio: "Кардио",
  strength: "Силовая",
  hike: "Поход",
  altitude: "Высота",
  rest: "Отдых",
  other: "Тренировка",
};

export function typeLabel(type: string): string {
  return TYPE_LABELS[type] ?? TYPE_LABELS.other;
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function TrainingCalendarGrid({
  year,
  month,
  sessionsByDate,
  selectedDate,
  onSelectDate,
  onMonthChange,
}: {
  year: number;
  month: number; // 0-11
  sessionsByDate: Record<string, CalendarSessionSummary>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
}) {
  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0=Sunday..6=Saturday — convert to Monday-first index.
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayKey = toDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  function goPrev() {
    if (month === 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, month - 1);
  }
  function goNext() {
    if (month === 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, month + 1);
  }

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={goPrev} className="text-mist hover:text-snow p-1">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-display uppercase text-snow tracking-wide">
          {MONTH_NAMES[month]} {year}
        </span>
        <button onClick={goNext} className="text-mist hover:text-snow p-1">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[11px] text-mist uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;
          const dateKey = toDateKey(year, month, day);
          const session = sessionsByDate[dateKey];
          const isSelected = selectedDate === dateKey;
          const isToday = dateKey === todayKey;

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`aspect-square flex flex-col items-center justify-center border text-xs transition-colors relative ${
                isSelected
                  ? "border-glacier-light bg-glacier/10"
                  : session
                    ? "border-white/20 hover:border-glacier-light/50"
                    : "border-white/5 hover:border-white/20"
              }`}
            >
              <span className={isToday ? "text-glacier-light font-bold" : "text-snow"}>{day}</span>
              {session && (
                <span
                  className={`mt-1 w-1.5 h-1.5 rounded-full ${
                    session.is_completed ? "bg-glacier-light" : "bg-mist"
                  }`}
                />
              )}
              {session?.is_completed && (
                <Check className="w-3 h-3 text-glacier-light absolute top-0.5 right-0.5" strokeWidth={3} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
