import type { Metadata } from "next";
import Calculator from "./Calculator";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import {
  baseNodes,
  breadcrumbNode,
  webPageNode,
  webApplicationNode,
  type Crumb,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "금융계산기 — money brief",
  description:
    "원리금·대출이자·DSR·중도상환수수료를 슬라이더로 바로 계산해 보세요. 대출 실행 전 부담을 정확한 숫자로 확인할 수 있어요.",
  alternates: { canonical: "/calculator" },
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const pageUrl = `${SITE_URL}/calculator`;
  const crumbs: Crumb[] = [
    { name: "홈", path: "/" },
    { name: "금융계산기", path: "/calculator" },
  ];
  const jsonLd = [
    ...baseNodes(),
    breadcrumbNode(pageUrl, crumbs),
    webPageNode({
      url: pageUrl,
      name: "금융계산기",
      description:
        "원리금·대출이자·DSR·중도상환수수료를 슬라이더로 바로 계산해 보세요. 대출 실행 전 부담을 정확한 숫자로 확인할 수 있어요.",
      crumbs,
    }),
    webApplicationNode(pageUrl),
  ];
  return (
    <>
      <JsonLd nodes={jsonLd} />
      <Calculator initialTab={sp?.tab ?? "loan"} />
    </>
  );
}
