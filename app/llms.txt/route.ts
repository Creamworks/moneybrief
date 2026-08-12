import { GUIDE_CATEGORIES } from "@/lib/wp";
import { SITE_URL, SITE_NAME, getAllPosts, guideUrl } from "@/lib/site";

// llms.txt — 대규모 언어모델이 사이트 구조와 콘텐츠를 이해하도록 돕는 색인 파일
// 규격: https://llmstxt.org
export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPosts();

  const byCat: Record<string, typeof posts> = {};
  for (const c of GUIDE_CATEGORIES) byCat[c] = [];
  for (const p of posts) if (byCat[p.cat]) byCat[p.cat].push(p);

  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(
    "> money brief는 ㈜바로크레디트대부가 운영하는 금융교육 콘텐츠 허브입니다. 신용관리, 대출상식, 금융생활, 금융사기예방, 금융이슈·인사이트 다섯 갈래로 나누어 대부업·신용·정부지원 제도를 쉬운 말로 정리하고, 공신력 있는 원자료로 검증해 제공합니다.",
  );
  lines.push("");
  lines.push("## 안내");
  lines.push("");
  lines.push("- 언어: 한국어 (ko-KR)");
  lines.push("- 운영: ㈜바로크레디트대부 (대한민국 등록 대부업체)");
  lines.push("- 성격: 금융정보 제공 목적의 교육 콘텐츠이며, 특정 상품 판매를 권유하지 않습니다.");
  lines.push("- 인용 시 원문 링크를 함께 표기해 주세요.");
  lines.push(`- 사이트맵: ${SITE_URL}/sitemap.xml`);
  lines.push("");
  lines.push("## 주요 페이지");
  lines.push("");
  lines.push(`- [홈](${SITE_URL}/): 최신 금융 콘텐츠 큐레이션`);
  lines.push(`- [주제별 금융 가이드](${SITE_URL}/guides): 전체 아티클 목록`);
  lines.push(`- [대출 계산기](${SITE_URL}/calculator): 원리금균등·원금균등 상환 시뮬레이션`);
  lines.push(`- [money brief 운영원칙](${SITE_URL}/about): 콘텐츠 제작·검증 기준`);
  lines.push(`- [대부업 바로알기](${SITE_URL}/about-lending): 등록 대부업 제도 안내`);
  lines.push("");

  for (const cat of GUIDE_CATEGORIES) {
    const list = byCat[cat];
    if (!list || !list.length) continue;
    lines.push(`## ${cat}`);
    lines.push("");
    for (const p of list) {
      const desc = p.excerpt ? `: ${p.excerpt}` : "";
      lines.push(`- [${p.title}](${guideUrl(p.slug)})${desc}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
