"use client";

import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { saveSiteTheme, resetSiteTheme } from "./actions";
import { FONT_DISPLAY_OPTIONS, FONT_BODY_OPTIONS, findFont } from "@/lib/theme-fonts";
import type { SiteTheme } from "@/lib/theme-shared";

export default function ThemeEditor({ initial }: { initial: SiteTheme }) {
  const [theme, setTheme] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);

  const displayFont = findFont(FONT_DISPLAY_OPTIONS, theme.fontDisplay);
  const bodyFont = findFont(FONT_BODY_OPTIONS, theme.fontBody);

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    setSavedMsg(false);
    const result = await saveSiteTheme(theme);
    setSaving(false);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    setSavedMsg(true);
  }

  async function handleReset() {
    if (!confirm("Сбросить фон, цвет и шрифты к значениям по умолчанию?")) return;
    setSaving(true);
    const result = await resetSiteTheme();
    setSaving(false);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    window.location.reload();
  }

  const inputClass =
    "w-full bg-transparent border border-white/20 px-3 py-2 text-snow text-sm focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-1.5";

  return (
    <div className="grid lg:grid-cols-2 gap-10 max-w-5xl">
      <div className="flex flex-col gap-6">
        <div>
          <label className={labelClass}>Цвет фона сайта</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => setTheme((t) => ({ ...t, backgroundColor: e.target.value }))}
              className="w-12 h-10 bg-transparent border border-white/20 cursor-pointer"
            />
            <input
              className={inputClass}
              value={theme.backgroundColor}
              onChange={(e) => setTheme((t) => ({ ...t, backgroundColor: e.target.value }))}
            />
          </div>
          <p className="text-xs text-mist mt-1.5">
            Основной фон страниц. Второстепенные тёмные панели (карточки, чередующиеся блоки) не
            меняются — подобраны так, чтобы сочетаться с тёмным фоном.
          </p>
        </div>

        <div>
          <label className={labelClass}>Акцентный цвет</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.accentColor}
              onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
              className="w-12 h-10 bg-transparent border border-white/20 cursor-pointer"
            />
            <input
              className={inputClass}
              value={theme.accentColor}
              onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
            />
          </div>
          <p className="text-xs text-mist mt-1.5">
            Цвет кнопок, ссылок и выделений по всему сайту (сейчас — горный синий).
          </p>
        </div>

        <div>
          <label className={labelClass}>Шрифт заголовков</label>
          <select
            className={inputClass}
            value={theme.fontDisplay}
            onChange={(e) => setTheme((t) => ({ ...t, fontDisplay: e.target.value }))}
          >
            {FONT_DISPLAY_OPTIONS.map((f) => (
              <option key={f.key} value={f.key} className="bg-obsidian">
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Шрифт основного текста</label>
          <select
            className={inputClass}
            value={theme.fontBody}
            onChange={(e) => setTheme((t) => ({ ...t, fontBody: e.target.value }))}
          >
            {FONT_BODY_OPTIONS.map((f) => (
              <option key={f.key} value={f.key} className="bg-obsidian">
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
        {savedMsg && (
          <p className="text-xs text-glacier-light">
            Сохранено — обновите публичный сайт (Ctrl+Shift+R), чтобы увидеть изменения.
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-snow text-obsidian px-5 py-2.5 text-sm hover:bg-glacier-light transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-mist hover:text-red-400 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить всё
          </button>
        </div>
      </div>

      <div>
        <p className={labelClass}>Превью</p>
        <div
          className="border border-white/10 p-8 flex flex-col items-start gap-4"
          style={{ backgroundColor: theme.backgroundColor }}
        >
          <span
            className="uppercase text-3xl font-bold"
            style={{ fontFamily: displayFont.cssFamily, color: "#F6F8FA" }}
          >
            Вершина ждёт
          </span>
          <p className="text-sm" style={{ fontFamily: bodyFont.cssFamily, color: "#8B96A1" }}>
            Так будет выглядеть текст на сайте с выбранными шрифтами и цветом фона.
          </p>
          <button
            className="px-5 py-2.5 text-sm text-white"
            style={{ backgroundColor: theme.accentColor, fontFamily: bodyFont.cssFamily }}
          >
            Пример кнопки
          </button>
        </div>
        <p className="text-xs text-mist mt-3">
          Превью примерное — шрифты в нём подгружаются с Google Fonts и могут появиться не сразу.
        </p>
      </div>
    </div>
  );
}
