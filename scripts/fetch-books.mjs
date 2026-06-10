#!/usr/bin/env node
/* ============================================================
   책 표지·소개 자동 수집기 (알라딘 OpenAPI + 네이버 책 폴백)

   사용법:
     1) 무료 키 발급 (scripts/README.md 참고)
     2) 키를 환경변수로 넣고 실행:

        ALADIN_TTB_KEY=ttb내키 node scripts/fetch-books.mjs

        # 네이버도 함께 쓰려면:
        ALADIN_TTB_KEY=... NAVER_CLIENT_ID=... NAVER_CLIENT_SECRET=... \
          node scripts/fetch-books.mjs

   하는 일:
     - books.json 의 각 책에서 cover(표지)가 비어 있으면 검색해서 채움
     - 비어 있는 author/publisher/year/pages/isbn/desc 만 채움 (내가 적은 값은 보존)
     - books.json 갱신 + assets/books.js(브라우저용) 재생성
   ============================================================ */

import { readFile, writeFile, mkdir } from "node:fs/promises";

const ALADIN_KEY = process.env.ALADIN_TTB_KEY;
const NAVER_ID = process.env.NAVER_CLIENT_ID;
const NAVER_SECRET = process.env.NAVER_CLIENT_SECRET;

if (!ALADIN_KEY && !(NAVER_ID && NAVER_SECRET)) {
  console.error("⚠  키가 없어요. ALADIN_TTB_KEY 또는 NAVER_CLIENT_ID/SECRET 를 설정하세요.");
  console.error("   예) ALADIN_TTB_KEY=ttb내키 node scripts/fetch-books.mjs");
  process.exit(1);
}

const ROOT = new URL("../", import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const firstAuthor = (a) => (a || "").split(",")[0].trim();

async function fromAladin(book) {
  if (!ALADIN_KEY) return null;
  const q = encodeURIComponent(`${book.title} ${firstAuthor(book.author)}`.trim());
  const url =
    `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ALADIN_KEY}` +
    `&Query=${q}&QueryType=Keyword&MaxResults=1&start=1&SearchTarget=Book` +
    `&Cover=Big&OptResult=itemPage&output=js&Version=20131101`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    const data = JSON.parse(text.replace(/;\s*$/, ""));
    const it = data.item && data.item[0];
    if (!it) return null;
    return {
      author: it.author,
      publisher: it.publisher,
      year: (it.pubDate || "").slice(0, 7).replace("-", "."),
      pages: it.subInfo && it.subInfo.itemPage ? it.subInfo.itemPage : null,
      cover: it.cover || null,
      isbn: it.isbn13 || it.isbn || "",
      desc: it.description || "",
      aladinUrl: it.link || "#",
    };
  } catch (e) {
    console.error("  알라딘 오류:", e.message);
    return null;
  }
}

async function fromNaver(book) {
  if (!(NAVER_ID && NAVER_SECRET)) return null;
  const q = encodeURIComponent(`${book.title} ${firstAuthor(book.author)}`.trim());
  const url = `https://openapi.naver.com/v1/search/book.json?query=${q}&display=1`;
  try {
    const res = await fetch(url, {
      headers: { "X-Naver-Client-Id": NAVER_ID, "X-Naver-Client-Secret": NAVER_SECRET },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const it = data.items && data.items[0];
    if (!it) return null;
    const strip = (s) => (s || "").replace(/<\/?b>/g, "");
    return {
      author: strip(it.author).replace(/\^/g, ", "),
      publisher: strip(it.publisher),
      year: (it.pubdate || "").replace(/(\d{4})(\d{2}).*/, "$1.$2"),
      cover: it.image || null,
      isbn: (it.isbn || "").split(" ").pop(),
      desc: strip(it.description),
      aladinUrl: it.link || "#",
    };
  } catch (e) {
    console.error("  네이버 오류:", e.message);
    return null;
  }
}

const books = JSON.parse(await readFile(new URL("books.json", ROOT), "utf8"));
let filled = 0, missed = 0;

for (const b of books) {
  if (b.cover) { console.log("·  건너뜀(이미 표지 있음):", b.title); continue; }
  const got = (await fromAladin(b)) || (await fromNaver(b));
  if (got) {
    for (const [k, v] of Object.entries(got)) {
      const empty = b[k] == null || b[k] === "" || b[k] === "#";
      if (v && empty) b[k] = v; // 비어 있는 칸만 채움 (내 값 보존)
    }
    console.log(b.cover ? "✔  채움:" : "△  일부만:", b.title);
    filled++;
  } else {
    console.log("✖  못 찾음:", b.title, "→ 표지 URL 직접 넣어주세요");
    missed++;
  }
  await sleep(300); // 서버 배려
}

await writeFile(new URL("books.json", ROOT), JSON.stringify(books, null, 2) + "\n");
await mkdir(new URL("assets/", ROOT), { recursive: true });
await writeFile(
  new URL("assets/books.js", ROOT),
  "/* 자동 생성 파일 — books.json 에서 생성됩니다. 직접 수정하지 마세요. */\n" +
    "const SAMPLE_BOOKS = " + JSON.stringify(books, null, 2) + ";\n"
);

console.log(`\n완료 — 채움 ${filled}권, 못 찾음 ${missed}권`);
console.log("→ books.json 갱신 + assets/books.js 재생성됨. 브라우저 새로고침하세요.");
