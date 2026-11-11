/* Everything that puts words on the page. Nothing here decides which step is open; callers pass it in. */
import { STEP_IDS, GLOSSARY } from './constants.js';
import { $, $$, element } from './dom.js';
import { currentLanguage, text, ui, stepText, termText } from './i18n.js';
import { buildHeelFigure } from './heel-figure.js';
import { buildTermFigure } from './glossary-figures.js';
import { splitTerms } from './term-markup.js';
import { renderThemeButton } from './theme.js';

const chips = $('#chips');
const stepContent = $('#pcontent');
const pager = $('#ppager');
const sockParts = $$('#sock .part');
const languageButtons = $$('[data-lang]');
const glossaryGroups = $('#glossary-groups');
const termDialog = {
  figure: $('#term-dialog-figure'),
  title: $('#term-dialog-title'),
  text: $('#term-dialog-text'),
  open: $('#term-dialog-open'),
};

const START = 'start';                    /* the "Before you start" page, next to the step ids in the URL hash */
const stepNumber = (id) => STEP_IDS.indexOf(id) + 1;

/* A glossary word inside a text. It is a link to the glossary, so it still leads somewhere without
   JavaScript; app.js opens the short explanation in a dialog instead. Links wrap across lines, buttons do not. */
function termLink(id, label) {
  const link = element('a', 'term', label);
  link.href = `#glossary/${id}`;
  link.dataset.term = id;
  link.setAttribute('aria-haspopup', 'dialog');
  return link;
}

/* Puts a text with [[term|words]] markup into an element. */
function fillText(target, source) {
  target.replaceChildren(...splitTerms(source).map((piece) => (typeof piece === 'string' ? piece : termLink(piece.term, piece.label))));
  return target;
}
const richElement = (tag, className, source) => fillText(element(tag, className), source);

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
  $$('[data-i18n]').forEach((e) => fillText(e, text(e.dataset.i18n)));
  $$('[data-i18n-aria]').forEach((e) => e.setAttribute('aria-label', text(e.dataset.i18nAria)));
  sockParts.forEach((part) => {
    const id = part.dataset.id;
    part.setAttribute('aria-label', `${ui('part')} ${stepNumber(id)}, ${stepText(id).name}`);
  });
  languageButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === currentLanguage())));
  renderThemeButton();
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
  /* The text goes in a span: .how items are a grid, and every glossary link would otherwise get a cell of its own. */
  items.forEach((item) => list.appendChild(element('li')).appendChild(richElement('span', null, item)));
  return list;
}

/* A tinted block with a heading; the class says which tint. */
function block(className, heading, content) {
  const section = element('section', `block ${className}`);
  section.append(element('h3', null, heading), content);
  return section;
}

// Shown only when the step has a video link; without one there is nothing to show.
function videoBlock(step) {
  if (!/^https?:\/\//i.test(step.video ?? '')) return null;
  const section = element('section', 'block block-video media');
  const link = element('a', 'btn primary', ui('watchVideo'));
  link.href = step.video;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  section.append(element('h3', null, ui('mediaTitle')), link);
  return section;
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
    richElement('p', 'lead', step.what),
  );
  if (id === 'heel') stepContent.appendChild(heelFigure());
  stepContent.append(
    block('block-how', ui('howLabel'), itemList('ol', 'how', step.how)),
    block('block-watch', step.watchLabel, itemList('ul', 'watch', step.watch)),
    ...[videoBlock(step)].filter(Boolean),
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

/* The glossary page: a heading per group, then a card per term, with its picture when it has one. */
export function renderGlossary() {
  glossaryGroups.replaceChildren(...Object.entries(GLOSSARY).map(([group, ids]) => {
    const section = element('section', 'glossary-group');
    const cards = element('div', 'term-cards');
    ids.forEach((id) => {
      const term = termText(id);
      const card = element('article', 'term-card');
      card.id = `term-${id}`;
      card.tabIndex = -1;
      const figure = buildTermFigure(id, term.fig);
      if (figure) {
        const box = element('div', 'term-fig-box');
        box.appendChild(figure);
        card.appendChild(box);
      }
      card.append(element('h3', null, term.name), richElement('p', null, term.text));
      cards.appendChild(card);
    });
    section.append(element('h2', null, text(`glossary.groups.${group}`)), cards);
    return section;
  }));
}

/* The short explanation that opens when a glossary word in a text is tapped. */
export function renderTermDialog(id) {
  const term = termText(id);
  const figure = buildTermFigure(id, term.fig);
  termDialog.figure.replaceChildren(...[figure].filter(Boolean));
  termDialog.figure.hidden = !figure;
  termDialog.title.textContent = term.name;
  fillText(termDialog.text, term.text);
  termDialog.open.dataset.go = `glossary/${id}`;
}

export function showLoadError() {
  stepContent.textContent = 'Could not load the page texts. Please reload.';
}
