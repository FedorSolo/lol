"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { TrainingProgramContent } from "@/lib/site-content-shared";

export default function TrainingProgramTeaser({
  content,
  linkLabel,
}: {
  content: TrainingProgramContent;
  linkLabel: string;
}) {
  const introFirstLine = content.intro.split("\n")[0];

  return (
    <section className="bg-obsidian py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="border border-white/10 p-8 md:p-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <h2 className="font-display font-bold uppercase text-3xl md:text-4xl leading-[1.05] text-snow text-balance mb-4">
              {content.title1}
              <br />
              <span className="text-glacier-light">{content.title2}</span>
            </h2>
            <p className="text-mist text-sm md:text-base leading-relaxed max-w-lg">{introFirstLine}</p>
          </div>

          <Link
            href="/preparation"
            className="shrink-0 inline-flex items-center gap-2 bg-snow text-obsidian px-6 py-3.5 text-sm tracking-wide hover:bg-glacier-light transition-colors"
          >
            {linkLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
