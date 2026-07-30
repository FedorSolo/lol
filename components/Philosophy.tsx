"use client";

import { motion } from "framer-motion";
import type { PhilosophyContent } from "@/lib/site-content-shared";

export default function Philosophy({ content }: { content: PhilosophyContent }) {
  return (
    <section className="bg-obsidian py-20 md:py-28 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display font-bold uppercase text-3xl sm:text-4xl md:text-5xl leading-tight text-snow text-balance"
        >
          {content.line1}
          <br />
          <span className="text-glacier-light">{content.line2}</span>
        </motion.p>
      </div>
    </section>
  );
}
