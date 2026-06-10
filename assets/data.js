/* ============================================================
   샘플 데이터 (시제품용)
   - 나중에 본인 실제 정보 / 외부 도서 API 데이터로 교체하세요.
   ============================================================ */

/* 나 탭의 '독서 결' 7축 (독해 난이도 = 어려울수록 높음) */
const AXES = ["독해 난이도", "사고 깊이", "정서적 울림", "자기이해", "신앙적 사유", "세상 이해", "시대 통찰"];

/* 책 특성(책 탭) 7축 — 첫 축만 '가독성'(쉬울수록 높음, 독해 난이도의 반전) */
const BOOK_AXES = ["가독성", ...AXES.slice(1)];

/* 각 축 설명 (책 탭 '각 축 설명' 펼침용) */
const AXIS_DESC = {
  "가독성": "술술 읽히는 정도 (높을수록 쉬움)",
  "사고 깊이": "곱씹게 만드는 사유의 깊이",
  "정서적 울림": "마음을 흔드는 정도",
  "자기이해": "나를 돌아보게 하는 정도",
  "신앙적 사유": "믿음·초월을 생각하게 하는 정도",
  "세상 이해": "사회·세계를 보는 눈을 넓히는 정도",
  "시대 통찰": "시대의 흐름을 읽게 하는 정도",
};

/* 독해 난이도(axes[0]) → 가독성 으로 변환 (반전) */
function toBookChar(axes) {
  if (!Array.isArray(axes)) return null;
  const read = Math.max(1, Math.min(5, 6 - axes[0]));
  return [read, ...axes.slice(1)];
}

/* ---------------- 나 (프로필) ---------------- */
const PROFILE = {
  name: "최찬규",
  // 카드: 줄글 대신 유형명(value) + 특징 불릿(points)
  cards: [
    {
      icon: "🧩", label: "MBTI", value: "INTJ · 전략가형",
      points: ["독립적이고 전략적으로 사고한다", "장기 목표를 세우고 묵묵히 실행한다", "효율·논리·의미를 중시한다"],
    },
    {
      icon: "🧭", label: "진로·꿈", value: "기술과 사람을 잇는 일",
      points: ["기술의 방향을 윤리의 눈으로 묻기", "연구·기획·집필에 끌린다", "옳은 방향을 먼저 본다"],
    },
    {
      icon: "📐", label: "학업 선호", value: "인문 × 과학기술",
      points: ["개념을 깊이 파는 정독형", "토론·글쓰기로 정리할 때 잘 배운다", "수학·과학과 인문을 함께"],
    },
    {
      icon: "✝️", label: "가치관·신앙", value: "믿음 위에 선 분별",
      points: ["신앙적 사유로 시대를 읽는다", "빠른 성취보다 옳은 방향", "사람과 의미를 먼저 본다"],
    },
  ],
  careerAnalysis:
    "INTJ 특유의 통찰과 ‘기술 × 인문’ 선호가 또렷합니다. 읽어온 책들의 결이 <b>세상 이해·시대 통찰</b>로 쏠려 있어, " +
    "단순 기술자보다 <b>기술의 방향을 묻는 자리</b>(기술윤리·정책·과학저술·기획)와 잘 맞습니다. " +
    "신앙적 사유 축이 살아 있어 ‘옳음’을 기준으로 판단하는 일에서 동기가 큽니다.",
};

/* ---------------- 책 ----------------
   cover: 표지 이미지 URL (없으면 색 표지로 대체)
   axes:  [독해난이도, 사고, 정서, 자기이해, 신앙, 세상, 시대]  (1~5)
   desc:  책 소개 (알라딘 등 출처)
   review: 드리미 학교 서평 (지금은 비움 — 나중에 입력)
   reviewCount: 서평 편수
------------------------------------------------- */
const SAMPLE_BOOKS = [
  {
    id: "b1", title: "기술공화국 선언", author: "알렉스 C. 카프, 니콜라스 W. 자미스카",
    publisher: "지식노마드", year: "2025.08", pages: 360, genre: "과학기술", status: "read",
    cover: null, axes: [3, 4, 2, 2.5, 2, 4, 5], aiRating: 4.2,
    desc: "팔란티어 CEO 알렉스 카프와 법률 고문 니콜라스 자미스카가 함께 쓴 《기술공화국 선언》은 기술 시대에 꼭 생각해봐야 할 중요한 질문을 던지는 책이다. 미국은 왜 점점 약해지고 있을까? 저자들은 그 중심에 기술이 있다고 말한다.",
    review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
  },
  {
    id: "b2", title: "코스모스", author: "칼 세이건",
    publisher: "사이언스북스", year: "2006", pages: 720, genre: "과학기술", status: "read",
    cover: null, axes: [4, 5, 4, 3, 2.5, 5, 4], aiRating: 4.8,
    desc: "우주의 크기 앞에서 인간을 다시 보게 하는 과학 고전. 과학을 시처럼 읽게 만든다.",
    review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
  },
  {
    id: "b3", title: "데미안", author: "헤르만 헤세",
    publisher: "민음사", year: "2000", pages: 240, genre: "소설", status: "read",
    cover: null, axes: [3, 4, 5, 5, 3.5, 3, 3], aiRating: 4.5,
    desc: "알을 깨고 나오는 성장의 이야기. 자기 안의 빛과 어둠을 직면하게 한다.",
    review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
  },
  {
    id: "b4", title: "순전한 기독교", author: "C.S. 루이스",
    publisher: "홍성사", year: "2018", pages: 320, genre: "신앙", status: "read",
    cover: null, axes: [4, 4.5, 3.5, 4, 5, 3, 3], aiRating: 4.6,
    desc: "이성으로 믿음을 변증하는 고전. 신앙을 ‘생각하며’ 붙들게 돕는다.",
    review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
  },
  {
    id: "b5", title: "사피엔스", author: "유발 하라리",
    publisher: "김영사", year: "2015", pages: 640, genre: "역사", status: "read",
    cover: null, axes: [4, 5, 2.5, 2.5, 2, 5, 5], aiRating: 4.3,
    desc: "인류가 어떻게 지구를 지배했는가. 허구를 믿는 능력에서 답을 찾는다.",
    review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
  },
  {
    id: "b6", title: "아주 작은 습관의 힘", author: "제임스 클리어",
    publisher: "비즈니스북스", year: "2019", pages: 360, genre: "자기계발", status: "read",
    cover: null, axes: [2, 3, 2.5, 4.5, 1.5, 3, 2], aiRating: 4.0,
    desc: "1%의 변화가 쌓여 정체성을 바꾼다. 의지가 아니라 시스템을 설계하라.",
    review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
  },
  {
    id: "b7", title: "미움받을 용기", author: "기시미 이치로",
    publisher: "인플루엔셜", year: "2014", pages: 336, genre: "인문", status: "read",
    cover: null, axes: [3, 4, 4, 5, 2.5, 3, 2.5], aiRating: 4.1,
    desc: "아들러 심리학을 대화로 풀어낸 책. 모든 고민은 인간관계에서 온다.",
    review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
  },
  {
    id: "b8", title: "팩트풀니스", author: "한스 로슬링",
    publisher: "김영사", year: "2019", pages: 408, genre: "인문", status: "wish",
    cover: null, axes: [3, 4, 2, 2.5, 2, 5, 4], aiRating: 4.4,
    desc: "세상은 생각보다 나아지고 있다. 데이터로 편견을 깨는 법.",
    review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
  },
  {
    id: "b9", title: "총, 균, 쇠", author: "재레드 다이아몬드",
    publisher: "문학사상", year: "2005", pages: 752, genre: "역사", status: "wish",
    cover: null, axes: [5, 5, 2, 2, 2, 5, 4.5], aiRating: 4.2,
    desc: "왜 어떤 문명은 앞서고 어떤 문명은 뒤처졌는가. 지리에서 답을 찾는다.",
    review: "", reviewCount: 0, aladinUrl: "#", notionUrl: "#",
  },
];

/* 이번 달 신간 자리 (외부 API 연결 전 placeholder) */
const NEW_RELEASES = [
  { title: "신간 자리 ①", author: "외부 도서 API 연결 예정", genre: "과학기술", placeholder: true },
  { title: "신간 자리 ②", author: "이번 달 신간이 여기 자동으로", genre: "인문", placeholder: true },
  { title: "신간 자리 ③", author: "표지·소개·평점도 함께", genre: "신앙", placeholder: true },
  { title: "신간 자리 ④", author: "API 키 연결 후 활성화", genre: "소설", placeholder: true },
];
