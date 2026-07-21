"use client";

import { motion } from "framer-motion";
import { Mountain, Gauge, CalendarDays, Users2, ArrowUpRight } from "lucide-react";
import { expeditions } from "@/lib/data";

export default function Expeditions() {
  return (
    <section id="expeditions" className="bg-ash py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <p className="md:col-span-4 font-mono text-xs tracking-widest2 uppercase text-glacier-light">
            Ближайшие экспедиции
          </p>
          <h2 className="md:col-span-8 font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
            Пять вершин.
            <br />
            Один стандарт подготовки
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {expeditions.map((exp, i) => (
            <motion.article
              key={exp.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden bg-obsidian border border-white/10 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent" />
                <div className="absolute top-4 right-4 bg-obsidian/70 backdrop-blur-sm border border-white/10 px-3 py-1.5 font-mono text-xs text-snow">
                  {exp.price}
                </div>
                <h3 className="absolute bottom-4 left-5 font-display font-bold uppercase text-3xl text-snow">
                  {exp.name}
                </h3>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-mist text-sm leading-relaxed mb-6">{exp.text}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-xs text-mist">
                  <div className="flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-glacier-light shrink-0" />
                    {exp.altitude}
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-glacier-light shrink-0" />
                    {exp.difficulty}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-glacier-light shrink-0" />
                    {exp.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-glacier-light shrink-0" />
                    {exp.spots} мест
                  </div>
                </div>

                <p className="text-xs text-mist/70 uppercase tracking-wide mb-5">
                  Сезон: {exp.season}
                </p>

                <a
                  href="#contact"
                  className="mt-auto inline-flex items-center justify-center gap-2 border border-white/20 text-snow px-5 py-3 text-sm tracking-wide hover:border-glacier-light hover:text-glacier-light hover:bg-glacier-light/5 transition-colors"
                >
                  Подать заявку
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
