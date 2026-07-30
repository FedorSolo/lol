import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllPublishedSlugs } from "@/lib/expeditions-data";
import { getAllPublishedStorySlugs } from "@/lib/stories-data";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [expeditionSlugs, storySlugs] = await Promise.all([
    getAllPublishedSlugs(),
    getAllPublishedStorySlugs(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      changeFrequency: "weekly",
      priority: 1,
    });
    entries.push({
      url: `${SITE_URL}/${locale}/stories`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
    for (const slug of expeditionSlugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/expeditions/${slug}`,
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
    for (const slug of storySlugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/stories/${slug}`,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
