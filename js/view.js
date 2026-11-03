/* Everything that puts words on the page. Nothing here decides which step is open; callers pass it in. */
import { STEP_IDS } from './constants.js';
import { $, $$, element } from './dom.js';
import { currentLanguage, text, ui, stepText } from './i18n.js';
import { buildHeelFigure } from './heel-figure.js';

const chips = $('#chips');
const stepContent = $('#pcontent');
const pager = $('#ppager');
const sockParts = $$('#sock .part');
const languageButtons = $$('[data-lang]');

const START = 'start';                    /* the "Before you start" page, next to the step ids in the URL hash */
const stepNumber = (id) => STEP_IDS.indexOf(id) + 1;

/* One-time setup: a chip per step, and the numbers on the sock. */
export function buildStepChips() {
  STEP_IDS.forEach((id, i) => {
    const chip = element('button', 'chip');
    chip.type = 'button';
    chip.dataset.go = id;
    chip.append(element('span', 'n', i + 1), element('span', 'lbl'));
    chips.appendChild(chip);
  });
  $$('#sock .badge').forEach((badge) => {
    badge.querySelector('text').textContent = stepNumber(badge.dataset.id);
  });
}

/* Everything written in index.html (data-i18n, data-i18n-aria) plus the sock's part labels. */
export function renderStaticTexts() {
  document.documentElement.lang = currentLanguage();
  document.title = ui('docTitle');
  $$('[data-i18n]').forEach((e) => { e.textContent = text(e.dataset.i18n); });
  $$('[data-i18n-aria]').forEach((e) => e.setAttribute('aria-label', text(e.dataset.i18nAria)));
  sockParts.forEach((part) => {
    const id = part.dataset.id;
    part.setAttribute('aria-label', `${ui('part')} ${stepNumber(id)}, ${stepText(id).name}`);
  });
  languageButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === currentLanguage())));
}

export function renderChips(currentStep) {
  Array.from(chips.children).forEach((chip) => {
    chip.lastChild.textContent = stepText(chip.dataset.go).chip;
    if (chip.dataset.go === currentStep) chip.setAttribute('aria-current', 'step');
    else chip.removeAttribute('aria-current');
  });
}

function itemList(tag, className, items) {
  const list = element(tag, className);
  items.forEach((item) => list.appendChild(element('li', null, item)));
  return list;
}

function videoBlock(step) {
  const block = element('div', 'media');
  block.appendChild(element('p', 'media-title', ui('mediaTitle')));
  if (/^https?:\/\//i.test(step.video ?? '')) {
    const link = element('a', 'btn primary', ui('watchVideo'));
    link.href = step.video;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    block.appendChild(link);
  } else {
    const soon = element('span', 'btn ghost', ui('soon'));
    soon.setAttribute('aria-disabled', 'true');
    block.append(element('p', 'media-note', ui('mediaNote')), soon);
  }
  return block;
}

function heelFigure() {
  return buildHeelFigure({
    right: ui('right'), centre: ui('centre'), left: ui('left'),
    start: ui('start'), end: ui('end'),
    shorten: ui('shorten'), round: ui('round'), lengthen: ui('lengthen'),
    aria: ui('figAria'), caption: ui('figCaption'),
  });
}

export function renderStep(id) {
  const step = stepText(id);
  const eyebrow = ui('stepOf').replace('{n}', stepNumber(id)).replace('{m}', STEP_IDS.length) + step.kind;

  stepContent.replaceChildren(
    element('p', 'eyebrow', eyebrow),
    element('h2', null, step.name),
    element('p', 'lead', step.what),
  );
  if (id === 'heel') stepContent.appendChild(heelFigure());
  stepContent.append(
    element('h3', null, ui('howLabel')),
    itemList('ol', 'how', step.how),
    element('h3', null, step.watchLabel),
    itemList('ul', 'watch', step.watch),
    videoBlock(step),
  );
}

export function renderPager(id) {
  const index = STEP_IDS.indexOf(id);
  const previous = STEP_IDS[index - 1];
  const next = STEP_IDS[index + 1];

  const button = (className, label, target) => {
    const b = element('button', className, label);
    b.type = 'button';
    b.dataset.go = target;
    return b;
  };
  pager.replaceChildren(
    button('btn', ui('back') + (previous ? stepText(previous).name : ui('beforeStart')), previous ?? START),
  );
  if (next) pager.appendChild(button('btn primary', ui('next') + stepText(next).name, next));
}

export function showLoadError() {
  stepContent.textContent = 'Could not load the page texts. Please reload.';
}
