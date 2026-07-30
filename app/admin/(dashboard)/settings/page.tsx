import { getSiteThemeAdmin } from "./actions";
import ThemeEditor from "./ThemeEditor";
import { FONT_DISPLAY_OPTIONS, FONT_BODY_OPTIONS } from "@/lib/theme-fonts";

export default async function SettingsPage() {
  const theme = await getSiteThemeAdmin();
  const allFontLinks = [...FONT_DISPLAY_OPTIONS, ...FONT_BODY_OPTIONS].filter(
    (f) => f.googleFontsParam
  );

  return (
    <div>
      {/* Preload every font option so the live preview can render them. */}
      {allFontLinks.map((f) => (
        <link key={f.key} rel="stylesheet" href={`https://fonts.googleapis.com/css2?${f.googleFontsParam}`} />
      ))}

      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-2">Настройки</h1>
      <p className="text-mist text-sm max-w-lg mb-10">
        Фон, акцентный цвет и шрифты применяются сразу ко всему сайту (кроме страниц самой
        админки).
      </p>

      <ThemeEditor initial={theme} />
    </div>
  );
}
