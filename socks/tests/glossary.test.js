import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GLOSSARY, TERM_IDS, LANGUAGES } from '../js/constants.js';
import { splitTerms, plainText, linkedTerms } from '../js/term-markup.js';
import { FIGURE_IDS } from '../js/glossary-figures.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const content = Object.fromEntries(LANGUAGES.map((lang) => [lang, JSON.parse(read(`content/${lang}.json`))]));

/* Every string in a content file, however deep. */
const strings = (value) => (typeof value === 'string' ? [value] : Object.values(value ?? {}).flatMap(strings));

/* The pictures' labels are read from the source, as t.<label>. */
const figureSource = read('js/glossary-figures.js');

test('term markup is split into plain text and terms', () => {
  assert.deepEqual(splitTerms('Knit [[k2tog|two together]], then [[ssk|SSK]].'), [
    'Knit ', { term: 'k2tog', label: 'two together' }, ', then ', { term: 'ssk', label: 'SSK' }, '.',
  ]);
  assert.deepEqual(splitTerms('No terms here.'), ['No terms here.']);
  assert.equal(plainText('Knit [[k2tog|two together]].'), 'Knit two together.');
});

test('every term appears in the glossary once', () => {
  assert.equal(new Set(TERM_IDS).size, TERM_IDS.length);
});

test('every term and group has its texts in every language', () => {
  LANGUAGES.forEach((lang) => {
    const glossary = content[lang].glossary;
    assert.deepEqual(Object.keys(glossary.groups), Object.keys(GLOSSARY), lang);
    assert.deepEqual(Object.keys(glossary.terms).sort(), [...TERM_IDS].sort(), lang);
    TERM_IDS.forEach((id) => {
      assert.ok(glossary.terms[id].name?.trim(), `${lang} ${id}.name`);
      assert.ok(glossary.terms[id].text?.trim(), `${lang} ${id}.text`);
    });
  });
});

test('every glossary link in the texts points to a term', () => {
  LANGUAGES.forEach((lang) => {
    const all = strings(content[lang]);
    all.forEach((s) => linkedTerms(s).forEach((id) => assert.ok(TERM_IDS.includes(id), `${lang}: unknown term "${id}" in "${s}"`)));
    /* A half-written link would show its brackets on the page. */
    all.forEach((s) => assert.ok(!plainText(s).includes('[[') && !plainText(s).includes(']]'), `${lang}: broken link in "${s}"`));
  });
});

test('every picture belongs to a term, and its labels exist', () => {
  assert.ok(FIGURE_IDS.length > 0);
  FIGURE_IDS.forEach((id) => assert.ok(TERM_IDS.includes(id), `picture for unknown term "${id}"`));
  const labelsUsed = [...figureSource.matchAll(/\bt\.(\w+)/g)].map((m) => m[1]);
  const labelsGiven = new Set(LANGUAGES.flatMap((lang) => TERM_IDS.flatMap((id) => Object.keys(content[lang].glossary.terms[id].fig ?? {}))));
  labelsUsed.forEach((key) => assert.ok(labelsGiven.has(key), `picture label "${key}" is not in the texts`));
});
