# 책 표지·소개 자동 채우기 (scripts/fetch-books.mjs)

`books.json` 에 적은 책들의 **표지·소개·저자·출판사·페이지수**를
알라딘/네이버에서 받아 자동으로 채웁니다.

내가 적은 값(장르·7축·별점·내가 쓴 소개)은 **건드리지 않고**, 비어 있는 칸만 채워요.

---

## 1. 무료 키 발급 (둘 중 하나만 있어도 됨)

### 알라딘 TTB 키 (추천 · 한국 책 표지 좋음)
1. https://www.aladin.co.kr/ttb/wblog_manage.aspx 접속 (알라딘 로그인)
2. "상품 검색·조회 API" 신청 → **TTBKey** 발급 (즉시, 무료)
3. 발급된 키 복사 (예: `ttbexample1234001`)

### 네이버 책 검색 (선택 · 알라딘에 없는 책 보강)
1. https://developers.naver.com/apps/#/register 에서 애플리케이션 등록
2. "검색" API 사용 추가 → **Client ID / Client Secret** 발급

> 둘 다 넣으면 알라딘을 먼저 쓰고, 없으면 네이버로 보강합니다.

## 2. 실행

```bash
# 알라딘만
ALADIN_TTB_KEY=ttb내키 node scripts/fetch-books.mjs

# 알라딘 + 네이버
ALADIN_TTB_KEY=ttb내키 \
NAVER_CLIENT_ID=네이버아이디 \
NAVER_CLIENT_SECRET=네이버시크릿 \
  node scripts/fetch-books.mjs
```

실행하면:
- `books.json` 의 빈 칸이 채워지고
- `assets/books.js` 가 다시 생성됩니다(브라우저가 읽는 파일)

브라우저에서 `index.html` 을 **새로고침**하면 표지가 보여요.

## 3. 책 추가/수정

`books.json` 을 열어 책을 추가하거나 고친 뒤, 위 명령을 다시 실행하면 됩니다.
- `cover` 가 이미 채워진 책은 건너뜁니다(다시 받고 싶으면 `cover` 를 `null` 로).
- `axes`(7축)·`aiRating`·`genre`·`status` 는 API가 모르는 값이라 직접 적습니다.

## 못 찾는 책

검색해도 안 나오면 `✖ 못 찾음` 으로 표시돼요.
그 책은 `books.json` 의 `cover` 에 표지 이미지 주소를 직접 붙이면 됩니다.
