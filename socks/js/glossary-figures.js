/* Small pictures for the glossary, drawn in code like the heel schematic, so they follow the theme.
   Every picture is 200 x 120 SVG units. A knit stitch is drawn as a V, a purl stitch as a small bump.
   Colours come from classes in css/glossary.css: .st is a stitch, .hi a highlighted one, .soft a faded one. */

const SVG_NS = 'http://www.w3.org/2000/svg';
const W = 200;
const H = 120;

/* The outline of the sock on the sock page, so the parts look the same here. */
const SOCK_PATH = 'M110,20 L230,20 L230,248 C232,285 262,300 300,300 L348,300 C382,300 396,328 396,350 C396,380 376,396 346,396 L142,396 C104,396 85,376 85,340 C85,300 110,290 110,250 Z';

let uid = 0;                              /* clip-path ids must be unique on the page */

function svgEl(tag, attrs, parent) {
  const e = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([name, value]) => e.setAttribute(name, value));
  if (parent) parent.appendChild(e);
  return e;
}

function label(svg, x, y, content, anchor = 'middle') {
  svgEl('text', { x, y, 'text-anchor': anchor, class: 'fig-label' }, svg).textContent = content;
}

/* A knit stitch: a V centred on (x, y). */
function knitStitch(svg, x, y, cls = 'st', size = 6) {
  svgEl('path', { d: `M${x - size} ${y - size} L${x} ${y + size} L${x + size} ${y - size}`, class: cls }, svg);
}

/* A purl stitch: a small bump centred on (x, y). */
function purlStitch(svg, x, y, cls = 'st', size = 6) {
  svgEl('path', { d: `M${x - size} ${y + 2} Q${x} ${y - size - 2} ${x + size} ${y + 2}`, class: cls }, svg);
}

/* cols x rows stitches centred on (cx, cy). draw(svg, x, y, col, row) draws one. */
function grid(svg, { cx, cy, cols, rows, dx = 16, dy = 14 }, draw) {
  const x0 = cx - ((cols - 1) * dx) / 2;
  const y0 = cy - ((rows - 1) * dy) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) draw(svg, x0 + c * dx, y0 + r * dy, c, r);
  }
  return { x0, y0, dx, dy };
}

/* A filled triangle pointing from (x1, y1) towards (x2, y2), with its tip at (x2, y2). */
function arrowHead(svg, x1, y1, x2, y2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const back = (a) => [x2 - 9 * Math.cos(angle + a), y2 - 9 * Math.sin(angle + a)];
  const [a, b] = [back(0.45), back(-0.45)];
  svgEl('polygon', { points: `${x2},${y2} ${a[0]},${a[1]} ${b[0]},${b[1]}`, class: 'head' }, svg);
}

/* ---------- the pictures, one per term; `t` holds that term's picture labels ---------- */

function knit(svg) {
  grid(svg, { cx: W / 2, cy: H / 2, cols: 7, rows: 5 }, (s, x, y, c, r) => knitStitch(s, x, y, c === 3 && r === 2 ? 'st hi' : 'st'));
}

function purl(svg) {
  grid(svg, { cx: W / 2, cy: H / 2, cols: 7, rows: 6, dy: 12 }, (s, x, y, c, r) => {
    if (c === 6 && r % 2) return;
    purlStitch(s, x + (r % 2 ? 8 : 0), y, c === 3 && r === 2 ? 'st hi' : 'st');
  });
}

function stockinette(svg, t) {
  grid(svg, { cx: 52, cy: 50, cols: 5, rows: 5 }, (s, x, y) => knitStitch(s, x, y, 'st'));
  grid(svg, { cx: 148, cy: 50, cols: 5, rows: 6, dy: 12 }, (s, x, y, c, r) => {
    if (c === 4 && r % 2) return;
    purlStitch(s, x + (r % 2 ? 8 : 0), y, 'st');
  });
  label(svg, 52, 112, t.front);
  label(svg, 148, 112, t.back);
}

function ribbing(svg) {
  const panel = (cx, pattern, dx, name) => {
    grid(svg, { cx, cy: 50, cols: pattern.length, rows: 5, dx }, (s, x, y, c) => {
      if (pattern[c] === 'k') knitStitch(s, x, y, 'st hi', 5);
      else purlStitch(s, x, y, 'st soft', 5);
    });
    label(svg, cx, 112, name);
  };
  panel(52, 'kpkpkp', 14, '1×1');
  panel(148, 'kkppkkpp', 11, '2×2');
}

function roundRow(svg, t) {
  /* A round: once around, always the same way. */
  const cx = 52, cy = 52, r = 30;
  const start = -Math.PI / 2 + 0.35;
  const end = start + 2 * Math.PI - 0.7;
  const at = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [sx, sy] = at(start);
  const [ex, ey] = at(end);
  svgEl('path', { d: `M${sx} ${sy} A${r} ${r} 0 1 1 ${ex} ${ey}`, class: 'yarn' }, svg);
  const [px, py] = at(end - 0.2);
  arrowHead(svg, px, py, ex, ey);
  label(svg, cx, 112, t.round);

  /* Rows: there and back, turning at each end. */
  const left = 116, right = 182;
  const ys = [26, 50, 74];
  svgEl('path', {
    d: `M${left} ${ys[0]} L${right - 8} ${ys[0]} A12 12 0 0 1 ${right - 8} ${ys[1]} L${left + 8} ${ys[1]} A12 12 0 0 0 ${left + 8} ${ys[2]} L${right - 4} ${ys[2]}`,
    class: 'yarn',
  }, svg);
  arrowHead(svg, right - 12, ys[2], right + 2, ys[2]);
  label(svg, (left + right) / 2, 112, t.row);
}

function gauge(svg, t) {
  svgEl('rect', { x: 34, y: 34, width: 132, height: 80, rx: 6, class: 'swatch' }, svg);
  const g = grid(svg, { cx: W / 2, cy: 74, cols: 8, rows: 5 }, (s, x, y, c, r) => {
    knitStitch(s, x, y, r === 2 && c >= 1 && c <= 6 ? 'st hi' : 'st soft');
  });
  const from = g.x0 + g.dx - 8;
  const to = g.x0 + 6 * g.dx + 8;
  svgEl('path', { d: `M${from} 28 L${from} 22 L${to} 22 L${to} 28`, class: 'bracket' }, svg);
  label(svg, W / 2, 15, t.ten);
}

function dpns(svg) {
  /* Seen from above: four needles make a square, the fifth one knits. */
  const cx = 88, cy = 60, half = 34;      /* the square of stitches */
  const over = 12;                        /* needle tips sticking out at the corners */
  const [l, r, t, b] = [cx - half, cx + half, cy - half, cy + half];
  [[l - over, t, r + over, t], [r, t - over, r, b + over], [r + over, b, l - over, b], [l, b + over, l, t - over]]
    .forEach(([x1, y1, x2, y2]) => svgEl('line', { x1, y1, x2, y2, class: 'needle' }, svg));
  for (let i = 1; i <= 4; i++) {
    const p = (i * 2 * half) / 5;
    [[l + p, t], [r, t + p], [r - p, b], [l, b - p]].forEach(([x, y]) => svgEl('circle', { cx: x, cy: y, r: 4.5, class: 'loop' }, svg));
  }
  svgEl('line', { x1: r + 8, y1: t - 6, x2: r + 58, y2: t + 44, class: 'needle hi-needle' }, svg);
}

function marker(svg) {
  const y = 62;
  svgEl('line', { x1: 12, y1: y, x2: 188, y2: y, class: 'needle' }, svg);
  const xs = [30, 50, 70, 90, 128, 148, 168];
  xs.forEach((x) => svgEl('ellipse', { cx: x, cy: y, rx: 6, ry: 13, class: 'loop' }, svg));
  svgEl('ellipse', { cx: 109, cy: y, rx: 5, ry: 10, class: 'ring' }, svg);
}

function sockFigure(svg, highlight) {
  const id = `glossary-sock-${++uid}`;
  const g = svgEl('g', { transform: 'translate(-8 -2) scale(0.3)' }, svg);
  svgEl('path', { d: SOCK_PATH }, svgEl('clipPath', { id: `${id}-clip` }, g));
  svgEl('path', { d: SOCK_PATH, class: 'sock-fill' }, g);
  const clipped = svgEl('g', { 'clip-path': `url(#${id}-clip)` }, g);
  highlight(clipped);
  svgEl('path', { d: SOCK_PATH, class: 'sock-line' }, g);
}

function instepSole(svg, t) {
  /* Two drawings: the sock from the side, and a slice through the foot showing the two halves. */
  sockFigure(svg, (g) => {
    svgEl('rect', { x: 232, y: 290, width: 180, height: 58, class: 'part-a' }, g);
    svgEl('rect', { x: 232, y: 348, width: 180, height: 60, class: 'part-b' }, g);
  });
  const cx = 160, cy = 54, rx = 30, ry = 24;
  svgEl('path', { d: `M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy} Z`, class: 'part-a' }, svg);
  svgEl('path', { d: `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} Z`, class: 'part-b' }, svg);
  svgEl('ellipse', { cx, cy, rx, ry, class: 'sock-line thin' }, svg);
  label(svg, cx, 22, t.instep);
  label(svg, cx, 96, t.sole);
}

function gusset(svg) {
  sockFigure(svg, (g) => {
    svgEl('polygon', { points: '232,215 330,215 330,410 232,410', class: 'part-a' }, g);
  });
}

/* A decrease: two stitches of the round below become one, leaning right (k2tog) or left (ssk). */
function decrease(svg, lean) {
  const g = grid(svg, { cx: W / 2, cy: 62, cols: 6, rows: 3, dx: 22, dy: 20 }, (s, x, y, c, r) => {
    if (r === 0 && (c === 2 || c === 3)) return;
    knitStitch(s, x, y, r === 1 && (c === 2 || c === 3) ? 'st hi' : 'st soft', 7);
  });
  /* The new stitch sits over the two it was made from, tilted towards the side it leans to. */
  const x = g.x0 + 2.5 * g.dx;
  const y = g.y0 + 2;
  const tilt = lean === 'right' ? 24 : -24;
  const stitch = svgEl('g', { transform: `rotate(${tilt} ${x} ${y})` }, svg);
  knitStitch(stitch, x, y - 2, 'st hi strong', 8);
}

function shortRows(svg) {
  const widths = [11, 9, 7, 5, 7, 9, 11];
  const cell = 12;
  widths.forEach((w, i) => {
    const y = 10 + i * 15;
    const x = W / 2 - (w * cell) / 2;
    svgEl('rect', { x, y, width: w * cell, height: 10, rx: 3, class: 'bar' }, svg);
    if (w < 11) {
      [x + cell / 2, x + w * cell - cell / 2].forEach((cx) => svgEl('circle', { cx, cy: y + 5, r: 3, class: 'dot' }, svg));
    }
  });
}

function kitchener(svg) {
  /* Two pieces of knitting, one above the other. The yarn goes back and forth between their open stitches
     and makes a new row (on the left, already sewn), so the seam looks like ordinary knitting. */
  const xs = Array.from({ length: 8 }, (_, i) => 30 + i * 20);
  [12, 28, 92, 108].forEach((y) => xs.forEach((x) => knitStitch(svg, x, y, 'st soft')));
  xs.slice(0, 4).forEach((x) => knitStitch(svg, x, 60, 'st hi'));
  /* The open stitches waiting to be sewn. */
  xs.slice(4).forEach((x) => {
    svgEl('path', { d: `M${x - 6} 40 Q${x} 50 ${x + 6} 40`, class: 'st' }, svg);
    svgEl('path', { d: `M${x - 6} 80 Q${x} 70 ${x + 6} 80`, class: 'st' }, svg);
  });
  let d = `M${xs[3] + 6} 54`;
  xs.slice(4, 7).forEach((x) => { d += ` L${x} 46 L${x + 10} 74`; });
  svgEl('path', { d, class: 'yarn thin' }, svg);
  const end = xs[6] + 10;
  svgEl('line', { x1: end, y1: 74, x2: end + 26, y2: 50, class: 'needle hi-needle' }, svg);
}

const FIGURES = {
  knit, purl, stockinette, ribbing, 'round-row': roundRow, gauge,
  dpns, marker, 'instep-sole': instepSole, gusset,
  k2tog: (svg) => decrease(svg, 'right'), ssk: (svg) => decrease(svg, 'left'),
  'short-rows': shortRows, kitchener,
};

export const hasFigure = (id) => id in FIGURES;
export const FIGURE_IDS = Object.keys(FIGURES);

/* The picture for a term, or null when it has none. labels: the term's `fig` texts. */
export function buildTermFigure(id, labels = {}) {
  if (!hasFigure(id)) return null;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'term-fig', 'aria-hidden': 'true', focusable: 'false' });
  FIGURES[id](svg, labels);
  return svg;
}
