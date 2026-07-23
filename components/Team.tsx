"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Photos and years of experience are facts, not translated text — order
// must match the "team.members" array in messages/{locale}.json.
const IMAGES = ["/images/222587_original.jpg", "/images/69698932_504812243438000_623966195394198982_n.jpg"];
const YEARS = ["10", "15"];

interface Member {
  name: string;
  role: string;
  bio: string;
  statValue: string;
  statLabel: string;
}

export default function Team() {
  const t = useTranslations("team");
  const members = t.raw("members") as Member[];
  const yearsLabel = t("yearsLabel");

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

        <div className="grid md:grid-cols-2 gap-10">
          {members.map((member, i) => (
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
                  src={IMAGES[i]}
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
                <div>
                  <div className="font-mono text-2xl text-snow">{YEARS[i]}</div>
                  <div className="text-[11px] uppercase tracking-wide text-mist">{yearsLabel}</div>
                </div>
                <div>
                  <div className="font-mono text-2xl text-snow">{member.statValue}</div>
                  <div className="text-[11px] uppercase tracking-wide text-mist">{member.statLabel}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
