"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Toc = { id: string; text: string };

// 활성 판정 라인(뷰포트 상단에서 px). 헤딩 scroll-margin-top(100px)과 정합되도록 조금 아래로 둔다.
const ACTIVATE_OFFSET = 110;

export default function ArticleRail({ toc, title }: { toc: Toc[]; title: string }) {
  const [active, setActive] = useState(toc[0]?.id ?? "");
  const [copied, setCopied] = useState(false);
  // 목차 클릭 직후 점프가 끝날 때까지 스크롤스파이가 선택을 덮어쓰지 않도록 잠그는 시각
  const lockUntil = useRef(0);

  useEffect(() => {
    const ids = toc.map((t) => t.id);
    if (!ids.length) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      if (Date.now() < lockUntil.current) return; // 클릭 점프 중에는 계산 보류

      const els = ids
        .map((id) => document.getElementById(id))
        .filter((e): e is HTMLElement => !!e);
      if (!els.length) return;

      // 페이지 하단에 거의 닿으면 마지막 헤딩까지 못 올라오므로 마지막 항목을 강제 활성화
      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (reachedBottom) {
        setActive(els[els.length - 1].id);
        return;
      }

      // 활성 라인을 지나(위로 올라간) 가장 아래쪽 헤딩이 현재 섹션
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - ACTIVATE_OFFSET <= 0) current = el.id;
        else break;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [toc]);

  // 목차 항목 클릭: 선택을 즉시 반영하고 점프가 안정될 때까지 스크롤스파이 잠금
  const onTocClick = (id: string) => {
    setActive(id);
    lockUntil.current = Date.now() + 600;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };
  const mail = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
  };

  return (
    <aside className={styles.rail}>
      <nav className={styles.toc}>
        <h4>목차</h4>
        <ul>
          {toc.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                onClick={() => onTocClick(t.id)}
                className={active === t.id ? styles.active : ""}
              >
                {t.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.share}>
        <span className={styles.lbl}>이 글 공유</span>
        <div className={styles.shareBtns}>
          <button
            className={`${styles.sbtn} ${copied ? styles.copied : ""}`}
            onClick={copy}
            aria-label="링크 복사"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 5 5L20 7" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
                <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
              </svg>
            )}
          </button>
          <button className={styles.sbtn} onClick={mail} aria-label="메일 보내기">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </button>
          <button className={styles.sbtn} onClick={() => window.print()} aria-label="인쇄">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <path d="M6 14h12v8H6z" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
