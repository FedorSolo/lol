export interface PublicArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  authorName: string | null;
  publishedAt: string | null;
}

export interface PublicArticleDetail extends PublicArticleSummary {
  content: string; // Markdown
  metaTitle: string | null;
  metaDescription: string | null;
}
