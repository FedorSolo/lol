"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

interface Step {
  title: string;
  text: string;
}

export default function ApplicationProcess() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <section className="bg-obsidian py-28 md:py-36">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="bg-obsidian p-8"
            >
              <span className="font-mono text-xs text-glacier-light">{i + 1}</span>
              <h3 className="mt-3 font-display font-bold text-xl text-snow uppercase tracking-wide">
                {step.title}
              </h3>
              <p className="mt-2 text-mist text-sm leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-start gap-4 border border-glacier-light/20 bg-glacier/5 px-6 py-6 md:px-8 md:py-7"
        >
          <ShieldCheck className="w-6 h-6 text-glacier-light shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-mist text-sm md:text-base leading-relaxed">{t("trustNote")}</p>
        </motion.div>
      </div>
    </section>
  );
}
