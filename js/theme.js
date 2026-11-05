/* Light / dark switch. With no choice made the page follows the device; the first click picks the opposite theme. */
import { $ } from './dom.js';
import { ui } from './i18n.js';

const THEME_STORAGE_KEY = 'sockmap-theme';     /* also written in theme-init.js */
const deviceIsDark = matchMedia('(prefers-color-scheme: dark)');
const button = $('#theme-toggle');

const isDark = () => {
  const chosen = document.documentElement.dataset.theme;
  return chosen ? chosen === 'dark' : deviceIsDark.matches;
};

/* The button shows the theme you would switch to, and says so for screen readers. */
export function renderThemeButton() {
  const dark = isDark();
  button.textContent = dark ? '\u2600' : '\u263E';
  button.setAttribute('aria-label', ui(dark ? 'themeToLight' : 'themeToDark'));
}

function toggleTheme() {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* not essential */ }
  renderThemeButton();
}

button.addEventListener('click', toggleTheme);
deviceIsDark.addEventListener('change', renderThemeButton);
