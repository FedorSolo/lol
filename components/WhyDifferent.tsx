"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Layers,
  Users,
  Dumbbell,
  BadgeCheck,
  HeartPulse,
  Target,
  ShieldCheck,
  Check,
  X,
  LucideIcon,
} from "lucide-react";
import type { WhyContent } from "@/lib/site-content-shared";

// Icons are code, not content — order must match the "items" array.
const ICONS: LucideIcon[] = [
  Compass,
  Layers,
  Users,
  Dumbbell,
  BadgeCheck,
  HeartPulse,
  Target,
  ShieldCheck,
];

export default function WhyDifferent({
  content,
  photoUrl,
}: {
  content: WhyContent;
  photoUrl: string;
}) {
  return (
    <section id="why" className="bg-obsidian py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-8 mb-16 items-end">
          <div className="md:col-span-7">
            <p className="font-mono text-xs tracking-widest2 uppercase text-glacier-light mb-4">
              {content.eyebrow}
            </p>
            <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
              {content.title1}
              <br />
              {content.title2}
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-5 h-56 md:h-72 overflow-hidden border border-white/10"
          >
            <img
              src={photoUrl}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {content.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="bg-obsidian p-8 hover:bg-ash transition-colors"
              >
                {Icon && <Icon className="w-6 h-6 text-glacier-light mb-6" strokeWidth={1.5} />}
                <h3 className="font-display font-bold text-xl text-snow uppercase tracking-wide mb-3">
                  {item.title}
                </h3>
                <p className="text-mist text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            );
          })}
        </div>

        {content.comparisonRows && content.comparisonRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mt-20 border border-white/10"
          >
            <div className="grid grid-cols-2 border-b border-white/10">
              <div className="px-5 py-4 md:px-8 md:py-5">
                <span className="font-mono text-[11px] uppercase tracking-widest2 text-mist">
                  {content.comparisonTitle}
                </span>
              </div>
              <div className="px-5 py-4 md:px-8 md:py-5 bg-glacier/10 border-l border-white/10">
                <span className="font-display font-bold uppercase tracking-wide text-glacier-light">
                  {content.comparisonTitleUs}
                </span>
              </div>
            </div>

            {content.comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-2 ${
                  i < content.comparisonRows!.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="px-5 py-4 md:px-8 md:py-5 flex items-start gap-3">
                  <X className="w-4 h-4 text-mist/60 shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs text-mist/70 uppercase tracking-wide mb-1">
                      {row.label}
                    </div>
                    <div className="text-sm text-mist">{row.generic}</div>
                  </div>
                </div>
                <div className="px-5 py-4 md:px-8 md:py-5 bg-glacier/5 border-l border-white/10 flex items-start gap-3">
                  <Check className="w-4 h-4 text-glacier-light shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <div className="text-xs text-mist/70 uppercase tracking-wide mb-1 md:hidden">
                      {row.label}
                    </div>
                    <div className="text-sm text-snow">{row.us}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
