"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Video, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { recordTrainingVideo } from "./actions";

const MAX_SIZE_MB = 200;

export default function VideoUploader({ clientId }: { clientId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("video/")) {
      setError("Выберите видеофайл");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Файл больше ${MAX_SIZE_MB} МБ`);
      return;
    }

    setUploading(true);
    setProgress("Загружаем видео…");

    const supabase = createClient();
    const ext = file.name.split(".").pop() || "mp4";
    const path = `training-videos/${clientId}/${crypto.randomUUID()}.${ext}`;

    // Uploaded directly to Storage from the browser — never passes
    // through our Vercel serverless functions, so there's no 4.5MB
    // request body limit to worry about here.
    const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      setUploading(false);
      setProgress(null);
      setError(uploadError.message);
      return;
    }

    setProgress("Сохраняем…");
    const result = await recordTrainingVideo(path, note);
    setUploading(false);
    setProgress(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setNote("");
    router.refresh();
  }

  return (
    <div className="border border-white/10 p-5">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Подпись к видео (необязательно) — например «Бег, 10 км»"
        className="w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors mb-3"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 border border-white/20 text-snow px-4 py-2 text-sm hover:border-glacier-light transition-colors disabled:opacity-50"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
        {progress ?? "Загрузить видео тренировки"}
      </button>
      <p className="text-xs text-mist mt-2">До {MAX_SIZE_MB} МБ.</p>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}
