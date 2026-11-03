import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shorteningRows, lengtheningRows, SIDE, CENTRE, STITCHES } from '../js/heel-figure.js';

const width = (row) => row.last - row.first + 1;

test('the heel is split into two sides and a centre', () => {
  assert.equal(STITCHES, 2 * SIDE + CENTRE);
});

test('the heel starts with two full rows', () => {
  const [a, b] = shorteningRows();
  assert.equal(width(a), STITCHES);
  assert.equal(width(b), STITCHES);
});

test('the rows get shorter until only the centre is left', () => {
  const rows = shorteningRows();
  const last = rows[rows.length - 1];
  assert.deepEqual([last.first, last.last], [SIDE + 1, SIDE + CENTRE]);
  rows.slice(1).forEach((row, i) => assert.ok(width(row) <= width(rows[i]), `row ${i + 1} is not longer than the row before`));
});

test('the turning stitch is always at an end of its row', () => {
  [...shorteningRows(), ...lengtheningRows()].forEach((row) => {
    assert.ok(row.turn === row.first || row.turn === row.last);
  });
});

test('the rows get longer again, up to the full width', () => {
  const rows = lengtheningRows();
  assert.equal(width(rows[0]), CENTRE + 1);
  rows.slice(1).forEach((row, i) => assert.ok(width(row) >= width(rows[i])));
  assert.equal(width(rows[rows.length - 1]), STITCHES - 1);
});
