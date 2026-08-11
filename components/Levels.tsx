"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { LevelsContent } from "@/lib/site-content-shared";
import type { PublicExpedition } from "@/lib/expeditions-shared";
import { coverImageFor } from "@/lib/expeditions-shared";

export default function Levels({
  content,
  expeditions,
}: {
  content: LevelsContent;
  expeditions: PublicExpedition[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = content.levels[activeIndex];

  const matchingExpeditions = active?.difficultyLevelId
    ? expeditions.filter((e) => e.difficultyLevelId === active.difficultyLevelId)
    : [];

  return (
    <section id="levels" className="bg-ash py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-14">
          <p className="font-mono text-xs tracking-widest2 uppercase text-glacier-light mb-4">
            {content.eyebrow}
          </p>
          <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
            {content.title}
          </h2>
        </div>

        {/* Tabs — only one level's content is shown at a time, instead of
            three full cards stacked on the page at once. */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {content.levels.map((level, i) => (
            <button
              key={level.title}
              onClick={() => setActiveIndex(i)}
              className={`px-5 py-2.5 text-sm border transition-colors ${
                i === activeIndex
                  ? "border-glacier-light text-snow bg-glacier/10"
                  : "border-white/15 text-mist hover:border-white/30 hover:text-snow"
              }`}
            >
              <span className="font-mono text-xs text-glacier-light mr-2">{level.number}</span>
              {level.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="font-mono text-xs uppercase tracking-widest2 text-glacier-light mb-2">
                {active.subtitle}
              </p>
              <h3 className="font-display font-bold text-2xl md:text-3xl uppercase text-snow tracking-wide mb-5">
                {active.title}
              </h3>
              <p className="text-mist text-sm md:text-base leading-relaxed whitespace-pre-line">
                {active.text}
              </p>
            </div>

            {matchingExpeditions.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingExpeditions.map((exp, i) => (
                  <Link
                    key={exp.id}
                    href={`/expeditions/${exp.slug}`}
                    className="group border border-white/10 flex flex-col hover:border-glacier-light/40 transition-colors bg-obsidian"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={exp.coverUrl ?? coverImageFor(i)}
                        alt={exp.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="font-display font-bold uppercase text-lg text-snow mb-2">
                        {exp.title}
                      </h4>
                      <div className="flex items-center justify-between mt-auto pt-3 text-xs text-mist">
                        <span>{exp.durationDays ? `${exp.durationDays} дней` : ""}</span>
                        <span className="inline-flex items-center gap-1 text-glacier-light group-hover:gap-2 transition-all">
                          Подробнее
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
