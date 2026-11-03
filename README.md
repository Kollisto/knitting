# Sock Map

An interactive beginner's guide to knitting a sock top-down on five double-pointed needles.
Pick a part of the sock and read how to knit it. English and Russian.

## Structure

```
index.html            the page: markup only, no words
style.css             all styles (light and dark theme)
js/app.js             draws the page, routing (URL hash), language switch
js/heel-figure.js     the heel schematic (an SVG built from a model of the rows)
js/calculator.js      how many stitches to cast on
content/en.json       every word on the page, English
content/ru.json       every word on the page, Russian
```

## Changing the texts

Edit `content/en.json` and `content/ru.json`. Both files have the same structure:

- `page`: the "Before you start" page
- `steps`: one entry per step (`name`, `chip`, `kind`, `what`, `how`, `watchLabel`, `watch`, and an optional `video` link)
- `ui`: buttons, labels and the heel figure's texts

To add a video to a step, add `"video": "https://…"` to that step in each language file.

## Adding a language

Copy `content/en.json` to `content/<code>.json`, translate it, add the code to `LANGUAGES` in `js/app.js`
and add a button with `data-lang="<code>"` next to the others in `index.html`.

## Running locally

The page loads its texts with `fetch`, so open it through a web server, not by double-clicking the file:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publishing

GitHub Pages serves the `main` branch. Work happens in `develop` and is merged into `main`.
