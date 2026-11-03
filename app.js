/* Sock Map. All the words live in content/en.json and content/ru.json; this file only draws and wires the page. */
(function () {
  'use strict';

  var ORDER = ['cuff', 'leg', 'heel', 'gusset', 'toe', 'finish'];
  var LANGS = ['en', 'ru'];
  var DATA = {};
  var LANG = 'en';
  var currentId = 'cuff';
  var scrollOnShow = false;

  var $ = function (sel) { return document.querySelector(sel); };
  var viewStart = $('#view-start'), viewSock = $('#view-sock');
  var tabStart = $('#tab-start'), tabSock = $('#tab-sock');
  var panel = $('#panel'), content = $('#pcontent'), pager = $('#ppager');
  var svg = $('#sock'), chips = $('#chips');
  var parts = Array.prototype.slice.call(svg.querySelectorAll('.part'));
  var langBtns = Array.prototype.slice.call(document.querySelectorAll('[data-lang]'));

  /* ---------- text lookup ---------- */
  function dig(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function get(path) {
    var v = dig(DATA[LANG], path);
    return v != null ? v : dig(DATA.en, path);
  }
  function ui(key) { return get('ui.' + key); }
  function step(id) { return get('steps.' + id); }

  function mk(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- static texts ---------- */
  function applyStatic() {
    document.documentElement.lang = LANG;
    document.title = ui('docTitle');
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      el.textContent = get(el.getAttribute('data-i18n'));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-aria]'), function (el) {
      el.setAttribute('aria-label', get(el.getAttribute('data-i18n-aria')));
    });
    parts.forEach(function (p) {
      var id = p.getAttribute('data-id');
      p.setAttribute('aria-label', ui('part') + ' ' + (ORDER.indexOf(id) + 1) + ', ' + step(id).name);
    });
    langBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === LANG ? 'true' : 'false');
    });
  }

  /* ---------- chips ---------- */
  ORDER.forEach(function (id, i) {
    var b = mk('button', 'chip');
    b.type = 'button';
    b.setAttribute('data-go', id);
    b.appendChild(mk('span', 'n', i + 1));
    b.appendChild(mk('span', 'lbl'));
    chips.appendChild(b);
  });
  function updateChips() {
    Array.prototype.forEach.call(chips.children, function (c) {
      c.lastChild.textContent = step(c.getAttribute('data-go')).chip;
    });
  }

  /* Heel figure: every line is one row, every square one stitch (5 right, 5 centre, 5 left). */
  function heelFigure() {
    var NS = 'http://www.w3.org/2000/svg';
    var N = 15, S = 5, C = 5;
    var X0 = 84, W = 576, sw = W / N, rh = 14, step = 17;
    function sv(tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      if (parent) parent.appendChild(e);
      return e;
    }
    var shortRows = [{ a: 1, b: N }, { a: 1, b: N }];
    for (var k = 1; k <= S; k++) {
      shortRows.push({ a: k, b: N - k });
      shortRows.push({ a: k + 1, b: N - k });
    }
    var parts = [[1, S, 'seg-r', ui('right')], [S + 1, S + C, 'seg-c', ui('centre')], [S + C + 1, N, 'seg-l', ui('left')]];

    var fig = mk('figure', 'heel-fig');
    var svg = sv('svg', { role: 'img', 'aria-label': ui('figAria') });
    fig.appendChild(svg);

    parts.forEach(function (p) {
      var x = X0 + (N - p[1]) * sw, w = (p[1] - p[0] + 1) * sw;
      var t = sv('text', { x: x + w / 2, y: 36, 'text-anchor': 'middle' }, svg);
      t.textContent = p[3] + ' · ' + (p[1] - p[0] + 1);
      sv('rect', { x: x + 1, y: 43, width: w - 2, height: 4, class: p[2] }, svg);
    });

    /* arrows: the knitting runs from the right edge to the left edge, at the start and again at the end */
    function arrow(yy, text) {
      sv('line', { x1: X0 + W - 2, y1: yy, x2: X0 + 10, y2: yy, class: 'arrow' }, svg);
      sv('polygon', { points: X0 + ',' + yy + ' ' + (X0 + 14) + ',' + (yy - 6) + ' ' + (X0 + 14) + ',' + (yy + 6), class: 'arrow-head' }, svg);
      var at = sv('text', { x: 0, y: yy + 4, class: 'fig-label' }, svg);
      at.textContent = text;
    }
    arrow(12, ui('start'));

    var y = 58;
    function bar(r, dir) {
      parts.forEach(function (p) {
        var lo = Math.max(r.a, p[0]), hi = Math.min(r.b, p[1]);
        for (var q = lo; q <= hi; q++) {
          sv('rect', { x: X0 + (N - q) * sw + 1, y: y, width: sw - 2, height: rh, rx: 2, class: p[2] }, svg);
        }
      });
      var turn = dir === 'rs' ? r.b : r.a;
      sv('circle', { cx: X0 + (N - turn + 0.5) * sw, cy: y + rh / 2, r: 3.5, class: 'ring' }, svg);
      y += step;
    }
    function label(text, from, to) {
      var t = sv('text', { x: 0, y: (from + to) / 2 + 4, class: 'fig-label' }, svg);
      t.textContent = text;
    }

    var y0 = y;
    shortRows.forEach(function (r, i) { bar(r, i % 2 === 0 ? 'rs' : 'ws'); });
    label(ui('shorten'), y0, y);

    y += 8;
    var yr = y;
    sv('rect', { x: X0, y: y, width: W, height: rh, class: 'round-bar' }, svg);
    y += step;
    label(ui('round'), yr, y);

    y += 8;
    var y1 = y;
    for (var i = shortRows.length - 2, n = 0; i >= 2; i--, n++) {
      /* the same rows in reverse, mirrored, because lengthening starts on the left side */
      bar({ a: N + 1 - shortRows[i].b, b: N + 1 - shortRows[i].a }, n % 2 === 0 ? 'rs' : 'ws');
    }
    label(ui('lengthen'), y1, y);

    y += 6;
    arrow(y + 6, ui('end'));
    y += 12;

    svg.setAttribute('viewBox', '0 0 ' + (X0 + W) + ' ' + (y + 4));
    fig.appendChild(mk('figcaption', null, ui('figCaption')));
    return fig;
  }

  /* ---------- step panel ---------- */
  function list(tag, cls, items) {
    var l = mk(tag, cls);
    items.forEach(function (t) { l.appendChild(mk('li', null, t)); });
    return l;
  }

  function renderContent(id) {
    var s = step(id);
    content.textContent = '';

    content.appendChild(mk('p', 'eyebrow',
      ui('stepOf').replace('{n}', ORDER.indexOf(id) + 1).replace('{m}', ORDER.length) + s.kind));
    content.appendChild(mk('h2', null, s.name));
    content.appendChild(mk('p', 'lead', s.what));
    if (id === 'heel') content.appendChild(heelFigure());

    content.appendChild(mk('h3', null, ui('howLabel')));
    content.appendChild(list('ol', 'how', s.how));
    content.appendChild(mk('h3', null, s.watchLabel));
    content.appendChild(list('ul', 'watch', s.watch));

    var media = mk('div', 'media');
    media.appendChild(mk('p', 'media-title', ui('mediaTitle')));
    if (/^https?:\/\//i.test(s.video || '')) {
      var a = mk('a', 'btn primary', ui('watchVideo'));
      a.href = s.video; a.target = '_blank'; a.rel = 'noopener noreferrer';
      media.appendChild(a);
    } else {
      media.appendChild(mk('p', 'media-note', ui('mediaNote')));
      var g = mk('span', 'btn ghost', ui('soon'));
      g.setAttribute('aria-disabled', 'true');
      media.appendChild(g);
    }
    content.appendChild(media);
  }

  function renderPager(id) {
    var i = ORDER.indexOf(id), prev = ORDER[i - 1], next = ORDER[i + 1];
    pager.textContent = '';
    var b = mk('button', 'btn', ui('back') + (prev ? step(prev).name : ui('beforeStart')));
    b.type = 'button';
    b.setAttribute('data-go', prev || 'start');
    pager.appendChild(b);
    if (next) {
      var n = mk('button', 'btn primary', ui('next') + step(next).name);
      n.type = 'button';
      n.setAttribute('data-go', next);
      pager.appendChild(n);
    }
  }

  /* ---------- routing ---------- */
  function go(id) {
    scrollOnShow = true;
    if (location.hash === '#' + id) { route(); } else { location.hash = id; }
  }

  function showStart() {
    viewStart.hidden = false;
    viewSock.hidden = true;
    tabStart.setAttribute('aria-selected', 'true');
    tabSock.setAttribute('aria-selected', 'false');
  }

  function showStep(id) {
    currentId = id;
    viewStart.hidden = true;
    viewSock.hidden = false;
    tabStart.setAttribute('aria-selected', 'false');
    tabSock.setAttribute('aria-selected', 'true');

    svg.classList.toggle('all', id === 'finish');
    parts.forEach(function (p) {
      p.setAttribute('aria-pressed', p.getAttribute('data-id') === id ? 'true' : 'false');
    });
    Array.prototype.forEach.call(chips.children, function (c) {
      if (c.getAttribute('data-go') === id) { c.setAttribute('aria-current', 'step'); }
      else { c.removeAttribute('aria-current'); }
    });
    updateChips();
    renderContent(id);
    renderPager(id);
  }

  function route() {
    var h = location.hash.slice(1);
    if (h === 'start') { showStart(); }
    else { showStep(ORDER.indexOf(h) >= 0 ? h : 'cuff'); }
    if (scrollOnShow) {
      scrollOnShow = false;
      if (window.matchMedia('(max-width: 819px)').matches) {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var target = viewStart.hidden ? panel : viewStart;
        target.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      }
    }
  }

  /* ---------- clicks ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var g = t.closest('[data-go], [data-id]');
    if (!g) return;
    var id = g.getAttribute('data-go') || g.getAttribute('data-id');
    if (id) go(id);
  });
  parts.forEach(function (p) {
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(p.getAttribute('data-id'));
      }
    });
  });
  tabStart.addEventListener('click', function () { go('start'); });
  tabSock.addEventListener('click', function () { go(currentId); });
  window.addEventListener('hashchange', route);

  /* ---------- language switch ---------- */
  function setLang(l) {
    if (l === LANG || !DATA[l]) return;
    LANG = l;
    try { localStorage.setItem('sockmap-lang', l); } catch (e) { /* no storage: fine */ }
    applyStatic();
    updateChips();
    renderContent(currentId);
    renderPager(currentId);
  }
  langBtns.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  /* ---------- stitch calculator ---------- */
  function stitchCount(circumferenceCm, gaugePer10cm) {
    var raw = circumferenceCm * (gaugePer10cm / 10) * 0.9;
    var n = Math.round(raw / 4) * 4;
    return Math.max(n, 4);
  }
  var circ = $('#circ'), gauge = $('#gauge'), cast = $('#cast');
  function update() {
    var c = parseFloat(circ.value), g = parseFloat(gauge.value);
    cast.textContent = (c > 0 && g > 0) ? String(stitchCount(c, g)) : '–';
  }
  circ.addEventListener('input', update);
  gauge.addEventListener('input', update);
  update();

  /* ---------- start: load the texts, then draw ---------- */
  function load(lang) {
    return fetch('content/' + lang + '.json').then(function (r) {
      if (!r.ok) throw new Error(lang + ': ' + r.status);
      return r.json();
    }).then(function (d) { DATA[lang] = d; });
  }
  Promise.all(LANGS.map(load)).then(function () {
    try {
      var saved = localStorage.getItem('sockmap-lang');
      if (LANGS.indexOf(saved) >= 0) LANG = saved;
    } catch (e) { /* no storage: stay on English */ }
    applyStatic();
    route();
  }).catch(function () {
    content.textContent = 'Could not load the page texts. Please reload.';
  });
})();
