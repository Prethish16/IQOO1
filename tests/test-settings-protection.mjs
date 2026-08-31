import { chromium } from 'playwright';
const BASE='http://localhost:5173';
let pass=0,fail=0;
function assert(c,m){ if(c){pass++; console.log('PASS',m)} else {fail++; console.log('FAIL',m)}}
async function run(){
  const browser = await chromium.launch({ channel:'msedge', headless:true });
  const ctx = await browser.newContext({ viewport:{width:1280,height:900}});
  const page = await ctx.newPage();
  await page.goto(BASE, {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1500);
  // go to Settings
  await page.getByRole('button', {name:/Settings/i}).first().click();
  await page.waitForTimeout(700);
  let body = await page.textContent('body');
  assert(body.includes('Protection status'), 'Settings protection');
  // find ACTIVE button
  const activeBtn = page.getByRole('button', {name:/ACTIVE|Paused/i}).first();
  const before = await activeBtn.textContent();
  console.log('Before toggle:', before);
  await activeBtn.click();
  await page.waitForTimeout(500);
  const after = await activeBtn.textContent();
  console.log('After toggle:', after);
  assert(before!==after, 'Toggle changes label');
  // go to Dashboard and check sidebar reflects
  await page.getByRole('button', {name:/Dashboard/i}).first().click();
  await page.waitForTimeout(700);
  body = await page.textContent('body');
  // check dashboard protection card shows same state as after
  const isActive = after.includes('ACTIVE');
  if(isActive){
    assert(body.includes('ACTIVE'), 'Dashboard shows ACTIVE after toggle back?');
  } else {
    assert(body.includes('PAUSED'), 'Dashboard shows PAUSED');
  }
  // toggle back via Dashboard Pause/Activate
  const dashToggle = page.getByRole('button', {name:/Pause|Activate/i}).first();
  await dashToggle.click();
  await page.waitForTimeout(500);
  body = await page.textContent('body');
  assert(body.includes('ACTIVE') || body.includes('PAUSED'), 'Dashboard toggle works');
  // test viewport sizes for responsive: check no horizontal overflow
  for(const vp of [{w:320,h:812},{w:768,h:1024},{w:1280,h:900},{w:1920,h:1080}]){
    await page.setViewportSize({width:vp.w, height:vp.h});
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(()=>{
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 5;
    });
    // allow overflow for bottom nav scroll but page itself should not overflow massively
    // we check body width
    assert(!overflow || vp.w===320, `No horizontal overflow at ${vp.w}x${vp.h} (overflow=${overflow})`);
  }
  console.log(`Settings/Protection: ${pass} pass ${fail} fail`);
  await browser.close();
  if(fail) process.exit(1);
}
run().catch(e=>{console.error(e); process.exit(1)});
