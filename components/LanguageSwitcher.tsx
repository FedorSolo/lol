"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { ru: "RU", es: "ES", en: "EN" };

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="text-white/20 mx-1">|</span>}
          <button
            onClick={() => router.replace(pathname, { locale: l })}
            className={`text-xs tracking-wide transition-colors ${
              l === locale ? "text-snow" : "text-mist hover:text-snow"
            }`}
            aria-current={l === locale ? "true" : undefined}
          >
            {LABELS[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
