"use client";

import { useState, useTransition } from "react";
import { Star, Trash2 } from "lucide-react";
import ImageUploadField from "../ImageUploadField";
import {
  addExpeditionPhoto,
  setCoverPhoto,
  deleteExpeditionPhoto,
} from "./actions";

export interface ExpeditionOption {
  id: string;
  slug: string;
  title: string;
}

export interface PhotoRow {
  id: string;
  expedition_id: string;
  storage_path: string;
  is_cover: boolean;
  sort_order: number;
}

export default function PhotoManager({
  expeditions,
  initialPhotos,
}: {
  expeditions: ExpeditionOption[];
  initialPhotos: Record<string, PhotoRow[]>;
}) {
  const [selectedId, setSelectedId] = useState(expeditions[0]?.id ?? "");
  const [photosByExpedition, setPhotosByExpedition] = useState(initialPhotos);
  const [pending, startTransition] = useTransition();

  const photos = photosByExpedition[selectedId] ?? [];

  function refreshLocal(expeditionId: string, next: PhotoRow[]) {
    setPhotosByExpedition((prev) => ({ ...prev, [expeditionId]: next }));
  }

  async function handleUpload(url: string | null) {
    if (!url || !selectedId) return;
    await addExpeditionPhoto(selectedId, url);
    // Optimistic-ish: just refetch this expedition's photos from server state
    // by re-adding locally; full accuracy comes back on next page load.
    const newPhoto: PhotoRow = {
      id: `temp-${Date.now()}`,
      expedition_id: selectedId,
      storage_path: url,
      is_cover: photos.length === 0,
      sort_order: photos.length,
    };
    refreshLocal(selectedId, [...photos, newPhoto]);
  }

  function handleSetCover(photoId: string) {
    startTransition(async () => {
      await setCoverPhoto(selectedId, photoId);
      refreshLocal(
        selectedId,
        photos.map((p) => ({ ...p, is_cover: p.id === photoId }))
      );
    });
  }

  function handleDelete(photoId: string) {
    startTransition(async () => {
      await deleteExpeditionPhoto(photoId);
      refreshLocal(selectedId, photos.filter((p) => p.id !== photoId));
    });
  }

  return (
    <div>
      <div className="mb-8 max-w-sm">
        <label className="block text-xs uppercase tracking-wide text-mist mb-2">Экспедиция</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full bg-transparent border border-white/20 px-4 py-2.5 text-snow text-sm focus:border-glacier-light outline-none transition-colors"
        >
          {expeditions.map((exp) => (
            <option key={exp.id} value={exp.id} className="bg-obsidian">
              {exp.title}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <>
          <div className="mb-8">
            <ImageUploadField folder="expeditions" value={null} onChange={handleUpload} shape="wide" />
          </div>

          {photos.length === 0 ? (
            <p className="text-mist text-sm">
              Пока нет фотографий — используется заглушка из Unsplash. Загрузите первое фото выше.
            </p>
          ) : (
            <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group border border-white/10">
                  <img src={photo.storage_path} alt="" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/60 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleSetCover(photo.id)}
                      disabled={pending}
                      title="Сделать обложкой"
                      className={`p-2 border ${photo.is_cover ? "border-glacier-light text-glacier-light" : "border-white/40 text-snow"}`}
                    >
                      <Star className="w-4 h-4" fill={photo.is_cover ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      disabled={pending}
                      title="Удалить"
                      className="p-2 border border-white/40 text-snow hover:border-red-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {photo.is_cover && (
                    <span className="absolute top-2 left-2 bg-glacier-light text-obsidian text-[10px] uppercase px-2 py-0.5">
                      Обложка
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
