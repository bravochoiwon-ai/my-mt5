/* ============================================================
   앱 로직 — 탭, 프로필, 독서 결, 도서관, 책 상세, 평점
   ============================================================ */

const LS_BOOKS = "myspace.userBooks.v1";       // 직접 추가한 책
const LS_STATUS = "myspace.statusOverride.v1"; // 읽음/관심 직접 변경
const LS_RATING = "myspace.myRatings.v1";      // 내 추천 별점·코멘트
const LS_REVIEW = "myspace.myReviews.v1";      // 내 서평
const LS_HIDDEN = "myspace.hiddenBooks.v1";    // 삭제(숨김)한 책 id

const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
const lsArr = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));

function allBooks() {
  const overrides = lsGet(LS_STATUS);
  const hidden = lsArr(LS_HIDDEN);
  return [...SAMPLE_BOOKS, ...lsArr(LS_BOOKS)]
    .filter((b) => !hidden.includes(b.id))
    .map((b) => (overrides[b.id] ? { ...b, status: overrides[b.id] } : b));
}
function getBook(id) { return allBooks().find((b) => b.id === id); }

/* ---------- 탭 ---------- */
function initTabs() {
  document.getElementById("tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    btn.classList.add("is-active");
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
    document.getElementById("tab-" + btn.dataset.tab).classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 나: 프로필 ---------- */
function renderProfile() {
  document.getElementById("brandName").textContent = PROFILE.name + "의 공간";
  document.getElementById("meTitle").textContent = PROFILE.name;
  document.getElementById("gyeolName").textContent = PROFILE.name;
  document.getElementById("libName").textContent = PROFILE.name;
  document.getElementById("sbName").textContent = PROFILE.name;
  document.getElementById("sbAvatar").textContent = PROFILE.name.slice(0, 1);

  document.getElementById("profileCards").innerHTML = PROFILE.cards
    .map(
      (c) => `
      <div class="card profile-card">
        <div class="pc-icon">${c.icon}</div>
        <div class="pc-label">${c.label}</div>
        <div class="pc-value">${c.value}</div>
        <ul class="pc-points">${(c.points || []).map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>`
    )
    .join("");

  document.getElementById("careerBody").innerHTML = PROFILE.careerAnalysis;
}

/* ---------- 나: 독서 결 ---------- */
function renderGyeol() {
  const books = allBooks().filter((b) => b.status === "read");
  const analyzed = books.filter((b) => Array.isArray(b.axes));

  const sums = AXES.map(() => 0);
  analyzed.forEach((b) => b.axes.forEach((v, i) => (sums[i] += v)));
  const avgs = AXES.map((_, i) => (analyzed.length ? sums[i] / analyzed.length : 0));
  const strong = avgs.filter((v) => v >= 3.5).length;

  drawRadar(document.getElementById("gyeolRadar"), {
    labels: AXES, values: avgs, max: 5, size: 440, accent: "#1d4ed8",
  });

  document.getElementById("gyeolStats").innerHTML = `
    <div class="stat"><div class="stat-num">${books.length}</div><div class="stat-cap">읽은 책</div></div>
    <div class="stat"><div class="stat-num">${analyzed.length}</div><div class="stat-cap">7축 분석된 책</div></div>
    <div class="stat"><div class="stat-num">${strong}/7</div><div class="stat-cap">깊이 닿은 결</div></div>`;

  const order = avgs.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  const top = order.slice(0, 2).map((o) => AXES[o.i]);
  const low = order[order.length - 1];
  document.getElementById("gyeolObserve").innerHTML =
    `지금까지 <b>${books.length}권</b>을 읽었고, 그중 <b>${analyzed.length}권</b>의 결이 분석됐어요. ` +
    `읽어온 책들의 결을 쌓아보면 <b>${top.join("·")}</b> 결이 가장 두텁고, ` +
    `<b>${AXES[low.i]}</b> 결은 상대적으로 얇게 남아 있어요.`;

  document.getElementById("gyeolBars").innerHTML = AXES.map((label, i) => {
    const pct = (avgs[i] / 5) * 100;
    return `
      <div class="bar-row">
        <div class="bar-label">${label}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div class="bar-val">${avgs[i].toFixed(1)}</div>
      </div>`;
  }).join("");
}

/* ---------- 표지 ---------- */
function coverHTML(b, cls) {
  if (b.cover) {
    return `<div class="cover ${cls}"><img src="${b.cover}" alt="${b.title}"
      onerror="this.parentElement.classList.add('cover-fallback');this.parentElement.style.setProperty('--g','${genreHue(b.genre)}');this.remove();this.parentElement.dataset.letter='${(b.title||'?').slice(0,1)}';"/></div>`;
  }
  return `<div class="cover cover-fallback ${cls}" style="--g:${genreHue(b.genre)}" data-letter="${(b.title || "?").slice(0, 1)}"></div>`;
}

/* ---------- 도서관 ---------- */
let currentFilter = "all";
let deleteMode = false;

function deleteBook(id) {
  const b = getBook(id);
  if (!b) return;
  if (!confirm(`'${b.title}'을(를) 서재에서 삭제할까요?`)) return;
  const userList = lsArr(LS_BOOKS);
  const idx = userList.findIndex((x) => x.id === id);
  if (idx >= 0) {
    userList.splice(idx, 1); lsSet(LS_BOOKS, userList);      // 직접 추가한 책 → 완전 삭제
  } else {
    const hidden = lsArr(LS_HIDDEN);                          // 기본 등록 책 → 숨김 처리
    if (!hidden.includes(id)) { hidden.push(id); lsSet(LS_HIDDEN, hidden); }
  }
  renderLibrary(); renderGyeol();
}

function bookCardHTML(b) {
  const stars = b.aiRating ? "★".repeat(Math.round(b.aiRating)) : "";
  const badge = b.status === "wish" ? `<span class="badge wish">관심</span>` : `<span class="badge read">읽음</span>`;
  return `
    <button class="book-card" data-id="${b.id}">
      <span class="card-del" data-del="${b.id}" title="삭제">✕</span>
      ${coverHTML(b, "card-cover")}
      <div class="book-meta">
        <div class="book-title">${b.title}</div>
        <div class="book-author">${b.author || "저자 미상"}</div>
        <div class="book-foot">${badge}<span class="book-genre">${b.genre || ""}</span></div>
        ${b.aiRating ? `<div class="book-stars">${stars} <span>AI ${b.aiRating}</span></div>` : `<div class="book-stars muted">분석 대기</div>`}
      </div>
    </button>`;
}

function renderLibrary() {
  const books = allBooks();
  document.getElementById("libCount").textContent = books.filter((b) => b.status === "read").length;

  let shown = books;
  if (currentFilter === "read") shown = books.filter((b) => b.status === "read");
  if (currentFilter === "wish") shown = books.filter((b) => b.status === "wish");

  document.getElementById("bookGrid").innerHTML =
    shown.map(bookCardHTML).join("") || `<p class="muted">이 분류에 책이 없어요.</p>`;

  document.getElementById("newGrid").innerHTML = NEW_RELEASES.map(
    (b) => `
    <div class="book-card placeholder">
      <div class="cover card-cover ph">신간</div>
      <div class="book-meta">
        <div class="book-title">${b.title}</div>
        <div class="book-author">${b.author}</div>
        <div class="book-foot"><span class="book-genre">${b.genre}</span></div>
      </div>
    </div>`
  ).join("");

  renderReco(books);
}

/* 추천: 추천 책 + 추천 작가(장르 표기) */
function renderReco(books) {
  // 추천 책 — 관심(아직 안 읽은) 책을 '다음에 읽어볼 책'으로
  const recoBooks = books.filter((b) => b.status === "wish");
  document.getElementById("recoBooks").innerHTML = recoBooks.length
    ? recoBooks.map((b) => `
        <button class="reco-book" data-id="${b.id}">
          ${coverHTML(b, "reco-cover")}
          <div class="rb-meta">
            <div class="rb-title">${b.title}</div>
            <div class="rb-author">${b.author || ""}</div>
            <div class="rb-genre">${b.genre || ""}</div>
          </div>
        </button>`).join("")
    : `<span class="muted">관심 책으로 담아두면 여기 추천으로 떠요.</span>`;

  // 추천 작가 — 평점 높은 책의 저자 + 장르
  const seen = new Set();
  const authors = books
    .filter((b) => b.author && b.aiRating)
    .sort((a, b) => b.aiRating - a.aiRating)
    .filter((b) => { const k = b.author; if (seen.has(k)) return false; seen.add(k); return true; })
    .slice(0, 5);
  document.getElementById("recoAuthors").innerHTML = authors.length
    ? authors.map((b) => `
        <div class="author-row">
          <span class="author-name">${b.author.split(",")[0]}</span>
          <span class="author-genre">${b.genre} 작가</span>
        </div>`).join("")
    : `<span class="muted">평가된 책이 쌓이면 추천 작가가 생겨요.</span>`;
}

function initLibraryUI() {
  document.getElementById("libFilters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    currentFilter = chip.dataset.filter;
    renderLibrary();
  });
  document.getElementById("bookGrid").addEventListener("click", (e) => {
    const del = e.target.closest(".card-del");
    if (del) { e.stopPropagation(); deleteBook(del.dataset.del); return; }
    if (deleteMode) return; // 삭제 모드에선 카드 본문 클릭은 무시
    const card = e.target.closest(".book-card");
    if (card && card.dataset.id) openBook(card.dataset.id);
  });

  // 삭제 모드 토글
  const delBtn = document.getElementById("deleteModeBtn");
  delBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    delBtn.classList.toggle("on", deleteMode);
    delBtn.textContent = deleteMode ? "✓ 완료" : "🗑 삭제";
    document.getElementById("bookGrid").classList.toggle("del-on", deleteMode);
    document.getElementById("delHint").hidden = !deleteMode;
  });
  document.getElementById("recoBooks").addEventListener("click", (e) => {
    const card = e.target.closest(".reco-book");
    if (card && card.dataset.id) openBook(card.dataset.id);
  });
}

/* ---------- 내 서평 ---------- */
function getReview(id) {
  const saved = lsGet(LS_REVIEW)[id];
  return saved && saved.text ? saved : { text: "", date: "" };
}
function reviewViewHTML(id) {
  const r = getReview(id);
  if (!r.text) {
    return `<div class="review-empty">아직 내 서평이 없어요.<br/>위 <b>작성</b> 버튼을 눌러 이 책에 대한 생각을 남겨보세요.</div>`;
  }
  return `<p class="review-text">${r.text.replace(/\n/g, "<br/>")}</p><div class="review-date">작성: ${r.date}</div>`;
}

/* ---------- 책 상세 ---------- */
function openBook(id) {
  const b = getBook(id);
  if (!b) return;
  const myRatings = lsGet(LS_RATING);
  const mine = myRatings[id];

  const reviewBox = `
    <div class="card detail-col review-col">
      <div class="dc-head">✍️ 내 서평
        <button class="review-edit-btn" id="reviewEditBtn">${getReview(id).text ? "수정" : "작성"}</button>
      </div>
      <div id="reviewView">${reviewViewHTML(id)}</div>
      <div id="reviewEdit" hidden>
        <textarea id="reviewText" placeholder="이 책을 읽고 든 생각을 자유롭게 적어보세요...">${getReview(id).text}</textarea>
        <div class="review-actions">
          <button class="btn-primary sm" id="reviewSave">저장</button>
          <button class="ghost-btn" id="reviewCancel">취소</button>
        </div>
      </div>
    </div>`;

  const axisDescRows = BOOK_AXES.map((a) => `<li><b>${a}</b> — ${AXIS_DESC[a] || ""}</li>`).join("");
  const charBox = `
    <div class="card detail-col">
      <div class="dc-head">📊 책 특성 (AI 추정) <span class="dc-sub">학생 서평 ${b.reviewCount || 0}편 기반 · 1~5 점</span></div>
      <div class="modal-radar" id="modalRadar"></div>
      <details class="axis-desc"><summary>각 축 설명</summary><ul>${axisDescRows}</ul></details>
      <div class="char-note">※ 책 자체 특성. 책 선택 시 라벨이 아니라 자신과의 결을 따져보세요.</div>
    </div>`;

  document.getElementById("modalBody").innerHTML = `
    <div class="card detail-head">
      ${coverHTML(b, "detail-cover")}
      <div class="dh-info">
        <h3>${b.title}</h3>
        <div class="dh-author">${b.author || "저자 미상"}</div>
        <div class="dh-meta">${[b.publisher, b.year, b.pages ? b.pages + "쪽" : null].filter(Boolean).join("  ·  ")}</div>
        <p class="dh-desc">${b.desc || ""}</p>
        <div class="dh-links">
          <a href="${b.aladinUrl || "#"}" target="_blank" rel="noopener">알라딘 →</a>
          <a href="${b.notionUrl || "#"}" target="_blank" rel="noopener">노션 상세 →</a>
        </div>
        <div class="dh-src">ⓘ 출판사·페이지 수·소개·표지·평점 등 책 정보는 알라딘 OpenAPI 제공.</div>
        <div class="dh-status">
          <span class="dh-status-label">내 분류</span>
          <button class="seg ${b.status === "read" ? "on" : ""}" data-status="read" data-id="${b.id}">읽음</button>
          <button class="seg ${b.status === "wish" ? "on" : ""}" data-status="wish" data-id="${b.id}">관심</button>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      ${reviewBox}
      ${charBox}
    </div>

    <div class="card rating-card">
      <div class="rc-head">추천 별점 <span class="dc-sub">${mine ? `내 평점 ${mine.rating}점` : "아직 평가가 없어요. 첫 평가를 남겨보세요."}</span></div>
      <div class="stars-input" id="starsInput" data-id="${b.id}">
        ${[1, 2, 3, 4, 5].map((n) => `<span class="star ${mine && n <= mine.rating ? "on" : ""}" data-v="${n}">★</span>`).join("")}
      </div>
      <button class="comment-toggle" id="commentToggle">+ 짧은 코멘트 (선택)</button>
      <div class="comment-box" id="commentBox" ${mine && mine.comment ? "" : "hidden"}>
        <textarea id="commentText" placeholder="이 책에 대한 한 줄...">${mine && mine.comment ? mine.comment : ""}</textarea>
        <button class="btn-primary sm" id="saveComment">저장</button>
      </div>
    </div>
  `;

  document.getElementById("bookModal").hidden = false;
  document.body.classList.add("modal-open");

  if (Array.isArray(b.axes)) {
    drawRadar(document.getElementById("modalRadar"), {
      labels: BOOK_AXES, values: toBookChar(b.axes), max: 5, size: 380, accent: "#6366f1",
    });
  }
  wireDetailEvents(id);
}

function wireDetailEvents(id) {
  // 내 서평 작성/수정
  const reviewView = document.getElementById("reviewView");
  const reviewEdit = document.getElementById("reviewEdit");
  const editBtn = document.getElementById("reviewEditBtn");
  const showEdit = (on) => { reviewEdit.hidden = !on; reviewView.hidden = on; editBtn.hidden = on; };
  editBtn.addEventListener("click", () => showEdit(true));
  document.getElementById("reviewCancel").addEventListener("click", () => {
    document.getElementById("reviewText").value = getReview(id).text;
    showEdit(false);
  });
  document.getElementById("reviewSave").addEventListener("click", () => {
    const text = document.getElementById("reviewText").value.trim();
    const all = lsGet(LS_REVIEW);
    if (text) all[id] = { text, date: new Date().toLocaleDateString("ko-KR") };
    else delete all[id];
    lsSet(LS_REVIEW, all);
    reviewView.innerHTML = reviewViewHTML(id);
    editBtn.textContent = text ? "수정" : "작성";
    showEdit(false);
  });

  // 읽음/관심 토글
  document.querySelectorAll(".dh-status .seg").forEach((btn) =>
    btn.addEventListener("click", () => {
      const ov = lsGet(LS_STATUS);
      ov[id] = btn.dataset.status;
      lsSet(LS_STATUS, ov);
      document.querySelectorAll(".dh-status .seg").forEach((s) => s.classList.toggle("on", s.dataset.status === btn.dataset.status));
      renderLibrary();
      renderGyeol();
    })
  );

  // 별점
  const starsEl = document.getElementById("starsInput");
  const setStars = (v) => starsEl.querySelectorAll(".star").forEach((s) => s.classList.toggle("on", +s.dataset.v <= v));
  starsEl.querySelectorAll(".star").forEach((s) => {
    s.addEventListener("mouseenter", () => setStars(+s.dataset.v));
    s.addEventListener("click", () => {
      const r = lsGet(LS_RATING);
      r[id] = { ...(r[id] || {}), rating: +s.dataset.v };
      lsSet(LS_RATING, r);
      setStars(+s.dataset.v);
      document.querySelector(".rating-card .dc-sub").textContent = `내 평점 ${s.dataset.v}점`;
    });
  });
  starsEl.addEventListener("mouseleave", () => {
    const saved = lsGet(LS_RATING)[id];
    setStars(saved ? saved.rating : 0);
  });

  // 코멘트
  document.getElementById("commentToggle").addEventListener("click", () => {
    document.getElementById("commentBox").hidden = !document.getElementById("commentBox").hidden;
  });
  document.getElementById("saveComment").addEventListener("click", () => {
    const r = lsGet(LS_RATING);
    r[id] = { ...(r[id] || { rating: 0 }), comment: document.getElementById("commentText").value.trim() };
    lsSet(LS_RATING, r);
    document.getElementById("saveComment").textContent = "저장됨 ✓";
    setTimeout(() => (document.getElementById("saveComment").textContent = "저장"), 1200);
  });
}

function genreHue(genre) {
  const map = { "과학기술": 210, "인문": 270, "신앙": 45, "소설": 330, "역사": 25, "자기계발": 160, "경제·경영": 190, "에세이": 300, "기타": 0 };
  return `hsl(${map[genre] ?? 220} 45% 55%)`;
}

/* ---------- 책 추가 ---------- */
function initAddBook() {
  const formModal = document.getElementById("formModal");
  document.getElementById("addBookBtn").addEventListener("click", () => {
    formModal.hidden = false; document.body.classList.add("modal-open");
  });
  document.getElementById("formClose").addEventListener("click", () => closeModal(formModal));
  document.getElementById("addBookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const book = {
      id: "u" + Date.now(),
      title: (f.get("title") || "").trim(), author: (f.get("author") || "").trim(),
      publisher: (f.get("publisher") || "").trim(), year: (f.get("year") || "").trim(),
      genre: f.get("genre"), status: f.get("status"),
      cover: null, review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
    };
    if (!book.title) return;
    const list = lsArr(LS_BOOKS); list.push(book); lsSet(LS_BOOKS, list);
    e.target.reset(); closeModal(formModal); renderLibrary(); renderGyeol();
  });
}

/* ---------- 모달 공통 ---------- */
function closeModal(el) {
  el.hidden = true;
  if (!document.querySelector(".modal-backdrop:not([hidden])")) document.body.classList.remove("modal-open");
}
function initModals() {
  document.getElementById("modalClose").addEventListener("click", () => closeModal(document.getElementById("bookModal")));
  document.querySelectorAll(".modal-backdrop").forEach((bd) =>
    bd.addEventListener("click", (e) => { if (e.target === bd) closeModal(bd); })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.querySelectorAll(".modal-backdrop:not([hidden])").forEach(closeModal);
  });
  // 의견·신고 (placeholder)
  document.getElementById("fab").addEventListener("click", () =>
    alert("의견·신고 기능은 준비 중이에요. 나중에 연결합니다.")
  );
}

/* ---------- 부트 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTabs(); renderProfile(); renderGyeol(); renderLibrary();
  initLibraryUI(); initAddBook(); initModals();
});
