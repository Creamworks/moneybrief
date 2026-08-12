import Script from "next/script";

/**
 * Google Tag Manager — money brief
 * 컨테이너 ID는 환경변수 NEXT_PUBLIC_GTM_ID 로 덮어쓸 수 있어요.
 * (Vercel > Project > Settings > Environment Variables)
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-N9NHHHG5";

/** GTM 로더. Next.js 권장 방식(next/script, afterInteractive)으로 <head>에 주입돼요. */
export function GtmScript() {
  if (!GTM_ID) return null;
  return (
    <Script id="gtm-loader" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/** <body> 바로 아래에 들어가는 noscript 폴백. */
export function GtmNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
