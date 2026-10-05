/* Klikt de quiz van begin tot eind door in een nep-browser (jsdom). Draai: npm test */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
const html = `<!doctype html><body><div class="mk"><div class="mk-wrap" id="mk-root"></div></div>
<script type="application/json" id="mk-config">${JSON.stringify({ mode: 'preview', baseUrl: 'https://houseofmira.com', products: {} })}</script></body>`;
const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window, d = w.document;
w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t, k) => k === 'measureText' ? () => ({ width: 10 }) : () => {}, set: () => true });
w.scrollTo = () => {};
w.eval(fs.readFileSync(path.join(root, 'src/mira-fyc-data.js'), 'utf8'));
w.eval(fs.readFileSync(path.join(root, 'src/mira-fyc.js'), 'utf8'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const btn = s => [...d.querySelectorAll('button')].find(x => x.textContent.includes(s));

(async () => {
  btn('Begin').click();
  for (const q of w.MIRA_FYC.questions) {
    if (d.querySelector('.mk-insight')) [...d.querySelectorAll('.mk-btn')].pop().click();
    if (q.type === 'multi') {
      for (let i = 0; i < (q.min || 1); i++) d.querySelectorAll('.mk-opt')[i].click();
      [...d.querySelectorAll('.mk-btn')].pop().click();
    } else { d.querySelectorAll('.mk-opt')[0].click(); await sleep(220); }
  }
  assert.ok(d.querySelector('.mk-reveal'), 'reveal-scherm ontbreekt');
  await sleep(4000);
  assert.ok(d.querySelector('.mk-result'), 'uitslag ontbreekt');
  assert.ok(/match/.test(d.querySelector('.mk-pct').textContent), 'matchpercentage ontbreekt');
  assert.strictEqual(d.querySelectorAll('.mk-rank li').length, 3, 'top 3 ontbreekt');
  btn('Niet helemaal').click();
  assert.ok(/misschien meer jij/.test(d.querySelector('.mk-commit').textContent), 'commitment werkt niet');
  btn('Ik twijfel tussen twee').click();
  const two = btn('Neem ').textContent; const names = two.replace('Neem ', '').split(' · ')[0].split(' en ');
  assert.notStrictEqual(names[0], names[1], 'twee keer dezelfde kleur aangeboden');
  console.log('OK  flow: intro → 7 vragen → reveal → uitslag → commitment → bezwaar');
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
