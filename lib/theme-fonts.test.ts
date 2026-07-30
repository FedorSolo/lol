import { describe, it, expect } from "vitest";
import { findFont, FONT_DISPLAY_OPTIONS, FONT_BODY_OPTIONS } from "@/lib/theme-fonts";

describe("findFont", () => {
  it("returns the matching option by key", () => {
    const found = findFont(FONT_DISPLAY_OPTIONS, "oswald");
    expect(found.key).toBe("oswald");
    expect(found.cssFamily).toContain("Oswald");
  });

  it("falls back to the first option (default) for an unknown key", () => {
    const found = findFont(FONT_BODY_OPTIONS, "does-not-exist");
    expect(found).toBe(FONT_BODY_OPTIONS[0]);
    expect(found.key).toBe("default");
  });

  it("every display option has a non-empty label and cssFamily", () => {
    for (const option of FONT_DISPLAY_OPTIONS) {
      expect(option.label.length).toBeGreaterThan(0);
      expect(option.cssFamily.length).toBeGreaterThan(0);
    }
  });

  it("the default option has no Google Fonts param (it's self-hosted via next/font)", () => {
    expect(FONT_DISPLAY_OPTIONS[0].googleFontsParam).toBe("");
    expect(FONT_BODY_OPTIONS[0].googleFontsParam).toBe("");
  });

  it("every non-default option has a Google Fonts param", () => {
    for (const option of [...FONT_DISPLAY_OPTIONS, ...FONT_BODY_OPTIONS].filter(
      (o) => o.key !== "default"
    )) {
      expect(option.googleFontsParam.length).toBeGreaterThan(0);
    }
  });
});
