/* ============================================================
   앱 로직 — 탭, 프로필, 독서 결, 도서관, 모달, 책 추가
   ============================================================ */

const LS_KEY = "myspace.userBooks.v1";

/* ---------- 데이터 로드 (샘플 + localStorage 추가분) ---------- */
function loadUserBooks() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}
function saveUserBooks(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}
function allBooks() {
  return [...SAMPLE_BOOKS, ...loadUserBooks()];
}

/* ---------- 탭 ---------- */
function initTabs() {
  document.getElementById("tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    btn.classList.add("is-active");
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
    document.getElementById("tab-" + tab).classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 나: 프로필 ---------- */
function renderProfile() {
  document.getElementById("brandName").textContent = PROFILE.name + "의 공간";
  document.getElementById("meTitle").textContent = PROFILE.name;
  document.getElementById("gyeolName").textContent = PROFILE.name;
  document.getElementById("libName").textContent = PROFILE.name;

  document.getElementById("profileCards").innerHTML = PROFILE.cards
    .map(
      (c) => `
      <div class="card profile-card">
        <div class="pc-icon">${c.icon}</div>
        <div class="pc-label">${c.label}</div>
        <div class="pc-value">${c.value}</div>
        <div class="pc-desc">${c.desc}</div>
      </div>`
    )
    .join("");

  document.getElementById("careerBody").innerHTML = PROFILE.careerAnalysis;
}

/* ---------- 나: 독서 결 ---------- */
function renderGyeol() {
  const books = allBooks().filter((b) => b.status === "read");
  const analyzed = books.filter((b) => Array.isArray(b.axes));

  // 누적 합 & 평균
  const sums = AXES.map(() => 0);
  analyzed.forEach((b) => b.axes.forEach((v, i) => (sums[i] += v)));
  const avgs = AXES.map((_, i) => (analyzed.length ? sums[i] / analyzed.length : 0));

  // 마음 깊이 닿은 결: 평균 3.5 이상인 축 수
  const strong = avgs.filter((v) => v >= 3.5).length;

  // 레이더는 평균값으로
  drawRadar(document.getElementById("gyeolRadar"), {
    labels: AXES, values: avgs, max: 5, size: 440, accent: "#1d4ed8",
  });

  // 통계 카드
  document.getElementById("gyeolStats").innerHTML = `
    <div class="stat"><div class="stat-num">${books.length}</div><div class="stat-cap">읽은 책</div></div>
    <div class="stat"><div class="stat-num">${analyzed.length}</div><div class="stat-cap">7축 분석된 책</div></div>
    <div class="stat"><div class="stat-num">${strong}/7</div><div class="stat-cap">깊이 닿은 결</div></div>`;

  // 관찰 코멘트 (가장 두꺼운/얇은 축)
  const order = avgs.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  const top = order.slice(0, 2).map((o) => AXES[o.i]);
  const low = order[order.length - 1];
  document.getElementById("gyeolObserve").innerHTML =
    `지금까지 <b>${books.length}권</b>을 읽었고, 그중 <b>${analyzed.length}권</b>의 결이 분석됐어요. ` +
    `읽어온 책들의 결을 쌓아보면 <b>${top.join("·")}</b> 결이 가장 두텁고, ` +
    `<b>${AXES[low.i]}</b> 결은 상대적으로 얇게 남아 있어요.`;

  // 막대 (평균 기준, 5점 만점)
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

/* ---------- 도서관 ---------- */
let currentFilter = "all";

function bookCardHTML(b) {
  const stars = b.aiRating ? "★".repeat(Math.round(b.aiRating)) : "";
  const badge = b.status === "wish" ? `<span class="badge wish">관심</span>` : `<span class="badge read">읽음</span>`;
  return `
    <button class="book-card" data-id="${b.id}">
      <div class="book-cover" style="--g:${genreHue(b.genre)}">${(b.title || "?").slice(0, 1)}</div>
      <div class="book-meta">
        <div class="book-title">${b.title}</div>
        <div class="book-author">${b.author || "저자 미상"}</div>
        <div class="book-foot">${badge}<span class="book-genre">${b.genre || ""}</span></div>
        ${b.aiRating ? `<div class="book-stars">${stars} <span>${b.aiRating}</span></div>` : `<div class="book-stars muted">분석 대기</div>`}
      </div>
    </button>`;
}

function renderLibrary() {
  const books = allBooks();
  const reads = books.filter((b) => b.status === "read");
  document.getElementById("libCount").textContent = reads.length;

  let shown = books;
  if (currentFilter === "read") shown = books.filter((b) => b.status === "read");
  if (currentFilter === "wish") shown = books.filter((b) => b.status === "wish");

  document.getElementById("bookGrid").innerHTML =
    shown.map(bookCardHTML).join("") || `<p class="muted">아직 책이 없어요. ‘+ 책 직접 입력’으로 추가해 보세요.</p>`;

  // 신간 placeholder
  document.getElementById("newGrid").innerHTML = NEW_RELEASES.map(
    (b) => `
    <div class="book-card placeholder">
      <div class="book-cover ph">신간</div>
      <div class="book-meta">
        <div class="book-title">${b.title}</div>
        <div class="book-author">${b.author}</div>
        <div class="book-foot"><span class="book-genre">${b.genre}</span></div>
      </div>
    </div>`
  ).join("");

  renderReco(books);
}

function renderReco(books) {
  // 추천 장르: 읽은 책 장르 빈도 상위
  const gCount = {};
  books.filter((b) => b.status === "read").forEach((b) => {
    if (b.genre) gCount[b.genre] = (gCount[b.genre] || 0) + 1;
  });
  const topGenres = Object.entries(gCount).sort((a, b) => b[1] - a[1]).slice(0, 4);
  document.getElementById("recoGenres").innerHTML = topGenres.length
    ? topGenres.map(([g, c]) => `<span class="pill">${g} <em>${c}권</em></span>`).join("")
    : `<span class="muted">읽은 책이 쌓이면 추천이 생겨요.</span>`;

  // 추천 작가: 평점 높은 책의 저자
  const authors = books
    .filter((b) => b.aiRating)
    .sort((a, b) => b.aiRating - a.aiRating)
    .map((b) => b.author)
    .filter(Boolean);
  const uniqAuthors = [...new Set(authors)].slice(0, 4);
  document.getElementById("recoAuthors").innerHTML = uniqAuthors.length
    ? uniqAuthors.map((a) => `<span class="pill">${a}</span>`).join("")
    : `<span class="muted">평가된 책이 쌓이면 추천이 생겨요.</span>`;
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
    const card = e.target.closest(".book-card");
    if (!card || !card.dataset.id) return;
    openBook(card.dataset.id);
  });
}

/* ---------- 책 상세 모달 ---------- */
function openBook(id) {
  const b = allBooks().find((x) => x.id === id);
  if (!b) return;
  const stars = b.aiRating ? renderStars(b.aiRating) : "";

  let radarHTML = "";
  if (Array.isArray(b.axes)) {
    radarHTML = `<div class="modal-radar" id="modalRadar"></div>`;
  }

  document.getElementById("modalBody").innerHTML = `
    <div class="book-detail">
      <div class="bd-cover" style="--g:${genreHue(b.genre)}">${b.title.slice(0, 1)}</div>
      <div class="bd-info">
        <h3>${b.title}</h3>
        <div class="bd-author">${b.author || "저자 미상"}</div>
        <div class="bd-meta">${[b.publisher, b.year, b.pages ? b.pages + "쪽" : null].filter(Boolean).join("  ·  ")}</div>
        <div class="bd-genre"><span class="pill">${b.genre || "미분류"}</span> ${b.status === "wish" ? '<span class="badge wish">관심</span>' : '<span class="badge read">읽음</span>'}</div>
      </div>
    </div>

    <div class="ai-block">
      <div class="ai-head">🤖 AI 줄거리 ${b.aiRating ? `<span class="ai-rating">${stars} <b>${b.aiRating}</b></span>` : ""}</div>
      <p class="ai-summary">${b.aiSummary || "AI 분석이 아직 없습니다. (미리 생성·저장 방식 — 나중에 한 번 만들어 채웁니다.)"}</p>
      ${b.aiNote ? `<div class="ai-note">💬 ${b.aiNote}</div>` : ""}
    </div>

    ${radarHTML ? `<div class="ai-head" style="margin-top:18px">📊 책 특성 (AI 추정)</div>${radarHTML}` : ""}
  `;

  const modal = document.getElementById("bookModal");
  modal.hidden = false;
  document.body.classList.add("modal-open");

  if (Array.isArray(b.axes)) {
    drawRadar(document.getElementById("modalRadar"), {
      labels: AXES, values: b.axes, max: 5, size: 380, accent: "#6366f1",
    });
  }
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = "★".repeat(full);
  if (half) s += "⯨";
  s += "☆".repeat(5 - full - (half ? 1 : 0));
  return `<span class="stars">${s}</span>`;
}

function genreHue(genre) {
  const map = {
    "과학기술": 210, "인문": 270, "신앙": 45, "소설": 330,
    "역사": 25, "자기계발": 160, "경제·경영": 190, "에세이": 300, "기타": 0,
  };
  const h = map[genre] ?? 220;
  return `hsl(${h} 45% 55%)`;
}

/* ---------- 책 추가 ---------- */
function initAddBook() {
  const formModal = document.getElementById("formModal");
  document.getElementById("addBookBtn").addEventListener("click", () => {
    formModal.hidden = false;
    document.body.classList.add("modal-open");
  });
  document.getElementById("formClose").addEventListener("click", () => closeModal(formModal));

  document.getElementById("addBookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const book = {
      id: "u" + Date.now(),
      title: (f.get("title") || "").trim(),
      author: (f.get("author") || "").trim(),
      publisher: (f.get("publisher") || "").trim(),
      year: (f.get("year") || "").trim(),
      genre: f.get("genre"),
      status: f.get("status"),
      // 7축·AI는 나중에 생성 (미리 생성·저장 방식)
    };
    if (!book.title) return;
    const list = loadUserBooks();
    list.push(book);
    saveUserBooks(list);
    e.target.reset();
    closeModal(formModal);
    renderLibrary();
  });
}

/* ---------- 모달 공통 ---------- */
function closeModal(el) {
  el.hidden = true;
  if (!document.querySelector(".modal-backdrop:not([hidden])")) {
    document.body.classList.remove("modal-open");
  }
}
function initModals() {
  document.getElementById("modalClose").addEventListener("click", () =>
    closeModal(document.getElementById("bookModal"))
  );
  document.querySelectorAll(".modal-backdrop").forEach((bd) => {
    bd.addEventListener("click", (e) => { if (e.target === bd) closeModal(bd); });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.querySelectorAll(".modal-backdrop:not([hidden])").forEach(closeModal);
  });
}

/* ---------- 부트 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderProfile();
  renderGyeol();
  renderLibrary();
  initLibraryUI();
  initAddBook();
  initModals();
});
