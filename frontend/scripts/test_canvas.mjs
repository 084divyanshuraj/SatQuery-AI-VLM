import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\sarra\\.gemini\\antigravity-ide\\brain\\0cd1af96-0f1d-4221-9dee-375544aba066';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log("Launching Edge with remote debugging...");
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1920,1080',
    '--disable-gpu',
    'about:blank'
  ]);

  await sleep(1500);

  // Get target page or create new one
  const newTargetRes = await fetch('http://localhost:9222/json/new?http://localhost:3000/?nointro=1');
  const target = await newTargetRes.json();
  console.log("Target created:", target.id);

  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data.result);
      pending.delete(data.id);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise(r => ws.onopen = r);

  await send('Page.enable');
  await send('Runtime.enable');

  // Wait for React to render and scroll to workstation
  await sleep(2500);
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('workstation-viewport')?.scrollIntoView({ behavior: 'instant' });
    `
  });
  await sleep(1000);

  async function takeScreenshot(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(artifactDir, name);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${outPath} (${buffer.length} bytes)`);
  }

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res.result?.value;
  }

  console.log("\n--- TEST 5: EMPTY STATE ---");
  const emptyText = await evaluate(`
    document.querySelector('main p')?.innerText
  `);
  console.log("Canvas empty state text:", emptyText);
  await takeScreenshot('canvas_test5_empty.png');

  console.log("\n--- TEST 6 & TEST 1: LOAD SAMPLE & SINGLE BASELINE ---");
  await evaluate(`
    // Find 'LOAD SAMPLE SENTINEL-2 TILE' button
    const btns = Array.from(document.querySelectorAll('button'));
    const loadBtn = btns.find(b => b.innerText.includes('LOAD SAMPLE SENTINEL-2 TILE'));
    if (loadBtn) loadBtn.click();
  `);
  await sleep(1200);

  const singleImagesCount = await evaluate(`
    document.querySelectorAll('main img[alt*="Sentinel"]').length
  `);
  const singleImageSrc = await evaluate(`
    document.querySelector('main img[alt*="Sentinel"]')?.src
  `);
  console.log("Single Baseline Image Count:", singleImagesCount);
  console.log("Single Baseline Image Src:", singleImageSrc);
  await takeScreenshot('canvas_test1_single_baseline.png');

  console.log("\n--- TEST 2: BI-TEMPORAL CHANGE ---");
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const bitemporalBtn = btns.find(b => b.innerText.includes('Bi-Temporal Change'));
    if (bitemporalBtn) bitemporalBtn.click();
  `);
  await sleep(1200);

  const bitemporalImagesCount = await evaluate(`
    document.querySelectorAll('main img[alt*="Sentinel"]').length
  `);
  const bitemporalLabels = await evaluate(`
    Array.from(document.querySelectorAll('main div')).filter(d => d.innerText === 'BEFORE' || d.innerText === 'AFTER').map(d => d.innerText)
  `);
  console.log("Bi-Temporal Image Count:", bitemporalImagesCount);
  console.log("Bi-Temporal Labels:", bitemporalLabels);
  await takeScreenshot('canvas_test2_bitemporal.png');

  console.log("\n--- TEST 3: OPTICAL-SAR FUSION ---");
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const crossmodalBtn = btns.find(b => b.innerText.includes('Optical-SAR Fusion'));
    if (crossmodalBtn) crossmodalBtn.click();
  `);
  await sleep(1200);

  const crossmodalImagesCount = await evaluate(`
    document.querySelectorAll('main img[alt*="Sentinel"]').length
  `);
  const crossmodalLabels = await evaluate(`
    Array.from(document.querySelectorAll('main div')).filter(d => d.innerText === 'OPTICAL' || d.innerText === 'SAR').map(d => d.innerText)
  `);
  console.log("Optical-SAR Image Count:", crossmodalImagesCount);
  console.log("Optical-SAR Labels:", crossmodalLabels);
  await takeScreenshot('canvas_test3_optical_sar.png');

  console.log("\n--- TEST 4: DYNAMIC SWITCHING (Bi-Temporal -> Single Baseline) ---");
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const bitemporalBtn = btns.find(b => b.innerText.includes('Bi-Temporal Change'));
    if (bitemporalBtn) bitemporalBtn.click();
  `);
  await sleep(800);
  console.log("Switched to Bi-Temporal. Now switching to Single Baseline...");
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const singleBtn = btns.find(b => b.innerText.includes('Single Baseline'));
    if (singleBtn) singleBtn.click();
  `);
  await sleep(1200);

  const switchedSingleCount = await evaluate(`
    document.querySelectorAll('main img[alt*="Sentinel"]').length
  `);
  const afterLabelPresent = await evaluate(`
    Array.from(document.querySelectorAll('main div')).some(d => d.innerText === 'AFTER')
  `);
  console.log("Images after switching back to Single Baseline:", switchedSingleCount);
  console.log("Is AFTER label present?", afterLabelPresent);
  await takeScreenshot('canvas_test4_switched_single.png');

  console.log("\n--- TEST 7: CHATBOT 'Find water areas' & GROUNDED WATER SEGMENTATION ---");
  await evaluate(`
    const chatInput = document.querySelector('input[placeholder*="Ask"]');
    if (chatInput) {
      chatInput.value = "Find water areas";
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
      chatInput.dispatchEvent(new Event('change', { bubbles: true }));
      const form = chatInput.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }
  `);
  await sleep(2000);

  const activeAnalysisImg = await evaluate(`
    document.querySelector('main img[src*="river_water_segmented"]')?.src
  `);
  const toggleButtons = await evaluate(`
    Array.from(document.querySelectorAll('main button')).filter(b => b.innerText.includes('RAW') || b.innerText.includes('ANALYSIS')).map(b => b.innerText)
  `);
  console.log("Active Analysis Result Img:", activeAnalysisImg);
  console.log("Toggle Buttons:", toggleButtons);
  await takeScreenshot('canvas_test7_water_segmentation.png');

  // Clean up
  edgeProc.kill();
  console.log("\nAll 7 tests complete!");
  process.exit(0);
}

run().catch(e => {
  console.error("Test error:", e);
  process.exit(1);
});
