import { WebSocket } from 'ws';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\sarra\\.gemini\\antigravity-ide\\brain\\0cd1af96-0f1d-4221-9dee-375544aba066';
const PAGE_ID = 'C938E0F78F1A430976DBA881F272DCFF';
const WS_URL = `ws://localhost:9222/devtools/page/${PAGE_ID}`;

let msgId = 1;
const pending = new Map();
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
const ws = new WebSocket(WS_URL);
ws.on('message', (raw) => {
  const data = JSON.parse(raw);
  if (data.id && pending.has(data.id)) { pending.get(data.id)(data.result); pending.delete(data.id); }
});
function send(method, params = {}) {
  return new Promise(r => { const id = msgId++; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
}
async function screenshot(name) {
  const res = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACT_DIR}\\${name}`, Buffer.from(res.data, 'base64'));
  console.log(`  📸 ${name}`);
}
async function evaluate(expr) {
  const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  return res.result?.value;
}

ws.on('open', async () => {
  await send('Page.enable');
  await send('Runtime.enable');
  
  // Click Bi-Temporal Change button
  await evaluate(`
    (function() {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.trim().includes('Bi-Temporal Change'));
      if (btn) { console.log('Found button, clicking...'); btn.click(); return 'CLICKED'; }
      return 'NOT_FOUND - buttons: ' + btns.map(b => b.textContent.trim().substring(0,20)).join(' | ');
    })()
  `).then(v => console.log('Click result:', v));
  
  await sleep(2000);
  await screenshot('debug_bitemporal_after_click.png');
  
  // Deep DOM inspection
  const domInfo = await evaluate(`
    (function() {
      const imgs = Array.from(document.querySelectorAll('img'));
      const allText = document.body.innerText;
      const hasBefore = allText.includes('BEFORE');
      const hasAfter = allText.includes('AFTER');
      const mode = document.querySelector('[class*="emerald-200"]')?.textContent;
      return JSON.stringify({
        imgCount: imgs.length,
        imgSrcs: imgs.slice(0,5).map(i => i.src.split('/').slice(-1)[0]),
        hasBefore,
        hasAfter,
        activeBtn: mode
      });
    })()
  `);
  console.log('DOM info after bi-temporal click:', domInfo);
  
  // Check what React state shows
  const reactInfo = await evaluate(`
    (function() {
      // Try to find React fiber
      const main = document.querySelector('main');
      const key = Object.keys(main || {}).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
      return key ? 'React fiber found: ' + key : 'No React fiber on main element';
    })()
  `);
  console.log('React info:', reactInfo);
  
  ws.close();
  process.exit(0);
});
ws.on('error', (e) => { console.error('CDP error:', e.message); process.exit(1); });
