// 사이트 공통 상수 + 사이트맵/llms.txt 가 함께 쓰는 글 목록 조회
import { wpUrl, stripHtml, GUIDE_CATEGORIES } from "@/lib/wp";

export const SITE_URL = (process.env.SITE_URL || "https://moneybrief.net").replace(/\/$/, "");
export const SITE_NAME = "money brief";

export type SitePost = {
  slug: string;
  title: string;
  excerpt: string;
  cat: string;
  date: string;
  modified: string;
};

type WpCat = { id: number; name: string };
/**
 * sitemap / llms.txt 전용 fetch.
 * lib/wp.ts 의 wpFetch 는 cache:"no-store" 라서 라우트의 revalidate 설정과 충돌해요.
 * 여기서는 1시간 ISR 캐시를 써서 크롤러가 자주 때려도 WordPress 부하가 없게 합니다.
 */
async function wpCached<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(wpUrl(path), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type WpPost = {
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  categories: number[];
};

/** 가이드 카테고리에 속한 공개 글 전체 (페이지네이션 포함, 최신순) */
export async function getAllPosts(): Promise<SitePost[]> {
  const cats = (await wpCached<WpCat[]>("/wp/v2/categories?per_page=100&_fields=id,name")) || [];
  const catName: Record<number, string> = {};
  const ids: number[] = [];
  for (const c of cats) {
    catName[c.id] = c.name;
    if (GUIDE_CATEGORIES.includes(c.name)) ids.push(c.id);
  }
  if (!ids.length) return [];

  const out: SitePost[] = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await wpCached<WpPost[]>(
      `/wp/v2/posts?categories=${ids.join(",")}&per_page=100&page=${page}&orderby=date&order=desc&_fields=slug,title,excerpt,date,modified,categories`,
    );
    if (!batch || !batch.length) break;
    for (const p of batch) {
      out.push({
        slug: decodeURIComponent(p.slug),
        title: stripHtml(p.title?.rendered || ""),
        excerpt: stripHtml(p.excerpt?.rendered || "").slice(0, 160),
        cat: (p.categories || []).map((id) => catName[id]).find((n) => GUIDE_CATEGORIES.includes(n)) || "",
        date: p.date,
        modified: p.modified || p.date,
      });
    }
    if (batch.length < 100) break;
  }
  return out;
}

export const guideUrl = (slug: string) => `${SITE_URL}/guides/${encodeURIComponent(slug)}`;
