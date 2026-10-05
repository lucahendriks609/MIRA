/* MIRA Find Your Color — engine.
   Bevat geen inhoud: vragen, kleuren, teksten en weging komen uit window.MIRA_FYC (mira-fyc-data.js).
   Productgegevens (foto, variant, voorraad, url) komen uit <script type="application/json" id="mk-config">. */
(function () {
  var D = window.MIRA_FYC;
  if (!D) return;
  var W = D.scoringWeights;
  var TRAITS = Object.keys(D.personalityTraits);
  var SEASONS = Object.keys(D.seasonTraits);

  /* ===== Scoring (puur, zonder DOM) ===== */
  function emptyVec(keys) { var o = {}; keys.forEach(function (k) { o[k] = 0; }); return o; }
  function normalize(v) {
    var sum = 0, k;
    for (k in v) sum += v[k];
    var out = {};
    for (k in v) out[k] = sum > 0 ? v[k] / sum : 1 / Object.keys(v).length;
    return out;
  }
  function ranked(v) { return Object.keys(v).sort(function (a, b) { return v[b] - v[a]; }); }

  /* answers: { questionId: answerIndex | [answerIndex, ...] } */
  function profile(answers) {
    var pers = emptyVec(TRAITS), seas = emptyVec(SEASONS);
    var pref = { intensity: null, family: [], style: null, occasion: null, depth: null, novelty: null };
    D.questions.forEach(function (q) {
      var a = answers[q.id];
      if (a === undefined || a === null) return;
      (Array.isArray(a) ? a : [a]).forEach(function (i) {
        var e = (q.answers[i] || {}).effects || {};
        var k;
        if (e.personality) for (k in e.personality) pers[k] += e.personality[k];
        if (e.season) for (k in e.season) seas[k] += e.season[k];
        if (e.pref) for (k in e.pref) {
          if (k === 'family') pref.family = pref.family.concat(e.pref.family);
          else pref[k] = e.pref[k];
        }
      });
    });
    return { personality: normalize(pers), season: normalize(seas), pref: pref, rawSeason: seas };
  }

  function prefScore(c, pref) {
    var P = W.preferenceParts, ch = c.characteristics, s = 0;
    /* familie */
    var fam;
    if (!pref.family.length) fam = W.familyFit.none;
    else {
      var inFam = pref.family.indexOf(c.family) > -1;
      var fit = pref.novelty === 'new' ? W.familyFit.new : W.familyFit.familiar;
      fam = inFam ? fit.inFamily : fit.outFamily;
    }
    s += P.family * fam;
    /* stijl */
    s += P.style * (!pref.style ? 0.6 : c.style.indexOf(pref.style) > -1 ? 1 : W.softMiss);
    /* subtiel - opvallend */
    s += P.intensity * (pref.intensity ? 1 - Math.abs(pref.intensity - ch.intensity) / 2 : 0.6);
    /* licht - donker */
    var order = ['light', 'medium', 'deep'];
    var dd = (!pref.depth || pref.depth === 'any') ? null : Math.abs(order.indexOf(pref.depth) - order.indexOf(ch.depth));
    s += P.depth * (dd === null ? 0.7 : dd === 0 ? 1 : dd === 1 ? 0.5 : 0);
    /* gelegenheid */
    s += P.occasion * (!pref.occasion || pref.occasion === 'any' ? 1 : c.occasion.indexOf(pref.occasion) > -1 ? 1 : W.softMiss);
    return s;
  }

  function score(answers) {
    var pr = profile(answers);
    var rows = D.colors.map(function (c) {
      var p = 0, s = 0, k;
      for (k in pr.personality) p += pr.personality[k] * (c.personality[k] || 0);
      for (k in pr.season) s += pr.season[k] * (c.season[k] || 0);
      return { color: c, p: p, s: s, v: prefScore(c, pr.pref) };
    });
    /* Iedere component relatief t.o.v. de best scorende MIRA Color, zodat de weging eerlijk werkt. */
    ['p', 's', 'v'].forEach(function (key) {
      var max = Math.max.apply(null, rows.map(function (r) { return r[key]; })) || 1;
      rows.forEach(function (r) { r[key + 'n'] = r[key] / max; });
    });
    rows.forEach(function (r) {
      r.total = W.personality * r.pn + W.season * r.sn + W.preference * r.vn;
      r.percent = Math.max(W.minDisplayPercent, Math.min(W.maxDisplayPercent, Math.round(r.total * 100)));
    });
    rows.sort(function (a, b) { return b.total - a.total; });
    /* Top N, met maximaal X kleuren per familie */
    var top = [], perFam = {};
    for (var i = 0; i < rows.length && top.length < W.topCount; i++) {
      var f = rows[i].color.family;
      if ((perFam[f] || 0) >= W.maxPerFamily) continue;
      perFam[f] = (perFam[f] || 0) + 1;
      top.push(rows[i]);
    }
    var traitsRanked = ranked(pr.personality);
    var seasonsRanked = ranked(pr.season);
    var seasonShare = pr.season[seasonsRanked[0]];
    var seasonKnown = Object.keys(pr.rawSeason).some(function (k) { return pr.rawSeason[k] > 0; });
    return {
      profile: pr, top: top, all: rows,
      traits: traitsRanked,
      season: { primary: seasonsRanked[0], secondary: pr.season[seasonsRanked[1]] >= seasonShare * 0.8 ? seasonsRanked[1] : null, known: seasonKnown }
    };
  }

  window.MIRA_FYC_ENGINE = { score: score, profile: profile };

  /* ===== Tekst ===== */
  var T = D.personalityTraits, S = D.seasonTraits, L = D.labels;
  function typeName(r) { return 'The ' + T[r.traits[0]].adjective + ' ' + T[r.traits[1]].noun; }
  function typeText(r) { return T[r.traits[0]].lead + ' ' + T[r.traits[1]].twist; }
  function joinNL(arr) { return arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' en ' + arr[arr.length - 1]; }
  function colorTraits(c, n) { return ranked(c.personality).slice(0, n || 2); }
  function seasonTitle(r) {
    var t = S[r.season.primary].title;
    return r.season.secondary ? t + ' met een vleugje ' + S[r.season.secondary].label.toLowerCase() : t;
  }
  function whyPersonality(c, r) {
    var userTop = r.traits.slice(0, 3);
    var ct = colorTraits(c, 3);
    var shared = ct.filter(function (t) { return userTop.indexOf(t) > -1; });
    var stands = c.name + ' staat voor ' + joinNL(colorTraits(c, 2).map(function (t) { return T[t].essence; })) + '.';
    if (shared.length) return stands + ' Dat sluit aan bij jouw ' + joinNL(shared.slice(0, 2).map(function (t) { return T[t].attr; })) + ' kant.';
    return c.name + ' voegt een ' + T[ct[0]].attr + ' kant toe aan jouw verhaal.';
  }
  function whySeason(c, r) {
    var ch = c.characteristics;
    var base = c.name + ' is een ' + L.tone[ch.tone] + ', ' + L.depth[ch.depth] + ' tint met een ' + L.chroma[ch.chroma] + ' uitstraling.';
    if (!r.season.known) return base;
    var fit = c.season[r.season.primary];
    var title = S[r.season.primary].title.toLowerCase();
    if (fit >= 0.9) return base + ' Dat sluit mooi aan bij een ' + title + '.';
    if (fit >= 0.7) return base + ' Dat werkt goed bij een ' + title + '.';
    return base + ' Voor een ' + title + ' is dit een verrassende keuze. Hier wegen je persoonlijkheid en stijl zwaarder.';
  }
  function whyAlso(row, r) {
    var c = row.color;
    var parts = [['p', row.pn * W.personality], ['s', row.sn * W.season], ['v', row.vn * W.preference]];
    parts.sort(function (a, b) { return b[1] - a[1]; });
    var lead = parts[0][0];
    if (lead === 's' && r.season.known) return c.story.split('. ')[0] + '. Past waarschijnlijk mooi bij je ' + S[r.season.primary].title.toLowerCase() + '.';
    if (lead === 'v' && r.profile.pref.style) return c.story.split('. ')[0] + '. Sluit aan bij je ' + L.style[r.profile.pref.style] + ' stijl.';
    return c.story.split('. ')[0] + '. ' + whyPersonality(c, r).split('. ').slice(1).join('. ');
  }

  /* ===== UI ===== */
  var root = document.getElementById('mk-root');
  if (!root) return;
  var cfg = {};
  try { cfg = JSON.parse(document.getElementById('mk-config').textContent); } catch (e) { cfg = {}; }
  var PROD = cfg.products || {};
  /* Live: zonder ingebakken productdata halen we alles uit de openbare Shopify-endpoint van de winkel. */
  var productsReady = Promise.resolve();
  if (cfg.mode === 'live' && !Object.keys(PROD).length) {
    productsReady = fetch((cfg.baseUrl || '') + '/products.json?limit=250', { headers: { Accept: 'application/json' } })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        (json.products || []).forEach(function (pr) {
          var v = pr.variants && pr.variants[0] || {};
          var img = pr.images && pr.images[0] ? pr.images[0].src : '';
          PROD[pr.handle] = {
            title: pr.title, variant: v.id, available: v.available !== false,
            price: Math.round(parseFloat(v.price || 0) * 100),
            img: img ? img + (img.indexOf('?') > -1 ? '&' : '?') + 'width=480' : '',
            url: (cfg.baseUrl || '') + '/products/' + pr.handle,
            lowStock: (cfg.lowStock || []).indexOf(pr.handle) > -1
          };
        });
      })
      .catch(function () { /* zonder data tonen we namen en links; knoppen vallen terug op de productpagina */ });
  }
  var LIVE = cfg.mode === 'live';
  var BASE = cfg.baseUrl || '';
  var STARTER = cfg.starterPackUrl || (D.ritual && D.ritual.starterPackUrl) || '';
  function freshState() { return { step: -1, answers: {}, seen: {}, revealed: false, pick: 0, recognized: null, objection: null, handled: [] }; }
  var state = freshState();

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var a in attrs) {
      if (a === 'class') n.className = attrs[a];
      else if (a === 'text') n.textContent = attrs[a];
      else if (a.slice(0, 2) === 'on') n.addEventListener(a.slice(2), attrs[a]);
      else if (attrs[a] !== null && attrs[a] !== undefined) n.setAttribute(a, attrs[a]);
    }
    (kids || []).forEach(function (k) { if (k) n.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); });
    return n;
  }
  function prod(h) {
    var p = PROD[h] || {};
    return { h: h, title: p.title || h, img: p.img || '', url: p.url || (BASE + '/products/' + h), variant: p.variant, available: p.available !== false, price: p.price || 0, lowStock: !!p.lowStock };
  }
  function ext() { return LIVE ? {} : { target: '_blank', rel: 'noopener' }; }
  function link(cls, href, text, extra) {
    var a = { class: cls, href: href }, x = ext(), k;
    for (k in x) a[k] = x[k];
    for (k in (extra || {})) a[k] = extra[k];
    return el('a', a, [text]);
  }
  function toast(msg) {
    var t = el('div', { class: 'mk-toast', role: 'status', text: msg });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3200);
  }
  function addToCart(p, name, btn) {
    if (!LIVE) { toast('Op de website gaat ' + name + ' hier direct naar je winkelmand.'); return; }
    if (!p.variant) { window.location.href = p.url; return; }
    btn.disabled = true;
    fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items: [{ id: p.variant, quantity: 1 }] }) })
      .then(function (res) { if (!res.ok) throw new Error(); return res.json(); })
      .then(function () { toast(name + ' ligt in je winkelmand.'); document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true })); })
      .catch(function () { toast('Dat lukte niet. Probeer het via de productpagina.'); })
      .then(function () { btn.disabled = false; });
  }
  function actions(c, primary) {
    var p = prod(c.handle);
    return el('div', { class: 'mk-actions' }, [
      link('mk-btn mk-btn--small' + (primary ? '' : ' mk-btn--ghost'), p.url, primary ? 'Shop your color' : 'Bekijk'),
      el('button', { class: 'mk-btn mk-btn--ghost mk-btn--small', type: 'button', disabled: p.available ? null : 'disabled', onclick: function (e) { addToCart(p, c.name, e.currentTarget); } }, [p.available ? 'In winkelmand' : 'Uitverkocht'])
    ]);
  }
  var mounted = false;
  function mount(node) {
    root.innerHTML = '';
    node.classList.add('mk-screen');
    root.appendChild(node);
    if (!mounted) { mounted = true; return; }
    var h = node.querySelector('h1, h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    var top = root.getBoundingClientRect().top + window.scrollY - 24;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }
  var MARK = '<svg class="mk-mark" viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><circle cx="50" cy="50" r="46"/><path d="M50 4 V96 M50 4 L16 86 M50 4 L84 86 M17 17 L50 50 L83 17"/></svg>';

  /* ---------- Intro ---------- */
  function intro() {
    var mark = el('div', { 'aria-hidden': 'true' }); mark.innerHTML = MARK;
    var count = {};
    D.questions.forEach(function (q) { count[q.chapter] = (count[q.chapter] || 0) + 1; });
    return el('div', { class: 'mk-intro' }, [
      mark,
      el('p', { class: 'mk-eyebrow', text: 'MIRA' }),
      el('h1', { text: 'Find your color' }),
      el('p', { class: 'mk-lede', text: 'Iedere MIRA Color heeft een eigen karakter. Zeven vragen, en je weet welke bij jou past.' }),
      el('ol', { class: 'mk-chapters' }, D.chapters.map(function (ch, i) {
        return el('li', {}, [el('span', { class: 'n', text: String(i + 1) }), el('div', {}, [el('b', { text: ch.title }), el('small', { text: count[ch.key] + ' vragen' })])]);
      })),
      el('button', { class: 'mk-btn', type: 'button', onclick: function () { state.step = 0; render(); } }, ['Begin']),
      el('p', { class: 'mk-quiet', text: 'Duurt ongeveer een minuut. We bewaren niets van je antwoorden.' })
    ]);
  }

  /* ---------- Vraag ---------- */
  function question(i) {
    var q = D.questions[i];
    var chIdx = D.chapters.map(function (c) { return c.key; }).indexOf(q.chapter);
    var chapter = D.chapters[chIdx];
    var inChapter = D.questions.filter(function (x) { return x.chapter === q.chapter; });
    var posInCh = inChapter.indexOf(q);
    var firstOfChapter = posInCh === 0;
    if (firstOfChapter && D.insights && D.insights[q.chapter] && !state.seen[q.chapter]) return insight(q.chapter, i);
    var chosen = state.answers[q.id];
    var multi = q.type === 'multi';
    var chips = multi && q.answers.length > 9;
    var long = q.answers.some(function (a) { return a.label.length > 26 || a.sub; });

    var progress = el('div', { class: 'mk-progress', 'aria-hidden': 'true' }, D.chapters.map(function (ch, ci) {
      var total = D.questions.filter(function (x) { return x.chapter === ch.key; }).length;
      var done = ci < chIdx ? total : ci === chIdx ? posInCh : 0;
      return el('div', { class: 'mk-seg' + (ci === chIdx ? ' is-on' : '') }, [el('i', {}, [el('span', { style: 'width:' + Math.round(done / total * 100) + '%' })]), el('em', { text: ch.title })]);
    }));

    var opts = el('div', { class: 'mk-options' + (chips ? ' mk-options--chips' : (long || q.answers.length % 2) ? ' mk-options--list' : ''), role: 'group', 'aria-label': q.title });
    q.answers.forEach(function (a, idx) {
      var pressed = multi ? (chosen || []).indexOf(idx) > -1 : chosen === idx;
      var b = el('button', { class: 'mk-opt', type: 'button', 'aria-pressed': pressed ? 'true' : 'false', onclick: function () {
        if (multi) {
          var cur = (state.answers[q.id] || []).slice();
          var at = cur.indexOf(idx);
          if (at > -1) cur.splice(at, 1);
          else { cur.push(idx); if (q.max && cur.length > q.max) cur.shift(); }
          state.answers[q.id] = cur;
          render(idx);
        } else {
          state.answers[q.id] = idx;
          b.setAttribute('aria-pressed', 'true');
          setTimeout(function () { state.step = i + 1; render(); }, 160);
        }
      } }, [el('strong', { text: a.label }), a.sub ? el('span', { text: a.sub }) : null]);
      opts.appendChild(b);
    });

    var n = (chosen || []).length;
    var minOk = !multi || n >= (q.min || 0);
    var nav = el('div', { class: 'mk-nav' }, [
      el('button', { class: 'mk-link', type: 'button', onclick: function () { state.step = i - 1; render(); } }, [i === 0 ? 'Terug naar begin' : 'Vorige vraag']),
      multi ? el('button', { class: 'mk-btn', type: 'button', disabled: minOk ? null : 'disabled', onclick: function () { state.step = i + 1; render(); } }, [i === D.questions.length - 1 ? 'Toon mijn kleur' : 'Verder']) : null
    ]);

    return el('div', { class: 'mk-q' }, [
      progress,
      el('p', { class: 'mk-eyebrow', text: chapter.title }),
      firstOfChapter ? el('p', { class: 'mk-quiet', text: chapter.intro }) : null,
      el('h2', { text: q.title }),
      q.hint ? el('p', { class: 'mk-quiet', text: q.hint + (multi && q.max ? ' (' + n + '/' + q.max + ')' : '') }) : null,
      opts,
      el('p', { class: 'mk-count', text: (function () { var left = D.questions.length - i - 1; return left === 0 ? 'Laatste vraag' : left <= 2 ? 'Nog ' + left + ' vragen tot je kleur' : 'Vraag ' + (i + 1) + ' van ' + D.questions.length; })() }),
      nav
    ]);
  }

  /* ---------- Inzicht tussen hoofdstukken (Challenger + spiegelen) ---------- */
  function fill(t, map) { return String(t || '').replace(/\{(\w+)\}/g, function (m, k) { return map[k] !== undefined ? map[k] : m; }); }
  var PCT = { pref: Math.round(W.preference * 100), season: Math.round(W.season * 100), personality: Math.round(W.personality * 100), n: D.colors.length };
  function insight(chKey, i) {
    var ins = D.insights[chKey];
    var pr = profile(state.answers);
    var chips = ranked(pr.personality).slice(0, 3).map(function (t) { return T[t].label; });
    var sKnown = Object.keys(pr.rawSeason).some(function (k) { return pr.rawSeason[k] > 0; });
    if (sKnown) chips.push(S[ranked(pr.season)[0]].title.toLowerCase());
    return el('div', { class: 'mk-insight' }, [
      el('p', { class: 'mk-eyebrow', text: ins.eyebrow }),
      el('h2', { text: ins.title }),
      el('p', { class: 'mk-lede', text: fill(ins.text, PCT) }),
      ins.mirror ? el('div', { class: 'mk-panel' }, [
        el('h3', { text: ins.mirror }),
        el('ul', { class: 'mk-traits' }, chips.map(function (t) { return el('li', { text: t }); }))
      ]) : null,
      el('div', { class: 'mk-nav' }, [
        el('button', { class: 'mk-link', type: 'button', onclick: function () { state.step = i - 1; render(); } }, ['Vorige vraag']),
        el('button', { class: 'mk-btn', type: 'button', onclick: function () { state.seen[chKey] = true; render(); } }, [ins.cta])
      ])
    ]);
  }

  /* ---------- Opbouw vóór de uitslag ---------- */
  var revealTimers = [];
  function reveal() {
    var R = D.reveal;
    var mark = el('div', { class: 'mk-reveal-mark', 'aria-hidden': 'true' }); mark.innerHTML = MARK;
    var list = el('ol', { class: 'mk-reveal-steps' }, R.steps.map(function (s) { return el('li', { text: s }); }));
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var per = reduce ? 200 : R.stepMs;
    revealTimers.forEach(clearTimeout); revealTimers = [];
    R.steps.forEach(function (s, k) {
      revealTimers.push(setTimeout(function () { if (list.children[k]) list.children[k].classList.add('is-done'); }, per * (k + 1)));
    });
    revealTimers.push(setTimeout(function () {
      productsReady.then(function () { if (state.step >= D.questions.length) { state.revealed = true; render(); } });
    }, per * (R.steps.length + 1)));
    return el('div', { class: 'mk-reveal', role: 'status' }, [mark, el('h2', { text: fill(R.title, PCT) }), list]);
  }

  /* ---------- Uitslag ---------- */
  function money(cents) { return '€' + (cents / 100).toFixed(2).replace('.', ','); }
  function addMany(list, label, btn) {
    var items = list.filter(function (p) { return p.available && p.variant; });
    if (!LIVE || items.length !== list.length) { toast(LIVE ? 'Niet alles is op voorraad. Voeg ze los toe.' : 'Op de website gaan ' + label + ' hier in één keer naar je winkelmand.'); return; }
    btn.disabled = true;
    fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items: items.map(function (p) { return { id: p.variant, quantity: 1 }; }) }) })
      .then(function (res) { if (!res.ok) throw new Error(); return res.json(); })
      .then(function () { toast(label.charAt(0).toUpperCase() + label.slice(1) + ' liggen in je winkelmand.'); document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true })); })
      .catch(function () { toast('Dat lukte niet. Probeer het via de productpagina.'); })
      .then(function () { btn.disabled = false; });
  }
  function starterBtn() {
    return STARTER ? link('mk-btn mk-btn--small', STARTER, 'Bekijk het starterpack')
                   : el('button', { class: 'mk-btn mk-btn--small', type: 'button', onclick: function () { toast('Link naar het starterpack volgt.'); } }, ['Bekijk het starterpack']);
  }
  function toolRow(handle, why) {
    var tp = prod(handle);
    return el('li', { class: 'mk-tool' }, [
      tp.img ? el('img', { src: tp.img, alt: '', width: '52', height: '52', loading: 'lazy' }) : el('span'),
      el('div', { style: 'min-width:0' }, [
        el('div', { class: 'mk-tool-name', text: tp.title.replace(/^MIRA /, '') }),
        el('div', { class: 'mk-tool-why', text: [why, tp.price ? money(tp.price) : ''].filter(Boolean).join(' · ') })
      ]),
      link('mk-btn mk-btn--ghost mk-btn--small', tp.url, 'Bekijk', { 'aria-label': 'Bekijk ' + tp.title })
    ]);
  }
  function workFix(r, c) {
    if (c.occasion.indexOf('work') > -1) return { text: fill(D.workYes, { color: c.name }), alt: null };
    var alt = r.all.filter(function (row) { return row.color.occasion.indexOf('work') > -1; })[0];
    return { text: fill(D.workAlt, { alt: alt.color.name, percent: alt.percent }), alt: alt };
  }

  function objectionPanel(o, r, c, p) {
    var panel = el('div', { class: 'mk-panel' });
    if (o.empathy) panel.appendChild(el('p', { class: 'mk-label', text: o.empathy }));
    var otherRow = r.top.filter(function (row) { return row.color.handle !== c.handle; })[0];
    var top2 = otherRow ? otherRow.color : null;
    if (o.action === 'work') {
      var w = workFix(r, c);
      panel.appendChild(el('p', { text: w.text }));
      if (w.alt) panel.appendChild(actions(w.alt.color, false));
    } else if (o.answer) panel.appendChild(el('p', { text: fill(o.answer, { color: c.name }) }));

    if (o.action === 'lamp') {
      panel.appendChild(el('ul', { class: 'mk-tools' }, [toolRow(D.ritual.lamp, 'UV/LED-lamp')]));
      panel.appendChild(el('div', { class: 'mk-actions' }, [starterBtn()]));
    } else if (o.action === 'skill') {
      panel.appendChild(el('div', { class: 'mk-actions' }, [link('mk-btn mk-btn--ghost mk-btn--small', BASE + o.link.url, o.link.label), starterBtn()]));
    } else if (o.action === 'two' && top2) {
      var both = [p, prod(top2.handle)];
      var sum = both.reduce(function (a, x) { return a + (x.price || 0); }, 0);
      panel.appendChild(el('div', { class: 'mk-actions' }, [
        el('button', { class: 'mk-btn mk-btn--small', type: 'button', onclick: function (e) { addMany(both, c.name + ' en ' + top2.name, e.currentTarget); } }, [fill(D.twoCta, { a: c.name, b: top2.name }) + (sum ? ' \u00b7 ' + money(sum) : '')])
      ]));
    } else if (o.action === 'later') {
      panel.appendChild(el('div', { class: 'mk-actions' }, [link('mk-btn mk-btn--ghost mk-btn--small', BASE + '/collections/all-colors', D.laterCta)]));
    } else if (o.action === 'close') {
      panel.appendChild(el('div', { class: 'mk-actions' }, [
        el('button', { class: 'mk-btn', type: 'button', disabled: p.available ? null : 'disabled', onclick: function (e) { addToCart(p, c.name, e.currentTarget); } }, [fill(D.closeCta, { color: c.name })])
      ]));
      return panel;
    }
    /* Achterdeur dicht */
    panel.appendChild(el('p', { class: 'mk-backdoor', text: fill(D.backDoor, { color: c.name }) }));
    panel.appendChild(el('div', { class: 'mk-actions' }, [
      el('button', { class: 'mk-btn mk-btn--small', type: 'button', disabled: p.available ? null : 'disabled', onclick: function (e) { addToCart(p, c.name, e.currentTarget); } }, [fill(D.backDoorNo, { color: c.name })]),
      el('button', { class: 'mk-btn mk-btn--ghost mk-btn--small', type: 'button', onclick: function () { state.handled.push(o.id); state.objection = null; render('keep'); } }, [D.backDoorYes])
    ]));
    return panel;
  }

  /* Dropdown: een rij per bezwaar, \u00e9\u00e9n tegelijk open. */
  function objectionBlock(r, c, p) {
    var sec = el('section', { class: 'mk-section', 'aria-label': D.objectionsTitle }, [
      el('h3', { text: D.objectionsTitle }),
      el('p', { class: 'mk-quiet', text: D.objectionsHint })
    ]);
    var list = el('div', { class: 'mk-acc' });
    D.objections.filter(function (x) { return state.handled.indexOf(x.id) === -1; }).forEach(function (x) {
      var open = state.objection === x.id;
      var head = el('button', {
        class: 'mk-acc-head', type: 'button', id: 'mk-acc-h-' + x.id, 'data-obj': x.id,
        'aria-expanded': open ? 'true' : 'false', 'aria-controls': 'mk-acc-p-' + x.id,
        onclick: function () {
          state.objection = open ? null : x.id;
          render('keep');
          var again = root.querySelector('[data-obj="' + x.id + '"]');
          if (again) again.focus({ preventScroll: true });
        }
      }, [el('span', { text: x.option })]);
      var item = el('div', { class: 'mk-acc-item' + (open ? ' is-open' : '') }, [head]);
      if (open) {
        var region = el('div', { class: 'mk-acc-panel', id: 'mk-acc-p-' + x.id, role: 'region', 'aria-labelledby': 'mk-acc-h-' + x.id }, [objectionPanel(x, r, c, p)]);
        item.appendChild(region);
      }
      list.appendChild(item);
    });
    sec.appendChild(list);
    return sec;
  }

  function result() {
    var r = score(state.answers);
    var pick = Math.min(state.pick, r.top.length - 1);
    var best = r.top[pick], c = best.color, p = prod(c.handle);
    var painKey = r.profile.pref.pain;
    var pain = painKey ? fill(D.painLabels[painKey], PCT) : '';
    var out = el('div', { class: 'mk-result' });

    out.appendChild(el('div', { class: 'mk-hero' }, [
      el('p', { class: 'mk-eyebrow', text: 'Your MIRA Color Match' }),
      el('p', { class: 'mk-quiet', text: 'Jouw kleurpersoonlijkheid' }),
      el('h1', { text: typeName(r) }),
      el('p', { class: 'mk-type', text: typeText(r) }),
      el('ul', { class: 'mk-traits', 'aria-label': 'Jouw sterkste eigenschappen' }, r.traits.slice(0, 3).map(function (t) { return el('li', { text: T[t].label }); })),
      pain ? el('p', { class: 'mk-label', text: pain }) : null
    ]));

    /* Commitment */
    var C = D.commitment, commit = el('div', { class: 'mk-commit' });
    if (state.recognized === null) {
      commit.appendChild(el('p', { text: C.question }));
      commit.appendChild(el('div', { class: 'mk-actions' }, [
        el('button', { class: 'mk-btn mk-btn--small', type: 'button', onclick: function () { state.recognized = true; render('keep'); } }, [C.yes]),
        el('button', { class: 'mk-btn mk-btn--ghost mk-btn--small', type: 'button', onclick: function () { state.recognized = false; state.pick = 1; render('keep'); } }, [C.no])
      ]));
    } else if (state.recognized) {
      commit.appendChild(el('p', { text: fill(C.yesText, { color: c.name }) }));
    } else {
      commit.appendChild(el('p', { text: fill(C.noText, { color: c.name, essence: T[colorTraits(c, 1)[0]].essence }) }));
      commit.appendChild(el('button', { class: 'mk-link', type: 'button', onclick: function () { state.recognized = null; state.pick = 0; render('keep'); } }, [fill(C.backTo, { color: r.top[0].color.name })]));
    }

    out.appendChild(el('section', { class: 'mk-section', 'aria-label': pick ? 'Jouw keuze' : 'Your perfect match' }, [
      el('h3', { text: pick ? 'Jouw keuze' : 'Your perfect match' }),
      el('div', { class: 'mk-match' }, [
        p.img ? el('img', { src: p.img, alt: p.title, width: '150', height: '150' }) : el('div'),
        el('div', { class: 'mk-match-body' }, [
          el('span', { class: 'mk-name', text: c.name }),
          el('span', { class: 'mk-pct' }, [el('b', { text: best.percent + '%' }), ' match']),
          p.lowStock ? el('span', { class: 'mk-stock', text: 'Nog maar een paar op voorraad' }) : null,
          el('p', { class: 'mk-story', text: c.story }),
          el('dl', { class: 'mk-why' }, [
            el('div', {}, [el('dt', { text: 'Jouw persoonlijkheid' }), el('dd', { text: whyPersonality(c, r) })]),
            el('div', {}, [el('dt', { text: 'Jouw kleurtype' }), el('dd', { text: whySeason(c, r) })])
          ]),
          actions(c, true),
          commit
        ])
      ])
    ]));

    out.appendChild(el('section', { class: 'mk-section', 'aria-label': 'Also made for you' }, [
      el('h3', { text: 'Also made for you' }),
      el('ol', { class: 'mk-rank' }, r.top.map(function (row, i) {
        var cp = prod(row.color.handle);
        return el('li', {}, [
          el('span', { class: 'n', text: String(i + 1) }),
          cp.img ? el('img', { src: cp.img, alt: '', width: '64', height: '64', loading: 'lazy' }) : el('span'),
          el('div', { class: 'mk-rank-body' }, [
            el('div', { class: 'mk-rank-head' }, [el('span', { class: 'mk-name', text: row.color.name }), el('span', { class: 'mk-pct', text: row.percent + '% match' })]),
            el('p', { text: i === pick ? (pick ? 'Jouw keuze.' : 'Your perfect match.') : whyAlso(row, r) }),
            i === pick ? null : actions(row.color, false)
          ])
        ]);
      })),
      el('p', { class: 'mk-note', text: 'Het matchpercentage laat zien hoe goed een kleur aansluit bij jouw antwoorden, vergeleken met alle MIRA Colors. Het is een persoonlijke aanbeveling, geen wetenschappelijke kleuranalyse.' })
    ]));

    var seasonRow = r.season.known
      ? [el('span', { text: 'Waarschijnlijk ben je een ' + seasonTitle(r).toLowerCase() + '.' }), el('span', { text: S[r.season.primary].text })]
      : [el('span', { text: 'Je kleurtype bleef open, dus telden je persoonlijkheid en stijl zwaarder.' })];
    out.appendChild(el('section', { class: 'mk-section', 'aria-label': 'This color tells your story' }, [
      el('h3', { text: 'This color tells your story' }),
      el('div', { class: 'mk-panel' }, [
        el('dl', { class: 'mk-tell' }, [
          el('div', { class: 'mk-tellrow' }, [el('dt', { text: 'Wie je bent' }), el('dd', {}, [el('span', { text: typeName(r) + ': ' + joinNL(r.traits.slice(0, 3).map(function (t) { return T[t].label; })) + '.' })])]),
          el('div', { class: 'mk-tellrow' }, [el('dt', { text: 'Wat je laat stralen' }), el('dd', {}, seasonRow)]),
          el('div', { class: 'mk-tellrow' }, [el('dt', { text: 'Waarom ' + c.name }), el('dd', {}, [el('span', { text: whyPersonality(c, r) }), el('span', { text: whySeason(c, r) })])]),
          el('div', { class: 'mk-tellrow' }, [el('dt', { text: 'En de rest' }), el('dd', {}, r.top.filter(function (x, i) { return i !== pick; }).map(function (row) { return el('span', { text: row.color.name + ': ' + whyAlso(row, r) }); }))])
        ])
      ])
    ]));

    /* Bundel: match + base + top */
    var RT = D.ritual || {};
    if (RT.bundle && RT.bundle.length) {
      var set = [p].concat(RT.bundle.map(prod));
      var total = set.reduce(function (a, x) { return a + (x.price || 0); }, 0);
      out.appendChild(el('section', { class: 'mk-section', 'aria-label': RT.bundleTitle }, [
        el('h3', { text: RT.bundleTitle }),
        el('p', { text: fill(RT.bundleText, { color: c.name }) }),
        el('ul', { class: 'mk-tools' }, [toolRow(c.handle, 'Jouw kleur')].concat(RT.bundle.map(function (h) { return toolRow(h, ''); }))),
        el('div', { class: 'mk-actions' }, [
          el('button', { class: 'mk-btn', type: 'button', onclick: function (e) { addMany(set, 'alle drie', e.currentTarget); } }, ['Alle drie in winkelmand' + (total ? ' · ' + money(total) : '')])
        ])
      ]));
    }

    /* Isolate & close */
    out.appendChild(objectionBlock(r, c, p));

    /* Deelkaart */
    var canvas = el('canvas', { width: '1080', height: '1920', role: 'img', 'aria-label': 'Deelkaart: ' + typeName(r) + ', ' + c.name + ', ' + best.percent + '% match' });
    drawCard(canvas, r, best);
    out.appendChild(el('section', { class: 'mk-section', 'aria-label': 'Deel je kleur' }, [
      el('h3', { text: 'Deel je kleur' }),
      el('div', { class: 'mk-share' }, [
        canvas,
        el('div', { class: 'mk-match-body' }, [
          el('p', { text: 'Je uitslag als kaart in storyformaat. Tag ons, dan zien we jouw kleur.' }),
          el('div', { class: 'mk-actions' }, [
            el('button', { class: 'mk-btn mk-btn--small', type: 'button', onclick: function () { shareCard(canvas, r, best); } }, ['Deel je kaart']),
            el('button', { class: 'mk-btn mk-btn--ghost mk-btn--small', type: 'button', onclick: function () { saveCard(canvas, best); } }, ['Bewaar'])
          ])
        ])
      ])
    ]));

    out.appendChild(el('div', { class: 'mk-nav' }, [
      el('button', { class: 'mk-link', type: 'button', onclick: function () { state = freshState(); render(); } }, ['Opnieuw beginnen']),
      link('mk-link', BASE + '/collections/all-colors', 'Alle MIRA Colors')
    ]));
    out.appendChild(el('p', { class: 'mk-slogan', text: 'Because every color tells a story' }));
    return out;
  }

  /* ---------- Deelkaart ---------- */
  function drawCard(cv, r, best) {
    var x = cv.getContext('2d'), Wd = 1080, H = 1920, c = best.color, p = prod(c.handle);
    var disp = getComputedStyle(root).getPropertyValue('--mk-display') || 'sans-serif';
    var body = getComputedStyle(root).fontFamily || 'sans-serif';
    function spaced(text, cx, y, gap, maxW) {
      var ch = text.split(''), w = ch.map(function (k) { return x.measureText(k).width; });
      var total = w.reduce(function (a, b) { return a + b; }, 0) + gap * (ch.length - 1);
      x.save();
      if (maxW && total > maxW) { var f = maxW / total; x.translate(cx, y); x.scale(f, f); cx = 0; y = 0; }
      var px = cx - total / 2;
      x.textAlign = 'left';
      ch.forEach(function (k, i) { x.fillText(k, px, y); px += w[i] + gap; });
      x.restore();
    }
    function paint(img) {
      x.fillStyle = '#FDF5EC'; x.fillRect(0, 0, Wd, H);
      x.fillStyle = '#0C7B7B'; x.textAlign = 'center';
      x.font = '400 44px ' + disp; spaced('MIRA', Wd / 2, 170, 18);
      x.font = '400 28px ' + disp; spaced('MY MIRA COLOR MATCH', Wd / 2, 300, 8);
      x.font = '400 78px ' + disp; spaced(typeName(r).toUpperCase(), Wd / 2, 420, 6, Wd - 140);
      x.fillStyle = '#A7D3D7'; x.beginPath(); x.arc(Wd / 2, 900, 300, 0, Math.PI * 2); x.fill();
      if (img) { try { x.drawImage(img, Wd / 2 - 270, 630, 540, 540); } catch (e) { } }
      x.fillStyle = '#0C7B7B';
      x.font = '400 60px ' + disp; spaced(c.name.toUpperCase(), Wd / 2, 1330, 10, Wd - 140);
      x.font = '400 40px ' + disp; spaced(best.percent + '% MATCH', Wd / 2, 1410, 8);
      if (r.season.known) { x.font = '400 34px ' + body; x.textAlign = 'center'; x.fillText(S[r.season.primary].title, Wd / 2, 1490); }
      x.font = '400 24px ' + disp; spaced('BECAUSE EVERY COLOR TELLS A STORY', Wd / 2, 1760, 6);
      x.font = '400 28px ' + body; x.textAlign = 'center'; x.fillText('houseofmira.com', Wd / 2, 1820);
    }
    paint(null);
    if (p.img) { var im = new Image(); im.crossOrigin = 'anonymous'; im.onload = function () { paint(im); }; im.src = p.img; }
  }
  function blob(cv) { return new Promise(function (res) { try { cv.toBlob(res, 'image/png'); } catch (e) { res(null); } }); }
  function fname(best) { return 'mira-color-match-' + best.color.handle + '.png'; }
  function saveCard(cv, best) {
    if (!LIVE) { toast('Op de website wordt je kaart hier opgeslagen.'); return; }
    blob(cv).then(function (b) {
      if (!b) { toast('Opslaan lukte niet. Maak een screenshot van je kaart.'); return; }
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fname(best);
      document.body.appendChild(a); a.click(); a.remove();
    });
  }
  function shareCard(cv, r, best) {
    if (!LIVE) { toast('Op je telefoon opent hier het deelmenu, met je kaart erbij.'); return; }
    blob(cv).then(function (b) {
      var file = b ? new File([b], fname(best), { type: 'image/png' }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'My MIRA Color Match', text: typeName(r) + ' · ' + best.color.name + '. Because every color tells a story.' }).catch(function () { });
      } else saveCard(cv, best);
    });
  }

  function render(opt) {
    var n = D.questions.length;
    var node = state.step < 0 ? intro() : state.step < n ? question(state.step) : state.revealed ? result() : reveal();
    if (state.step < n) state.revealed = false;
    if (typeof opt === 'number') {
      root.innerHTML = ''; root.appendChild(node);
      var btn = node.querySelectorAll('.mk-opt')[opt];
      if (btn) btn.focus({ preventScroll: true });
      return;
    }
    if (opt === 'keep') {
      var y = window.scrollY;
      root.innerHTML = ''; root.appendChild(node);
      window.scrollTo(0, y);
      return;
    }
    mount(node);
  }
  render();
})();
