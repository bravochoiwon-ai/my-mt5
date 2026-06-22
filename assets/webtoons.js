/* ============================================================
   큐레이션 웹툰 시드 데이터 (등장인물·설정 포함)
   - 여기에 실제 웹툰을 정리해 넣으면 앱에 바로 뜹니다.
   - 사용자가 직접 추가한 웹툰(localStorage)과 합쳐져 보입니다.

   구조:
   {
     id, title, author, day("월"~"일" 또는 "완결"), genre, status,
     axes: [작화, 스토리, 몰입도, 연출, 캐릭터, 독창성] (1~5),
     cover: 표지 이미지 URL(없으면 색 타일),
     setting: "세계관·설정 설명",
     characters: [{ name, alias, img, intro, ability, personality, affiliation, past, quote }]
   }
   ※ 인물/설정은 나무위키 등 공개 정보를 바탕으로 사실관계를 정리(요약)한 것.
   ※ 장르·6축 특성은 우선 장르 기준의 추정값 — 상세는 작품별로 채워갑니다.
   ============================================================ */

/* 장르별 기본 6축 [작화, 스토리, 몰입도, 연출, 캐릭터, 독창성] */
const WT_GENRE_AXES = {
  "액션": [4.5, 4, 4.5, 4.5, 4, 3.5],
  "판타지": [4, 4.5, 4.5, 4, 4, 4.5],
  "무협/사극": [4.5, 4.5, 4.5, 4.5, 4, 4],
  "로맨스": [4, 4, 4, 3.5, 4.5, 3.5],
  "드라마": [3.5, 4.5, 4, 4, 4.5, 4],
  "스릴러": [4, 4.5, 4.5, 4.5, 4, 4],
  "일상": [3.5, 3.5, 3.5, 3, 4, 3.5],
  "개그": [3.5, 3.5, 4, 3.5, 4, 4],
  "스포츠": [4, 4, 4.5, 4.5, 4, 3.5],
  "감성": [4, 4, 4, 3.5, 4.5, 4],
};

/* 간단 시드 생성기 (상세가 없는 작품용) */
function wseed(id, title, genre, status, extra) {
  extra = extra || {};
  return {
    id, title, genre, status,
    author: extra.author || "",
    day: extra.day || "",
    axes: extra.axes || WT_GENRE_AXES[genre] || [3, 3, 3, 3, 3, 3],
    cover: extra.cover || null,
    setting: extra.setting || "",
    characters: extra.characters || [],
  };
}

const SAMPLE_WEBTOONS = [
  /* ---------- 상세 정리된 작품 ---------- */
  wseed("wt-nano", "나노마신", "무협/사극", "watching", {
    author: "한중월야 원작 · REDICE STUDIO 작화",
    axes: [5, 4.5, 4.5, 4, 4, 5],
    setting:
      "약 800년 전 천마조사가 천마신교를 창설한 이래, 무림은 정파·사파·천마신교의 3대 세력으로 나뉜 무협 세계가 배경이다. 천마신교는 절대자 ‘천마’를 정점으로 한 거대 마교다.\n" +
      "이 작품의 가장 큰 특징은 전통 무협에 SF가 결합된다는 점. 먼 미래(천마신교의 후신 ‘블랙 스카이 컴퍼니’)에서 시간을 거슬러 온 후손이 주인공의 몸에 ‘나노머신’을 주입하면서 이야기가 시작된다. 약골 사생아였던 천여운이 나노머신의 보조로 마교 최강자로 성장해 가는 과정을 그린다.",
    characters: [
      {
        name: "천여운", alias: "제2대 천마", img: "",
        intro: "천마신교 교주 천유종과 시녀 화연 사이에서 태어났으나, 낮은 서열과 어머니의 죽음으로 늘 목숨을 위협받던 소년. 미래에서 온 후손이 몸에 주입한 ‘나노머신’을 계기로 운명이 완전히 뒤바뀐다. 끝내 천마신교 24대 교주이자 제2대 천마의 자리에 오른다.",
        ability: "체내의 나노머신이 몸 상태와 내공 흐름을 실시간 분석하고, 무공에 맞는 최적의 운기요결을 시뮬레이션해 제시한다. 독 중화·신체 회복 보조까지 더해져, 본인의 재능과 결합하며 마교 최강자로 성장한다.",
        personality: "영리하고 침착하다. 생존을 위해 냉정하게 판단하지만, 받은 은혜는 반드시 갚는다.",
        affiliation: "천마신교",
        past: "어린 시절 어머니 화연이 무 부인의 미독 계략으로 세상을 떠났고, 서열 최하위로 멸시와 암살 위협에 끊임없이 시달렸다.",
        quote: "",
      },
      {
        name: "나노머신", alias: "‘나노’", img: "",
        intro: "미래 기술의 결정체로, 천여운의 몸속에 주입된 이 작품의 핵심 동력. 천여운은 줄여서 ‘나노’라 부른다. 그가 죽지 않는 한 몸 밖으로 배출되지 않아 사실상 한 몸이다.",
        ability: "인체와 내공을 분석하고, 무공에 맞는 운기요결을 시뮬레이션·개발한다. 상대의 미세 반응을 읽어 참·거짓을 판별하고, 정보 전이로 지식을 전달하며, 독 중화와 신체 회복을 돕는다.",
        personality: "기계적이고 효율 중심의 어조로 천여운을 보조한다.",
        affiliation: "천여운 전속 시스템", past: "", quote: "",
      },
      {
        name: "천무성", alias: "천여운의 먼 후손", img: "",
        intro: "미래에서 과거로 건너온 천여운의 후손. 본래의 시간선에서 벌어진 비극을 막기 위해, 조상인 천여운에게 나노머신을 주입한 장본인이다.",
        ability: "", personality: "", affiliation: "천마신교의 후예", past: "", quote: "",
      },
      {
        name: "천유종", alias: "천마신교 23대 교주", img: "",
        intro: "천여운의 부친이자 천마신교 23대 교주. 시녀였던 화연을 유일하게 마음에 둔 여인으로 사랑했다.",
        ability: "", personality: "", affiliation: "천마신교 (교주)",
        past: "태상교주 천인지가 떠난 뒤 갑작스럽게 교주가 되었고, 원정을 나간 사이 화연이 독살당하는 비극을 겪는다.",
        quote: "",
      },
      {
        name: "화연", alias: "천여운의 모친", img: "",
        intro: "교주전의 시녀 출신으로, 교주 천유종이 마음을 준 여인이자 천여운의 어머니.",
        ability: "", personality: "", affiliation: "천마신교 (교주전 시녀)",
        past: "천유종이 원정을 떠난 사이, 무 부인의 계략으로 미독에 중독되어 끝내 세상을 떠났다.",
        quote: "",
      },
      {
        name: "무 부인", alias: "", img: "",
        intro: "천마신교 내 권력 다툼 속에서 화연을 미독으로 해친 장본인. 천여운의 어린 시절 비극을 만든 원흉이다.",
        ability: "", personality: "", affiliation: "천마신교", past: "", quote: "",
      },
    ],
  }),

  /* ---------- 읽는 중 (목록만 — 상세는 추후) ---------- */
  wseed("wt-w01", "로드 오브 머니", "드라마", "watching"),
  wseed("wt-w02", "판사 이한영", "드라마", "watching"),
  wseed("wt-w03", "픽미업", "판타지", "watching"),
  wseed("wt-w04", "갓 오브 블랙필드", "액션", "watching"),
  wseed("wt-w05", "죽여주는 변호사", "드라마", "watching"),
  wseed("wt-w06", "괴력난신", "액션", "watching"),
  wseed("wt-w07", "투신전생기", "무협/사극", "watching"),
  wseed("wt-w08", "김부장", "드라마", "watching"),
  wseed("wt-w09", "퀘스트 지상주의", "액션", "watching"),
  wseed("wt-w10", "역대급 영지 설계서", "판타지", "watching"),
  wseed("wt-w11", "멸망 이후의 세계", "액션", "watching"),
  wseed("wt-w12", "나혼자 만렙 뉴비", "판타지", "watching"),
  wseed("wt-w13", "백XX", "액션", "watching"),
  wseed("wt-w14", "창백한 말", "스릴러", "watching"),
  wseed("wt-w15", "정글쥬스", "액션", "watching"),
  wseed("wt-w16", "1초", "액션", "watching"),
  wseed("wt-w17", "입학용병", "액션", "watching"),
  wseed("wt-w18", "전지적 독자 시점", "판타지", "watching"),
  wseed("wt-w19", "나혼자만 레벨업", "액션", "watching"),
  wseed("wt-w20", "윈드브레이커", "스포츠", "watching"),
  wseed("wt-w21", "도굴왕", "액션", "watching"),
  wseed("wt-w22", "내 최애는 막차를 탄다", "로맨스", "watching"),
  wseed("wt-w23", "히어로 킬러", "액션", "watching"),
  wseed("wt-w24", "킬러 배드로", "액션", "watching"),
  wseed("wt-w25", "마도전생기", "판타지", "watching"),
  wseed("wt-w26", "하이브 1", "스릴러", "watching"),
  wseed("wt-w27", "검술명가 막내아들", "판타지", "watching"),
  wseed("wt-w28", "별정직 공무원", "액션", "watching"),
  wseed("wt-w29", "연애혁명", "로맨스", "watching"),
  wseed("wt-w30", "심해수", "스릴러", "watching"),
  wseed("wt-w31", "신도림", "액션", "watching"),
  wseed("wt-w32", "택배기사", "액션", "watching"),
  wseed("wt-w33", "철혈검가 사냥개의 회귀", "판타지", "watching"),
  wseed("wt-w34", "백작가의 망나니가 되었다", "판타지", "watching"),
  wseed("wt-w35", "여고생이 신인데 나만 괴롭힘", "개그", "watching"),

  /* ---------- 관심 (아직 안 읽음) ---------- */
  wseed("wt-i01", "하이브 2", "스릴러", "wish"),
  wseed("wt-i02", "외모지상주의", "액션", "wish"),
  wseed("wt-i03", "격기 3반", "액션", "wish"),
  wseed("wt-i04", "싸움독학", "액션", "wish"),
  wseed("wt-i05", "인생존망", "드라마", "wish"),
  wseed("wt-i06", "재벌집 막내 아들", "드라마", "wish"),
  wseed("wt-i07", "화산귀환", "무협/사극", "wish"),
  wseed("wt-i08", "뷰티풀군바리", "드라마", "wish"),
  wseed("wt-i09", "스위트 홈", "스릴러", "wish"),
];
