import type { Metadata } from "next";
import AboutLending from "./AboutLending";
import { FAQS } from "./faqs";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import {
  baseNodes,
  reviewerNode,
  breadcrumbNode,
  webPageNode,
  type Crumb,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "바로알기 — 대부업 바로 알기 | money brief",
  description:
    "대부업에 대한 흔한 오해, 합법 대부업과 불법 사금융의 차이, 위험 신호, 이용 전 체크리스트와 자주 묻는 질문을 한곳에 정리했어요.",
  alternates: { canonical: "/about-lending" },
};

export default function AboutLendingPage() {
  const pageUrl = `${SITE_URL}/about-lending`;
  const crumbs: Crumb[] = [
    { name: "홈", path: "/" },
    { name: "대부업 바로알기", path: "/about-lending" },
  ];
  const jsonLd = [
    ...baseNodes(),
    reviewerNode(),
    breadcrumbNode(pageUrl, crumbs),
    webPageNode({
      url: pageUrl,
      name: "대부업 바로 알기",
      description:
        "대부업에 대한 흔한 오해, 합법 대부업과 불법 사금융의 차이, 위험 신호, 이용 전 체크리스트와 자주 묻는 질문을 한곳에 정리했어요.",
      crumbs,
      faq: FAQS,
      reviewed: true,
    }),
  ];
  return (
    <>
      <JsonLd nodes={jsonLd} />
      <AboutLending />
    </>
  );
}
