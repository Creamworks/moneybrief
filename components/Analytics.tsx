"use client";

/**
 * money brief — 페이지 참여도 계측 (GTM dataLayer 전용)
 *
 * 밀어 넣는 이벤트
 *  1) spa_page_view   : 클라이언트 라우팅으로 페이지가 바뀔 때 (최초 로드는 GA4 기본 page_view가 담당)
 *  2) scroll_depth    : 25 / 50 / 75 / 90 / 100% 도달 시 1회씩
 *  3) time_on_page    : 활성 체류 10 / 30 / 60 / 120 / 180 / 300초 도달 시 1회씩
 *  4) page_engagement : 이탈·탭 전환·라우팅 시 "직전 전송 이후 늘어난 초"를 델타로 전송
 *                       → GA4에서 engagement_seconds 를 합계(SUM)하면 총 체류시간이 돼요.
 *
 * 체류시간은 탭이 보이는 동안만 누적해요(백그라운드 시간 제외).
 */

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type DL = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DL[];
  }
}

function push(payload: DL) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

const SCROLL_MARKS = [25, 50, 75, 90, 100];
const TIME_MARKS = [10, 30, 60, 120, 180, 300];

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const pagePath = pathname + (qs ? `?${qs}` : "");
  const isFirst = useRef(true);

  useEffect(() => {
    // ---------- 1) SPA 페이지뷰 ----------
    let pvTimer = 0;
    if (isFirst.current) {
      // 최초 진입은 GTM 컨테이너 로드 시 GA4 구성 태그가 page_view를 이미 보내요.
      isFirst.current = false;
    } else {
      pvTimer = window.setTimeout(() => {
        push({
          event: "spa_page_view",
          page_path: pagePath,
          page_location: window.location.href,
          page_title: document.title,
          page_referrer: document.referrer,
        });
      }, 120); // Next가 <title>을 갱신할 여유를 줌
    }

    // ---------- 페이지 단위 상태 ----------
    const firedScroll = new Set<number>();
    const firedTime = new Set<number>();
    let maxPercent = 0;
    let activeMs = 0; // 탭이 보이는 동안만 누적
    let sentSec = 0; // page_engagement 로 이미 보낸 누적 초
    let lastStamp =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    let visible =
      typeof document === "undefined" || document.visibilityState === "visible";

    const now = () =>
      typeof performance !== "undefined" ? performance.now() : Date.now();

    const settle = () => {
      const t = now();
      if (visible) activeMs += t - lastStamp;
      lastStamp = t;
      return Math.round(activeMs / 1000);
    };

    const depth = () => {
      const doc = document.documentElement;
      const total = Math.max(
        doc.scrollHeight,
        document.body ? document.body.scrollHeight : 0,
      );
      const view = window.innerHeight;
      if (total <= view + 4) return 100; // 한 화면에 다 들어오는 페이지
      const p = ((window.scrollY + view) / total) * 100;
      return Math.max(0, Math.min(100, Math.round(p)));
    };

    const checkScroll = () => {
      const p = depth();
      if (p > maxPercent) maxPercent = p;
      for (const m of SCROLL_MARKS) {
        if (maxPercent >= m && !firedScroll.has(m)) {
          firedScroll.add(m);
          push({
            event: "scroll_depth",
            percent_scrolled: m,
            page_path: pagePath,
            engagement_seconds: settle(),
          });
        }
      }
    };

    const checkTime = () => {
      const s = settle();
      for (const m of TIME_MARKS) {
        if (s >= m && !firedTime.has(m)) {
          firedTime.add(m);
          push({
            event: "time_on_page",
            seconds: m,
            time_milestone: m + "s",
            page_path: pagePath,
            percent_scrolled: maxPercent,
          });
        }
      }
    };

    // 직전 전송 이후 늘어난 초만 델타로 보냄 (합계 = 총 체류시간)
    const flush = (reason: string) => {
      const s = settle();
      const delta = s - sentSec;
      if (delta <= 0) return;
      sentSec = s;
      push({
        event: "page_engagement",
        engagement_seconds: delta,
        total_seconds: s,
        percent_scrolled: maxPercent,
        page_path: pagePath,
        exit_reason: reason,
      });
    };

    const onScroll = () => checkScroll();
    const onVisibility = () => {
      settle();
      const nowVisible = document.visibilityState === "visible";
      if (!nowVisible) {
        visible = false;
        flush("hidden");
      } else {
        visible = true;
        lastStamp = now();
      }
    };
    const onPageHide = () => {
      settle();
      flush("pagehide");
      visible = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    const timer = window.setInterval(checkTime, 5000);
    // 이미지/폰트 로딩 후 문서 높이가 확정되면 한 번 측정
    const settleTimer = window.setTimeout(checkScroll, 1200);

    return () => {
      // 라우팅으로 페이지를 떠날 때 남은 체류시간을 마저 보냄
      settle();
      checkTime();
      flush("route_change");
      window.clearTimeout(pvTimer);
      window.clearTimeout(settleTimer);
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [pagePath]);

  return null;
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
