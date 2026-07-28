"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

// 바이라인의 "도움이 되었어요 N" 카운트.
// 서버(WordPress helpful_count)에서 받은 값을 표시하고,
// 같은 페이지의 Feedback 버튼이 보낸 커스텀 이벤트로 즉시 갱신한다.
export default function HelpfulCount({ slug, count }: { slug: string; count: number }) {
  const [n, setN] = useState(count);

  useEffect(() => {
    const onChange = (e: Event) => setN((e as CustomEvent<number>).detail);
    window.addEventListener("helpful-change:" + slug, onChange as EventListener);
    return () => window.removeEventListener("helpful-change:" + slug, onChange as EventListener);
  }, [slug]);

  return (
    <span className={styles.helpfulMeta}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Zm3.6-7.4L9 9v12h9.3a2 2 0 0 0 2-1.7l1.3-8A2 2 0 0 0 19.6 9H14V4.5a1.9 1.9 0 0 0-3.4-1.9Z" />
      </svg>
      도움이 되었어요 <b className="tnum">{n.toLocaleString("ko-KR")}</b>
    </span>
  );
}
