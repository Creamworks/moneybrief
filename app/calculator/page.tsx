import type { Metadata } from "next";
import Calculator from "./Calculator";

export const metadata: Metadata = {
  title: "금융계산기 — money brief",
  description:
    "원리금·대출이자·DSR·중도상환수수료를 슬라이더로 바로 계산해 보세요. 빌리기 전에 부담을 정확한 숫자로 확인할 수 있습니다.",
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  return <Calculator initialTab={sp?.tab ?? "loan"} />;
}
