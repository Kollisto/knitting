/* Facts shared by the page and its tests. */

/* The steps, in the order they are knit. Also the order of the sock's parts and of the chips. */
export const STEP_IDS = ['cuff', 'leg', 'heel', 'gusset', 'toe', 'finish'];

export const LANGUAGES = ['en', 'ru'];
export const DEFAULT_LANGUAGE = 'en';

/* The glossary: its groups and their terms, in the order they are shown.
   The texts live in content/<lang>.json under glossary.terms; the pictures in js/glossary-figures.js. */
export const GLOSSARY = {
  basics: ['knit', 'purl', 'stockinette', 'ribbing', 'round-row', 'gauge'],
  tools: ['dpns', 'marker', 'hold', 'tapestry-needle'],
  parts: ['instep-sole', 'gusset'],
  techniques: ['cast-on', 'k2tog', 'ssk', 'short-rows', 'kitchener', 'bind-off', 'weave-in', 'blocking'],
};
export const TERM_IDS = Object.values(GLOSSARY).flat();
