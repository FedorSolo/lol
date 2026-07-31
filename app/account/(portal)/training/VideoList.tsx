"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteTrainingVideo } from "./actions";

export interface VideoItem {
  id: string;
  url: string;
  note: string | null;
  uploaded_at: string;
}

export default function VideoList({ videos }: { videos: VideoItem[] }) {
  const [items, setItems] = useState(videos);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleDelete(video: VideoItem) {
    if (!confirm("Удалить видео?")) return;
    setPendingId(video.id);
    // storage_path isn't in VideoItem (only the resolved URL) — refetch
    // isn't worth it here; deleteTrainingVideo only needs the path for
    // storage cleanup, which we can derive from the public URL.
    const path = video.url.split("/media/")[1] ?? "";
    const result = await deleteTrainingVideo(video.id, path);
    setPendingId(null);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    setItems((prev) => prev.filter((v) => v.id !== video.id));
  }

  if (items.length === 0) {
    return <p className="text-mist text-sm">Вы ещё не загружали видео тренировок.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map((video) => (
        <div key={video.id} className="border border-white/10 p-3">
          <video src={video.url} controls className="w-full aspect-video bg-obsidian mb-2" />
          <div className="flex items-center justify-between">
            <div>
              {video.note && <div className="text-snow text-sm">{video.note}</div>}
              <div className="text-mist text-xs">
                {new Date(video.uploaded_at).toLocaleDateString("ru-RU")}
              </div>
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
