"use client";

import { motion } from "framer-motion";
import type { LevelsContent } from "@/lib/site-content-shared";

export default function Levels({ content }: { content: LevelsContent }) {
  return (
    <section className="bg-ash py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-widest2 uppercase text-glacier-light mb-4">
            {content.eyebrow}
          </p>
          <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
            {content.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/10">
          {content.levels.map((level, i) => (
            <motion.div
              key={level.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-obsidian p-8 md:p-10 flex flex-col"
            >
              <span className="font-display font-bold text-5xl text-glacier/25 leading-none mb-6">
                {level.number}
              </span>
              <p className="font-mono text-xs uppercase tracking-widest2 text-glacier-light mb-2">
                {level.subtitle}
              </p>
              <h3 className="font-display font-bold text-2xl uppercase text-snow tracking-wide mb-4">
                {level.title}
              </h3>
              <p className="text-mist text-sm leading-relaxed whitespace-pre-line flex-1">
                {level.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
