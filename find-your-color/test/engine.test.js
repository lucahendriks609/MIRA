/* Controleert de data en de scoring zonder browser. Draai: npm test */
const assert = require('assert');
global.window = {};
global.document = { getElementById: () => null };
require('../src/mira-fyc-data.js');
require('../src/mira-fyc.js');
const D = window.MIRA_FYC, E = window.MIRA_FYC_ENGINE;
const traits = Object.keys(D.personalityTraits), seasons = Object.keys(D.seasonTraits);

/* 1. Weging */
const W = D.scoringWeights;
assert.ok(Math.abs(W.personality + W.season + W.preference - 1) < 1e-9, 'hoofdweging telt niet op tot 1');
const pp = W.preferenceParts; assert.ok(Math.abs(Object.values(pp).reduce((a, b) => a + b, 0) - 1) < 1e-9, 'preferenceParts telt niet op tot 1');

/* 2. Vragen verwijzen naar bestaande eigenschappen en seizoenen */
D.questions.forEach(q => {
  assert.ok(D.chapters.some(c => c.key === q.chapter), q.id + ': onbekend hoofdstuk');
  q.answers.forEach(a => {
    Object.keys((a.effects || {}).personality || {}).forEach(t => assert.ok(traits.includes(t), q.id + ': onbekende eigenschap ' + t));
    Object.keys((a.effects || {}).season || {}).forEach(s => assert.ok(seasons.includes(s), q.id + ': onbekend seizoen ' + s));
  });
});

/* 3. Iedere kleur is compleet */
const handles = new Set();
D.colors.forEach(c => {
  ['handle', 'name', 'family', 'story', 'personality', 'season', 'style', 'occasion', 'characteristics'].forEach(k => assert.ok(c[k] !== undefined, c.name + ' mist ' + k));
  seasons.forEach(s => assert.ok(typeof c.season[s] === 'number', c.name + ' mist seizoen ' + s));
  Object.keys(c.personality).forEach(t => assert.ok(traits.includes(t), c.name + ': onbekende eigenschap ' + t));
  assert.ok(!handles.has(c.handle), 'dubbele handle ' + c.handle); handles.add(c.handle);
});

/* 4. Simulatie: 20.000 willekeurige invullingen */
const rnd = n => Math.floor(Math.random() * n);
const first = {}, inTop = {};
for (let i = 0; i < 20000; i++) {
  const a = {};
  D.questions.forEach(q => {
    if (q.type === 'multi') { const k = q.min || rnd((q.max || 1) + 1); const s = new Set(); while (s.size < k) s.add(rnd(q.answers.length)); a[q.id] = [...s]; }
    else a[q.id] = rnd(q.answers.length);
  });
  const r = E.score(a);
  assert.strictEqual(r.top.length, W.topCount);
  r.top.forEach(t => assert.ok(t.percent <= W.maxDisplayPercent && t.percent >= W.minDisplayPercent, 'percentage buiten bereik'));
  const fams = {}; r.top.forEach(t => { fams[t.color.family] = (fams[t.color.family] || 0) + 1; });
  Object.values(fams).forEach(n => assert.ok(n <= W.maxPerFamily, 'te veel kleuren uit één familie'));
  first[r.top[0].color.name] = (first[r.top[0].color.name] || 0) + 1;
  r.top.forEach(t => { inTop[t.color.name] = 1; });
}
const never = D.colors.filter(c => !inTop[c.name]).map(c => c.name);
assert.deepStrictEqual(never, [], 'kleuren die nooit in een top 3 komen: ' + never.join(', '));
const neverFirst = D.colors.filter(c => !first[c.name]).map(c => c.name);
const most = Object.entries(first).sort((a, b) => b[1] - a[1])[0];
console.log('OK  ' + D.questions.length + ' vragen, ' + D.colors.length + ' kleuren');
console.log('    vaakst #1: ' + most[0] + ' (' + (most[1] / 200).toFixed(1) + '%)');
console.log('    nooit #1 (info): ' + (neverFirst.join(', ') || 'geen'));
