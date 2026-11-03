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
// 확인 코드는 비밀값이 아니에요(페이지 소스에 공개됨). 환경변수가 있으면 그 값이 우선해요.
const googleVerification =
  process.env.GOOGLE_SITE_VERIFICATION || "1v7vFaFfuFhKSe3GW54HiwZyc7bl4C7erD0mdBtvUjs";
const naverVerification =
  process.env.NAVER_SITE_VERIFICATION || "56443ef107dccf3af56a47ede1c73e4ff988efb6";
const bingVerification =
  process.env.BING_SITE_VERIFICATION || "F1D3F2752BEAEDBC1623145847D78812";

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
  ...(googleVerification || naverVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(naverVerification || bingVerification
            ? {
                other: {
                  ...(naverVerification ? { "naver-site-verification": naverVerification } : {}),
                  ...(bingVerification ? { "msvalidate.01": bingVerification } : {}),
                },
              }
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
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
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
