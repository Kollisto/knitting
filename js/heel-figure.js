/* The heel schematic: one bar per row, one square per stitch.
   Stitches are numbered 1..15 from the right edge of the drawing, which is where the knitting starts.
   The heel is split 5 + 5 + 5 (right, centre, left). */

const SVG_NS = 'http://www.w3.org/2000/svg';

const SIDE = 5;
const CENTRE = 5;
const STITCHES = 2 * SIDE + CENTRE;

/* Geometry, in SVG units. */
const LABEL_COLUMN = 84;                  /* room on the left for the row-group labels */
const WIDTH = 576;
const CELL = WIDTH / STITCHES;
const ROW_HEIGHT = 14;
const ROW_PITCH = 17;
const GROUP_GAP = 8;
const ARROW_HEAD = { length: 14, half: 6 };

const SECTIONS = [
  { name: 'right', first: 1, last: SIDE, className: 'seg-r' },
  { name: 'centre', first: SIDE + 1, last: SIDE + CENTRE, className: 'seg-c' },
  { name: 'left', first: SIDE + CENTRE + 1, last: STITCHES, className: 'seg-l' },
];

/* x of the left edge of stitch q (stitch 1 is on the right). */
const stitchX = (q) => LABEL_COLUMN + (STITCHES - q) * CELL;

function svgEl(tag, attrs, parent) {
  const e = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([name, value]) => e.setAttribute(name, value));
  if (parent) parent.appendChild(e);
  return e;
}

/* The rows of the shortening half. Two full rows, then each row ends one stitch earlier than the last.
   Rows alternate between right side and wrong side, and the turning stitch is the one at the end of the row. */
function shorteningRows() {
  const spans = [{ first: 1, last: STITCHES }, { first: 1, last: STITCHES }];
  for (let k = 1; k <= SIDE; k++) {
    spans.push({ first: k, last: STITCHES - k }, { first: k + 1, last: STITCHES - k });
  }
  return spans.map((span, i) => ({ ...span, turn: i % 2 === 0 ? span.last : span.first }));
}

/* The lengthening half is the shortening half played backwards and mirrored,
   without the two full rows and the last row (that one is the full round). */
function lengtheningRows() {
  const mirrored = shorteningRows().slice(2, -1).reverse().map((row) => ({
    first: STITCHES + 1 - row.last,
    last: STITCHES + 1 - row.first,
  }));
  return mirrored.map((span, i) => ({ ...span, turn: i % 2 === 0 ? span.last : span.first }));
}

/* t: the figure's texts { right, centre, left, start, end, shorten, round, lengthen, aria, caption } */
export function buildHeelFigure(t) {
  const figure = document.createElement('figure');
  figure.className = 'heel-fig';
  const svg = svgEl('svg', { role: 'img', 'aria-label': t.aria });
  figure.appendChild(svg);

  let y = 58;

  const text = (x, yy, content, attrs) => {
    svgEl('text', { x, y: yy, ...attrs }, svg).textContent = content;
  };
  const sideLabel = (content, from, to) => text(0, (from + to) / 2 + 4, content, { class: 'fig-label' });

  /* The knitting runs from the right edge to the left edge, once at the start and once at the end. */
  function arrow(yy, label) {
    const tip = LABEL_COLUMN;
    svgEl('line', { x1: LABEL_COLUMN + WIDTH - 2, y1: yy, x2: tip + 10, y2: yy, class: 'arrow' }, svg);
    svgEl('polygon', {
      points: `${tip},${yy} ${tip + ARROW_HEAD.length},${yy - ARROW_HEAD.half} ${tip + ARROW_HEAD.length},${yy + ARROW_HEAD.half}`,
      class: 'arrow-head',
    }, svg);
    text(0, yy + 4, label, { class: 'fig-label' });
  }

  function sectionHeaders() {
    SECTIONS.forEach((s) => {
      const x = stitchX(s.last);
      const width = (s.last - s.first + 1) * CELL;
      text(x + width / 2, 36, `${t[s.name]} · ${s.last - s.first + 1}`, { 'text-anchor': 'middle' });
      svgEl('rect', { x: x + 1, y: 43, width: width - 2, height: 4, class: s.className }, svg);
    });
  }

  function row({ first, last, turn }) {
    SECTIONS.forEach((s) => {
      for (let q = Math.max(first, s.first); q <= Math.min(last, s.last); q++) {
        svgEl('rect', { x: stitchX(q) + 1, y, width: CELL - 2, height: ROW_HEIGHT, rx: 2, class: s.className }, svg);
      }
    });
    svgEl('circle', { cx: LABEL_COLUMN + (STITCHES - turn + 0.5) * CELL, cy: y + ROW_HEIGHT / 2, r: 3.5, class: 'ring' }, svg);
    y += ROW_PITCH;
  }

  function group(label, rows) {
    const top = y;
    rows.forEach(row);
    sideLabel(label, top, y);
  }

  arrow(12, t.start);
  sectionHeaders();

  group(t.shorten, shorteningRows());

  y += GROUP_GAP;
  const roundTop = y;
  svgEl('rect', { x: LABEL_COLUMN, y, width: WIDTH, height: ROW_HEIGHT, class: 'round-bar' }, svg);
  y += ROW_PITCH;
  sideLabel(t.round, roundTop, y);

  y += GROUP_GAP;
  group(t.lengthen, lengtheningRows());

  y += 6;
  arrow(y + 6, t.end);
  y += 12;

  svg.setAttribute('viewBox', `0 0 ${LABEL_COLUMN + WIDTH} ${y + 4}`);

  const caption = document.createElement('figcaption');
  caption.textContent = t.caption;
  figure.appendChild(caption);
  return figure;
}
