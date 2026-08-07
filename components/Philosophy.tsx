"use client";

import { motion } from "framer-motion";
import type { PhilosophyContent, PhilosophyExtendedContent } from "@/lib/site-content-shared";

export default function Philosophy({
  content,
  extended,
}: {
  content: PhilosophyContent;
  extended: PhilosophyExtendedContent;
}) {
  return (
    <section id="philosophy" className="bg-obsidian py-24 md:py-32 border-b border-white/10">
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
        {extended.title && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-widest2 uppercase text-glacier-light mb-6"
          >
            {extended.title}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display font-bold uppercase text-3xl sm:text-4xl md:text-5xl leading-tight text-snow text-balance mb-10"
        >
          {content.line1}
          <br />
          <span className="text-glacier-light">{content.line2}</span>
        </motion.p>

        <div className="flex flex-col gap-4">
          {extended.paragraphs.map((p, i) => (
            <motion.p
              key={p}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="text-mist text-sm md:text-base leading-relaxed whitespace-pre-line"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
