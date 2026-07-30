import { describe, it, expect } from "vitest";
import { coverImageFor } from "@/lib/expeditions-shared";

describe("coverImageFor", () => {
  it("returns a valid https Unsplash URL", () => {
    const url = coverImageFor(0);
    expect(url).toMatch(/^https:\/\/images\.unsplash\.com\//);
  });

  it("cycles through the fallback list rather than throwing for large indices", () => {
    expect(() => coverImageFor(0)).not.toThrow();
    expect(() => coverImageFor(4)).not.toThrow();
    expect(() => coverImageFor(5)).not.toThrow(); // wraps around
    expect(() => coverImageFor(999)).not.toThrow();
  });

  it("wraps around: index 0 and index 5 return the same image (5-item list)", () => {
    expect(coverImageFor(0)).toBe(coverImageFor(5));
  });

  it("different indices within one cycle return different images", () => {
    expect(coverImageFor(0)).not.toBe(coverImageFor(1));
  });
});
