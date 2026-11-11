/* Sock Map: routing (the URL hash is the page), events, and start-up. */
import { STEP_IDS, TERM_IDS } from './constants.js';
import { $, $$ } from './dom.js';
import { loadTexts, switchLanguage } from './i18n.js';
import {
  buildStepChips, renderStaticTexts, renderChips, renderStep, renderPager, renderGlossary, renderTermDialog, showLoadError,
} from './view.js';
import { stitchCount } from './calculator.js';

const FIRST_STEP = STEP_IDS[0];
const START = 'start';
const GLOSSARY = 'glossary';              /* #glossary, or #glossary/<term> to open at that term */
const PHONE_LAYOUT = '(max-width: 819px)';

const views = { start: $('#view-start'), sock: $('#view-sock'), glossary: $('#view-glossary') };
const tabs = { start: $('#tab-start'), sock: $('#tab-sock'), glossary: $('#tab-glossary') };
const panel = $('#panel');
const sock = $('#sock');
const sockParts = $$('#sock .part');
const dialog = $('#term-dialog');

let currentStep = FIRST_STEP;
let currentTerm = null;                   /* the term shown in the dialog */
let scrollToContent = false;

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- routing ---------- */

function go(target) {
  scrollToContent = true;
  if (location.hash === `#${target}`) route();
  else location.hash = target;
}

function showView(name) {
  Object.entries(views).forEach(([key, view]) => { view.hidden = key !== name; });
  Object.entries(tabs).forEach(([key, tab]) => tab.setAttribute('aria-selected', String(key === name)));
}

function showStep(id) {
  currentStep = id;
  showView('sock');
  sock.classList.toggle('all', id === 'finish');
  sockParts.forEach((part) => part.setAttribute('aria-pressed', String(part.dataset.id === id)));
  renderChips(id);
  renderStep(id);
  renderPager(id);
}

/* Opens the glossary; with a term, scrolls to its card and marks it for a moment. */
function showGlossary(term) {
  showView('glossary');
  const card = term && $(`#term-${term}`);
  if (!card) return;
  scrollToContent = false;
  card.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' });
  card.focus({ preventScroll: true });
  card.classList.remove('flash');
  void card.offsetWidth;                  /* restart the animation when the same card is opened twice */
  card.classList.add('flash');
}

/* On phones the content is below the sock, so bring it into view after a tap. */
function scrollIntoViewOnPhones() {
  if (!scrollToContent) return;
  scrollToContent = false;
  if (!matchMedia(PHONE_LAYOUT).matches) return;
  const target = views.sock.hidden ? (views.start.hidden ? views.glossary : views.start) : panel;
  target.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
}

function route() {
  const hash = location.hash.slice(1);
  if (dialog.open) dialog.close();
  /* A step's address opens that step, the glossary's opens the glossary.
     Anything else, including no address, opens "Before you start". */
  if (STEP_IDS.includes(hash)) showStep(hash);
  else if (hash === GLOSSARY || hash.startsWith(`${GLOSSARY}/`)) showGlossary(hash.slice(GLOSSARY.length + 1));
  else showView(START);
  scrollIntoViewOnPhones();
}

/* ---------- glossary words in the texts ---------- */

function openTerm(id) {
  if (!TERM_IDS.includes(id)) return;
  currentTerm = id;
  renderTermDialog(id);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

dialog.addEventListener('close', () => { currentTerm = null; });
/* A click on the dimmed background outside the box closes it too. */
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
$('#term-dialog-close').addEventListener('click', () => dialog.close());

/* ---------- events ---------- */

document.addEventListener('click', (e) => {
  const term = e.target.closest('[data-term]');
  if (term) {
    e.preventDefault();
    openTerm(term.dataset.term);
    return;
  }
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
tabs.start.addEventListener('click', () => go(START));
tabs.sock.addEventListener('click', () => go(currentStep));
tabs.glossary.addEventListener('click', () => go(GLOSSARY));
window.addEventListener('hashchange', route);

$$('[data-lang]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!switchLanguage(button.dataset.lang)) return;
    renderStaticTexts();
    renderChips(currentStep);
    renderStep(currentStep);
    renderPager(currentStep);
    renderGlossary();
    if (currentTerm) renderTermDialog(currentTerm);
  });
});

/* ---------- stitch calculator ---------- */

const circumference = $('#circ');
const gauge = $('#gauge');
const ribbing = $('#ribbing');
const castOn = $('#cast');

function renderCastOn() {
  const c = parseFloat(circumference.value);
  const g = parseFloat(gauge.value);
  castOn.textContent = c > 0 && g > 0 ? String(stitchCount(c, g, ribbing.value)) : '–';
}
circumference.addEventListener('input', renderCastOn);
gauge.addEventListener('input', renderCastOn);
ribbing.addEventListener('change', renderCastOn);
renderCastOn();

/* ---------- start ---------- */

try {
  await loadTexts();
  buildStepChips();
  renderStaticTexts();
  renderGlossary();
  route();
} catch {
  showLoadError();
}
