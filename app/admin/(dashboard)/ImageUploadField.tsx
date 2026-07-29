"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadMedia } from "./upload-actions";

export default function ImageUploadField({
  folder,
  value,
  onChange,
  shape = "square",
}: {
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
  shape?: "square" | "circle" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const result = await uploadMedia(formData);
    setUploading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }
    onChange(result.url);
  }

  const shapeClass =
    shape === "circle" ? "w-24 h-24 rounded-full" : shape === "wide" ? "w-full h-32" : "w-24 h-24";

  return (
    <div className="flex items-center gap-4">
      <div
        className={`${shapeClass} shrink-0 border border-white/20 bg-ash overflow-hidden relative flex items-center justify-center`}
      >
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImagePlus className="w-5 h-5 text-mist" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-obsidian/70 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-glacier-light animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs border border-white/20 text-snow px-3 py-1.5 hover:border-glacier-light transition-colors disabled:opacity-50"
        >
          {value ? "Заменить фото" : "Загрузить фото"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-mist hover:text-red-400 inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Убрать
          </button>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}
