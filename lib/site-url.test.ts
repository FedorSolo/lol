import { describe, it, expect } from "vitest";
import { buildHreflangAlternates, SITE_URL } from "@/lib/site-url";

describe("buildHreflangAlternates", () => {
  it("builds one URL per locale for the homepage", () => {
    const alternates = buildHreflangAlternates("");
    expect(alternates.ru).toBe(`${SITE_URL}/ru`);
    expect(alternates.es).toBe(`${SITE_URL}/es`);
    expect(alternates.en).toBe(`${SITE_URL}/en`);
  });

  it("preserves the given path for every locale", () => {
    const alternates = buildHreflangAlternates("/expeditions/aconcagua");
    expect(alternates.ru).toBe(`${SITE_URL}/ru/expeditions/aconcagua`);
    expect(alternates.es).toBe(`${SITE_URL}/es/expeditions/aconcagua`);
    expect(alternates.en).toBe(`${SITE_URL}/en/expeditions/aconcagua`);
  });

  it("includes an x-default pointing at the default locale (ru)", () => {
    const alternates = buildHreflangAlternates("/stories");
    expect(alternates["x-default"]).toBe(`${SITE_URL}/ru/stories`);
  });
});
