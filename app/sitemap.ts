import type { MetadataRoute } from "next";
import { GUIDE_CATEGORIES } from "@/lib/wp";
import { SITE_URL, getAllPosts, guideUrl } from "@/lib/site";

// 1시간마다 갱신 (WordPress에 새 글이 올라오면 자동 반영)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/guides`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about-lending`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categories: MetadataRoute.Sitemap = GUIDE_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/guides?cat=${encodeURIComponent(c)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const posts = await getAllPosts();
  const articles: MetadataRoute.Sitemap = posts.map((p) => ({
    url: guideUrl(p.slug),
    lastModified: new Date(p.modified),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...statics, ...categories, ...articles];
}
