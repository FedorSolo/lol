"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Compass,
  Layers,
  Users,
  Dumbbell,
  BadgeCheck,
  HeartPulse,
  Target,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

// Icons are code, not content — order must match the "why.items" array in
// messages/{locale}.json.
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

interface Item {
  title: string;
  text: string;
}

export default function WhyDifferent() {
  const t = useTranslations("why");
  const items = t.raw("items") as Item[];

  return (
    <section id="why" className="bg-obsidian py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <p className="md:col-span-4 font-mono text-xs tracking-widest2 uppercase text-glacier-light">
            {t("eyebrow")}
          </p>
          <h2 className="md:col-span-8 font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
            {t("title1")}
            <br />
            {t("title2")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {items.map((item, i) => {
            const Icon = ICONS[i];
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
      </div>
    </section>
  );
}
