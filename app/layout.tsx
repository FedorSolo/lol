import { PT_Sans_Narrow, Inter, JetBrains_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

// PT Sans Narrow — designed by ParaType (Russian type foundry), native Cyrillic
// support, narrow proportions that echo topographic-map and altitude signage.
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
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
