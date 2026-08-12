# seo-ftp — FTP(파일질라)로 올릴 파일

> 이 폴더는 Next.js 빌드에 포함되지 않아요. moneybrief.net 용 robots/sitemap/llms 는
> Vercel(Next.js)이 자동 생성하므로 FTP로 올릴 필요가 **없습니다.**

## 어디에 무엇이 서비스되나요

| 파일 | 주소 | 만드는 곳 | 배포 방법 |
|---|---|---|---|
| robots.txt  | https://moneybrief.net/robots.txt  | `app/robots.ts`        | git push → Vercel |
| sitemap.xml | https://moneybrief.net/sitemap.xml | `app/sitemap.ts`       | git push → Vercel |
| llms.txt    | https://moneybrief.net/llms.txt    | `app/llms.txt/route.ts`| git push → Vercel |

moneybrief.net 의 DNS(A 76.76.21.21)는 **Vercel**을 가리킵니다.
후이즈 호스팅(FTP 접속처, bcredit.host.whoisweb.net)은 **워드프레스 CMS 전용**이라
거기에 파일을 올려도 moneybrief.net 에서는 보이지 않아요.

## FTP로 올릴 것은 이 파일 하나뿐이에요

`whoisweb-robots.txt` → 후이즈 서버 웹 루트(`/` 또는 `public_html/`)에 **`robots.txt`** 이름으로 업로드.

이유: CMS 원본(bcredit.host.whoisweb.net)이 검색엔진에 색인되면
moneybrief.net 과 **중복 콘텐츠**로 잡혀 본 사이트 순위가 깎여요. 색인을 막아야 합니다.
