"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

// 브라우저에서 WordPress 카운터 API를 직접 호출한다.
const WP = process.env.NEXT_PUBLIC_WP_URL || "http://localhost:8080/wp-json";

export default function Feedback({
  slug,
  id,
  count,
}: {
  slug: string;
  id: number;
  count: number;
}) {
  const [voted, setVoted] = useState(false);
  const [n, setN] = useState(count);

  useEffect(() => {
    try {
      setVoted(localStorage.getItem("helpful:" + slug) === "1");
    } catch {}
  }, [slug]);

  const emit = (val: number) => {
    setN(val);
    try {
      window.dispatchEvent(new CustomEvent("helpful-change:" + slug, { detail: val }));
    } catch {}
  };

  const toggle = async () => {
    const nv = !voted;
    setVoted(nv);
    try {
      localStorage.setItem("helpful:" + slug, nv ? "1" : "0");
    } catch {}
    // 낙관적 업데이트(즉시 반영) → 서버 응답으로 정정
    emit(Math.max(0, n + (nv ? 1 : -1)));
    try {
      const r = await fetch(`${WP}/creditnote/v1/helpful/${id}?delta=${nv ? 1 : -1}`, {
        method: "POST",
      });
      if (r.ok) {
        const d = await r.json();
        if (typeof d.count === "number") emit(d.count);
      }
    } catch {
      // 네트워크 실패 시 낙관적 값 유지(새로고침하면 서버값으로 정정됨)
    }
  };

  return (
    <div className={styles.feedback}>
      <span className={styles.ftxt}>이 글이 도움이 되었나요?</span>
      <div>
        <button
          className={`${styles.fbtn} ${voted ? styles.voted : ""}`}
          onClick={toggle}
          aria-pressed={voted}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          {voted ? `고마워요! · ${n.toLocaleString("ko-KR")}` : "도움이 되었어요"}
        </button>
      </div>
    </div>
  );
}
