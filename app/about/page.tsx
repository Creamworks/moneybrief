import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "운영 원칙 — money brief",
  description:
    "money brief의 콘텐츠 제작 원칙과 금융소비자 보호정책, 운영사 정보를 안내합니다.",
};

const PRINCIPLES = [
  {
    num: "01",
    title: "정확성",
    tag: "사실과 근거로 말합니다",
    body: "법령, 금융감독원 공식 자료, 공인 통계를 기반으로 작성합니다. 추측이나 과장은 싣지 않으며, 주요 정보에는 출처를 명시합니다. 확인되지 않은 내용은 게시하지 않습니다.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    num: "02",
    title: "투명성",
    tag: "숨기지 않습니다",
    body: "money brief는 ㈜바로크레디트대부가 운영하는 금융교육 콘텐츠 브랜드입니다. 운영 주체를 명확히 밝히며, 정보 제공 콘텐츠와 금융상품 안내 영역을 구조적으로 분리합니다. 광고성 내용에는 그 사실을 고지합니다.",
    icon: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    num: "03",
    title: "최신성",
    tag: "정보를 놓치지 않습니다",
    body: "금융 제도와 법령은 수시로 바뀝니다. money brief는 제도 변경, 금리 변동, 정책 변화가 있을 때 관련 콘텐츠를 업데이트하며, 각 글에 발행일과 최종 수정일을 표기합니다.",
    icon: (
      <>
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 4v5h-5" />
      </>
    ),
  },
  {
    num: "04",
    title: "쉬움",
    tag: "누구나 이해할 수 있어야 합니다",
    body: "DSR, LTV, 원리금균등상환처럼 어려운 용어는 풀어서 설명합니다. 전문가만 이해할 수 있는 정보는 누구에게도 도움이 되지 않습니다. 쉬운 말로 정확하게 전달하는 것이 우리가 생각하는 전문성입니다.",
    icon: (
      <>
        <path d="M12 8V5l-2 2" />
        <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4 3v-3H6a2 2 0 0 1-2-2Z" />
        <path d="M9 12h6" />
      </>
    ),
  },
];

const COMPANY_ROWS = [
  { k: "상호", v: <>㈜바로크레디트대부</> },
  { k: "대표자", v: <>김충호, 우영제</> },
  { k: "업종", v: <>대부업 · 대부중개업</> },
  { k: "등록번호", v: <span className="tnum">2016-금감원-0006</span> },
  { k: "등록기관", v: <>금융감독원</> },
  {
    k: "대표번호",
    v: (
      <b className="tnum" style={{ color: "var(--blue)", fontWeight: 700 }}>
        1899-8500
      </b>
    ),
  },
  {
    k: "등록업체 확인·신고",
    v: (
      <>
        금융감독원{" "}
        <b className="tnum" style={{ color: "var(--blue)", fontWeight: 700 }}>
          1332
        </b>
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ============ 운영철학 hero ============ */}
      <div className={styles.hero} id="philosophy">
        <div className={styles.wrap}>
          <nav className={styles.crumb}>
            <Link href="/">홈</Link>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
            <span>운영 원칙</span>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy} style={{ margin: "2px 0 0" }}>
              <span className={styles.heroKicker}>운영철학</span>
              <h1>
                복잡한 금융을
                <br />
                쉽게 이해할 수 있게 만듭니다.
              </h1>
              <div className={styles.lead}>
                <p style={{ margin: "20px 0" }}>
                  인터넷에는 대출, 신용, 연체에 대한 정보가 넘칩니다.
                  <br />
                  하지만 정확하지 않은 정보도, 불안을 부추기는 정보도 많습니다.
                  <br />
                  급하게 돈이 필요한 순간일수록 판단은 흐려지고, 잘못된 정보는 더
                  큰 비용으로 돌아옵니다.
                </p>
                <p>
                  money brief는 그 문제의식에서 시작했습니다.
                  <br />
                  신용점수가 무엇인지, 대출이 거절되는 이유는 무엇인지, 합법적인
                  대부업체와 불법 사금융을 어떻게 구분하는지 금융소비자가 결정을
                  내리기 전에 알아야 할 정보를{" "}
                  <b>사실과 근거에 기반해 쉽고 정확하게</b> 전합니다.
                </p>
              </div>
            </div>
            <div className={styles.media}>
              <Image
                src="/img/about-hero.webp"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 460px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          <div className={styles.accent}>
            <span className={styles.a1}>
              “우리는 대출을 권하기 위해 콘텐츠를 만들지 않습니다.”
            </span>
            <span className={styles.a2}>
              결정은 언제나 당신의 몫이고, money brief는 결정에 필요한 정보를
              드리는 곳입니다.
            </span>
          </div>
        </div>
      </div>

      {/* ============ 콘텐츠 제작 원칙 ============ */}
      <section className={styles.block} id="principles">
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <span className={styles.kicker}>콘텐츠 제작 원칙</span>
            <h2>네 가지 원칙으로 만듭니다</h2>
            <p>money brief의 모든 콘텐츠는 아래 네 가지 원칙에 따라 제작됩니다.</p>
          </div>
          <div className={styles.principles}>
            {PRINCIPLES.map((p) => (
              <div className={styles.principle} key={p.num}>
                <div className={styles.ptop}>
                  <span className={styles.pico}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {p.icon}
                    </svg>
                  </span>
                  <div>
                    <div className={styles.pnum}>{p.num}</div>
                    <h3>{p.title}</h3>
                    <div className={styles.ptag}>{p.tag}</div>
                  </div>
                </div>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 금융소비자 보호정책 ============ */}
      <section className={`${styles.block} ${styles.protect}`} id="protect">
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <span className={styles.kicker}>금융소비자 보호정책</span>
            <h2>소비자의 권리를 지킵니다</h2>
            <p>
              money brief는 금융소비자의 권리를 존중하며, 다음의 보호 원칙을
              지킵니다.
            </p>
          </div>
          <div className={styles.protectGrid}>
            <div className={styles.protectItem}>
              <span className={styles.mico}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="M8.5 8.5 6 6m9.5 9.5L18 18" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
              <div>
                <h3>대출을 유도하지 않습니다</h3>
                <p>
                  money brief의 금융교육 콘텐츠는 특정 금융상품의 가입을 권유하거나
                  유도하기 위해 작성되지 않습니다. 금융상품 정보가 필요한 분은
                  별도의 <span className={styles.hl}>상품안내</span> 메뉴에서 직접
                  확인하실 수 있으며, 해당 영역에는 법령에 따른 필수 고지사항이
                  안내되어 있습니다.
                </p>
              </div>
            </div>
            <div className={styles.protectItem}>
              <span className={styles.mico}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                  <path d="M14 3v5h5M9 13h6M9 17h4" />
                </svg>
              </span>
              <div>
                <h3>알 권리와 설명받을 권리를 지킵니다</h3>
                <p>
                  금융소비자는 금융상품에 관한 중요 사항을 충분히 설명받을 권리가
                  있습니다. money brief는 콘텐츠를 통해 소비자가 상품의 구조, 비용,
                  위험을 스스로 이해할 수 있도록 돕습니다.
                </p>
              </div>
            </div>
            <div className={styles.protectItem}>
              <span className={styles.mico}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </span>
              <div>
                <h3>불법 금융 피해 예방에 힘씁니다</h3>
                <p>
                  불법 사금융, 보이스피싱, 불법 중개수수료 등 금융사기로부터
                  소비자를 보호하기 위한 예방 콘텐츠를 제작합니다. 피해를
                  입으셨거나 의심되는 경우 금융감독원에 신고하실 수 있습니다.
                </p>
              </div>
            </div>
            <div className={styles.protectItem}>
              <span className={styles.mico}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 15v2" />
                </svg>
              </span>
              <div>
                <h3>개인정보를 소중히 다룹니다</h3>
                <p>
                  money brief는 서비스 제공에 필요한 최소한의 정보만 수집하며,
                  관계 법령에 따라 안전하게 관리합니다. 수집된 개인정보는 명시된
                  목적 외에 사용하지 않습니다.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.reportCallout}>
            <span className={styles.rcIco}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </span>
            <div className={styles.rcTxt}>
              <h4>불법 사금융·불법 추심 피해 신고</h4>
              <p>
                피해를 입으셨거나 의심되는 경우, 금융감독원으로 신고하실 수
                있습니다. (국번 없이)
              </p>
            </div>
            <span className={`${styles.rcNum} tnum`}>1332</span>
          </div>
        </div>
      </section>

      {/* ============ 운영사 정보 ============ */}
      <section className={styles.block} id="company">
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <span className={styles.kicker}>운영사 정보</span>
            <h2>money brief를 만든 회사를 소개합니다</h2>
            <p>
              money brief는 ㈜바로크레디트대부가 운영하는 금융교육 콘텐츠
              브랜드입니다.
            </p>
          </div>
          <div className={styles.companyGrid}>
            <div className={styles.ctable}>
              {COMPANY_ROWS.map((row) => (
                <div className={styles.crow} key={row.k}>
                  <div className={styles.ck}>{row.k}</div>
                  <div className={styles.cv}>{row.v}</div>
                </div>
              ))}
            </div>
            <div className={styles.companyNote}>
              <h3>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                </svg>
                money brief에서 금융상품을 판매하지 않습니다.
              </h3>
              <p>
                금융소비자가 정확한 정보로 합법 대부업과 불법 사금융을 구분하고,
                대부업에 대한 오해를 바로잡는 금융교육 콘텐츠 플랫폼입니다.{" "}
                <span className={styles.noteHl}>
                  콘텐츠의 오류나 개선 의견이 있으시면 언제든지 연락주세요.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
