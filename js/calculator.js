/* How many stitches to cast on. */

/* The sock is knit 10% narrower than the foot, so it hugs. */
const EASE = 0.9;
/* 2x2 ribbing needs a multiple of 4. */
const ROUND_TO = 4;

export function stitchCount(circumferenceCm, gaugePer10cm) {
  const stitches = circumferenceCm * (gaugePer10cm / 10) * EASE;
  return Math.max(Math.round(stitches / ROUND_TO) * ROUND_TO, ROUND_TO);
}
