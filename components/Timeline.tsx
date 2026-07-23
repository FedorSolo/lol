"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

interface Step {
  label: string;
  title: string;
  text: string;
}

const NUMBERS = ["01", "02", "03", "04", "05", "06", "07"];

export default function Timeline() {
  const t = useTranslations("timeline");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="timeline" className="bg-snow text-obsidian py-28 md:py-36">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="mb-20 text-center">
          <p className="font-mono text-xs tracking-widest2 uppercase text-stone mb-4">
            {t("eyebrow")}
          </p>
          <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-balance">
            {t("title1")}
            <br />
            {t("title2")}
          </h2>
        </div>

        <div className="flex flex-col items-center">
          {steps.map((step, i) => (
            <div key={step.title} className="w-full flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="w-full flex items-center gap-6 md:gap-10 bg-white/60 border border-obsidian/10 px-6 py-6 md:px-10 md:py-8"
              >
                <span className="font-display font-bold text-4xl md:text-5xl text-glacier/25 shrink-0 leading-none">
                  {NUMBERS[i]}
                </span>
                <div>
                  <div className="font-mono text-[11px] tracking-widest2 uppercase text-glacier mb-1">
                    {step.label}
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-wide">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-stone text-sm leading-relaxed">{step.text}</p>
                </div>
              </motion.div>

              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 + 0.15 }}
                  className="py-2"
                >
                  <ChevronDown className="w-5 h-5 text-glacier" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
