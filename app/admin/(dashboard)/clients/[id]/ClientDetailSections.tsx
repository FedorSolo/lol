"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { saveTrainingPlan, deleteClientVideo } from "../actions";

export interface QuestionnaireRow {
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  resting_heart_rate: number | null;
  chronic_conditions: string | null;
  current_medications: string | null;
  allergies: string | null;
  recent_training_summary: string | null;
  longest_altitude_reached_m: number | null;
  additional_notes: string | null;
}

export interface VideoRow {
  id: string;
  url: string;
  storage_path: string;
  note: string | null;
  uploaded_at: string;
}

const FIELD_LABELS: Record<keyof QuestionnaireRow, string> = {
  emergency_contact_name: "Экстренный контакт",
  emergency_contact_phone: "Телефон контакта",
  height_cm: "Рост (см)",
  weight_kg: "Вес (кг)",
  resting_heart_rate: "Пульс покоя",
  chronic_conditions: "Хронические заболевания",
  current_medications: "Лекарства",
  allergies: "Аллергии",
  recent_training_summary: "Текущая подготовка",
  longest_altitude_reached_m: "Макс. высота (м)",
  additional_notes: "Дополнительно",
};

export function QuestionnaireView({ data }: { data: QuestionnaireRow | null }) {
  if (!data) {
    return <p className="text-mist text-sm">Клиент ещё не заполнил опросник.</p>;
  }

  const entries = (Object.keys(FIELD_LABELS) as (keyof QuestionnaireRow)[])
    .map((key) => ({ label: FIELD_LABELS[key], value: data[key] }))
    .filter((e) => e.value !== null && e.value !== "");

  if (entries.length === 0) {
    return <p className="text-mist text-sm">Клиент ещё не заполнил опросник.</p>;
  }

  return (
    <dl className="grid sm:grid-cols-2 gap-4">
      {entries.map((e) => (
        <div key={e.label}>
          <dt className="text-xs text-mist uppercase tracking-wide">{e.label}</dt>
          <dd className="text-snow text-sm mt-0.5">{e.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function TrainingPlanEditor({ clientId, initialPlan }: { clientId: string; initialPlan: string }) {
  const [plan, setPlan] = useState(initialPlan);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveTrainingPlan(clientId, plan);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setSavedMsg(true);
  }

  return (
    <div>
      <textarea
        rows={8}
        value={plan}
        onChange={(e) => {
          setPlan(e.target.value);
          setSavedMsg(false);
        }}
        placeholder="Например:&#10;Неделя 1-2: кардио 3х в неделю по 40 минут&#10;Неделя 3-4: + силовая тренировка ног 2х в неделю&#10;..."
        className="w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors resize-y"
      />
      {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}
      {savedMsg && <p className="text-xs text-glacier-light mt-2">Сохранено — клиент увидит это в своём кабинете.</p>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-3 inline-flex items-center gap-2 bg-snow text-obsidian px-4 py-2 text-xs hover:bg-glacier-light transition-colors disabled:opacity-60"
      >
        <Save className="w-3.5 h-3.5" />
        {saving ? "Сохранение…" : "Сохранить план"}
      </button>
    </div>
  );
}

export function VideosView({ videos: initialVideos }: { videos: VideoRow[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleDelete(video: VideoRow) {
    if (!confirm("Удалить это видео?")) return;
    setPendingId(video.id);
    const result = await deleteClientVideo(video.id, video.storage_path);
    setPendingId(null);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    setVideos((v) => v.filter((x) => x.id !== video.id));
  }

  if (videos.length === 0) {
    return <p className="text-mist text-sm">Клиент ещё не загружал видео.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="border border-white/10 p-3">
          <video src={video.url} controls className="w-full aspect-video bg-obsidian mb-2" />
          <div className="flex items-center justify-between">
            <div>
              {video.note && <div className="text-snow text-sm">{video.note}</div>}
              <div className="text-mist text-xs">{new Date(video.uploaded_at).toLocaleDateString("ru-RU")}</div>
            </div>
            <button
              onClick={() => handleDelete(video)}
              disabled={pendingId === video.id}
              className="text-mist hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
