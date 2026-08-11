"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { TrainingProgramContent } from "@/lib/site-content-shared";

export default function TrainingProgram({ content }: { content: TrainingProgramContent }) {
  return (
    <section className="bg-obsidian py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance mb-6">
            {content.title1}
            <br />
            <span className="text-glacier-light">{content.title2}</span>
          </h2>
          <p className="text-mist text-base leading-relaxed whitespace-pre-line max-w-2xl mb-6">
            {content.intro}
          </p>

          <ul className="grid sm:grid-cols-2 gap-3 mb-16 max-w-2xl">
            {content.skills.map((skill) => (
              <li key={skill} className="flex items-start gap-2 text-snow text-sm">
                <Check className="w-4 h-4 text-glacier-light shrink-0 mt-0.5" />
                {skill}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="border border-white/10 p-8 md:p-12"
        >
          <h3 className="font-display font-bold uppercase text-2xl md:text-3xl text-snow mb-4">
            {content.onlineTitle}
          </h3>
          <p className="text-mist text-sm leading-relaxed whitespace-pre-line mb-6">
            {content.onlineIntro}
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 mb-8">
            {content.onlineItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-snow text-sm">
                <Check className="w-4 h-4 text-glacier-light shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-mist text-sm leading-relaxed whitespace-pre-line border-t border-white/10 pt-6">
            {content.closing}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
