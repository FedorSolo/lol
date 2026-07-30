"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function PhotoLightboxGallery({ photos, title }: { photos: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openIndex === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((url, i) => (
          <button
            key={url}
            onClick={() => setOpenIndex(i)}
            className="group relative h-64 overflow-hidden"
          >
            <img
              src={url}
              alt={`${title} — фото ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/20 transition-colors" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-sm flex flex-col items-center justify-center px-4 py-8 md:px-16"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Закрыть"
              className="absolute top-5 right-5 md:top-8 md:right-8 text-snow/80 hover:text-snow p-2 z-10"
            >
              <X className="w-7 h-7" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Предыдущее фото"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-snow/70 hover:text-snow p-2 z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Следующее фото"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-snow/70 hover:text-snow p-2 z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <motion.img
              key={openIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              src={photos[openIndex]}
              alt={`${title} — фото ${openIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[80vh] object-contain"
            />

            <div className="mt-4 font-mono text-xs text-mist">
              {openIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
