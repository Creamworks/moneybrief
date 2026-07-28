"use client";

import { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { catImage } from "@/lib/wp";

export type Guide = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cat: string;
  read_time: number;
  date: string;
  image?: string;
};

const ALL = "전체";
const CHIPS = [ALL, "신용관리", "대출상식", "금융생활", "금융사기예방", "금융이슈·인사이트"];
const STEP = 9;

const ICONS: Record<string, ReactNode> = {
  신용관리: (
    <>
      <path d="M3 17l5-5 4 4 8-8" />
      <path d="M16 8h4v4" />
    </>
  ),
  대출상식: (
    <>
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </>
  ),
  금융생활: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  금융사기예방: (
    <>
      <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  "금융이슈·인사이트": (
    <>
      <path d="M4 6h16v12H4z" />
      <path d="M8 10h8M8 14h5" />
      <path d="M4 6l-1 3h18l-1-3" />
    </>
  ),
  [ALL]: (
    <>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M2 12l10 5 10-5" />
      <path d="M2 16l10 5 10-5" />
    </>
  ),
};

type Meta = { fg: string; bg: string; grad: string; desc: string; short: string };

const CAT_META: Record<string, Meta> = {
  [ALL]: {
    fg: "#3182F6",
    bg: "#EBF3FF",
    grad: "linear-gradient(135deg,#EBF3FF 0%,#DEEEFF 60%,#E8F4FF 100%)",
    desc: "신용부터 사기 예방까지, 검증된 정보형 금융 콘텐츠를 한곳에 모았습니다.",
    short: "지금 내게 필요한 주제부터 골라 보세요.",
  },
  신용관리: {
    fg: "#3182F6",
    bg: "#EBF3FF",
    grad: "linear-gradient(135deg,#EBF3FF 0%,#DEEEFF 60%,#E8F4FF 100%)",
    desc: "점수가 매겨지는 원리부터 천천히 끌어올리는 법까지.",
    short: "신용, 제대로 이해하면 달라집니다.",
  },
  대출상식: {
    fg: "#7A5CFA",
    bg: "#F0EEFF",
    grad: "linear-gradient(135deg,#F0EEFF 0%,#E7E1FF 60%,#F3EFFF 100%)",
    desc: "금리·한도·상환 방식까지, 헷갈리는 기본기를 정리합니다.",
    short: "빌리기 전에 알아야 할 것들.",
  },
  금융생활: {
    fg: "#1ABAB8",
    bg: "#E6F9F9",
    grad: "linear-gradient(135deg,#E6F9F9 0%,#D6F5F4 60%,#ECFBFB 100%)",
    desc: "통장 쪼개기부터 비상금까지, 일상에서 쌓는 금융 습관.",
    short: "작은 습관이 큰 차이를 만듭니다.",
  },
  금융사기예방: {
    fg: "#FF6F61",
    bg: "#FFF0EF",
    grad: "linear-gradient(135deg,#FFF0EF 0%,#FFE3E0 60%,#FFF2F1 100%)",
    desc: "수법을 미리 알면 당하지 않는, 사례로 익히는 분별법.",
    short: "한 발 앞서 대비하세요.",
  },
  "금융이슈·인사이트": {
    fg: "#C79100",
    bg: "#FFF8D6",
    grad: "linear-gradient(135deg,#FFF8D6 0%,#FBEFBE 60%,#FFFAE0 100%)",
    desc: "바뀌는 제도와 정책, 내 지갑에 닿는 핵심만 짚어드립니다.",
    short: "최신 흐름을 놓치지 마세요.",
  },
};

const metaOf = (c: string) => CAT_META[c] || CAT_META[ALL];

function Meta({ g }: { g: Guide }) {
  const m = metaOf(g.cat);
  return (
    <div className={styles.metaRow}>
      <span style={{ fontWeight: 700, color: m.fg }}>{g.cat}</span>
      <span className={styles.metaDot} />
      <span>
        읽는 시간 <span className="tnum">{g.read_time}</span>분
      </span>
    </div>
  );
}

export default function GuideList({
  posts,
  featured,
  initialCat,
}: {
  posts: Guide[];
  featured: Guide | null;
  initialCat?: string;
}) {
  const [cat, setCat] = useState(initialCat && CHIPS.includes(initialCat) ? initialCat : ALL);
  const [sort, setSort] = useState<"recent" | "short">("recent");
  const [limit, setLimit] = useState(STEP);

  // sync active chip when the URL ?cat= changes (e.g. mega-menu click on the same page)
  useEffect(() => {
    setCat(initialCat && CHIPS.includes(initialCat) ? initialCat : ALL);
  }, [initialCat]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of posts) m[p.cat] = (m[p.cat] || 0) + 1;
    return m;
  }, [posts]);

  const filtered = useMemo(() => {
    let r = posts.filter((p) => cat === ALL || p.cat === cat);
    r = [...r].sort((a, b) =>
      sort === "short" ? a.read_time - b.read_time : b.date.localeCompare(a.date),
    );
    return r;
  }, [posts, cat, sort]);

  useEffect(() => {
    setLimit(STEP);
  }, [cat, sort]);

  const total = cat === ALL ? posts.length : counts[cat] || 0;
  const feat = cat === ALL ? featured || filtered[0] : filtered[0];
  const grid = filtered;
  const shown = grid.slice(0, limit);
  const remaining = grid.length - shown.length;

  const meta = metaOf(cat);
  const others = CHIPS.filter((c) => c !== ALL && c !== cat);

  return (
    <>
      {/* ===== BREADCRUMB + HERO ===== */}
      <div className={styles.head}>
        <div className={styles.wrap}>
          <nav className={styles.crumb}>
            <Link href="/">홈</Link>
            <span className={styles.sep}>›</span>
            <Link href="/guides">금융가이드</Link>
            {cat !== ALL && (
              <>
                <span className={styles.sep}>›</span>
                <span className={styles.crumbCur} style={{ color: meta.fg }}>
                  {cat}
                </span>
              </>
            )}
          </nav>
        </div>

        <div className={styles.hero} style={{ background: meta.grad }}>
          <div className={`${styles.wrap} ${styles.heroInner}`}>
            <div>
              <span className={styles.eyebrow} style={{ color: meta.fg }}>
                <span className={styles.eyeDot} style={{ background: meta.fg }} />
                금융가이드
              </span>
              <h1 className={styles.h1}>{cat === ALL ? "금융가이드" : cat}</h1>
              <p className={styles.heroDesc}>
                {meta.desc}
                <br />
                {meta.short}
              </p>
              <div className={styles.heroStat}>
                <span className={styles.statBadge} style={{ color: meta.fg }}>
                  <span className="tnum">{total}</span>개 가이드
                </span>
                <span className={styles.statSub}>최근 업데이트 2026.07</span>
              </div>
            </div>
            <div className={styles.heroIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke={meta.fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[cat] || ICONS[ALL]}
              </svg>
            </div>
          </div>
        </div>

        {/* category tabs */}
        <div className={styles.wrap}>
          <div className={styles.tabs}>
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.tab} ${cat === c ? styles.tabOn : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FEATURED ===== */}
      {feat && (
        <div className={styles.blockWhite}>
          <div className={`${styles.wrap} ${styles.featWrap}`}>
            <div className={styles.featKicker}>추천 아티클</div>
            <Link className={styles.feature} href={`/guides/${feat.slug}`}>
              <div className={styles.featImg} style={{ background: metaOf(feat.cat).bg }}>
                <span className={styles.thumbPill} style={{ color: metaOf(feat.cat).fg }}>
                  {feat.cat}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={feat.image || catImage(feat.cat)} alt="" />
              </div>
              <div className={styles.featBody}>
                <Meta g={feat} />
                <h2>{feat.title}</h2>
                <p>{feat.excerpt}</p>
                <span className={styles.readMore} style={{ color: metaOf(feat.cat).fg }}>
                  자세히 읽기 →
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* ===== GRID ===== */}
      <div className={styles.blockWhite}>
        <div className={`${styles.wrap} ${styles.gridWrap}`}>
          <div className={styles.gridHead}>
            <h2 className={styles.gridTitle}>
              전체 <span className="tnum" style={{ color: meta.fg }}>{total}</span>편
            </h2>
            <div className={styles.sort}>
              <span className={styles.sortLbl}>정렬:</span>
              <div className={styles.selectWrap}>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "recent" | "short")}
                >
                  <option value="recent">최신순</option>
                  <option value="short">읽는 시간 짧은순</option>
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {grid.length > 0 ? (
            <>
              <div className={styles.grid}>
                {shown.map((g) => {
                  const m = metaOf(g.cat);
                  return (
                    <Link className={styles.card} href={`/guides/${g.slug}`} key={g.id}>
                      <div className={styles.thumb} style={{ background: m.bg }}>
                        <span className={styles.thumbPill} style={{ color: m.fg }}>
                          {g.cat}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.image || catImage(g.cat)} alt="" />
                      </div>
                      <div className={styles.cbody}>
                        <h3>{g.title}</h3>
                        <p>{g.excerpt}</p>
                        <Meta g={g} />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {remaining > 0 && (
                <div className={styles.moreWrap}>
                  <button
                    type="button"
                    className={styles.moreBtn}
                    onClick={() => setLimit((n) => n + STEP)}
                  >
                    더 보기 <span className="tnum" style={{ color: meta.fg }}>{remaining}</span>편 →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noResult}>등록된 글이 없습니다.</div>
          )}
        </div>
      </div>

      {/* ===== OTHER CATEGORIES ===== */}
      <div className={styles.blockGray}>
        <div className={styles.wrap}>
          <div className={styles.otherHead}>
            <span className={styles.otherKicker}>다른 주제도 찾아보세요</span>
            <h2>금융가이드 전체 주제</h2>
          </div>
          <div className={styles.otherGrid}>
            {others.map((c) => {
              const m = metaOf(c);
              return (
                <Link
                  className={styles.otherCard}
                  href={`/guides?cat=${encodeURIComponent(c)}`}
                  onClick={() => setCat(c)}
                  key={c}
                >
                  <span className={styles.otherIco} style={{ color: m.fg, background: m.bg }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {ICONS[c]}
                    </svg>
                  </span>
                  <h3>{c === "금융이슈·인사이트" ? "금융이슈" : c}</h3>
                  <p>{m.desc}</p>
                  <span className={styles.otherCnt}>
                    <span className="tnum" style={{ color: m.fg }}>{counts[c] || 0}</span>개 글
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
