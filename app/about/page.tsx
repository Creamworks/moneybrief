import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./page.module.css";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import {
  ORG_ID,
  baseNodes,
  reviewerNode,
  breadcrumbNode,
  webPageNode,
  type Crumb,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "운영 원칙 — money brief",
  description:
    "money brief의 콘텐츠 제작 원칙과 금융소비자 보호정책, 운영사 정보를 안내해요.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  { num: "01", title: "정확성", tag: "사실과 근거로 말해요", fg: "#3182F6", bg: "#EBF3FF", body: "법령, 금융감독원 공식 자료, 공인 통계를 기반으로 작성해요. 추측이나 과장은 싣지 않으며, 주요 정보에는 출처를 명시해요." },
  { num: "02", title: "투명성", tag: "숨기지 않아요", fg: "#1ABAB8", bg: "#E6F9F9", body: "money brief는 ㈜바로크레디트대부가 운영하는 금융교육 콘텐츠 브랜드예요. 운영 주체를 명확히 밝히며, 정보 제공 콘텐츠와 금융상품 안내 영역을 구조적으로 분리해요." },
  { num: "03", title: "최신성", tag: "정보를 놓치지 않아요", fg: "#7A5CFA", bg: "#F0EEFF", body: "금융 제도와 법령은 수시로 바뀌어요. 제도 변경·금리 변동·정책 변화가 있을 때 관련 콘텐츠를 업데이트하며, 각 글에 발행일과 최종 수정일을 표기해요." },
  { num: "04", title: "쉬움", tag: "누구나 이해할 수 있어야 해요", fg: "#FF6F61", bg: "#FFF0EF", body: "DSR, LTV, 원리금균등상환처럼 어려운 용어는 풀어서 설명해요. 쉬운 말로 정확하게 전달하는 것이 우리가 생각하는 전문성이에요." },
];

const PROTECT: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "대출을 유도하지 않아요",
    body: "금융교육 콘텐츠는 특정 금융상품의 가입을 권유하거나 유도하기 위해 작성되지 않아요. 상품 정보가 필요한 분은 별도의 상품안내에서 확인하실 수 있어요.",
    icon: (<><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></>),
  },
  {
    title: "알 권리와 설명받을 권리를 지켜요",
    body: "금융소비자는 중요 사항을 충분히 설명받을 권리가 있어요. 콘텐츠를 통해 소비자가 상품의 구조·비용·위험을 스스로 이해하도록 도와요.",
    icon: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>),
  },
  {
    title: "불법 금융 피해 예방에 힘써요",
    body: "불법 사금융, 보이스피싱, 불법 중개수수료 등 금융사기로부터 소비자를 보호하기 위한 예방 콘텐츠를 제작해요.",
    icon: (<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />),
  },
  {
    title: "개인정보를 소중히 다뤄요",
    body: "서비스 제공에 필요한 최소한의 정보만 수집하며, 관계 법령에 따라 안전하게 관리해요. 명시된 목적 외에 사용하지 않아요.",
    icon: (<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  },
];

const COMPANY_ROWS = [
  ["상호", "㈜바로크레디트대부"],
  ["대표자", "김충호, 우영제"],
  ["업종", "대부업 · 대부중개업"],
  ["등록번호", "2016-금감원-0006"],
  ["등록기관", "금융감독원"],
  ["대표번호", "1899-8500"],
  ["등록업체 확인·신고", "금융감독원 1332"],
];

export default function AboutPage() {
  const pageUrl = `${SITE_URL}/about`;
  const crumbs: Crumb[] = [
    { name: "홈", path: "/" },
    { name: "운영 원칙", path: "/about" },
  ];
  const jsonLd = [
    ...baseNodes(),
    reviewerNode(),
    breadcrumbNode(pageUrl, crumbs),
    {
      ...webPageNode({
        url: pageUrl,
        type: "AboutPage",
        name: "운영 원칙",
        description:
          "money brief의 콘텐츠 제작 원칙과 금융소비자 보호정책, 운영사 정보를 안내해요.",
        crumbs,
      }),
      // 이 페이지가 설명하는 대상이 곧 운영사 엔티티임을 명시
      mainEntity: { "@id": ORG_ID },
    },
  ];
  return (
    <>
      <JsonLd nodes={jsonLd} />
      {/* ===== HERO ===== */}
      <div className={styles.hero}>
        <div className={styles.wrap}>
          <nav className={styles.crumb}>
            <Link href="/">홈</Link>
            <span className={styles.sep}>›</span>
            <span className={styles.crumbCur}>운영 원칙</span>
          </nav>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>운영철학</span>
              <h1 className={styles.h1}>
                복잡한 금융을
                <br />
                쉽게 이해할 수 있게 만들어요.
              </h1>
              <p className={styles.lead}>
                인터넷에는 대출, 신용, 연체에 대한 정보가 넘쳐요.
                <br />
                하지만 정확하지 않은 정보도, 불안을 부추기는 정보도 많아요.
                <br />
                급하게 돈이 필요한 순간일수록 판단은 흐려지고, 잘못된 정보는 더 큰 비용으로 돌아와요.
              </p>
              <p className={styles.lead}>
                money brief는 그 문제의식에서 시작했어요.
                <br />
                금융소비자가 결정을 내리기 전에 알아야 할 정보를 <b>사실과 근거에 기반해 쉽고 정확하게</b> 전해요.
              </p>
            </div>
            <div className={styles.heroArt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/about-illust.svg" alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== PRINCIPLES ===== */}
      <section className={styles.block}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <span className={styles.secKicker}>콘텐츠 제작 원칙</span>
            <h2>네 가지 원칙으로 만들어요</h2>
            <p>money brief의 모든 콘텐츠는 아래 네 가지 원칙에 따라 제작돼요.</p>
          </div>
          <div className={styles.grid2}>
            {PRINCIPLES.map((p) => (
              <div className={styles.principle} key={p.num}>
                <div className={styles.pTop}>
                  <span className={styles.pNum} style={{ color: p.fg, background: p.bg }}>{p.num}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <div className={styles.pTag} style={{ color: p.fg }}>{p.tag}</div>
                  </div>
                </div>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROTECT ===== */}
      <section className={`${styles.block} ${styles.blockWhite}`}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <span className={styles.secKicker}>금융소비자 보호정책</span>
            <h2>소비자의 권리를 지켜요</h2>
            <p>money brief는 금융소비자의 권리를 존중하며, 다음의 보호 원칙을 지켜요.</p>
          </div>
          <div className={styles.grid2}>
            {PROTECT.map((p) => (
              <div className={styles.protectItem} key={p.title}>
                <span className={styles.pIco}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {p.icon}
                  </svg>
                </span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.report}>
            <span className={styles.rIco}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </span>
            <div className={styles.rTxt}>
              <h4>불법 사금융·불법 추심 피해 신고</h4>
              <p>피해를 입으셨거나 의심되는 경우, 금융감독원으로 신고하실 수 있어요. (국번 없이)</p>
            </div>
            <span className={`${styles.rNum} tnum`}>1332</span>
          </div>
        </div>
      </section>

      {/* ===== COMPANY ===== */}
      <section className={styles.block}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <span className={styles.secKicker}>운영사 정보</span>
            <h2>money brief를 만든 회사를 소개해요</h2>
            <p>money brief는 ㈜바로크레디트대부가 운영하는 금융교육 콘텐츠 브랜드예요.</p>
          </div>
          <div className={styles.companyGrid}>
            <div className={styles.ctable}>
              {COMPANY_ROWS.map(([k, v]) => (
                <div className={styles.crow} key={k}>
                  <div className={styles.ck}>{k}</div>
                  <div className={styles.cv}>{v}</div>
                </div>
              ))}
            </div>
            <div className={styles.companyNote}>
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="#5AA9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                </svg>
                money brief에서 금융상품을 판매하지 않아요.
              </h3>
              <p>
                금융소비자가 정확한 정보로 합법 대부업과 불법 사금융을 구분하고, 대부업에 대한 오해를 바로잡는 금융교육 콘텐츠 플랫폼이에요. <span className={styles.noteHl}>콘텐츠의 오류나 개선 의견이 있으시면 언제든지 연락주세요.</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
