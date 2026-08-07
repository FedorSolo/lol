import { routing } from "@/i18n/routing";

export const SITE_URL = "https://cumbrepeak.com";

/**
 * Builds the `alternates.languages` object Next.js needs to emit
 * <link rel="alternate" hreflang="..."> tags — tells search engines that
 * /ru, /es, /en versions of a page are translations of each other, not
 * duplicate content competing against one another.
 *
 * @param path Path WITHOUT the locale prefix, e.g. "" for the homepage or
 *   "/expeditions/aconcagua" for an expedition page.
 */
export function buildHreflangAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of routing.locales) {
    alternates[locale] = `${SITE_URL}/${locale}${path}`;
  }
  // x-default points search engines to a sensible fallback (default locale).
  alternates["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`;
  return alternates;
}
