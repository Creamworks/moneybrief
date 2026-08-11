import type { Metadata } from "next";
import styles from "./page.module.css";
import GuideList, { type Guide } from "./GuideList";
import { wpFetch, stripHtml, getMediaMap, GUIDE_CATEGORIES } from "@/lib/wp";

export const metadata: Metadata = {
  title: "주제별 금융 가이드 — money brief",
  description:
    "신용부터 사기 예방까지, 검증된 정보형 콘텐츠를 한곳에 모았어요. 주제별로 골라 보세요.",
};

type WpCat = { id: number; name: string };
type WpPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  categories: number[];
  featured_media?: number;
  acf?: { read_time?: number | string };
};

async function getGuides(): Promise<Guide[]> {
  const cats = (await wpFetch<WpCat[]>("/wp/v2/categories?per_page=100&_fields=id,name")) || [];
  const catName: Record<number, string> = {};
  const ids: number[] = [];
  for (const c of cats) {
    catName[c.id] = c.name;
    if (GUIDE_CATEGORIES.includes(c.name)) ids.push(c.id);
  }
  if (!ids.length) return [];
  const posts =
    (await wpFetch<WpPost[]>(
      `/wp/v2/posts?categories=${ids.join(",")}&per_page=100&_fields=id,slug,title,excerpt,date,categories,featured_media,acf`,
    )) || [];
  const media = await getMediaMap(posts.map((p) => p.featured_media || 0));
  return posts.map((p) => ({
    id: p.id,
    slug: decodeURIComponent(p.slug),
    title: stripHtml(p.title?.rendered || ""),
    excerpt: stripHtml(p.excerpt?.rendered || ""),
    cat: catName[p.categories?.[0]] || "",
    read_time: Number(p.acf?.read_time) || 0,
    date: p.date || "",
    image: (p.featured_media && media[p.featured_media]) || "",
  }));
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const sp = await searchParams;
  const guides = await getGuides();

  // Editor's Pick: WP(home-settings 페이지)의 ACF로 노출 여부·대상 글 제어
  const settings =
    (await wpFetch<{ acf?: { guide_pick_enabled?: boolean; guide_pick_post?: number[] } }[]>(
      "/wp/v2/pages?slug=home-settings&_fields=acf",
    )) || [];
  const pickAcf = settings[0]?.acf || {};
  const pickEnabled = pickAcf.guide_pick_enabled !== false; // 미설정 시 기본 노출
  const pickId = Array.isArray(pickAcf.guide_pick_post) ? pickAcf.guide_pick_post[0] : undefined;
  const latest = [...guides].sort((a, b) => b.date.localeCompare(a.date))[0] || null;
  const featured = !pickEnabled
    ? null
    : (pickId && guides.find((g) => g.id === pickId)) || latest;

  return (
    <div className={styles.page}>
      <GuideList posts={guides} featured={featured} initialCat={sp?.cat} />
    </div>
  );
}
