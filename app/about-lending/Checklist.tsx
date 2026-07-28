"use client";

import { useState } from "react";
import styles from "./page.module.css";

const ITEMS = [
  "등록 대부업체인지 확인",
  "계약서 내용 확인",
  "금리 및 상환 조건 확인",
  "중도상환수수료 확인",
  "상환 계획 점검",
  "선입금 요구 여부 확인",
];

export default function Checklist() {
  const [checked, setChecked] = useState<boolean[]>(() => ITEMS.map(() => false));
  const count = checked.filter(Boolean).length;
  const toggle = (i: number) =>
    setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));

  return (
    <>
      <div className={styles.checks}>
        {ITEMS.map((label, i) => (
          <label className={styles.checkLine} key={label}>
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => toggle(i)}
            />
            <span className={styles.clt}>{label}</span>
          </label>
        ))}
      </div>
      <div className={styles.checkProgress}>
        <span className={styles.bar}>
          <i style={{ width: `${(count / ITEMS.length) * 100}%` }} />
        </span>
        <span>
          <b className="tnum">{count}</b> / {ITEMS.length} 확인
        </span>
      </div>
    </>
  );
}
