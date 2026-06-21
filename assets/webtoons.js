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
     characters: [
       { name, alias, img, intro, ability, personality, affiliation, past, quote }
     ]
   }
   ============================================================ */
const SAMPLE_WEBTOONS = [];
