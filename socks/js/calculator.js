/* How many stitches to cast on. */

/* The sock is knit 10% narrower than the foot, so it hugs. */
const EASE = 0.9;

/* The cast-on has to fit the ribbing pattern: 2x2 repeats every 4 stitches, 1x1 every 2. */
export const RIBBING_REPEAT = { '2x2': 4, '1x1': 2 };
export const DEFAULT_RIBBING = '2x2';

export function stitchCount(circumferenceCm, gaugePer10cm, ribbing = DEFAULT_RIBBING) {
  const repeat = RIBBING_REPEAT[ribbing];
  const stitches = circumferenceCm * (gaugePer10cm / 10) * EASE;
  return Math.max(Math.round(stitches / repeat) * repeat, repeat);
}
