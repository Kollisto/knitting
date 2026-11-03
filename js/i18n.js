/* The page's texts. They live in content/<lang>.json; this module loads them and says which language is on. */
import { LANGUAGES, DEFAULT_LANGUAGE } from './constants.js';

const STORAGE_KEY = 'sockmap-lang';

const texts = {};                         /* language -> parsed content/<lang>.json */
let language = DEFAULT_LANGUAGE;

function readSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;              /* storage can be blocked */
  }
}

async function loadLanguage(lang) {
  const response = await fetch(`content/${lang}.json`);
  if (!response.ok) throw new Error(`content/${lang}.json: ${response.status}`);
  texts[lang] = await response.json();
}

/* Loads every language, then switches to the one the visitor used last. */
export async function loadTexts() {
  await Promise.all(LANGUAGES.map(loadLanguage));
  language = readSavedLanguage();
}

export const currentLanguage = () => language;

/* Returns true if the language actually changed. */
export function switchLanguage(next) {
  if (next === language || !texts[next]) return false;
  language = next;
  try { localStorage.setItem(STORAGE_KEY, language); } catch { /* not essential */ }
  return true;
}

const dig = (object, path) => path.split('.').reduce((o, key) => (o == null ? o : o[key]), object);

/* text('page.title'), falling back to English when a key is missing in the current language. */
export const text = (path) => dig(texts[language], path) ?? dig(texts[DEFAULT_LANGUAGE], path);
export const ui = (key) => text(`ui.${key}`);
export const stepText = (id) => text(`steps.${id}`);
