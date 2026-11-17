const NAVER_ETF_API = "https://finance.naver.com/api/sise/etfItemList.nhn";

const page = "__ETF_DASHBOARD_HTML__";

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#0d1b29"/><path d="M14 47V28m12 19V17m12 30V32m12 15V12" fill="none" stroke="#32d49a" stroke-width="6" stroke-linecap="round"/></svg>`;

const securityHeaders = {
  "content-security-policy": "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'self'",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

async function proxyEtfData() {
  try {
    const upstream = await fetch(NAVER_ETF_API, {
      headers: {
        accept: "application/json,text/plain,*/*",
        referer: "https://finance.naver.com/sise/etf.naver",
        "user-agent": "Mozilla/5.0 (compatible; ETFMarketBoard/1.0)",
      },
    });
    if (!upstream.ok) {
      return Response.json({ message: `네이버 금융 API가 ${upstream.status} 상태를 반환했습니다.` }, { status: 502 });
    }
    return new Response(await upstream.arrayBuffer(), {
      headers: {
        "content-type": "application/octet-stream",
        "cache-control": "no-store, max-age=0",
        "x-upstream-charset": "euc-kr",
        "x-data-fetched-at": new Date().toISOString(),
      },
    });
  } catch {
    return Response.json({ message: "네이버 금융 ETF 데이터를 가져오지 못했습니다." }, { status: 502 });
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/api/etfs") return proxyEtfData();
    if (url.pathname === "/health") return Response.json({ ok: true, service: "naver-etf-market-board" }, { headers: { "cache-control": "no-store" } });
    if (url.pathname === "/favicon.svg") return new Response(icon, { headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400" } });
    if (url.pathname !== "/") return new Response("Not found", { status: 404 });
    return new Response(page, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60", ...securityHeaders } });
  },
};
