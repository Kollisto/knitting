/* Small DOM helpers. */

export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => Array.from(document.querySelectorAll(selector));

/* A new element with an optional class and text. */
export function element(tag, className, content) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (content != null) e.textContent = content;
  return e;
}
