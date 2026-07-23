// Client-safe: no imports from lib/supabase/server.ts (which pulls in
// next/headers). Client Components (Expeditions.tsx, Contact.tsx) must
// import from HERE, never from lib/expeditions-data.ts — importing a
// server-only module from a "use client" file bundles it for the browser
// and Next.js will fail the build with a next/headers error.

export interface PublicExpedition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  country: string | null;
  altitudeM: number | null;
  durationDays: number | null;
  bestSeason: string | null;
  priceFrom: number | null;
  currency: string;
  groupSizeMax: number | null;
  difficultyLevelId: string | null;
  difficultyName: string | null;
}

export interface PublicDifficultyLevel {
  id: string;
  slug: string;
  name: string;
}

// A handful of curated Unsplash cover photos, used as a placeholder cycle
// until expedition_photos + Supabase Storage are wired into the admin UI
// (planned for the gallery/stories iteration).
const FALLBACK_COVERS = [
  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1600&auto=format&fit=crop",
];

export function coverImageFor(index: number) {
  return FALLBACK_COVERS[index % FALLBACK_COVERS.length];
}
