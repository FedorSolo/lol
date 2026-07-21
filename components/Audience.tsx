"use client";

import { motion } from "framer-motion";
import { Footprints, Bike, Trophy, Compass, Flag, Award, LucideIcon } from "lucide-react";
import { audience } from "@/lib/data";

const icons: Record<string, LucideIcon> = { Footprints, Bike, Trophy, Compass, Flag, Award };

export default function Audience() {
  return (
    <section className="bg-ash py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <p className="md:col-span-4 font-mono text-xs tracking-widest2 uppercase text-glacier-light">
            Кому это подходит
          </p>
          <h2 className="md:col-span-8 font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
            Разные истории.
            <br />
            Один результат — вершина
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {audience.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="bg-obsidian border border-white/10 p-8 hover:border-glacier-light/40 transition-colors"
              >
                <Icon className="w-6 h-6 text-glacier-light mb-6" strokeWidth={1.5} />
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
