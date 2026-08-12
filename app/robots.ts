import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * AI 크롤러 정책: 전면 허용
 *
 * `User-agent: *` 만으로도 기본은 허용이지만, 주요 AI 크롤러를 이름으로 명시하면
 *  - 봇 운영사가 정책을 바꿔 기본값을 "차단"으로 돌려도 우리 의사가 유지되고,
 *  - robots.txt 를 읽는 사람(감사·제휴사)에게 의도가 분명하게 드러나요.
 *
 * 차단으로 바꾸고 싶은 봇이 생기면 allow: "/" 를 disallow: "/" 로만 바꾸면 돼요.
 */
const AI_CRAWLERS = [
  // OpenAI — 학습용 / 검색색인용 / 사용자가 링크를 물어봤을 때
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google (Gemini·AI 개요용 별도 토큰)
  "Google-Extended",
  // Apple Intelligence
  "Applebot",
  "Applebot-Extended",
  // Meta AI
  "meta-externalagent",
  "FacebookBot",
  // 기타 데이터셋·AI 검색
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "Diffbot",
  "YouBot",
  "Timpibot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 검색 결과에 노출될 필요가 없는 내부 경로
        disallow: ["/api/", "/_next/static/chunks/", "/*?*utm_"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
