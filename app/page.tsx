import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { wpFetch, stripHtml, getMediaMap, catImage, GUIDE_CATEGORIES } from "@/lib/wp";
import { SITE_URL, guideUrl } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { baseNodes, webPageNode, itemListNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "money brief — 금융교육 콘텐츠 허브",
  description:
    "money brief는 ㈜바로크레디트대부가 만든 금융교육 콘텐츠예요. 대부업·신용·정부지원을 쉬운 말로, 정확하게 알려드려요.",
};

type WpCat = { id: number; name: string; count?: number };
type WpPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
  featured_media?: number;
  acf?: { read_time?: number | string };
};
type Card = { slug: string; title: string; excerpt: string; cat: string; read_time: number; image: string };

const POST_FIELDS = "id,slug,title,excerpt,categories,featured_media,acf";

// 카테고리별 색상 (바로바로론 홈페이지 pc_260728)
const CAT_COLORS: Record<string, { fg: string; bg: string }> = {
  신용관리: { fg: "#3182F6", bg: "#EBF3FF" },
  대출상식: { fg: "#7A5CFA", bg: "#F0EEFF" },
  금융생활: { fg: "#1ABAB8", bg: "#E6F9F9" },
  금융사기예방: { fg: "#FF6F61", bg: "#FFF0EF" },
  "금융이슈·인사이트": { fg: "#C79100", bg: "#FFF8D6" },
};
const catColor = (c: string) => CAT_COLORS[c] || { fg: "#4E5968", bg: "#F2F4F6" };

function toCard(p: WpPost, catName: Record<number, string>, media: Record<number, string>): Card {
  return {
    slug: decodeURIComponent(p.slug),
    title: stripHtml(p.title?.rendered || ""),
    excerpt: stripHtml(p.excerpt?.rendered || ""),
    cat: catName[p.categories?.[0]] || "",
    read_time: Number(p.acf?.read_time) || 0,
    image: (p.featured_media && media[p.featured_media]) || "",
  };
}

// CMS에서 선택한 글 ID들을 순서 유지하며 카드로 변환
async function cardsByIds(ids: number[], catName: Record<number, string>): Promise<Card[]> {
  const list = (ids || []).filter((n) => n > 0);
  if (!list.length) return [];
  const posts =
    (await wpFetch<WpPost[]>(
      `/wp/v2/posts?include=${list.join(",")}&orderby=include&per_page=${list.length}&_fields=${POST_FIELDS}`,
    )) || [];
  const media = await getMediaMap(posts.map((p) => p.featured_media || 0));
  return posts.map((p) => toCard(p, catName, media));
}

async function getHomeData(): Promise<{
  hooks: Card[];
  picks: Card[];
  recent: Card[];
  counts: Record<string, number>;
}> {
  const cats = (await wpFetch<WpCat[]>("/wp/v2/categories?per_page=100&_fields=id,name,count")) || [];
  const catName: Record<number, string> = {};
  const counts: Record<string, number> = {};
  const ids: number[] = [];
  for (const c of cats) {
    catName[c.id] = c.name;
    if (GUIDE_CATEGORIES.includes(c.name)) {
      ids.push(c.id);
      counts[c.name] = c.count ?? 0;
    }
  }
  if (!ids.length) return { hooks: [], picks: [], recent: [], counts };

  // 최신글(자동)
  const recentPosts =
    (await wpFetch<WpPost[]>(
      `/wp/v2/posts?categories=${ids.join(",")}&per_page=6&_fields=${POST_FIELDS}`,
    )) || [];
  const recentMedia = await getMediaMap(recentPosts.map((p) => p.featured_media || 0));
  const recent = recentPosts.map((p) => toCard(p, catName, recentMedia));

  // CMS 큐레이션 (홈 화면 설정 페이지의 ACF)
  const settings =
    (await wpFetch<{ acf?: { home_hooks?: number[]; home_picks?: number[] } }[]>(
      "/wp/v2/pages?slug=home-settings&_fields=acf",
    )) || [];
  const acf = settings[0]?.acf || {};
  let hooks = await cardsByIds(acf.home_hooks || [], catName);
  let picks = await cardsByIds(acf.home_picks || [], catName);
  // 비어 있으면 최신글로 폴백
  if (!hooks.length) hooks = recent.slice(0, 4);
  if (!picks.length) picks = recent.slice(0, 5);

  return { hooks, picks, recent, counts };
}

type GuideCat = {
  name: string;
  short?: string;
  desc: string;
  fallback: number;
  icon: ReactNode;
};

const GUIDE_CATS: GuideCat[] = [
  {
    name: "신용관리",
    desc: "점수가 매겨지는 원리부터 천천히 끌어올리는 법까지",
    fallback: 24,
    icon: (
      <>
        <path d="M3 17l5-5 4 4 8-8" />
        <path d="M16 8h4v4" />
      </>
    ),
  },
  {
    name: "대출상식",
    desc: "금리·한도·상환 방식까지, 헷갈리는 기본기를 정리해요",
    fallback: 31,
    icon: (
      <>
        <path d="M5 4h11l3 3v13H5z" />
        <path d="M9 9h6M9 13h6M9 17h4" />
      </>
    ),
  },
  {
    name: "금융생활",
    desc: "통장 쪼개기부터 비상금까지, 일상에서 쌓는 금융 습관",
    fallback: 18,
    icon: (
      <>
        <path d="M4 11l8-7 8 7" />
        <path d="M6 10v10h12V10" />
        <path d="M10 20v-5h4v5" />
      </>
    ),
  },
  {
    name: "금융사기예방",
    desc: "수법을 미리 알면 당하지 않는, 사례로 익히는 분별법",
    fallback: 22,
    icon: (
      <>
        <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    name: "금융이슈·인사이트",
    short: "금융이슈",
    desc: "바뀌는 제도와 정책, 내 지갑에 닿는 핵심만 짚어드려요",
    fallback: 15,
    icon: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="M8 10h8M8 14h5" />
        <path d="M4 6l-1 3h18l-1-3" />
      </>
    ),
  },
];

const CALC_CARDS = [
  {
    tab: "interest",
    title: "대출 이자 계산기",
    fg: "#3182F6",
    bg: "#EBF3FF",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2" />
      </>
    ),
  },
  {
    tab: "dsr",
    title: "DSR 계산기",
    fg: "#7A5CFA",
    bg: "#F0EEFF",
    icon: (
      <>
        <path d="M3 17l5-5 4 4 8-8" />
        <path d="M16 8h4v4" />
      </>
    ),
  },
  {
    tab: "loan",
    title: "원리금 계산기",
    fg: "#1ABAB8",
    bg: "#E6F9F9",
    icon: (
      <>
        <path d="M12 3a9 9 0 1 0 9 9" />
        <path d="M12 3v9l6 4" />
      </>
    ),
  },
  {
    tab: "prepay",
    title: "중도상환수수료 계산기",
    fg: "#FF6F61",
    bg: "#FFF0EF",
    icon: (
      <>
        <path d="M4 12h16" />
        <path d="m9 7-5 5 5 5" />
        <path d="M20 6v6" />
      </>
    ),
  },
];

export default async function Home() {
  const { hooks, picks, recent, counts } = await getHomeData();
  const feat = picks[0];
  const list = picks.slice(1, 5);
  const heroCount = (name: string, fb: number) => counts[name] ?? fb;

  const homeUrl = `${SITE_URL}/`;
  const jsonLd = [
    ...baseNodes(),
    webPageNode({
      url: homeUrl,
      name: "money brief — 금융교육 콘텐츠 허브",
      description:
        "money brief는 ㈜바로크레디트대부가 만든 금융교육 콘텐츠예요. 대부업·신용·정부지원을 쉬운 말로, 정확하게 알려드려요.",
    }),
    itemListNode(
      homeUrl,
      picks.slice(0, 5).map((c) => ({ name: c.title, url: guideUrl(c.slug) })),
    ),
  ];

  return (
    <>
      <JsonLd nodes={jsonLd} />
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <span className={styles.dot} />
              금융교육 콘텐츠 허브
            </span>
            <h1 className={styles.h1}>
              나만의 금융 정보,
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.h1Logo} src="/img/money-brief.svg" alt="money brief" />
            </h1>
            <p className={styles.lede}>
              쉽고 정확한 금융 콘텐츠를 한 곳에서.
              <br />
              대부업·신용·정부지원, <b>money brief</b>가 쉽게 알려드려요.
            </p>
            <div className={styles.heroCta}>
              <Link href="/guides" className={styles.btnDark}>
                대출 전 체크리스트 보기 →
              </Link>
            </div>
          </div>

          <div className={styles.heroCards}>
            <div className={`${styles.hCard} ${styles.hCardA}`}>
              <div className={`${styles.hCardArt} ${styles.artBlue}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/hero-credit.svg" alt="" />
              </div>
              <div className={styles.hCardMeta}>
                <div className={styles.hCardTitle}>신용관리</div>
                <div className={styles.hCardSub}>{heroCount("신용관리", 24)}개 가이드</div>
              </div>
            </div>

            <div className={`${styles.hCard} ${styles.hCardB}`}>
              <div className={`${styles.hCardArt} ${styles.artPurple} ${styles.artTall}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/hero-loan.svg" alt="" />
              </div>
              <div className={styles.hCardMeta}>
                <div className={styles.hCardTitle}>대출상식</div>
                <div className={styles.hCardSub}>{heroCount("대출상식", 31)}개 가이드</div>
              </div>
            </div>

            <div className={`${styles.hCard} ${styles.hCardC}`}>
              <div className={`${styles.hCardArt} ${styles.artCoral}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/hero-scam.svg" alt="" />
              </div>
              <div className={styles.hCardMeta}>
                <div className={styles.hCardTitle}>사기예방</div>
                <div className={styles.hCardSub}>{heroCount("금융사기예방", 22)}개 가이드</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOOK ===== */}
      <section className={styles.hook}>
        <div className={styles.wrap}>
          <div className={styles.hookHead}>
            <h2>이런 고민, 한 번쯤 해보셨죠?</h2>
          </div>
          <div className={styles.hookGrid}>
            {hooks.map((h) => {
              const c = catColor(h.cat);
              return (
                <Link className={styles.hookCard} href={`/guides/${h.slug}`} key={h.slug}>
                  <span className={styles.tag} style={{ color: c.fg, background: c.bg }}>
                    {h.cat}
                  </span>
                  <span className={styles.q}>{h.title}</span>
                  <span className={styles.go}>자세히 보기 →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== GUIDE CATEGORIES ===== */}
      <section className={styles.block}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <div>
              <span className={styles.secKicker}>금융가이드</span>
              <h2>주제별로 차근차근</h2>
              <p>한 번에 다 알 필요는 없어요. 지금 내게 필요한 주제부터 골라 보세요.</p>
            </div>
            <Link className={styles.moreLink} href="/guides">
              전체 가이드 보기 →
            </Link>
          </div>
          <div className={styles.guideGrid}>
            {GUIDE_CATS.map((g) => {
              const c = catColor(g.name);
              return (
                <Link
                  className={styles.guideCard}
                  href={`/guides?cat=${encodeURIComponent(g.name)}`}
                  key={g.name}
                >
                  <span className={styles.guideIco} style={{ color: c.fg, background: c.bg }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {g.icon}
                    </svg>
                  </span>
                  <h3>{g.short || g.name}</h3>
                  <p>{g.desc}</p>
                  <span className={styles.cnt}>
                    <span className={`${styles.cntN} tnum`} style={{ color: c.fg }}>
                      {counts[g.name] ?? g.fallback}
                    </span>
                    개 글
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== RECENT (WP) ===== */}
      <section className={`${styles.block} ${styles.blockWhite}`}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <div>
              <span className={styles.secKicker}>새로운 정보</span>
              <h2>금융가이드 최신글</h2>
              <p>
                금융 정보는 자주 업데이트돼요.
                <br />
                최근 올라온 글 중 놓치면 안 될 콘텐츠를 추천해요.
              </p>
            </div>
            <Link className={styles.moreLink} href="/guides">
              전체 보기 →
            </Link>
          </div>
          <div className={styles.recentGrid}>
            {recent.map((p) => {
              const c = catColor(p.cat);
              return (
                <Link className={styles.recentCard} href={`/guides/${p.slug}`} key={p.slug}>
                  <div className={styles.recentThumb}>
                    <span className={styles.thumbPill} style={{ color: c.fg }}>
                      {p.cat}
                    </span>
                    <Image
                      src={p.image || catImage(p.cat)}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.rcBody}>
                    <h3>{p.title}</h3>
                    <p className={styles.rcDesc}>{p.excerpt}</p>
                    <div className={styles.metaRow}>
                      <span style={{ fontWeight: 700, color: c.fg }}>{p.cat}</span>
                      <span className={styles.metaDot} />
                      <span>
                        읽는 시간 <span className="tnum">{p.read_time}</span>분
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ARTICLES (WP) ===== */}
      <section className={styles.block}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <div>
              <span className={styles.secKicker}>추천 읽을거리</span>
              <h2>알아두면 도움되는 글</h2>
              <p>금융 결정을 앞두고 있다면, 관련 주제의 콘텐츠를 찾아보세요.</p>
            </div>
            <Link className={styles.moreLink} href="/guides">
              인사이트 더 보기 →
            </Link>
          </div>
          <div className={styles.artGrid}>
            {feat && (
              <Link className={styles.feat} href={`/guides/${feat.slug}`}>
                <div className={styles.featImg}>
                  <span
                    className={styles.thumbPill}
                    style={{ color: catColor(feat.cat).fg }}
                  >
                    {feat.cat}
                  </span>
                  <Image
                    src={feat.image || catImage(feat.cat)}
                    alt=""
                    fill
                    sizes="(max-width: 960px) 100vw, 55vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.featBody}>
                  <div className={styles.metaRow}>
                    <span style={{ fontWeight: 700, color: catColor(feat.cat).fg }}>
                      {feat.cat}
                    </span>
                    <span className={styles.metaDot} />
                    <span>
                      읽는 시간 <span className="tnum">{feat.read_time}</span>분
                    </span>
                  </div>
                  <h3>{feat.title}</h3>
                  <p>{feat.excerpt}</p>
                </div>
              </Link>
            )}
            <div className={styles.artList}>
              {list.map((p, i) => {
                const c = catColor(p.cat);
                return (
                  <Link className={styles.artItem} href={`/guides/${p.slug}`} key={p.slug}>
                    <span className={`${styles.artNum} tnum`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.artBody}>
                      <span className={styles.artTitle}>{p.title}</span>
                      <span className={styles.metaRow}>
                        <span style={{ fontWeight: 700, color: c.fg }}>{p.cat}</span>
                        <span className={styles.metaDot} />
                        <span>
                          읽는 시간 <span className="tnum">{p.read_time}</span>분
                        </span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CALCULATOR CTA ===== */}
      <section className={`${styles.block} ${styles.blockWhite}`}>
        <div className={styles.wrap}>
          <div className={styles.calc}>
            <div className={styles.calcLeft}>
              <span className={styles.secKicker}>금융계산기</span>
              <h2>숫자로 먼저 확인하세요</h2>
              <p>대출 실행 전, 막연한 불안 대신 정확한 숫자로 직접 확인해 보세요.</p>
              <div className={styles.calcSample}>
                <span className={styles.lbl}>월 상환액 예시</span>
                <span className={`${styles.val} tnum`}>428,300</span>
                <span className={styles.unit}>원</span>
              </div>
            </div>
            <div className={styles.calcGrid}>
              {CALC_CARDS.map((c) => (
                <Link className={styles.calcCard} href={`/calculator?tab=${c.tab}`} key={c.tab}>
                  <span className={styles.ci} style={{ color: c.fg, background: c.bg }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {c.icon}
                    </svg>
                  </span>
                  <h4>{c.title}</h4>
                  <span className={styles.arrow}>계산하기 →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
