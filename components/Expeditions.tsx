"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mountain, Gauge, CalendarDays, Users2, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PublicExpedition, PublicDifficultyLevel } from "@/lib/expeditions-shared";
import { coverImageFor } from "@/lib/expeditions-shared";

export default function Expeditions({
  expeditions,
  levels,
}: {
  expeditions: PublicExpedition[];
  levels: PublicDifficultyLevel[];
}) {
  const t = useTranslations("expeditions");
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  const filtered = activeLevel
    ? expeditions.filter((e) => e.difficultyLevelId === activeLevel)
    : expeditions;

  return (
    <section id="expeditions" className="bg-ash py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-10">
          <p className="md:col-span-4 font-mono text-xs tracking-widest2 uppercase text-glacier-light">
            {t("eyebrow")}
          </p>
          <h2 className="md:col-span-8 font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
            {t("title1")}
            <br />
            {t("title2")}
          </h2>
        </div>

        {levels.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setActiveLevel(null)}
              className={`px-4 py-2 text-xs uppercase tracking-wide border transition-colors ${
                activeLevel === null
                  ? "border-glacier-light text-snow bg-glacier-light/10"
                  : "border-white/20 text-mist hover:text-snow"
              }`}
            >
              {t("filterAll")}
            </button>
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setActiveLevel(level.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wide border transition-colors ${
                  activeLevel === level.id
                    ? "border-glacier-light text-snow bg-glacier-light/10"
                    : "border-white/20 text-mist hover:text-snow"
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="border border-white/10 py-20 text-center text-mist">{t("empty")}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((exp, i) => (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                className="group relative overflow-hidden bg-obsidian border border-white/10 rounded-xl flex flex-col"
              >
                <PhotoCarousel photos={exp.photoUrls} fallbackIndex={i} alt={exp.title}>
                  {exp.priceFrom != null && (
                    <div className="absolute top-4 right-4 z-10 bg-obsidian/70 backdrop-blur-sm border border-white/10 px-3 py-1.5 font-mono text-xs text-snow">
                      {exp.currency === "USD" ? "$" : exp.currency} {exp.priceFrom.toLocaleString("ru-RU")}
                    </div>
                  )}
                  <h3 className="absolute bottom-4 left-5 z-10 font-display font-bold uppercase text-3xl text-snow pointer-events-none">
                    {exp.title}
                  </h3>
                </PhotoCarousel>

                <div className="p-6 flex flex-col flex-1">
                  {exp.shortDescription && (
                    <p className="text-mist text-sm leading-relaxed mb-6">{exp.shortDescription}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-xs text-mist">
                    {exp.altitudeM != null && (
                      <div className="flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-glacier-light shrink-0" />
                        {exp.altitudeM.toLocaleString("ru-RU")} м
                      </div>
                    )}
                    {exp.difficultyName && (
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-glacier-light shrink-0" />
                        {exp.difficultyName}
                      </div>
                    )}
                    {exp.durationDays != null && (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-glacier-light shrink-0" />
                        {exp.durationDays} {t("durationLabel").toLowerCase()}
                      </div>
                    )}
                    {exp.groupSizeMax != null && (
                      <div className="flex items-center gap-2">
                        <Users2 className="w-4 h-4 text-glacier-light shrink-0" />
                        {exp.groupSizeMax} {t("spotsLabel")}
                      </div>
                    )}
                  </div>

                  {exp.bestSeason && (
                    <p className="text-xs text-mist/70 uppercase tracking-wide mb-5">
                      {t("seasonLabel")}: {exp.bestSeason}
                    </p>
                  )}

                  <div className="mt-auto flex gap-3">
                    <Link
                      href={`/expeditions/${exp.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 border border-white/20 text-snow px-5 py-3 text-sm tracking-wide hover:border-glacier-light hover:text-glacier-light transition-colors"
                    >
                      {t("detailsButton")}
                    </Link>
                    <a
                      href="#contact"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-snow text-obsidian px-5 py-3 text-sm tracking-wide hover:bg-glacier-light transition-colors"
                    >
                      {t("applyButton")}
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PhotoCarousel({
  photos,
  fallbackIndex,
  alt,
  children,
}: {
  photos: string[];
  fallbackIndex: number;
  alt: string;
  children?: ReactNode;
}) {
  const slides = photos.length > 0 ? photos : [coverImageFor(fallbackIndex)];
  const [index, setIndex] = useState(0);

  function go(delta: number, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <div className="relative h-64 overflow-hidden">
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent" />

      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => go(-1, e)}
            aria-label="Предыдущее фото"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-obsidian/60 text-snow opacity-0 group-hover:opacity-100 hover:bg-obsidian/80 transition-opacity rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => go(1, e)}
            aria-label="Следующее фото"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-obsidian/60 text-snow opacity-0 group-hover:opacity-100 hover:bg-obsidian/80 transition-opacity rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                aria-label={`Фото ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? "bg-snow" : "bg-snow/30"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {children}
    </div>
  );
}
