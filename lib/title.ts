/**
 * 워드프레스 제목에 붙어 있는 부제를 분리합니다.
 *
 * 현재 CMS의 제목이 이런 형태로 저장돼 있어요.
 *   "수수료 먼저 보내라는 연락, 받으셨나요?대출 중개수수료 요구에 대처하는 법"
 * 물음표 뒤에 부제가 공백도 없이 이어 붙어 카드와 H1 이 한 덩어리로 보입니다.
 *
 * 근본 해결은 워드프레스에서 제목과 부제를 나눠 저장하는 것이지만,
 * 그 전까지 화면이 깨져 보이지 않도록 첫 문장부호를 기준으로 갈라 줍니다.
 * 부제 필드(acf.subtitle)에 값이 들어오면 그쪽이 우선이라 이 함수는 자연스럽게 물러납니다.
 */
export type SplitTitle = { title: string; subtitle: string };

/** 문장이 끝났다고 볼 수 있는 문자 */
const ENDERS = "?!.";

export function splitTitle(raw: string): SplitTitle {
  const s = (raw || "").trim();
  if (!s) return { title: "", subtitle: "" };

  for (let i = 0; i < s.length - 1; i++) {
    if (!ENDERS.includes(s[i])) continue;

    // 3.5% 처럼 숫자 사이의 마침표는 문장 끝이 아니에요
    if (s[i] === "." && /[0-9]/.test(s[i - 1] || "") && /[0-9]/.test(s[i + 1] || "")) {
      continue;
    }

    // "정말?!" 처럼 문장부호가 연달아 오면 마지막 것까지 제목에 포함
    let end = i;
    while (end + 1 < s.length && ENDERS.includes(s[end + 1])) end++;

    const title = s.slice(0, end + 1).trim();
    const subtitle = s.slice(end + 1).trim();

    // 어느 한쪽이 너무 짧으면 부제가 아니라 문장 일부일 가능성이 커요
    if (title.length < 6 || subtitle.length < 4) continue;

    return { title, subtitle };
  }

  return { title: s, subtitle: "" };
}

/** 카드처럼 한 줄만 필요한 곳에서 쓰는 축약형 */
export const mainTitle = (raw: string) => splitTitle(raw).title;
