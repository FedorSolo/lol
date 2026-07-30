import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("transliterates Cyrillic to Latin", () => {
    expect(slugify("Аконкагуа")).toBe("akonkagua");
  });

  it("leaves an already-Latin slug intact", () => {
    expect(slugify("aconcagua")).toBe("aconcagua");
  });

  it("lowercases input", () => {
    expect(slugify("ACONCAGUA")).toBe("aconcagua");
  });

  it("replaces spaces and punctuation with hyphens", () => {
    expect(slugify("Cerro Plata, Mendoza!")).toBe("cerro-plata-mendoza");
  });

  it("collapses multiple separators into a single hyphen", () => {
    expect(slugify("охос   дель   саладо")).toBe("ohos-del-salado");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("  -Ланин-  ")).toBe("lanin");
  });

  it("handles mixed Cyrillic and Latin input", () => {
    expect(slugify("Aconcagua 2026 Экспедиция")).toBe("aconcagua-2026-ekspeditsiya");
  });

  it("returns an empty string for input with no usable characters", () => {
    expect(slugify("!!!")).toBe("");
  });

  it("truncates to 60 characters", () => {
    const long = "a".repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(60);
  });
});
