# 크레딧노트 (CreditNote)

> **작업 요약 (Phase A–G 완료):** 공용 Header/Footer(메가메뉴·≤768px 햄버거 오버레이·홈 at-top 네이비 헤더)와 디자인 토큰을 정비하고, **운영원칙·바로알기·금융계산기(4탭 실시간 계산)·금융가이드 목록/상세·홈** 6개 페이지를 원본 Claude Design 기준 픽셀 단위로 변환했습니다. **WordPress 헤드리스 CMS**를 연결(기본 카테고리 5개 + ACF `subtitle`·`read_time`·`sources` + 샘플 글 5개)하고 가이드 목록·상세·홈 최신글·카테고리 글 수를 REST로 실연동했으며, 본문 H2에서 섹션 번호·목차를 자동 생성합니다. 404/error/loading(스켈레톤) 상태 페이지와 디자인 번들에서 추출한 실제 이미지를 적용하고, 데스크탑/모바일 Playwright 검증 · 프로덕션 빌드 통과 · Lighthouse 베이스라인 측정까지 마쳤습니다.

㈜바로크레디트대부의 **금융교육 콘텐츠 허브** — 헤드리스 사이트.
Next.js(App Router) 프론트엔드 + WordPress 헤드리스 CMS.

## 스택

- **Next.js 16** (App Router, React 19, TypeScript)
- **CSS Modules** + `:root` 디자인 토큰 (Tailwind v4 설치되어 있으나 페이지 UI는 CSS Modules로 구현)
- **WordPress** 헤드리스 CMS (Docker, REST API) + **ACF**(Advanced Custom Fields, 무료)
- Pretendard / Noto Serif KR 웹폰트

## 디렉터리

```
creditnote/
├─ frontend/              # Next.js 앱
│  ├─ app/                # 라우트 (페이지 + 상태 페이지)
│  ├─ components/         # Header, Footer (공용)
│  ├─ lib/wp.ts           # WordPress REST 헬퍼
│  └─ public/img/         # 로고·일러스트 자산
├─ design-reference/      # Claude Design 원본 HTML 7개 (참조용, 변경 금지)
└─ docker-compose.yml     # WordPress + MySQL
```

## 페이지

| 라우트 | 설명 | 데이터 |
|---|---|---|
| `/` | 홈 (hero, 고민 hook, 카테고리, 최신글, 추천글, 계산기 CTA, trust) | 정적 + WP 최신글 |
| `/guides` | 가이드 목록 (칩 필터·검색·정렬·뷰토글) | WP |
| `/guides/[slug]` | 가이드 상세 (번호 섹션·목차·출처·도움돼요·관련글) | WP |
| `/calculator` | 금융계산기 (원리금·대출이자·DSR·중도상환, 실시간) | 클라이언트 |
| `/about-lending` | 바로알기 (오해·비교표·체크리스트·FAQ) | 정적 |
| `/about` | 운영원칙 | 정적 |

상태 페이지: `not-found`(404), `error`(오류), `loading`(스켈레톤, 루트·목록·상세).

## 개발 환경

### 1) WordPress 기동

```bash
# 저장소 루트에서
docker compose up -d
```

- WP 관리자: http://localhost:8080/wp-admin
- REST API: http://localhost:8080/wp-json

### 2) Next.js 개발 서버

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

`.env.local`:

```
WORDPRESS_API_URL=http://localhost:8080/wp-json
```

## WordPress 콘텐츠 모델

- **카테고리**(기본): 신용관리 · 대출상식 · 금융생활 · 금융사기예방 · 금융이슈·인사이트
- **ACF 필드 그룹 "가이드 메타"** (게시물 유형 = 글, REST 노출 ON)
  - `subtitle` (텍스트) — 부제
  - `read_time` (숫자) — 읽는 시간(분)
  - `sources` (WYSIWYG) — 출처
- 가이드 상세 본문은 기본 에디터(`post_content`)의 **H2 섹션**으로 작성 → 프론트가 01/02 번호 + 목차 자동 생성
- 썸네일은 대표 이미지(featured image) 사용 (현재 샘플은 플레이스홀더)

REST로 샘플 생성 시 워드프레스 **애플리케이션 비밀번호**(사용자 > 프로필) 사용.

## 반응형

- 주 분기점 **768px** (데스크탑 원본 유지, 모바일 재설계). 일부 페이지는 콘텐츠 특성상 980/1024/600px 보조 분기점 사용.
- ≤768px: 헤더 햄버거 + 풀스크린 오버레이, 그리드 1열 스택.

## Lighthouse Baseline (2026-06-07)

프로덕션 빌드(`next build` + `next start`) 기준, 시스템 Chrome으로 측정. (M = 모바일, D = 데스크탑)

| 페이지 | Performance (M / D) | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| 홈 `/` | 62 / 92 | 94 | 100 | 91 |
| 가이드 목록 `/guides` | 64 / 99 | 91 | 100 | 100 |
| 가이드 상세 `/guides/[slug]` | 88 / 99 | 96 | 100 | 91 |

> 측정 URL: `/`, `/guides`, `/guides/2026년-바뀌는-대출-규제-핵심만-정리`

### 개선 메모 (운영 시작 후 우선순위 정해 처리 — 지금은 미수정)

- **모바일 Performance(62~64)** 가 가장 낮음. 주 원인 후보:
  - 이미지가 `next/image` 최적화를 거치지 않은 일반 `<img>` (webp). `width/height` 미지정으로 CLS·LCP 영향 → `next/image` 전환 또는 명시적 치수 부여 검토.
  - 웹폰트(Pretendard·Noto Serif KR) CDN 로드가 렌더 블로킹 → `next/font` 또는 self-host + `font-display` 검토.
  - 데스크탑 Performance(92~99)는 양호하므로 주로 모바일 스로틀링·이미지/폰트 이슈.
- **Accessibility(91~96)**: 색상 대비(연한 회색 텍스트)·일부 아이콘 버튼 라벨 등 점검 여지.
- **SEO(91, 홈·상세)**: 메타/모바일 탭타깃 등 1개 내외 항목. 추후 확인.
- Best Practices는 전 페이지 100.
