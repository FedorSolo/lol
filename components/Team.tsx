"use client";

import { motion } from "framer-motion";
import { team } from "@/lib/data";

export default function Team() {
  return (
    <section className="bg-obsidian py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <p className="md:col-span-4 font-mono text-xs tracking-widest2 uppercase text-glacier-light">
            Команда
          </p>
          <h2 className="md:col-span-8 font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
            Люди, которые
            <br />
            доведут вас до вершины
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center border border-white/10 bg-ash/50 px-8 py-12"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-glacier-light/30 mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-display font-bold uppercase text-2xl text-snow tracking-wide">
                {member.name}
              </h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-glacier-light">
                {member.role}
              </p>
              <p className="mt-5 text-mist text-sm leading-relaxed max-w-sm">{member.bio}</p>

              <div className="mt-8 flex gap-10 border-t border-white/10 pt-6 w-full justify-center">
                {member.stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-mono text-2xl text-snow">{s.value}</div>
                    <div className="text-[11px] uppercase tracking-wide text-mist">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
