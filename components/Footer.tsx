"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Footer.module.css";

const RELATED_LINKS = [
  {
    label: "금융감독원",
    href: "https://www.fss.or.kr/fss/cvpl/unlawDistb/forInsertAgre.do?menuNo=200309",
  },
  {
    label: "전국대부업체조회",
    href: "https://fines.fss.or.kr/fines/plis/moneyLenderSearch/MoneyLenderSearch.getMoneyLenderList.do",
  },
  {
    label: "서민금융진흥원",
    href: "https://www.kinfa.or.kr/main.do",
  },
];

export default function Footer() {
  const [ddOpen, setDdOpen] = useState(false);
  const relatedRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close when clicking outside the dropdown.
  useEffect(() => {
    if (!ddOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (relatedRef.current && !relatedRef.current.contains(e.target as Node)) {
        setDdOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [ddOpen]);

  const cancelLeave = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };
  const scheduleLeave = () => {
    leaveTimer.current = setTimeout(() => setDdOpen(false), 260);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.logo}
                src="/img/money-brief.svg"
                alt="money brief"
              />
            </div>
            <p className={styles.rel}>
              money brief는 ㈜바로크레디트대부가 만든 금융교육 콘텐츠입니다.
            </p>
          </div>
          <div className={styles.company}>
            <p className={styles.corp}>
              ㈜바로크레디트대부 · 대표이사 : 김충호, 우영제 &nbsp;|&nbsp;
              사업자등록번호 : 210-81-42659 &nbsp;|&nbsp; 주소 : (07292) 서울특별시
              영등포구 영등포로 150 (당산동1가, 생각공장) &nbsp;|&nbsp; 대표번호
              : 1899-8500
              <br />
              대부업·대부중개업 등록번호 : 2016-금감원-0006 &nbsp;|&nbsp; 등록기관
              금융감독원·보호감시인 김인호 감사 (02-2093-6111) &nbsp;|&nbsp;
              등록업체 확인·신고 금융감독원 : 1332
            </p>
            <p className={styles.protect}>
              과도한 빚은 신용등급 하락 등 불이익을 초래할 수 있습니다.
              <br />본 콘텐츠는 금융정보 제공을 목적으로 작성되었습니다.
            </p>
          </div>
        </div>

        <div className={styles.policyRow}>
          <div className={styles.policy}>
            <a
              className={styles.privacy}
              href="https://www.barocredit.com/help/terms-policy/policy-privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              개인정보처리방침
            </a>
            <a
              href="https://www.barocredit.com/ubi4/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              이용약관
            </a>

            <div
              className={`${styles.related} ${ddOpen ? styles.relatedOpen : ""}`}
              ref={relatedRef}
              onMouseEnter={cancelLeave}
              onMouseLeave={scheduleLeave}
            >
              <button
                type="button"
                className={styles.ddBtn}
                aria-expanded={ddOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setDdOpen((v) => !v);
                }}
              >
                관련 링크
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {ddOpen && (
                <div className={styles.ddPanel}>
                  <div className={styles.ddGroup}>
                    <span className={styles.ddH}>관련 기관</span>
                    {RELATED_LINKS.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.copy}>
            © 2026 money brief. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
