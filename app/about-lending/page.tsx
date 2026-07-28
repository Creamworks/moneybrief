import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import Checklist from "./Checklist";
import { wpFetch, GUIDE_CATEGORIES } from "@/lib/wp";

export const metadata: Metadata = {
  title: "대부업 바로알기 — money brief",
  description:
    "대부업에 대한 막연한 불안과 오해를 줄이고, 합법 대부업과 불법 사금융을 구분할 수 있도록 핵심 정보를 한곳에 모았습니다.",
};

const S = {
  stroke: "currentColor" as const,
};

function ArrowR() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
function ChevR() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const QUESTIONS = [
  "대부업은 모두 불법일까요?",
  "대부업을 이용하면 신용점수가 크게 떨어질까요?",
  "중개수수료를 요구하면 정상 업체일까요?",
];

const MYTHS = [
  {
    h: "대부업체는 모두 불법이다?",
    p: "금융당국에 등록된 대부업체는 관련 법령에 따라 합법적으로 영업할 수 있습니다. 미등록 업체만 불법 사금융입니다.",
  },
  {
    h: "대부업을 이용하면 신용점수가 무조건 폭락한다?",
    p: "신용점수는 상환 이력·부채 수준 등 다양한 요소로 평가되며, 단순한 이용 여부만으로 결정되지 않습니다.",
  },
  {
    h: "대부중개업 등록번호는 큰 의미가 없다?",
    p: "등록 여부는 합법 업체와 불법 사금융을 구분하는 가장 기본적인 기준입니다. 상담 전 대부중개업 등록번호를 꼭 확인하세요.",
  },
  {
    h: "수수료를 내야 대출이 가능하다?",
    p: "정상적인 금융회사는 대출 실행 전에 수수료를 요구하지 않습니다. 선입금·수수료 요구는 대표적인 사기 신호입니다.",
  },
];

const COMPARE = [
  { crit: "등록 여부", legal: "금융당국 정식 등록", illegal: "미등록" },
  { crit: "법정 금리 적용", legal: "법정 최고금리 이내", illegal: "법정 금리 초과 요구" },
  { crit: "중개수수료", legal: "차주에게 요구하지 않음", illegal: "수수료·선입금 요구" },
  { crit: "계약서 제공", legal: "정식 계약서 교부", illegal: "미제공·구두 계약" },
  { crit: "추심 방식", legal: "법이 정한 절차 준수", illegal: "협박·불법 추심" },
  { crit: "소비자 보호", legal: "관련 제도 적용", illegal: "보호 사각지대" },
];

const LOAN_TYPES = [
  {
    title: "신용대출",
    desc: "담보 없이 신용과 소득을 기반으로 심사하는 가장 일반적인 대출 유형입니다.",
    targets: ["직장인", "프리랜서", "소득이 있는 개인"],
    icon: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
  },
  {
    title: "자동차 담보대출",
    desc: "본인 명의 차량을 담보로 활용하는 대출 유형입니다.",
    targets: ["차량 보유자"],
    icon: <path d="M5 16l1.5-5h11L19 16M5 16h14v3H5zM7 19v2M17 19v2" />,
  },
  {
    title: "부동산 담보대출",
    desc: "주택, 아파트, 상가, 토지 등을 담보로 활용하는 대출 유형입니다.",
    targets: ["부동산 보유자"],
    icon: <path d="M4 11l8-7 8 7M6 10v10h12V10" />,
  },
  {
    title: "사업자대출",
    desc: "사업 운영에 필요한 자금을 위한 대출 유형입니다.",
    targets: ["개인사업자", "법인사업자"],
    icon: <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />,
  },
];

const FRAUD = [
  {
    h: "선입금 요구",
    p: "정상적인 금융회사는 대출 실행 전에 수수료·보증금을 요구하지 않습니다.",
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  },
  {
    h: "중개수수료 요구",
    p: "대출 중개 명목으로 차주에게 수수료를 받는 것은 법으로 금지되어 있습니다.",
    icon: (
      <>
        <path d="M16 8a4 4 0 0 0-8 0c0 6-3 6-3 8h14c0-2-3-2-3-8z" />
        <path d="M3 3l18 18" />
      </>
    ),
  },
  {
    h: "작업대출 권유",
    p: "재직·소득 서류를 허위로 꾸미는 작업대출은 명백한 불법이며 본인도 처벌받을 수 있습니다.",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 13l2 2 4-4" />
      </>
    ),
  },
  {
    h: "통장 양도 요구",
    p: "통장·카드를 넘기는 행위는 범죄에 악용될 수 있고 양도자도 책임을 질 수 있습니다.",
    icon: (
      <>
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <path d="M2 10h20M6 15h4" />
      </>
    ),
  },
  {
    h: "신분증 사진 무분별 요구",
    p: "꼭 필요한 절차가 아닌데 신분증 사진을 과도하게 요구하면 도용 위험이 있습니다.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="M3 18l4-4 3 2 4-4 7 6" />
      </>
    ),
  },
];

// link: 답변을 더 자세히 다루는 가이드 기사의 subtitle(ACF) 키 → gl()로 슬러그 변환
const FAQ = [
  {
    q: "대부업체는 모두 불법인가요?",
    a: "아닙니다. 금융감독원·지자체에 등록된 대부업체는 관련 법령에 따라 합법적으로 영업할 수 있습니다. 미등록 업체가 불법 사금융이며, 등록 여부로 둘을 구분할 수 있습니다.",
    link: "합법 대부업체 확인 방법",
  },
  {
    q: "대부업을 이용하면 신용점수가 떨어지나요?",
    a: "신용점수는 상환 이력·부채 수준 등 여러 요소로 평가되며, 단순히 대부업 이용 여부만으로 결정되지 않습니다. 다만 대출 실행과 상환 상태는 신용 정보에 반영됩니다.",
    link: "신용점수란 무엇인가",
  },
  {
    q: "등록 대부업체는 어디서 확인하나요?",
    a: "금융감독원의 '등록 대부업체 통합조회'에서 업체명·등록번호로 직접 확인할 수 있습니다. 상담 전에 등록 여부를 조회하는 것이 가장 기본적인 안전 확인입니다.",
    link: "대부업 등록번호 조회 방법",
  },
  {
    q: "중개수수료 요구는 합법인가요?",
    a: "아닙니다. 대출 중개 명목으로 차주에게 수수료를 요구하는 것은 법으로 금지되어 있습니다. 수수료를 요구한다면 응하지 말고 거래를 중단하세요.",
    link: "중개수수료 요구는 불법인가",
  },
  {
    q: "선입금을 요구하면 정상 업체인가요?",
    a: "아닙니다. 정상적인 금융회사는 대출 실행 전에 수수료·보증금 등 어떤 명목의 선입금도 요구하지 않습니다. 선입금 요구는 대표적인 사기 신호입니다.",
    link: "선입금 요구 사기 유형",
  },
  {
    q: "작업대출은 왜 위험한가요?",
    a: "재직·소득 서류를 허위로 만드는 작업대출은 명백한 불법입니다. 권유에 응하면 사문서위조·사기 등으로 본인도 형사처벌을 받을 수 있어 매우 위험합니다.",
    link: "작업대출이란",
  },
];

const QNAV = [
  { n: "01", label: "흔한 오해", href: "#s1" },
  { n: "02", label: "합법 대부업과 불법 사금융", href: "#s2" },
  { n: "03", label: "대표적인 대출 유형", href: "#s3" },
  { n: "04", label: "금융사기 예방", href: "#s4" },
  { n: "05", label: "이용 전 체크리스트", href: "#s5" },
  { n: "06", label: "자주 묻는 질문", href: "#s6" },
];

function GuideCard({ title, href = "/guides" }: { title: string; href?: string }) {
  return (
    <Link className={styles.gdCard} href={href}>
      <span className={styles.gdic}>
        <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      </span>
      <span className={styles.gdt}>{title}</span>
      <span className={styles.gda}>
        <ChevR />
      </span>
    </Link>
  );
}

type WpGuide = { slug: string; acf?: { subtitle?: string } };

// 가이드 글의 주제(subtitle) → 슬러그 매핑. 관련 가이드 카드를 해당 기사로 연결한다.
async function getSubtitleSlugMap(): Promise<Record<string, string>> {
  const cats =
    (await wpFetch<{ id: number; name: string }[]>("/wp/v2/categories?per_page=100&_fields=id,name")) || [];
  const ids = cats.filter((c) => GUIDE_CATEGORIES.includes(c.name)).map((c) => c.id);
  if (!ids.length) return {};
  const posts =
    (await wpFetch<WpGuide[]>(`/wp/v2/posts?categories=${ids.join(",")}&per_page=100&_fields=slug,acf`)) || [];
  const map: Record<string, string> = {};
  for (const p of posts) {
    const sub = (p.acf?.subtitle || "").trim();
    if (sub && !map[sub]) map[sub] = decodeURIComponent(p.slug);
  }
  return map;
}

export default async function AboutLendingPage() {
  const slugMap = await getSubtitleSlugMap();
  const gl = (subtitle: string) => {
    const s = slugMap[subtitle];
    return s ? `/guides/${s}` : "/guides";
  };
  return (
    <>
      {/* ============ HERO ============ */}
      <div className={styles.ghero}>
        <div className={styles.gheroInner}>
          <nav className={styles.crumb}>
            <Link href="/">홈</Link>
            <ChevR />
            <span>바로알기</span>
          </nav>
          <h1 className={styles.phTitle}>대부업 바로알기</h1>
          <p className={styles.phSub}>
            대부업에 대한 막연한 불안과 오해를 줄이고,
            <br />
            금융소비자가 안전하게 판단할 수 있도록 핵심 정보를 한곳에
            모았습니다.
          </p>

          <div className={styles.heroFeature}>
            <div className={styles.mediaPlaceholder}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/about-lending-hero.webp" alt="" />
            </div>
            <div className={styles.hfBody}>
              <span className={styles.hfKicker}>바로알기</span>
              <h2 className={styles.hfTitle}>대부업에 대해 얼마나 알고 계신가요?</h2>
              <div className={styles.qline}>
                {QUESTIONS.map((q) => (
                  <div className={styles.qi} key={q}>
                    <span className={styles.qm}>Q</span>
                    {q}
                  </div>
                ))}
              </div>
              <p className={styles.lead}>
                인터넷에는 대부업에 대한 정보가 많지만, 사실과 오해가 함께 섞여
                있는 경우도 적지 않습니다. 금융소비자가 합법 대부업과 불법
                사금융을 구분하고, 보다 안전하게 금융 정보를 이해할 수 있도록
                '바로알기' 가이드를 제작했습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ quick nav ============ */}
      <div className={styles.qnavBar}>
        <div className={styles.wrap}>
          <nav className={styles.qnav} aria-label="페이지 내 빠른 이동">
            {QNAV.map((item) => (
              <a href={item.href} key={item.href}>
                <span className={styles.qn}>{item.n}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className={styles.wrap}>
        <div className={styles.gcontent}>
          {/* ===== S1 — myths ===== */}
          <section className={styles.gsec} id="s1">
            <div className={styles.gsecHead}>
              <span className={styles.gsecNum}>
                <span className={styles.ln} />
                SECTION 01
              </span>
              <h2>대부업에 대한 흔한 오해</h2>
              <p>
                많은 분들이 대부업에 대해 막연한 선입견을 갖고 있습니다. 자주
                접하는 오해부터 사실 그대로 짚어 봅니다.
              </p>
            </div>
            <div className={styles.myths}>
              {MYTHS.map((m) => (
                <div className={styles.myth} key={m.h}>
                  <h3>{m.h}</h3>
                  <div className={styles.verdict}>
                    <XIcon />
                    오해입니다
                  </div>
                  <p className={styles.factText}>{m.p}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== S2 — comparison ===== */}
          <section className={styles.gsec} id="s2">
            <div className={styles.gsecHead}>
              <span className={styles.gsecNum}>
                <span className={styles.ln} />
                SECTION 02
              </span>
              <h2>합법 대부업과 불법 사금융의 차이</h2>
              <p>
                가장 중요한 건 '등록 여부'입니다. 합법 대부업과 불법 사금융은
                아래 항목에서 분명하게 갈립니다.
              </p>
            </div>
            <p className={styles.compareNote}>
              <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              등록 대부업체는 금융감독원·지자체에 등록되어 있으며, 등록 여부는
              누구나 직접 조회해 확인할 수 있습니다.
            </p>
            <div className={styles.compare}>
              <div className={styles.ctblHead}>
                <div>구분</div>
                <div className={styles.cLegal}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  합법 대부업
                </div>
                <div className={styles.cIllegal}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                    <path d="M12 9v4M12 17h.01" />
                  </svg>
                  불법 사금융
                </div>
              </div>
              {COMPARE.map((row) => (
                <div className={styles.ctblRow} key={row.crit}>
                  <div className={styles.cCrit}>{row.crit}</div>
                  <div className={`${styles.cCell} ${styles.legal}`}>
                    <span className={styles.icYes}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    </span>
                    {row.legal}
                  </div>
                  <div className={`${styles.cCell} ${styles.illegal}`}>
                    <span className={styles.icNo}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </span>
                    {row.illegal}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.gdBlock}>
              <div className={styles.gdLabel}>
                <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                함께 보면 좋은 가이드
              </div>
              <div className={styles.gdCards}>
                <GuideCard title="합법 대부업체 확인 방법" href={gl("합법 대부업체 확인 방법")} />
                <GuideCard title="불법 사금융 구별법" href={gl("불법 사금융 구별법")} />
              </div>
            </div>
          </section>

          {/* ===== S3 — loan types ===== */}
          <section className={styles.gsec} id="s3">
            <div className={styles.gsecHead}>
              <span className={styles.gsecNum}>
                <span className={styles.ln} />
                SECTION 03
              </span>
              <h2>대부업에서는 어떤 대출을 취급할까?</h2>
              <p>
                대부업체마다 취급 상품은 다를 수 있지만, 일반적으로 아래와 같은
                유형의 대출이 알려져 있습니다.
              </p>
            </div>
            <div className={styles.typeblocks}>
              {LOAN_TYPES.map((t) => (
                <div className={styles.typeblock} key={t.title}>
                  <div className={styles.tbh}>
                    <span className={styles.tbic}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {t.icon}
                      </svg>
                    </span>
                    <h3>{t.title}</h3>
                  </div>
                  <p className={styles.tbdesc}>{t.desc}</p>
                  <div className={styles.tbtarget}>
                    <div className={styles.cl}>주 대상</div>
                    <ul>
                      {t.targets.map((tg) => (
                        <li key={tg}>{tg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== S4 — risk signals ===== */}
          <section className={styles.gsec} id="s4">
            <div className={styles.fraud}>
              <div className={styles.gsecHead}>
                <span className={styles.gsecNum}>
                  <span className={styles.ln} />
                  SECTION 04
                </span>
                <h2>이런 경우는 위험 신호입니다</h2>
                <p>
                  아래와 같은 요구를 받는다면 불법 사금융이나 금융사기일 수
                  있습니다. 진행을 멈추고 등록 여부부터 확인하세요.
                </p>
              </div>
              <div className={styles.fraudGrid}>
                {FRAUD.map((f) => (
                  <div className={styles.fcard} key={f.h}>
                    <span className={styles.fco}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        {f.icon}
                      </svg>
                    </span>
                    <div>
                      <h3>{f.h}</h3>
                      <p>{f.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.gdBlock}>
              <div className={styles.gdLabel}>
                <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                관련 가이드
              </div>
              <div className={styles.gdCards}>
                <GuideCard title="중개수수료 요구는 불법인가" href={gl("중개수수료 요구는 불법인가")} />
                <GuideCard title="작업대출이란" href={gl("작업대출이란")} />
              </div>
            </div>
          </section>

          {/* ===== S5 — checklist ===== */}
          <section className={styles.gsec} id="s5">
            <div className={styles.gsecHead}>
              <span className={styles.gsecNum}>
                <span className={styles.ln} />
                SECTION 05
              </span>
              <h2>대부업 이용 전 체크리스트</h2>
              <p>
                상담을 시작하기 전, 아래 항목을 하나씩 확인하세요. 직접 체크해
                보며 빠진 부분이 없는지 점검할 수 있습니다.
              </p>
            </div>
            <Checklist />
          </section>

          {/* ===== S6 — FAQ ===== */}
          <section className={styles.gsec} id="s6">
            <div className={styles.gsecHead}>
              <span className={styles.gsecNum}>
                <span className={styles.ln} />
                SECTION 06
              </span>
              <h2>자주 묻는 질문</h2>
              <p>
                대부업에 대해 가장 많이 묻는 질문을 모았습니다. 답변은 이
                페이지에서 바로 확인할 수 있습니다.
              </p>
            </div>
            <div className={styles.faq}>
              {FAQ.map((item, i) => (
                <details key={item.q} open={i === 0}>
                  <summary>
                    <span className={styles.q}>Q</span>
                    {item.q}
                    <svg className={styles.ar} viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <div className={styles.fa}>
                    <p>{item.a}</p>
                    <Link className={styles.glink} href={gl(item.link)}>
                      더 자세히 알아보기 <ArrowR />
                    </Link>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ============ bottom CTA ============ */}
      <div className={styles.gctaWrap}>
        <div className={styles.wrap}>
          <div className={styles.gcta}>
            <div>
              <h2>정확한 정보로 안전하게 판단하세요</h2>
              <p>
                신용관리, 대출상식, 금융사기예방 등 금융소비자가
                <br />꼭 알아야 할 정보를 금융가이드 메뉴에서 확인할 수 있습니다.
              </p>
            </div>
            <Link className={styles.gctaBtn} href="/guides">
              금융가이드 바로가기 <ArrowR />
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        <p className={styles.pageDisc}>
          <svg viewBox="0 0 24 24" fill="none" stroke={S.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          본 콘텐츠는 금융 이해를 돕기 위한 교육 정보이며, 특정 금융상품의 가입을
          권유하거나 투자를 자문하지 않습니다. 실제 거래 전 반드시 해당
          금융회사의 안내를 확인하세요.
        </p>
      </div>
    </>
  );
}
