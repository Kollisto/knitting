import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stitchCount } from '../js/calculator.js';

test('2x2 ribbing rounds to a multiple of 4', () => {
  assert.equal(stitchCount(22, 32, '2x2'), 64);
  assert.equal(stitchCount(22, 31, '2x2'), 60);   /* 61.4 stitches */
});

test('1x1 ribbing rounds to an even number', () => {
  assert.equal(stitchCount(22, 31, '1x1'), 62);
  assert.equal(stitchCount(22, 32, '1x1'), 64);
});

test('2x2 is the default', () => {
  assert.equal(stitchCount(22, 31), stitchCount(22, 31, '2x2'));
});

test('never returns less than one repeat', () => {
  assert.equal(stitchCount(1, 1, '2x2'), 4);
  assert.equal(stitchCount(1, 1, '1x1'), 2);
});
