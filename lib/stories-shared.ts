export interface PublicStorySummary {
  id: string;
  slug: string;
  year: number | null;
  coverUrl: string | null;
  title: string;
  description: string | null;
}

export interface PublicStoryDetail extends PublicStorySummary {
  expeditionTitle: string | null;
  expeditionSlug: string | null;
  photoUrls: string[];
}
