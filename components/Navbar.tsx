"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Menu, X, Mountain } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#why", label: t("why") },
    { href: "#expeditions", label: t("expeditions") },
    { href: "#timeline", label: t("timeline") },
    { href: "#faq", label: t("faq") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-obsidian/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display text-2xl tracking-wide">
          <Mountain className="w-5 h-5 text-glacier-light" strokeWidth={1.5} />
          <span className="text-snow">{t("brand")}</span>
        </a>

        <ul className="hidden md:flex items-center gap-9 font-body text-sm text-mist">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-snow transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitcher />
          <a
            href="#contact"
            className="inline-flex items-center border border-glacier-light/60 text-snow text-sm px-5 py-2.5 tracking-wide hover:bg-glacier-light hover:text-obsidian transition-colors"
          >
            {t("apply")}
          </a>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <button
            className="text-snow"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-obsidian border-b border-white/10"
          >
            <ul className="flex flex-col px-6 py-4 gap-4 font-body text-mist">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="hover:text-snow">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="inline-block mt-2 border border-glacier-light/60 text-snow px-5 py-2.5"
                >
                  {t("apply")}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
