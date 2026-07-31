// Handles the common YouTube URL shapes:
// https://www.youtube.com/watch?v=XXXXXXXXXXX
// https://youtu.be/XXXXXXXXXXX
// https://www.youtube.com/embed/XXXXXXXXXXX
// https://www.youtube.com/shorts/XXXXXXXXXXX
export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
      const match = parsed.pathname.match(/^\/(embed|shorts)\/([^/]+)/);
      if (match) return match[2];
    }

    return null;
  } catch {
    return null;
  }
}

export function youTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
