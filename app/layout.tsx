import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { GtmScript, GtmNoScript } from "@/components/GoogleTagManager";

const SITE_URL = process.env.SITE_URL || "https://www.moneybrief.net";

/**
 * 검색엔진 소유권 확인 코드.
 * 값은 Vercel 환경변수로만 넣어 주세요. (코드에 직접 적지 않아요)
 *   GOOGLE_SITE_VERIFICATION  — Google Search Console > 소유권 확인 > HTML 태그
 *   NAVER_SITE_VERIFICATION   — 네이버 서치어드바이저 > 사이트 소유확인 > HTML 태그
 */
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
const naverVerification = process.env.NAVER_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "money brief — 금융교육 콘텐츠 허브",
  description:
    "money brief는 ㈜바로크레디트대부가 만든 금융교육 콘텐츠예요. 신용·대출·금융사기를 쉬운 말로, 정확하게 검증해 드려요.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "money brief",
    locale: "ko_KR",
    url: SITE_URL,
    title: "money brief — 금융교육 콘텐츠 허브",
    description:
      "신용·대출·금융사기를 쉬운 말로, 정확하게 검증해 드려요.",
    // 개별 페이지가 대표 이미지를 지정하지 않았을 때 쓰는 기본 공유 이미지
    images: [
      {
        url: "/img/og-default.png",
        width: 1200,
        height: 630,
        alt: "money brief — 복잡한 금융을 쉽게 이해할 수 있게",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "money brief — 금융교육 콘텐츠 허브",
    description: "신용·대출·금융사기를 쉬운 말로, 정확하게 검증해 드려요.",
    images: ["/img/og-default.png"],
  },
  ...(googleVerification || naverVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(naverVerification
            ? { other: { "naver-site-verification": naverVerification } }
            : {}),
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <GtmNoScript />
        <GtmScript />
        <Analytics />
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
