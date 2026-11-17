# ETF 마켓보드

네이버 금융 ETF 목록 API를 실시간으로 조회해 운용사·시장·상품군별로 분석하는 단일 HTML 페이지 대시보드입니다. 화면 전체는 `index.html` 한 파일에 들어 있습니다.

## 주요 기능

- 60초 자동 갱신과 수동 새로고침
- 운용사별 시가총액, 상품군별 종목 분포
- 시장·운용사·상품 유형 필터와 검색·정렬
- ETF별 NAV 괴리율, 거래량, 거래대금, 시가총액, 3개월 수익률
- 종목 상세 보기와 브라우저 로컬 관심 종목

브라우저의 CORS 제약과 EUC-KR 인코딩을 처리하기 위해 Worker의 `/api/etfs` 경로가 원본 응답 바이트를 프록시합니다.

## 실행

```powershell
npm run dev
```

검증 및 빌드:

```powershell
npm run validate
npm run build
```

빌드 과정에서 `index.html`을 Worker에 삽입해 `dist/server/index.js`를 생성합니다. 화면은 `index.html`, API 프록시는 `worker/index.js`에서 수정합니다.
