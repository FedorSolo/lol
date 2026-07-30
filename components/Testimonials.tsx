"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";
import type { PublicTestimonial } from "@/lib/testimonials-shared";

interface StaticItem {
  quote: string;
  author: string;
  role: string;
}

export default function Testimonials({ items: dbItems }: { items: PublicTestimonial[] }) {
  const t = useTranslations("testimonials");
  const staticItems = t.raw("items") as StaticItem[];

  const display =
    dbItems.length > 0
      ? dbItems.map((it) => ({
          key: it.id,
          quote: it.quote,
          author: it.authorName,
          role: it.roleContext ?? it.expeditionTitle ?? "",
          photo: it.authorPhotoUrl,
          rating: it.rating,
        }))
      : staticItems.map((it) => ({
          key: it.author,
          quote: it.quote,
          author: it.author,
          role: it.role,
          photo: null as string | null,
          rating: 5,
        }));

  return (
    <section className="bg-ash py-28 md:py-36">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="bg-obsidian border border-white/10 p-8 flex flex-col"
            >
              <Quote className="w-6 h-6 text-glacier-light mb-5" strokeWidth={1.5} />

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s < item.rating ? "text-glacier-light" : "text-white/15"}`}
                    fill={s < item.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <p className="text-mist text-sm leading-relaxed flex-1 mb-6">«{item.quote}»</p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-ash shrink-0 border border-white/10">
                  {item.photo && (
                    <img src={item.photo} alt={item.author} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <div className="text-snow text-sm font-medium">{item.author}</div>
                  {item.role && <div className="text-mist text-xs">{item.role}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
