export interface FontOption {
  key: string;
  label: string;
  cssFamily: string;
  googleFontsParam: string; // used to build the Google Fonts <link> URL
}

export const FONT_DISPLAY_OPTIONS: FontOption[] = [
  { key: "default", label: "PT Sans Narrow (по умолчанию)", cssFamily: "'PT Sans Narrow', sans-serif", googleFontsParam: "" },
  { key: "oswald", label: "Oswald — узкий, строгий", cssFamily: "'Oswald', sans-serif", googleFontsParam: "family=Oswald:wght@400;500;600;700&display=swap" },
  { key: "montserrat", label: "Montserrat — геометричный", cssFamily: "'Montserrat', sans-serif", googleFontsParam: "family=Montserrat:wght@400;600;700;800&display=swap" },
  { key: "playfair", label: "Playfair Display — премиальный, с засечками", cssFamily: "'Playfair Display', serif", googleFontsParam: "family=Playfair+Display:wght@400;600;700;800&display=swap" },
  { key: "roboto-condensed", label: "Roboto Condensed — компактный", cssFamily: "'Roboto Condensed', sans-serif", googleFontsParam: "family=Roboto+Condensed:wght@400;500;600;700&display=swap" },
];

export const FONT_BODY_OPTIONS: FontOption[] = [
  { key: "default", label: "Inter (по умолчанию)", cssFamily: "'Inter', sans-serif", googleFontsParam: "" },
  { key: "roboto", label: "Roboto — нейтральный", cssFamily: "'Roboto', sans-serif", googleFontsParam: "family=Roboto:wght@400;500;600&display=swap" },
  { key: "open-sans", label: "Open Sans — мягкий", cssFamily: "'Open Sans', sans-serif", googleFontsParam: "family=Open+Sans:wght@400;500;600&display=swap" },
  { key: "pt-sans", label: "PT Sans — российский стандарт", cssFamily: "'PT Sans', sans-serif", googleFontsParam: "family=PT+Sans:wght@400;700&display=swap" },
  { key: "nunito-sans", label: "Nunito Sans — округлый", cssFamily: "'Nunito Sans', sans-serif", googleFontsParam: "family=Nunito+Sans:wght@400;600;700&display=swap" },
];

export function findFont(options: FontOption[], key: string): FontOption {
  return options.find((o) => o.key === key) ?? options[0];
}
