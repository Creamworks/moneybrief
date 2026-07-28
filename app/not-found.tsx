import Link from "next/link";
import styles from "./states.module.css";

export default function NotFound() {
  return (
    <div className={styles.shell}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>찾으시는 페이지가 없습니다</h1>
      <p className={styles.desc}>
        주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 아래에서 필요한 정보를
        찾아보세요.
      </p>
      <div className={styles.actions}>
        <Link className={styles.btnPrimary} href="/">
          홈으로
        </Link>
        <Link className={styles.btnGhost} href="/guides">
          금융가이드 보기
        </Link>
      </div>
    </div>
  );
}
