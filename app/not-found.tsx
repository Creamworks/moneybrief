"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./states.module.css";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className={styles.shell}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>찾으시는 페이지가 없습니다.</h1>
      <p className={styles.desc}>
        주소가 바뀌었거나 삭제된 페이지일 수 있어요.
        <br />
        아래에서 필요한 정보를 찾아보세요.
      </p>
      <div className={styles.actions}>
        <Link className={styles.btnPrimary} href="/">
          메인으로
        </Link>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => router.back()}
        >
          이전으로
        </button>
      </div>
    </div>
  );
}
