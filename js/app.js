/* Sock Map. All the words live in content/<lang>.json. This file draws the page and wires it up. */
import { buildHeelFigure } from './heel-figure.js';
import { stitchCount } from './calculator.js';

const STEP_IDS = ['cuff', 'leg', 'heel', 'gusset', 'toe', 'finish'];
const LANGUAGES = ['en', 'ru'];
const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_STORAGE_KEY = 'sockmap-lang';
const FIRST_STEP = STEP_IDS[0];
const START = 'start';                    /* the "Before you start" page, next to the step ids in the URL hash */
const PHONE_LAYOUT = '(max-width: 819px)';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const startView = $('#view-start');
const sockView = $('#view-sock');
const startTab = $('#tab-start');
const sockTab = $('#tab-sock');
const panel = $('#panel');
const stepContent = $('#pcontent');
const pager = $('#ppager');
const sock = $('#sock');
const chips = $('#chips');
const sockParts = $$('#sock .part');
const languageButtons = $$('[data-lang]');

const texts = {};                         /* language -> parsed content/<lang>.json */
let language = DEFAULT_LANGUAGE;
let currentStep = FIRST_STEP;
let scrollToContent = false;

/* ---------- texts ---------- */

const dig = (object, path) => path.split('.').reduce((o, key) => (o == null ? o : o[key]), object);
const text = (path) => dig(texts[language], path) ?? dig(texts[DEFAULT_LANGUAGE], path);
const ui = (key) => text(`ui.${key}`);
const stepText = (id) => text(`steps.${id}`);

function element(tag, className, content) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (content != null) e.textContent = content;
  return e;
}

function readSavedLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;              /* storage can be blocked */
  }
}

function saveLanguage() {
  try { localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* not essential */ }
}

/* Everything that is in index.html (data-i18n, data-i18n-aria) plus the sock's part labels. */
function renderStaticTexts() {
  document.documentElement.lang = language;
  document.title = ui('docTitle');
  $$('[data-i18n]').forEach((e) => { e.textContent = text(e.dataset.i18n); });
  $$('[data-i18n-aria]').forEach((e) => e.setAttribute('aria-label', text(e.dataset.i18nAria)));
  sockParts.forEach((part) => {
    const id = part.dataset.id;
    part.setAttribute('aria-label', `${ui('part')} ${STEP_IDS.indexOf(id) + 1}, ${stepText(id).name}`);
  });
  languageButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === language)));
}

/* ---------- chips, step panel, pager ---------- */

STEP_IDS.forEach((id, i) => {
  const chip = element('button', 'chip');
  chip.type = 'button';
  chip.dataset.go = id;
  chip.append(element('span', 'n', i + 1), element('span', 'lbl'));
  chips.appendChild(chip);
});

function renderChips() {
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

function renderStep() {
  const step = stepText(currentStep);
  const number = STEP_IDS.indexOf(currentStep) + 1;
  const eyebrow = ui('stepOf').replace('{n}', number).replace('{m}', STEP_IDS.length) + step.kind;

  stepContent.replaceChildren(
    element('p', 'eyebrow', eyebrow),
    element('h2', null, step.name),
    element('p', 'lead', step.what),
  );
  if (currentStep === 'heel') {
    stepContent.appendChild(buildHeelFigure({
      right: ui('right'), centre: ui('centre'), left: ui('left'),
      start: ui('start'), end: ui('end'),
      shorten: ui('shorten'), round: ui('round'), lengthen: ui('lengthen'),
      aria: ui('figAria'), caption: ui('figCaption'),
    }));
  }
  stepContent.append(
    element('h3', null, ui('howLabel')),
    itemList('ol', 'how', step.how),
    element('h3', null, step.watchLabel),
    itemList('ul', 'watch', step.watch),
    videoBlock(step),
  );
}

function renderPager() {
  const index = STEP_IDS.indexOf(currentStep);
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

/* ---------- routing: the URL hash is the page ---------- */

function go(target) {
  scrollToContent = true;
  if (location.hash === `#${target}`) route();
  else location.hash = target;
}

function setActiveTab(onStart) {
  startView.hidden = !onStart;
  sockView.hidden = onStart;
  startTab.setAttribute('aria-selected', String(onStart));
  sockTab.setAttribute('aria-selected', String(!onStart));
}

function scrollIntoViewOnPhones() {
  if (!scrollToContent) return;
  scrollToContent = false;
  if (!matchMedia(PHONE_LAYOUT).matches) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  (startView.hidden ? panel : startView).scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
}

function route() {
  const hash = location.hash.slice(1);
  if (hash === START) {
    setActiveTab(true);
  } else {
    currentStep = STEP_IDS.includes(hash) ? hash : FIRST_STEP;
    setActiveTab(false);
    sock.classList.toggle('all', currentStep === 'finish');
    sockParts.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.id === currentStep)));
    renderChips();
    renderStep();
    renderPager();
  }
  scrollIntoViewOnPhones();
}

/* ---------- language ---------- */

function setLanguage(next) {
  if (next === language || !texts[next]) return;
  language = next;
  saveLanguage();
  renderStaticTexts();
  renderChips();
  renderStep();
  renderPager();
}

/* ---------- events ---------- */

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-go], [data-id]');
  if (target) go(target.dataset.go ?? target.dataset.id);
});
sockParts.forEach((part) => {
  part.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    go(part.dataset.id);
  });
});
startTab.addEventListener('click', () => go(START));
sockTab.addEventListener('click', () => go(currentStep));
window.addEventListener('hashchange', route);
languageButtons.forEach((b) => b.addEventListener('click', () => setLanguage(b.dataset.lang)));

/* ---------- stitch calculator ---------- */

const circumference = $('#circ');
const gauge = $('#gauge');
const castOn = $('#cast');

function renderCastOn() {
  const c = parseFloat(circumference.value);
  const g = parseFloat(gauge.value);
  castOn.textContent = c > 0 && g > 0 ? String(stitchCount(c, g)) : '–';
}
circumference.addEventListener('input', renderCastOn);
gauge.addEventListener('input', renderCastOn);
renderCastOn();

/* ---------- start ---------- */

async function loadTexts(lang) {
  const response = await fetch(`content/${lang}.json`);
  if (!response.ok) throw new Error(`content/${lang}.json: ${response.status}`);
  texts[lang] = await response.json();
}

try {
  await Promise.all(LANGUAGES.map(loadTexts));
  language = readSavedLanguage();
  renderStaticTexts();
  route();
} catch {
  stepContent.textContent = 'Could not load the page texts. Please reload.';
}
