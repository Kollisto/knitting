# Sock Map

An interactive beginner's guide to knitting a sock top-down on five double-pointed needles.
Pick a part of the sock and read how to knit it. English and Russian.

## Structure

```
index.html              the page: markup only, no words
css/                    styles, one file per part of the page
  theme.css             colours and fonts (light and dark)
  base.css              reset, buttons
  header.css            title, language switch, tabs
  sock.css              the sock drawing and the step chips
  panel.css             the step text, lists, video box, pager
  start.css             "Before you start" and the stitch calculator
  heel-figure.css       the heel schematic
js/                     the code, as ES modules
  app.js                routing (the URL hash is the page), events, start-up
  view.js               puts texts and steps on the page
  i18n.js               loads content/*.json and knows the current language
  heel-figure.js        the heel schematic, built from a model of the rows
  calculator.js         how many stitches to cast on (2x2 or 1x1 ribbing)
  constants.js          the step order and the languages
  dom.js                small DOM helpers
content/                every word on the page
  en.json
  ru.json
tests/                  checks for the calculator, the heel rows and the texts
```

## Changing the texts

Edit `content/en.json` and `content/ru.json`. Both files have the same keys. Each language can have its own number of steps and notes in a list, because the texts are written for the language, not translated word for word:

- `page`: the "Before you start" page
- `steps`: one entry per step (`name`, `chip`, `kind`, `what`, `how`, `watchLabel`, `watch`, and an optional `video` link)
- `ui`: buttons, labels and the heel figure's texts

To add a video to a step, add `"video": "https://…"` to that step in each language file.

## Adding a language

Copy `content/en.json` to `content/<code>.json`, translate it, add the code to `LANGUAGES` in `js/constants.js`
and add a button with `data-lang="<code>"` next to the others in `index.html`.

## Running locally

The page loads its texts with `fetch`, so open it through a web server, not by double-clicking the file:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Tests

```
npm test
```

They check that English and Russian have the same structure, that every text the page asks for exists, and that the calculator and the heel rows behave.

## Publishing

GitHub Pages serves the `main` branch. Work happens in `develop` and is merged into `main`.
