import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { STEP_IDS, LANGUAGES } from '../js/constants.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const content = Object.fromEntries(LANGUAGES.map((lang) => [lang, JSON.parse(read(`content/${lang}.json`))]));
const html = read('index.html');

/* Every key path, with the length of every list, so that two languages can be compared. */
function shape(value, path = '') {
  if (Array.isArray(value)) return [`${path}[${value.length}]`];
  if (value && typeof value === 'object') return Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).flatMap(([k, v]) => shape(v, `${path}/${k}`));
  return [path];
}

test('every language has exactly the same structure as English', () => {
  LANGUAGES.forEach((lang) => assert.deepEqual(shape(content[lang]), shape(content.en), lang));
});

test('every step has all its texts', () => {
  LANGUAGES.forEach((lang) => {
    assert.deepEqual(Object.keys(content[lang].steps), STEP_IDS, lang);
    STEP_IDS.forEach((id) => {
      const step = content[lang].steps[id];
      ['name', 'chip', 'kind', 'what', 'watchLabel'].forEach((k) => assert.ok(step[k], `${lang} ${id}.${k}`));
      assert.ok(step.how.length > 0 && step.watch.length > 0, `${lang} ${id} lists`);
      [...step.how, ...step.watch].forEach((item) => assert.ok(item.trim(), `${lang} ${id} has an empty item`));
    });
  });
});

test('every text the HTML asks for exists in every language', () => {
  const keys = [...html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length > 20);
  LANGUAGES.forEach((lang) => {
    keys.forEach((key) => {
      const value = key.split('.').reduce((o, k) => o?.[k], content[lang]);
      assert.equal(typeof value, 'string', `${lang}: ${key}`);
    });
  });
});

test('the sock has one part and one badge per step except the last', () => {
  const ids = (selector) => [...html.matchAll(selector)].map((m) => m[1]);
  const expected = STEP_IDS.filter((id) => id !== 'finish').sort();
  assert.deepEqual(ids(/class="part" data-id="(\w+)"/g).sort(), expected);
  assert.deepEqual(ids(/class="badge" data-id="(\w+)"/g).sort(), expected);
});
