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
  if (data.id && pending.has(data.id)) {
    pending.get(data.id)(data.result);
    pending.delete(data.id);
  }
});

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = msgId++;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function screenshot(name) {
  const res = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(res.data, 'base64');
  const p = `${ARTIFACT_DIR}\\${name}`;
  fs.writeFileSync(p, buf);
  console.log(`  📸 Screenshot saved: ${name} (${buf.length} bytes)`);
}

async function evaluate(expr) {
  const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  return res.result?.value;
}

ws.on('open', async () => {
  console.log('✅ Connected to CDP target: SatQuery AI Workstation\n');

  await send('Page.enable');
  await send('Runtime.enable');

  // Scroll workstation into view
  await evaluate(`document.getElementById('workstation-viewport')?.scrollIntoView({ behavior: 'instant' })`);
  await sleep(800);

  // ─────────────────────────────────────────
  // TEST 5: EMPTY STATE
  // ─────────────────────────────────────────
  console.log('═══════════════════════════════════');
  console.log('TEST 5 — EMPTY STATE');

  const emptyMsg = await evaluate(`
    (function() {
      const all = Array.from(document.querySelectorAll('main p, main span'));
      const target = all.find(el => el.textContent.includes('Load a satellite layer'));
      return target ? target.textContent.trim() : 'NOT FOUND';
    })()
  `);
  console.log(`  Canvas empty state message: "${emptyMsg}"`);
  await screenshot('t5_empty_state.png');

  // ─────────────────────────────────────────
  // TEST 6 + TEST 1: Load Sample → Single Baseline
  // ─────────────────────────────────────────
  console.log('\n═══════════════════════════════════');
  console.log('TEST 6+1 — SINGLE BASELINE (Load Sample)');

  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('LOAD SAMPLE SENTINEL-2 TILE'));
    if (btn) btn.click();
  `);
  await sleep(1500);

  const singleImgs = await evaluate(`
    document.querySelectorAll('main img').length
  `);
  const singleSrc = await evaluate(`
    document.querySelector('main img')?.src?.split('/').slice(-1)[0]
  `);
  console.log(`  Image count in Single Baseline: ${singleImgs}`);
  console.log(`  Image src: ${singleSrc}`);
  await screenshot('t1_single_baseline.png');

  // ─────────────────────────────────────────
  // TEST 2: BI-TEMPORAL CHANGE
  // ─────────────────────────────────────────
  console.log('\n═══════════════════════════════════');
  console.log('TEST 2 — BI-TEMPORAL CHANGE');

  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Bi-Temporal Change'));
    if (btn) btn.click();
  `);
  await sleep(1500);

  const btImgs = await evaluate(`document.querySelectorAll('main img').length`);
  const btLabels = await evaluate(`
    Array.from(document.querySelectorAll('main *'))
      .filter(el => el.childElementCount === 0 && (el.textContent.trim() === 'BEFORE' || el.textContent.trim() === 'AFTER'))
      .map(el => el.textContent.trim())
  `);
  console.log(`  Image count in Bi-Temporal: ${btImgs}`);
  console.log(`  Labels found: ${JSON.stringify(btLabels)}`);
  await screenshot('t2_bitemporal.png');

  // ─────────────────────────────────────────
  // TEST 3: OPTICAL-SAR FUSION
  // ─────────────────────────────────────────
  console.log('\n═══════════════════════════════════');
  console.log('TEST 3 — OPTICAL-SAR FUSION');

  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Optical-SAR Fusion'));
    if (btn) btn.click();
  `);
  await sleep(1500);

  const sarImgs = await evaluate(`document.querySelectorAll('main img').length`);
  const sarLabels = await evaluate(`
    Array.from(document.querySelectorAll('main *'))
      .filter(el => el.childElementCount === 0 && (el.textContent.trim() === 'OPTICAL' || el.textContent.trim() === 'SAR'))
      .map(el => el.textContent.trim())
  `);
  console.log(`  Image count in Optical-SAR Fusion: ${sarImgs}`);
  console.log(`  Labels found: ${JSON.stringify(sarLabels)}`);
  await screenshot('t3_optical_sar.png');

  // ─────────────────────────────────────────
  // TEST 4: SWITCH Bi-Temporal → Single Baseline
  // ─────────────────────────────────────────
  console.log('\n═══════════════════════════════════');
  console.log('TEST 4 — DYNAMIC SWITCH (Bi-Temporal → Single Baseline)');

  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    btns.find(b => b.textContent.includes('Bi-Temporal Change'))?.click();
  `);
  await sleep(900);
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    btns.find(b => b.textContent.includes('Single Baseline'))?.click();
  `);
  await sleep(1200);

  const switchedImgs = await evaluate(`document.querySelectorAll('main img').length`);
  const afterPresent = await evaluate(`
    Array.from(document.querySelectorAll('main *'))
      .some(el => el.childElementCount === 0 && el.textContent.trim() === 'AFTER')
  `);
  console.log(`  Images after switch to Single Baseline: ${switchedImgs}`);
  console.log(`  AFTER label still present? ${afterPresent}`);
  await screenshot('t4_switched_single.png');

  console.log('\n═══════════════════════════════════');
  console.log('ALL TESTS COMPLETE ✅');
  ws.close();
  process.exit(0);
});

ws.on('error', (e) => {
  console.error('CDP WebSocket error:', e.message);
  process.exit(1);
});
