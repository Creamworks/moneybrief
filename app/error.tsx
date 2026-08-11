"use client";

import Link from "next/link";
import styles from "./states.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <div className={styles.shell}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <h1 className={styles.title}>이용에 불편을 드려 죄송합니다.</h1>
      <p className={styles.desc}>
        사용자가 많거나 일시적인 시스템 오류로 인해 페이지를 불러 올 수가 없어요.
        <br />
        잠시 후 다시 접속하여 주세요.
      </p>
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={() => reset()}>
          다시 시도
        </button>
        <Link className={styles.btnGhost} href="/">
          홈으로
        </Link>
      </div>
      {isDev && error?.message && (
        <pre className={styles.devError}>{error.message}</pre>
      )}
    </div>
  );
}
