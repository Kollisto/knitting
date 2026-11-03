/* Sock Map: routing (the URL hash is the page), events, and start-up. */
import { STEP_IDS } from './constants.js';
import { $, $$ } from './dom.js';
import { loadTexts, switchLanguage } from './i18n.js';
import { buildStepChips, renderStaticTexts, renderChips, renderStep, renderPager, showLoadError } from './view.js';
import { stitchCount } from './calculator.js';

const FIRST_STEP = STEP_IDS[0];
const START = 'start';
const PHONE_LAYOUT = '(max-width: 819px)';

const startView = $('#view-start');
const sockView = $('#view-sock');
const startTab = $('#tab-start');
const sockTab = $('#tab-sock');
const panel = $('#panel');
const sock = $('#sock');
const sockParts = $$('#sock .part');

let currentStep = FIRST_STEP;
let scrollToContent = false;

/* ---------- routing ---------- */

function go(target) {
  scrollToContent = true;
  if (location.hash === `#${target}`) route();
  else location.hash = target;
}

function showTab(onStart) {
  startView.hidden = !onStart;
  sockView.hidden = onStart;
  startTab.setAttribute('aria-selected', String(onStart));
  sockTab.setAttribute('aria-selected', String(!onStart));
}

function showStep(id) {
  currentStep = id;
  showTab(false);
  sock.classList.toggle('all', id === 'finish');
  sockParts.forEach((part) => part.setAttribute('aria-pressed', String(part.dataset.id === id)));
  renderChips(id);
  renderStep(id);
  renderPager(id);
}

/* On phones the content is below the sock, so bring it into view after a tap. */
function scrollIntoViewOnPhones() {
  if (!scrollToContent) return;
  scrollToContent = false;
  if (!matchMedia(PHONE_LAYOUT).matches) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  (startView.hidden ? panel : startView).scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
}

function route() {
  const hash = location.hash.slice(1);
  if (hash === START) showTab(true);
  else showStep(STEP_IDS.includes(hash) ? hash : FIRST_STEP);
  scrollIntoViewOnPhones();
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

$$('[data-lang]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!switchLanguage(button.dataset.lang)) return;
    renderStaticTexts();
    renderChips(currentStep);
    renderStep(currentStep);
    renderPager(currentStep);
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
  route();
} catch {
  showLoadError();
}
