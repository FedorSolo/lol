"use client";

import { motion } from "framer-motion";
import type { PhilosophyExtendedContent } from "@/lib/site-content-shared";

export default function PhilosophyExtended({ content }: { content: PhilosophyExtendedContent }) {
  return (
    <section className="bg-ash py-28 md:py-36 border-t border-white/10">
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs tracking-widest2 uppercase text-glacier-light mb-8"
        >
          {content.title}
        </motion.h2>

        <div className="flex flex-col gap-6">
          {content.paragraphs.map((p, i) => (
            <motion.p
              key={p}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="font-display text-xl md:text-2xl leading-snug text-snow whitespace-pre-line text-balance"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
