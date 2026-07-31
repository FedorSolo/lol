"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import {
  saveExerciseVideo,
  deleteExerciseVideo,
  type ExerciseVideoFormData,
} from "./sessions-actions";

function blank(sessionId: string, sortOrder: number): ExerciseVideoFormData {
  return { session_id: sessionId, exercise_name: "", video_url: "", sort_order: sortOrder };
}

function VideoRow({
  video,
  onSaved,
  onRemoved,
}: {
  video: ExerciseVideoFormData;
  onSaved: (id: string) => void;
  onRemoved: () => void;
}) {
  const [form, setForm] = useState(video);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputClass =
    "bg-transparent border border-white/20 px-2 py-1.5 text-snow text-xs focus:border-glacier-light outline-none transition-colors";

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    const result = await saveExerciseVideo(form);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setForm((f) => ({ ...f, id: result.data.id }));
    onSaved(result.data.id);
  }

  async function handleDelete() {
    if (!form.id) {
      onRemoved();
      return;
    }
    if (!confirm("Удалить это видео?")) return;
    const result = await deleteExerciseVideo(form.id);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    onRemoved();
  }

  return (
    <div className="border border-white/10 p-3">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <input
          className={`${inputClass} flex-1 min-w-[140px]`}
          placeholder="Упражнение, например «Приседания»"
          value={form.exercise_name}
          onChange={(e) => setForm((f) => ({ ...f, exercise_name: e.target.value }))}
        />
        <input
          className={`${inputClass} flex-[2] min-w-[200px]`}
          placeholder="https://www.youtube.com/watch?v=..."
          value={form.video_url}
          onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
        />
        <button
          onClick={handleSave}
          disabled={saving || !form.exercise_name || !form.video_url}
          className="inline-flex items-center gap-1 bg-snow text-obsidian px-2.5 py-1.5 text-xs hover:bg-glacier-light transition-colors disabled:opacity-50"
        >
          <Save className="w-3 h-3" />
        </button>
        <button onClick={handleDelete} className="text-mist hover:text-red-400 p-1.5">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {errorMsg && <p className="text-xs text-red-400 mb-2">{errorMsg}</p>}
      {form.video_url && (
        <div className="max-w-xs">
          <YouTubeEmbed url={form.video_url} title={form.exercise_name || "Пример упражнения"} />
        </div>
      )}
    </div>
  );
}

export default function ExerciseVideosManager({
  sessionId,
  initialVideos,
}: {
  sessionId: string;
  initialVideos: ExerciseVideoFormData[];
}) {
  const [videos, setVideos] = useState(initialVideos);

  return (
    <div>
      <div className="flex flex-col gap-3">
        {videos.map((v, i) => (
          <VideoRow
            key={v.id ?? `new-${i}`}
            video={v}
            onSaved={() => {}}
            onRemoved={() => setVideos((prev) => prev.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
      <button
        onClick={() => setVideos((prev) => [...prev, blank(sessionId, prev.length)])}
        className="mt-3 inline-flex items-center gap-1.5 border border-white/20 text-snow px-3 py-1.5 text-xs hover:border-glacier-light transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Добавить видео упражнения
      </button>
    </div>
  );
}
