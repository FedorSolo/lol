import { describe, it, expect } from "vitest";
import { extractYouTubeId, youTubeEmbedUrl } from "@/lib/youtube";

describe("extractYouTubeId", () => {
  it("extracts the id from a standard watch URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts the id from a youtu.be short URL", () => {
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts the id from an embed URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts the id from a Shorts URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("handles extra query params on a watch URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for a non-YouTube URL", () => {
    expect(extractYouTubeId("https://vimeo.com/12345")).toBeNull();
  });

  it("returns null for garbage input", () => {
    expect(extractYouTubeId("not a url")).toBeNull();
  });
});

describe("youTubeEmbedUrl", () => {
  it("builds a proper embed URL", () => {
    expect(youTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    );
  });

  it("returns null when the id can't be extracted", () => {
    expect(youTubeEmbedUrl("https://example.com")).toBeNull();
  });
});
