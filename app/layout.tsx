import type { Metadata } from "next";
import { PT_Sans_Narrow, Inter, JetBrains_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import { getSiteTheme } from "@/lib/theme-data";
import { FONT_DISPLAY_OPTIONS, FONT_BODY_OPTIONS, findFont } from "@/lib/theme-fonts";
import { SITE_URL } from "@/lib/site-url";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

// PT Sans Narrow — designed by ParaType (Russian type foundry), native Cyrillic
// support, narrow proportions that echo topographic-map and altitude signage.
// These are the DEFAULTS, always loaded (fast, self-hosted via next/font).
// If the admin picks a different font in /admin/settings, it's loaded
// separately at runtime below and overrides these via CSS variables.
const display = PT_Sans_Narrow({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// This is the single shared root for BOTH the public, trilingual site
// (app/[locale]/...) and the Russian-only /admin panel — Next.js allows
// only one <html>/<body> pair for the whole app directory tree. Locale is
// resolved from next-intl's request config (set by middleware.ts); /admin
// requests fall back to the default locale, which is fine since the panel
// itself isn't translated.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, theme] = await Promise.all([getLocale(), getSiteTheme()]);

  const displayFont = findFont(FONT_DISPLAY_OPTIONS, theme.fontDisplay);
  const bodyFont = findFont(FONT_BODY_OPTIONS, theme.fontBody);
  const customFontLinks = [displayFont, bodyFont].filter((f) => f.googleFontsParam);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CumbrePeak",
    url: SITE_URL,
    ...(theme.contactEmail && { email: theme.contactEmail }),
    ...(theme.contactPhone && { telephone: theme.contactPhone }),
    sameAs: [theme.instagramUrl, theme.facebookUrl].filter(Boolean),
  };

  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <JsonLd data={organizationSchema} />
        {customFontLinks.map((f) => (
          <link
            key={f.key}
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css2?${f.googleFontsParam}`}
          />
        ))}
        <style
          // Runtime theme override — see /admin/settings. Defaults live in
          // globals.css; this only renders when the admin picked something
          // different from the built-in defaults.
          dangerouslySetInnerHTML={{
            __html: `:root {
              --color-bg: ${theme.backgroundColor};
              --color-accent: ${theme.accentColor};
              ${theme.fontDisplay !== "default" ? `--font-display: ${displayFont.cssFamily};` : ""}
              ${theme.fontBody !== "default" ? `--font-body: ${bodyFont.cssFamily};` : ""}
            }`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
