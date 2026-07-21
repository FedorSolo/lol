import type { Metadata } from "next";
import { PT_Sans_Narrow, Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "CUMBRE — Элитные экспедиции в Андах с полной подготовкой",
  description:
    "CUMBRE готовит к восхождению 8–10 недель до старта: персональные тренировки, контроль здоровья и лицензированный горный гид. Аконкагуа, Охос-дель-Саладо, Ланин и другие вершины Аргентины.",
  keywords: [
    "экспедиции в Андах",
    "восхождение на Аконкагуа",
    "горные экспедиции Аргентина",
    "подготовка к высотным восхождениям",
    "Охос-дель-Саладо",
  ],
  openGraph: {
    title: "CUMBRE — Элитные экспедиции в Андах",
    description:
      "Вершина начинается за 60 дней до экспедиции. Полная физическая подготовка включена.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
