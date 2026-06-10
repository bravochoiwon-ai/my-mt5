/* ============================================================
   SVG 레이더 차트 (외부 라이브러리 없음)
   drawRadar(el, { labels, values, max, size, accent })
   ============================================================ */

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180; // 12시 방향이 0도
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function drawRadar(el, opts) {
  const labels = opts.labels;
  const values = opts.values;
  const max = opts.max || 5;
  const size = opts.size || 420;
  const accent = opts.accent || "#2563eb";
  const showAxisNums = opts.showAxisNums !== false;

  const n = labels.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 64; // 라벨 여백
  const rings = max;

  let svg = `<svg viewBox="0 0 ${size} ${size}" class="radar" role="img">`;

  // 그리드 링
  for (let ring = 1; ring <= rings; ring++) {
    const rr = (r * ring) / rings;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const [x, y] = polar(cx, cy, rr, (360 / n) * i);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    svg += `<polygon points="${pts.join(" ")}" fill="none" stroke="#e5e7eb" stroke-width="1"/>`;
  }

  // 축선 + 눈금 숫자
  for (let i = 0; i < n; i++) {
    const [x, y] = polar(cx, cy, r, (360 / n) * i);
    svg += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#e5e7eb" stroke-width="1"/>`;
  }
  if (showAxisNums) {
    for (let ring = 1; ring <= rings; ring++) {
      const rr = (r * ring) / rings;
      const [nx, ny] = polar(cx, cy, rr, 0);
      svg += `<text x="${nx + 6}" y="${ny + 4}" class="radar-tick">${ring}</text>`;
    }
  }

  // 데이터 다각형
  const dpts = [];
  for (let i = 0; i < n; i++) {
    const v = Math.max(0, Math.min(max, values[i] || 0));
    const rr = (r * v) / max;
    const [x, y] = polar(cx, cy, rr, (360 / n) * i);
    dpts.push([x, y]);
  }
  const poly = dpts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  svg += `<polygon points="${poly}" fill="${accent}22" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round"/>`;
  dpts.forEach((p) => {
    svg += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="${accent}"/>`;
  });

  // 라벨
  for (let i = 0; i < n; i++) {
    const [lx, ly] = polar(cx, cy, r + 30, (360 / n) * i);
    let anchor = "middle";
    if (lx < cx - 4) anchor = "end";
    else if (lx > cx + 4) anchor = "start";
    svg += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" class="radar-label">${labels[i]}</text>`;
  }

  svg += `</svg>`;
  el.innerHTML = svg;
}
