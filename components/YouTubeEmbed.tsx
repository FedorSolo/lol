import { youTubeEmbedUrl } from "@/lib/youtube";

export default function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const embedUrl = youTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="relative w-full aspect-video">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border border-white/10"
      />
    </div>
  );
}
