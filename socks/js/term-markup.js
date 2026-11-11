/* Glossary links inside the texts. In content/<lang>.json a term is written as [[term-id|the words shown]].
   This module only splits a string into plain pieces and term pieces; view.js turns them into elements. */

const TERM = /\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g;

/* 'Knit [[k2tog|two together]].' -> ['Knit ', { term: 'k2tog', label: 'two together' }, '.'] */
export function splitTerms(source) {
  const pieces = [];
  let last = 0;
  for (const match of source.matchAll(TERM)) {
    if (match.index > last) pieces.push(source.slice(last, match.index));
    pieces.push({ term: match[1], label: match[2] });
    last = match.index + match[0].length;
  }
  if (last < source.length) pieces.push(source.slice(last));
  return pieces;
}

/* The words as a reader sees them, without the markup. */
export const plainText = (source) => source.replace(TERM, '$2');

/* Every term id a string links to. */
export const linkedTerms = (source) => [...source.matchAll(TERM)].map((m) => m[1]);
