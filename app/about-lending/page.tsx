import type { Metadata } from "next";
import AboutLending from "./AboutLending";

export const metadata: Metadata = {
  title: "바로알기 — 대부업 바로 알기 | money brief",
  description:
    "대부업에 대한 흔한 오해, 합법 대부업과 불법 사금융의 차이, 위험 신호, 이용 전 체크리스트와 자주 묻는 질문을 한곳에 정리했습니다.",
};

export default function AboutLendingPage() {
  return <AboutLending />;
}
