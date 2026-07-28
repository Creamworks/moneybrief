"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Header.module.css";

type Sub = { label: string; href: string };
type NavItem = {
  key: string;
  label: string;
  href: string;
  sub?: Sub[];
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "guide",
    label: "금융가이드",
    href: "/guides",
    sub: [
      { label: "신용관리", href: "/guides?cat=신용관리" },
      { label: "대출상식", href: "/guides?cat=대출상식" },
      { label: "금융생활", href: "/guides?cat=금융생활" },
      { label: "금융사기예방", href: "/guides?cat=금융사기예방" },
      { label: "금융이슈·인사이트", href: "/guides?cat=금융이슈·인사이트" },
    ],
  },
  {
    key: "calc",
    label: "금융계산기",
    href: "/calculator",
    sub: [
      { label: "원리금 계산기", href: "/calculator?tab=loan" },
      { label: "대출이자", href: "/calculator?tab=interest" },
      { label: "DSR", href: "/calculator?tab=dsr" },
      { label: "중도상환수수료", href: "/calculator?tab=prepay" },
    ],
  },
  { key: "loanguide", label: "바로알기", href: "/about-lending" },
  { key: "about", label: "운영 원칙", href: "/about" },
];

const MEGA_KEYS = ["guide", "calc"];

const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

export default function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [colLeft, setColLeft] = useState<Record<string, number>>({});

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + "/"),
    [pathname],
  );

  // Align each mega column under its parent menu item (not under the logo).
  const align = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wl = wrap.getBoundingClientRect().left;
    const next: Record<string, number> = {};
    MEGA_KEYS.forEach((k) => {
      const el = linkRefs.current[k];
      if (el) next[k] = Math.max(0, el.getBoundingClientRect().left - wl);
    });
    setColLeft(next);
  }, []);

  const openMega = (key: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpenMenu(MEGA_KEYS.includes(key) ? key : null);
  };
  const scheduleClose = () => {
    timerRef.current = setTimeout(() => setOpenMenu(null), 150);
  };
  const cancelClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (openMenu) align();
  }, [openMenu, align]);

  useEffect(() => {
    align(); // pre-measure so the first hover has no position flash
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [align]);

  // Close everything on route change.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll + auto-expand current section while the mobile overlay is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) {
      const cur = NAV_ITEMS.find((i) => i.sub && isActive(i.href));
      setExpanded(cur ? cur.key : null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, isActive]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className={styles.gnb} onMouseLeave={scheduleClose}>
        <div className={styles.gnbInner}>
          <Link className={styles.brand} href="/" aria-label="money brief">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.brandLogo}
              src="/img/money-brief.svg"
              alt="money brief"
            />
          </Link>

          <nav className={styles.menu}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                ref={(el) => {
                  linkRefs.current[item.key] = el;
                }}
                href={item.href}
                className={cx(
                  styles.top,
                  isActive(item.href) && styles.current,
                  openMenu === item.key && styles.hot,
                )}
                onMouseEnter={() => openMega(item.key)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.gnbCredit}>
            <span>본 사이트는 ㈜바로크레디트대부가 제작하였습니다.</span>
          </div>

          <button
            type="button"
            className={styles.search}
            aria-label="검색"
            tabIndex={-1}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          <button
            type="button"
            className={cx(styles.burger, mobileOpen && styles.burgerOpen)}
            aria-label="메뉴 열기"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div
          className={cx(styles.megaPanel, openMenu && styles.megaPanelOpen)}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className={styles.megaWrap} ref={wrapRef}>
            {NAV_ITEMS.filter((i) => i.sub && i.key === openMenu).map((item) => (
              <div
                key={item.key}
                className={styles.megaCard}
                style={{ left: colLeft[item.key] ?? 0 }}
                onMouseEnter={() => openMega(item.key)}
              >
                {item.sub!.map((s) => (
                  <Link key={s.href} href={s.href} onClick={() => setOpenMenu(null)}>
                    <span className={styles.mt}>{s.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ---- mobile fullscreen overlay ---- */}
      <div
        className={cx(styles.overlay, mobileOpen && styles.overlayOpen)}
        aria-hidden={!mobileOpen}
      >
        <div className={styles.overlayHead}>
          <span className={styles.overlayTitle}>메뉴</span>
          <button
            type="button"
            className={styles.overlayClose}
            aria-label="메뉴 닫기"
            onClick={closeMobile}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <nav className={styles.overlayList}>
          {NAV_ITEMS.map((item) =>
            item.sub ? (
              <div
                key={item.key}
                className={cx(
                  styles.mGroup,
                  expanded === item.key && styles.mExpanded,
                )}
              >
                <button
                  type="button"
                  className={cx(styles.mAcc, isActive(item.href) && styles.mCurrent)}
                  aria-expanded={expanded === item.key}
                  onClick={() =>
                    setExpanded((e) => (e === item.key ? null : item.key))
                  }
                >
                  <span>{item.label}</span>
                  <svg
                    className={styles.mChev}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className={styles.mSub}>
                  <div className={styles.mSubInner}>
                    <Link
                      className={cx(styles.mSubLink, styles.mSubAll)}
                      href={item.href}
                      onClick={closeMobile}
                    >
                      {item.label} 전체보기
                    </Link>
                    {item.sub.map((s) => (
                      <Link
                        key={s.href}
                        className={styles.mSubLink}
                        href={s.href}
                        onClick={closeMobile}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.key}
                className={cx(styles.mLink, isActive(item.href) && styles.mCurrent)}
                href={item.href}
                onClick={closeMobile}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className={styles.overlayFoot}>
          본 사이트는 ㈜바로크레디트대부가 제작하였습니다.
        </div>
      </div>
    </>
  );
}
