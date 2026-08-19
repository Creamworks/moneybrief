import { GUIDE_CATEGORIES } from "@/lib/wp";
import { SITE_URL, SITE_NAME, getAllPosts, guideUrlReadable } from "@/lib/site";
import { geoOverride } from "@/lib/geo-overrides";

/**
 * llms.txt — 대규모 언어모델이 사이트 구조와 콘텐츠를 이해하도록 돕는 색인 파일
 * 규격: https://llmstxt.org
 *
 * 구성은 moneybrief-geo 레퍼런스를 따르되, 글 목록만 워드프레스에서 실시간으로 가져와요.
 * 레퍼런스 파일의 URL을 그대로 박아 두면 비공개로 돌린 글이 404 링크로 남아
 * 오히려 신뢰도를 떨어뜨리기 때문입니다. 발행 상태가 바뀌면 1시간 안에 자동 반영돼요.
 */
export const revalidate = 3600;

/** 카테고리 한글명 → llms.txt 소제목에 함께 적을 영문 병기 */
const CATEGORY_EN: Record<string, string> = {
  신용관리: "Credit Management",
  대출상식: "Loan Basics",
  금융생활: "Financial Life",
  금융사기예방: "Fraud Prevention",
  "금융이슈·인사이트": "Financial Issues & Insights",
};

const CALCULATORS: [string, string, string][] = [
  ["금융계산기 전체", "/calculator", "대출과 관련한 금액을 직접 계산해볼 수 있는 계산기 모음입니다."],
  ["원리금 계산기", "/calculator?tab=loan", "대출 원금과 이자를 합한 월 상환액을 계산합니다."],
  ["대출이자 계산기", "/calculator?tab=interest", "대출 조건에 따른 이자를 계산합니다."],
  ["DSR 계산기", "/calculator?tab=dsr", "총부채원리금상환비율(DSR)을 계산해 대출 한도를 가늠합니다."],
  [
    "중도상환수수료 계산기",
    "/calculator?tab=prepay",
    "대출을 조기 상환할 때 발생하는 수수료를 계산합니다.",
  ],
];

const KEY_PAGES: [string, string, string][] = [
  ["money brief 홈", "/", "금융가이드·계산기·회사 정보를 모아 놓은 메인 페이지입니다."],
  ["바로알기", "/about-lending", "대부업·대출에 대한 기본 개념을 소개하는 페이지입니다."],
  ["운영 원칙", "/about", "money brief의 콘텐츠 운영 원칙과 편집 방향을 안내합니다."],
];

const POLICY_PAGES: [string, string, string][] = [
  [
    "개인정보처리방침",
    "https://www.barocredit.com/help/terms-policy/policy-privacy",
    "운영사 ㈜바로크레디트대부의 개인정보 처리방침입니다.",
  ],
  [
    "이용약관",
    "https://www.barocredit.com/ubi4/terms",
    "운영사 ㈜바로크레디트대부의 이용약관입니다.",
  ],
];

const link = (name: string, href: string, desc: string) =>
  `- [${name}](${href.startsWith("http") ? href : SITE_URL + href}): ${desc}`;

export async function GET() {
  const posts = await getAllPosts();

  const byCat: Record<string, typeof posts> = {};
  for (const c of GUIDE_CATEGORIES) byCat[c] = [];
  for (const p of posts) if (byCat[p.cat]) byCat[p.cat].push(p);

  const L: string[] = [];
  L.push(`# ${SITE_NAME} (머니브리프)`);
  L.push("");
  L.push(
    "> money brief는 ㈜바로크레디트대부가 운영하는 금융교육 콘텐츠 플랫폼입니다. 신용관리·대출상식·금융생활·금융사기예방·금융이슈 등 실생활에 필요한 금융 지식을 누구나 이해하기 쉽게 풀어 제공하며, 대출 원리금·이자·DSR·중도상환수수료를 직접 계산해볼 수 있는 금융계산기도 함께 제공합니다.",
  );
  L.push("");
  L.push(
    "money brief의 콘텐츠는 정확한 법령·제도 정보를 바탕으로, 금융 초보자도 이해할 수 있는 쉬운 언어로 작성됩니다. 모든 가이드는 일반적인 금융소비자 보호 정보를 제공할 목적으로 작성된 것이며 법률 자문을 대체하지 않습니다. 인용된 조문·수치·제도는 각 글의 작성 시점을 기준으로 합니다. 운영사는 대부업 등록업체인 ㈜바로크레디트대부(바로바로론)입니다.",
  );
  L.push("");
  L.push("## 금융가이드 (Financial Guides)");
  L.push("");

  for (const cat of GUIDE_CATEGORIES) {
    const list = byCat[cat];
    if (!list || !list.length) continue;
    const en = CATEGORY_EN[cat];
    L.push(`### ${cat}${en ? ` (${en})` : ""}`);
    for (const p of list) {
      // 큐레이션 요약이 있으면 그것을, 없으면 워드프레스 발췌를 씁니다.
      const desc = geoOverride(p.id).llmsSummary || p.excerpt;
      L.push(link(p.title, guideUrlReadable(p.slug), desc));
    }
    L.push("");
  }

  L.push("## 금융계산기 (Financial Calculators)");
  L.push("");
  for (const [n, h, d] of CALCULATORS) L.push(link(n, h, d));
  L.push("");

  L.push("## 주요 페이지 (Key Pages)");
  L.push("");
  for (const [n, h, d] of KEY_PAGES) L.push(link(n, h, d));
  L.push("");

  L.push("## 회사 및 정책 (Company & Policy)");
  L.push("");
  for (const [n, h, d] of POLICY_PAGES) L.push(link(n, h, d));
  L.push("");

  return new Response(L.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
