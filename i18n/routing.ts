import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "es", "en"],
  defaultLocale: "ru",
  // Every URL always carries its locale segment (/ru, /es, /en) — including
  // the default. Matches the "единый slug на всех языках" decision: only
  // the locale prefix changes, the rest of the path is identical.
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
