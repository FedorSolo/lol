"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { HeroContent } from "@/lib/site-content-shared";

export default function Hero({ content, posterUrl }: { content: HeroContent; posterUrl: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const lines = [content.line1, content.line2, content.line3];

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
        >
          <source
            src="https://videos.pexels.com/video-files/29822397/12809486_2560_1440_60fps.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-obsidian/85 via-obsidian/60 to-obsidian"
      />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-24 md:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-xs md:text-sm tracking-widest2 text-glacier-light uppercase mb-6"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          {content.eyebrow}
        </motion.p>

        <h1
          className="font-display font-bold uppercase text-5xl sm:text-6xl md:text-8xl leading-[0.95] text-snow text-balance max-w-4xl"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}
        >
          {lines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: "easeOut" }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 max-w-xl text-mist text-base md:text-lg font-body"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#contact"
            className="bg-snow text-obsidian px-7 py-3.5 text-sm tracking-wide font-medium hover:bg-glacier-light transition-colors"
          >
            {content.applyButton}
          </a>
          <a
            href="#expeditions"
            className="border border-white/30 text-snow px-7 py-3.5 text-sm tracking-wide hover:border-glacier-light hover:text-glacier-light transition-colors"
          >
            {content.viewButton}
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ArrowDown className="w-5 h-5 text-mist" />
      </motion.div>
    </section>
  );
}
