"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const TOC = [
  { id: "s1", label: "01 흔한 오해" },
  { id: "s2", label: "02 합법 vs 불법" },
  { id: "s3", label: "03 금융사기 예방" },
  { id: "s4", label: "04 체크리스트" },
  { id: "s5", label: "05 자주 묻는 질문" },
];

const QUIZ = [
  "대부업은 모두 불법일까요?",
  "대부업을 이용하면 신용점수가 크게 떨어질까요?",
  "중개수수료를 요구하면 정상 업체일까요?",
];

const MYTHS = [
  { q: "대부업체는 모두 불법이다?", a: "금융당국에 등록된 대부업체는 관련 법령에 따라 합법적으로 영업할 수 있어요. 미등록 업체만 불법 사금융이에요." },
  { q: "대부업을 이용하면 신용점수가 무조건 폭락한다?", a: "신용점수는 상환 이력·부채 수준 등 다양한 요소로 평가되며, 단순한 이용 여부만으로 결정되지 않아요." },
  { q: "대부중개업 등록번호는 큰 의미가 없다?", a: "등록 여부는 합법 업체와 불법 사금융을 구분하는 가장 기본적인 기준이에요. 상담 전 대부중개업 등록번호를 꼭 확인하세요." },
  { q: "수수료를 내야 대출이 가능하다?", a: "정상적인 금융회사는 대출 실행 전에 수수료를 요구하지 않아요. 선입금·수수료 요구는 대표적인 사기 신호예요." },
];

const COMPARE = [
  ["등록 여부", "금융당국 정식 등록", "미등록"],
  ["법정 금리", "법정 최고금리 이내", "법정 금리 초과 요구"],
  ["중개수수료", "차주에게 요구하지 않음", "수수료·선입금 요구"],
  ["계약 절차", "정식 계약서 교부", "미제공·구두 계약"],
  ["채권 추심", "법이 정한 절차 준수", "협박·불법 추심"],
  ["소비자 보호", "관련 제도 적용", "보호 사각지대"],
];

const DANGERS = [
  { t: "선입금 요구", d: "정상적인 금융회사는 대출 실행 전에 수수료·보증금을 요구하지 않아요." },
  { t: "중개수수료 요구", d: "대출 중개 명목으로 차주에게 수수료를 받는 것은 법으로 금지되어 있어요." },
  { t: "작업대출 권유", d: "재직·소득 서류를 허위로 꾸미는 작업대출은 명백한 불법이며 본인도 처벌받을 수 있어요." },
  { t: "통장 양도 요구", d: "통장·카드를 넘기는 행위는 범죄에 악용될 수 있고 양도자도 책임을 질 수 있어요." },
  { t: "신분증 사진 무분별 요구", d: "꼭 필요한 절차가 아닌데 신분증 사진을 과도하게 요구하면 도용 위험이 있어요." },
];

const CHECKS = [
  "등록 대부업체인지 확인",
  "계약서 내용 확인",
  "금리 및 상환 조건 확인",
  "중도상환수수료 확인",
  "상환 계획 점검",
  "선입금 요구 여부 확인",
];

const FAQS = [
  { q: "대부업체는 모두 불법인가요?", a: "아니에요. 금융감독원·지자체에 등록된 대부업체는 관련 법령에 따라 합법적으로 영업할 수 있어요. 미등록 업체가 불법 사금융이며, 등록 여부로 둘을 구분할 수 있어요." },
  { q: "대부업을 이용하면 신용점수가 떨어지나요?", a: "신용점수는 상환 이력·부채 수준 등 여러 요소로 평가되며, 단순히 대부업 이용 여부만으로 결정되지 않아요. 다만 대출 실행과 상환 상태는 신용 정보에 반영돼요." },
  { q: "등록 대부업체는 어디서 확인하나요?", a: "금융감독원의 '등록 대부업체 통합조회'에서 업체명·등록번호로 직접 확인할 수 있어요. 상담 전에 등록 여부를 조회하는 것이 가장 기본적인 안전 확인이에요." },
  { q: "중개수수료 요구는 합법인가요?", a: "아니에요. 대출 중개 명목으로 차주에게 수수료를 요구하는 것은 법으로 금지되어 있어요. 수수료를 요구한다면 응하지 말고 거래를 즉시 중단하세요." },
  { q: "선입금을 요구하면 정상 업체인가요?", a: "아니에요. 정상적인 금융회사는 대출 실행 전에 어떠한 명목으로도 선입금을 요구하지 않아요. 선입금 요구는 금융사기의 가장 대표적인 신호이므로 즉시 거래를 중단하고 금융감독원(1332)에 신고하세요." },
];

export default function AboutLending() {
  const [checked, setChecked] = useState<boolean[]>(() => Array(CHECKS.length).fill(false));
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [active, setActive] = useState("s1");
  const tickRef = useRef(false);

  const checkedCount = checked.filter(Boolean).length;

  useEffect(() => {
    const ids = TOC.map((t) => t.id);
    const onScroll = () => {
      if (tickRef.current) return;
      tickRef.current = true;
      requestAnimationFrame(() => {
        tickRef.current = false;
        let cur = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 160) cur = id;
        }
        setActive(cur);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <>
      {/* ===== HERO ===== */}
      <div className={styles.heroWrap}>
        <div className={styles.wrap}>
          <nav className={styles.crumb}>
            <Link href="/">홈</Link>
            <span className={styles.sep}>›</span>
            <span className={styles.crumbCur}>바로알기</span>
          </nav>
        </div>
        <div className={styles.hero}>
          <div className={`${styles.wrap} ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>
                <span className={styles.eyeDot} />
                바로알기
              </span>
              <h1 className={styles.h1}>
                대부업에 대해
                <br />
                얼마나 알고 계신가요?
              </h1>
              <p className={styles.heroDesc}>
                대부업에 대한 막연한 불안과 오해를 줄이고,
                <br />
                합법 대부업과 불법 사금융을 구분할 수 있도록
                <br />
                핵심 정보를 한곳에 모았어요.
              </p>
              <div className={styles.quizList}>
                {QUIZ.map((q) => (
                  <div className={styles.quizCard} key={q}>
                    <span className={styles.quizQ}>Q</span>
                    <span className={styles.quizText}>{q}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.heroArt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/lending-illust.svg" alt="" />
            </div>
          </div>
        </div>

        {/* TOC */}
        <div className={styles.tocBar}>
          <div className={`${styles.wrap} ${styles.tocInner}`}>
            {TOC.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                onClick={(e) => goTo(e, t.id)}
                className={`${styles.tocItem} ${active === t.id ? styles.tocOn : ""}`}
              >
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SECTION 01 흔한 오해 ===== */}
      <section id="s1" className={`${styles.section} ${styles.secWhite}`}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <div className={styles.secLabel}>SECTION 01</div>
            <h2 className={styles.secTitle}>대부업에 대한 흔한 오해</h2>
            <p className={styles.secDesc}>많은 분들이 대부업에 대해 막연한 선입견을 갖고 있어요.<br />자주 접하는 오해부터 사실 그대로 짚어 봐요.</p>
          </div>
          <div className={styles.grid2}>
            {MYTHS.map((m) => (
              <div className={styles.mythCard} key={m.q}>
                <span className={styles.mythBadge}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  오해예요
                </span>
                <div className={styles.mythQ}>{m.q}</div>
                <div className={styles.mythA}>{m.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 02 합법 vs 불법 ===== */}
      <section id="s2" className={`${styles.section} ${styles.secGray}`}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <div className={styles.secLabel}>SECTION 02</div>
            <h2 className={styles.secTitle}>합법 대부업과 불법 사금융의 차이</h2>
            <p className={styles.secDesc}>가장 중요한 건 &lsquo;등록 여부&rsquo;예요. 합법 대부업과 불법 사금융은 아래 항목에서 분명하게 갈려요.</p>
          </div>
          <div className={styles.callout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p>등록 대부업체는 금융감독원·지자체에 등록되어 있으며, 등록 여부는 누구나 직접 조회해 확인할 수 있어요.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>구분</th>
                  <th className={styles.thOk}>✓&nbsp; 합법 대부업</th>
                  <th className={styles.thNo}>✗&nbsp; 불법 사금융</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td><span className={styles.ok}>✓</span>{row[1]}</td>
                    <td className={styles.noCell}><span className={styles.no}>✗</span>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.quickLinks}>
            <Link href="/guides" className={styles.quickLink}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="2.2" strokeLinecap="round"><path d="M9 12l2 2 4-4" /><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" /></svg>
              합법 대부업체 확인 방법
            </Link>
            <Link href="/guides" className={styles.quickLink}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E03131" strokeWidth="2.2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              불법 사금융 구별법
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 03 위험 신호 ===== */}
      <section id="s3" className={`${styles.section} ${styles.secRed}`}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <div className={`${styles.secLabel} ${styles.secLabelRed}`}>SECTION 03</div>
            <h2 className={styles.secTitle}>이런 경우는 위험 신호예요</h2>
            <p className={styles.secDesc}>아래와 같은 요구를 받는다면 불법 사금융이나 금융사기일 수 있어요.<br />진행을 멈추고 등록 여부부터 확인하세요.</p>
          </div>
          <div className={styles.dangerList}>
            {DANGERS.map((d, i) => (
              <div className={styles.dangerCard} key={d.t}>
                <div className={`${styles.dangerNum} tnum`}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className={styles.dangerTitle}>{d.t}</div>
                  <div className={styles.dangerDesc}>{d.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.related}>
            <span className={styles.relatedL}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E03131" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              관련 가이드
            </span>
            <Link href="/guides" className={styles.relatedLink}>중개수수료 요구는 불법인가 →</Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 04 체크리스트 ===== */}
      <section id="s4" className={`${styles.section} ${styles.secWhite}`}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <div className={styles.secLabel}>SECTION 04</div>
            <h2 className={styles.secTitle}>대부업 이용 전 체크리스트</h2>
            <p className={styles.secDesc}>상담을 시작하기 전, 아래 항목을 하나씩 확인하세요.<br />직접 체크해 보며 빠진 부분이 없는지 점검할 수 있어요.</p>
          </div>
          <div className={styles.checkWrap}>
            <div className={styles.checkList}>
              {CHECKS.map((c, i) => (
                <button
                  type="button"
                  key={c}
                  className={`${styles.checkItem} ${checked[i] ? styles.checkOn : ""}`}
                  onClick={() => setChecked((arr) => arr.map((v, j) => (j === i ? !v : v)))}
                >
                  <span className={styles.checkBox}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3.5 3.5 5.5-5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className={styles.checkLabel}>{c}</span>
                </button>
              ))}
            </div>
            <div className={styles.checkProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${(checkedCount / CHECKS.length) * 100}%` }} />
              </div>
              <div className={styles.progressText}>
                <span className="tnum">{checkedCount}</span> / {CHECKS.length} 확인
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 05 FAQ ===== */}
      <section id="s5" className={`${styles.section} ${styles.secGray}`}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <div className={styles.secLabel}>SECTION 05</div>
            <h2 className={styles.secTitle}>자주 묻는 질문</h2>
            <p className={styles.secDesc}>대부업에 대해 가장 많이 묻는 질문을 모았어요. 답변은 이 페이지에서 바로 확인할 수 있어요.</p>
          </div>
          <div className={styles.faqList}>
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div className={`${styles.faqItem} ${open ? styles.faqOpen : ""}`} key={f.q}>
                  <button type="button" className={styles.faqQ} onClick={() => setOpenFaq(open ? null : i)}>
                    <span className={styles.faqQInner}>
                      <span className={styles.faqBadge}>Q</span>
                      <span className={styles.faqQText}>{f.q}</span>
                    </span>
                    <span className={styles.faqToggle}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    </span>
                  </button>
                  {open && (
                    <div className={styles.faqA}>
                      {f.a}
                      <br />
                      <Link href="/guides" className={styles.faqLink}>더 자세히 알아보기 →</Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <div className={styles.cta}>
        <div className={`${styles.wrap} ${styles.ctaInner}`}>
          <div className={styles.ctaTag}>금융가이드</div>
          <h2 className={styles.ctaTitle}>정확한 정보로 안전하게 판단하세요</h2>
          <p className={styles.ctaDesc}>
            신용관리, 대출상식, 금융사기예방 등 금융소비자가
            <br />
            꼭 알아야 할 정보를 금융가이드 메뉴에서 확인할 수 있어요.
          </p>
          <Link href="/guides" className={styles.ctaBtn}>
            금융가이드 바로가기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>

      {/* ===== DISCLAIMER ===== */}
      <div className={styles.disclaimer}>
        <p className={styles.wrap}>본 콘텐츠는 금융 이해를 돕기 위한 교육 정보이며, 특정 금융상품의 가입을 권유하거나 투자를 자문하지 않아요. 실제 거래 전 반드시 해당 금융회사의 안내를 확인하세요.</p>
      </div>
    </>
  );
}
