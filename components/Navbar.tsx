"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#why", label: t("why") },
    { href: "/#levels", label: t("levels") },
    { href: "/#expeditions", label: t("expeditions") },
    { href: "/#timeline", label: t("timeline") },
    { href: "/#faq", label: t("faq") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-obsidian transition-shadow duration-500 ${
        scrolled ? "border-b border-white/10 shadow-lg shadow-obsidian/50" : "border-b border-white/5"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
        <Link href="/#top" className="flex items-center gap-2 font-display text-2xl tracking-wide">
          <img src="/logo-mark.png" alt="" className="w-6 h-6 object-contain" />
          <span className="text-snow">{t("brand")}</span>
        </Link>

        <ul className="hidden md:flex items-center gap-9 font-body text-sm text-mist">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-snow transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/stories" className="hover:text-snow transition-colors">
              {t("gallery")}
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-snow transition-colors">
              {t("blog")}
            </Link>
          </li>
        </ul>

        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitcher />
          <Link
            href="/#contact"
            className="inline-flex items-center border border-glacier-light/60 text-snow text-sm px-5 py-2.5 tracking-wide hover:bg-glacier-light hover:text-obsidian transition-colors"
          >
            {t("apply")}
          </Link>
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
                  <Link href={l.href} onClick={() => setOpen(false)} className="hover:text-snow">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/stories" onClick={() => setOpen(false)} className="hover:text-snow">
                  {t("gallery")}
                </Link>
              </li>
              <li>
                <Link href="/blog" onClick={() => setOpen(false)} className="hover:text-snow">
                  {t("blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="inline-block mt-2 border border-glacier-light/60 text-snow px-5 py-2.5"
                >
                  {t("apply")}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
