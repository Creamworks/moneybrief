import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { GtmScript, GtmNoScript } from "@/components/GoogleTagManager";

const SITE_URL = process.env.SITE_URL || "https://moneybrief.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "money brief — 금융교육 콘텐츠 허브",
  description:
    "money brief는 ㈜바로크레디트대부가 만든 금융교육 콘텐츠예요. 신용·대출·금융사기를 쉬운 말로, 정확하게 검증해 드려요.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "money brief",
    locale: "ko_KR",
    url: SITE_URL,
    title: "money brief — 금융교육 콘텐츠 허브",
    description:
      "신용·대출·금융사기를 쉬운 말로, 정확하게 검증해 드려요.",
  },
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
