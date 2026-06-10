/* ============================================================
   샘플 데이터 (시제품용)
   - 나중에 본인 실제 정보 / 외부 도서 API 데이터로 교체하세요.
   - 7축 순서는 모든 곳에서 동일하게 사용됩니다.
   ============================================================ */

const AXES = ["독해 난이도", "사고 깊이", "정서적 울림", "자기이해", "신앙적 사유", "세상 이해", "시대 통찰"];

const PROFILE = {
  name: "최찬규",
  // '나' 페이지 카드 (선택한 항목: MBTI / 진로·꿈 / 학업 선호 / 가치관·신앙)
  cards: [
    {
      icon: "🧩",
      label: "MBTI",
      value: "INFJ",
      desc: "이상을 품되 조용히 실행하는 통찰가. 의미·사람·방향을 먼저 본다.",
    },
    {
      icon: "🧭",
      label: "진로·꿈",
      value: "기술과 사람을 잇는 일",
      desc: "기술의 방향을 윤리·사회의 눈으로 묻는 기획·연구·집필.",
    },
    {
      icon: "📐",
      label: "학업 선호",
      value: "인문 × 과학기술",
      desc: "개념을 깊이 파고드는 정독형. 토론과 글쓰기로 정리할 때 가장 잘 배운다.",
    },
    {
      icon: "✝️",
      label: "가치관·신앙",
      value: "믿음 위에 선 분별",
      desc: "빠른 성취보다 옳은 방향. 신앙적 사유로 시대를 읽으려 한다.",
    },
  ],
  careerAnalysis:
    "INFJ 특유의 통찰과 ‘기술 × 인문’ 선호가 또렷합니다. 읽어온 책들의 결이 <b>세상 이해·시대 통찰</b>로 쏠려 있어, " +
    "단순 기술자보다 <b>기술의 방향을 묻는 자리</b>(기술윤리·정책·과학저술·기획)와 잘 맞습니다. " +
    "신앙적 사유 축이 살아 있어 ‘옳음’을 기준으로 판단하는 일에서 동기가 큽니다. " +
    "다음 단계로는 ① 관심 주제를 글로 정리하는 습관, ② 사고 깊이를 키우는 고전 1~2권을 권합니다.",
};

/* 샘플 책 — axes 순서는 AXES와 동일 (독해/사고/정서/자기이해/신앙/세상/시대) */
const SAMPLE_BOOKS = [
  {
    id: "b1",
    title: "기술공화국 선언",
    author: "알렉스 C. 카프, 니콜라스 W. 자미스카",
    publisher: "지식노마드", year: "2025.08", pages: 360,
    genre: "과학기술", status: "read",
    axes: [3, 4, 2, 2.5, 2, 4, 5],
    aiRating: 4.2,
    aiSummary:
      "팔란티어 CEO와 법률 고문이 던지는 질문: 미국은 왜 점점 약해지는가. 저자들은 그 중심에 ‘기술’이 있다고 본다. " +
      "기술 시대에 국가·시민·가치가 어디로 가야 하는지를 도발적으로 묻는다.",
    aiNote: "시대 통찰이 가장 두꺼운 책. ‘기술의 방향’을 고민하는 당신의 진로와 강하게 닿는다.",
  },
  {
    id: "b2",
    title: "코스모스",
    author: "칼 세이건", publisher: "사이언스북스", year: "2006", pages: 720,
    genre: "과학기술", status: "read",
    axes: [4, 5, 4, 3, 2.5, 5, 4],
    aiRating: 4.8,
    aiSummary: "우주의 크기 앞에서 인간을 다시 보게 하는 고전. 과학을 시처럼 읽게 만든다.",
    aiNote: "사고 깊이·세상 이해를 함께 끌어올리는 책.",
  },
  {
    id: "b3",
    title: "데미안",
    author: "헤르만 헤세", publisher: "민음사", year: "2000", pages: 240,
    genre: "소설", status: "read",
    axes: [3, 4, 5, 5, 3.5, 3, 3],
    aiRating: 4.5,
    aiSummary: "알을 깨고 나오는 성장의 이야기. 자기 안의 빛과 어둠을 직면하게 한다.",
    aiNote: "자기이해·정서적 울림이 강한 책.",
  },
  {
    id: "b4",
    title: "순전한 기독교",
    author: "C.S. 루이스", publisher: "홍성사", year: "2018", pages: 320,
    genre: "신앙", status: "read",
    axes: [4, 4.5, 3.5, 4, 5, 3, 3],
    aiRating: 4.6,
    aiSummary: "이성으로 믿음을 변증하는 고전. 신앙을 ‘생각하며’ 붙들게 돕는다.",
    aiNote: "신앙적 사유 축의 기준점이 되는 책.",
  },
  {
    id: "b5",
    title: "사피엔스",
    author: "유발 하라리", publisher: "김영사", year: "2015", pages: 640,
    genre: "역사", status: "read",
    axes: [4, 5, 2.5, 2.5, 2, 5, 5],
    aiRating: 4.3,
    aiSummary: "인류가 어떻게 지구를 지배했는가. 허구를 믿는 능력에서 답을 찾는다.",
    aiNote: "세상 이해·시대 통찰을 크게 넓히는 책.",
  },
  {
    id: "b6",
    title: "아주 작은 습관의 힘",
    author: "제임스 클리어", publisher: "비즈니스북스", year: "2019", pages: 360,
    genre: "자기계발", status: "read",
    axes: [2, 3, 2.5, 4.5, 1.5, 3, 2],
    aiRating: 4.0,
    aiSummary: "1%의 변화가 쌓여 정체성을 바꾼다. 의지가 아니라 시스템을 설계하라.",
    aiNote: "자기이해·실천에 바로 쓰이는 책.",
  },
  {
    id: "b7",
    title: "미움받을 용기",
    author: "기시미 이치로", publisher: "인플루엔셜", year: "2014", pages: 336,
    genre: "인문", status: "read",
    axes: [3, 4, 4, 5, 2.5, 3, 2.5],
    aiRating: 4.1,
    aiSummary: "아들러 심리학을 대화로 풀어낸 책. 모든 고민은 인간관계에서 온다.",
    aiNote: "자기이해를 깊게 흔드는 책.",
  },
  {
    id: "b8",
    title: "팩트풀니스",
    author: "한스 로슬링", publisher: "김영사", year: "2019", pages: 408,
    genre: "인문", status: "wish",
    axes: [3, 4, 2, 2.5, 2, 5, 4],
    aiRating: 4.4,
    aiSummary: "세상은 생각보다 나아지고 있다. 데이터로 편견을 깨는 법.",
    aiNote: "세상 이해 축을 데이터로 보정해 주는 책.",
  },
  {
    id: "b9",
    title: "총, 균, 쇠",
    author: "재레드 다이아몬드", publisher: "문학사상", year: "2005", pages: 752,
    genre: "역사", status: "wish",
    axes: [5, 5, 2, 2, 2, 5, 4.5],
    aiRating: 4.2,
    aiSummary: "왜 어떤 문명은 앞서고 어떤 문명은 뒤처졌는가. 지리에서 답을 찾는다.",
    aiNote: "독해 난이도·사고 깊이가 높은 도전적인 책.",
  },
];

/* 이번 달 신간 자리 (외부 API 연결 전 placeholder) */
const NEW_RELEASES = [
  { title: "신간 자리 ①", author: "외부 도서 API 연결 예정", genre: "과학기술", placeholder: true },
  { title: "신간 자리 ②", author: "이번 달 신간이 여기 자동으로", genre: "인문", placeholder: true },
  { title: "신간 자리 ③", author: "표지·소개·평점도 함께", genre: "신앙", placeholder: true },
  { title: "신간 자리 ④", author: "API 키 연결 후 활성화", genre: "소설", placeholder: true },
];
