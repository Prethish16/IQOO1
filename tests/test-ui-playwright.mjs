import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';

async function run(){
  console.log('Launching browser...');
  // try channel fallback
  let browser;
  try{
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch(e){
    console.log('msedge channel failed, trying default', e.message);
    browser = await chromium.launch({ headless: true });
  }
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }});
  const page = await ctx.newPage();
  // Capture console
  page.on('console', m=> console.log('PAGE CONSOLE:', m.text()));
  page.on('pageerror', e=> console.log('PAGE ERROR', e.message));

  console.log('Goto', BASE);
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1500);

  // take screenshot of dashboard
  await page.screenshot({ path: 'C:\\project\\test-screenshots-dashboard.png', fullPage: true });
  console.log('Dashboard screenshot saved');

  // helper to test nav
  const navChecks = [
    { id:'dashboard', label:'Dashboard', expect:'financial firewall' },
    { id:'scan', label:'Scan Message', expect:'Scan a suspicious message' },
    { id:'lab', label:'Scam Lab', expect:'SCAM LAB' },
    { id:'chain', label:'Fraud Chain', expect:'Fraud Chain' },
    { id:'protection', label:'Protection', expect:'Before I Pay' },
    { id:'reports', label:'Reports', expect:'Historical incidents' },
    { id:'settings', label:'Settings', expect:'Protection status' },
  ];

  let pass=0, fail=0;
  function assert(cond, msg){
    if(cond){ console.log('PASS',msg); pass++; } else { console.log('FAIL',msg); fail++; }
  }

  for(const n of navChecks){
    // try desktop nav button, fallback to more
    const btn = page.getByRole('button', { name: new RegExp(n.label, 'i') }).first();
    const visible = await btn.isVisible().catch(()=>false);
    if(!visible){
      console.log(`Nav button ${n.label} not visible in current viewport, trying mobile`);
      // try click via text
      await page.evaluate((label)=> {
        const els = Array.from(document.querySelectorAll('button'));
        const found = els.find(b=> b.textContent?.toLowerCase().includes(label.toLowerCase()));
        if(found) found.click();
      }, n.label);
    } else {
      await btn.click();
    }
    await page.waitForTimeout(700);
    const body = await page.textContent('body');
    const has = body?.toLowerCase().includes(n.expect.toLowerCase());
    assert(has, `Nav ${n.label} shows "${n.expect}"`);
    await page.screenshot({ path: `C:\\project\\test-screenshots-${n.id}.png`, fullPage: true });
  }

  // Test ScanMessage flow
  console.log('=== ScanMessage flow ===');
  await page.getByRole('button', { name: /Scan Message/i }).first().click();
  await page.waitForTimeout(700);
  // clear and type custom scam?
  const textarea = page.locator('#scan-input');
  await textarea.fill(''); // clear
  await textarea.fill('Your parcel could not be delivered due to incomplete address. Pay ₹49 to reschedule: http://delivery-reschedule-secure-pay.in/track?id=9482 Last attempt today');
  await page.getByRole('button', { name: /Analyze Message/i }).click();
  // wait for analysis 9*300=2700+ buffer
  await page.waitForTimeout(3500);
  let body = await page.textContent('body');
  assert(body?.includes('SCAM RISK'), 'Scan result shows SCAM RISK');
  assert(body?.includes('AI Risk Estimate'), 'Result shows AI Risk Estimate');
  assert(body?.includes('Why was this flagged'), 'Shows evidence panel');
  assert(body?.includes('DETECTED ATTACK PATTERN'), 'Shows attack pattern');
  // check gauge
  const gauge = await page.locator('text=AI Risk Estimate').first().isVisible().catch(()=>false);
  assert(gauge, 'Gauge label visible');

  // test legit
  await page.getByRole('button', { name: /Try legitimate/i }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Analyze Message/i }).click();
  await page.waitForTimeout(3500);
  body = await page.textContent('body');
  assert(body?.toLowerCase().includes('appears legitimate'), 'Legit result shows legitimate');
  assert(body?.includes('No automated system can guarantee'), 'Legit disclaimer present');

  // test ScamLab
  console.log('=== ScamLab ===');
  await page.getByRole('button', { name: /Scam Lab/i }).first().click();
  await page.waitForTimeout(700);
  const launchBtns = page.getByRole('button', { name: /Launch Simulation/i });
  const count = await launchBtns.count();
  assert(count===6, `Scam Lab has 6 scenarios, found ${count}`);
  await launchBtns.first().click();
  await page.waitForTimeout(700);
  body = await page.textContent('body');
  assert(body?.includes('SIMULATION'), 'Lab simulation opened');
  // click through steps until payment paused
  for(let i=0;i<5;i++){
    const nextBtn = page.getByRole('button', { name: /Continue|Open Link|Submit|Initiate|Pay/i }).first();
    const vis = await nextBtn.isVisible().catch(()=>false);
    if(!vis) break;
    await nextBtn.click();
    await page.waitForTimeout(500);
    body = await page.textContent('body');
    if(body?.includes('PAYMENT PAUSED')) break;
  }
  body = await page.textContent('body');
  assert(body?.includes('PAYMENT PAUSED'), 'Lab shows PAYMENT PAUSED');
  // view graph
  const graphBtn = page.getByRole('button', { name: /View Attack Graph/i });
  if(await graphBtn.isVisible()){
    await graphBtn.click();
    await page.waitForTimeout(700);
    body = await page.textContent('body');
    assert(body?.includes('ATTACK GRAPH'), 'Attack graph shown');
  }

  // test FraudChain
  console.log('=== FraudChain ===');
  await page.getByRole('button', { name: /Fraud Chain/i }).first().click();
  await page.waitForTimeout(700);
  body = await page.textContent('body');
  assert(body?.includes('INTERACTIVE TIMELINE'), 'FraudChain timeline present');
  // click first event
  const eventBtn = page.locator('button').filter({ hasText: 'Unknown caller'}).first();
  if(await eventBtn.isVisible()){
    await eventBtn.click();
    await page.waitForTimeout(500);
    body = await page.textContent('body');
    assert(body?.includes('Risk contribution'), 'Event detail shows risk contribution');
  }
  assert(body?.includes('FRAUD CHAIN RISK'), 'Chain risk score present');

  // test Protection Before I Pay
  console.log('=== Protection ===');
  await page.getByRole('button', { name: /Protection/i }).first().click();
  await page.waitForTimeout(700);
  body = await page.textContent('body');
  assert(body?.includes('Before I Pay'), 'Protection shows Before I Pay');
  assert(body?.includes('Your data. Your device'), 'Privacy section present');
  assert(body?.includes('AI ARCHITECTURE'), 'AI Arch present');
  // test Before I Pay analyze
  const analyzeBtn = page.getByRole('button', { name: /Analyze Before Paying/i });
  await analyzeBtn.click();
  await page.waitForTimeout(700);
  body = await page.textContent('body');
  assert(body?.includes('AI Risk Estimate'), 'Before I Pay shows risk');

  // test Reports
  console.log('=== Reports ===');
  await page.getByRole('button', { name: /^Reports$/i }).first().click();
  await page.waitForTimeout(700);
  body = await page.textContent('body');
  assert(body?.includes('Historical incidents'), 'Reports header');
  const viewChainBtns = page.getByRole('button', { name: /View Chain/i });
  const rc = await viewChainBtns.count();
  assert(rc>=4, `Reports has >=4 View Chain buttons, found ${rc}`);
  // click first view chain and verify navigates to FraudChain
  await viewChainBtns.first().click();
  await page.waitForTimeout(700);
  body = await page.textContent('body');
  assert(body?.includes('INTERACTIVE TIMELINE'), 'Reports View Chain navigates to FraudChain');

  // test Settings
  console.log('=== Settings ===');
  await page.getByRole('button', { name: /Settings/i }).first().click();
  await page.waitForTimeout(700);
  body = await page.textContent('body');
  assert(body?.includes('Protection status'), 'Settings shows Protection status');
  assert(body?.includes('Privacy controls'), 'Settings privacy');

  // test responsiveness - mobile viewport
  console.log('=== Responsive Mobile ===');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:\\project\\test-screenshots-mobile.png', fullPage: true });
  console.log('Mobile screenshot saved');
  // on mobile, bottom nav is scrollable; try multiple strategies
  let clicked = false;
  try{
    const btns = page.getByRole('button', { name: /Scan Message/i });
    const cnt = await btns.count();
    console.log(`Mobile: found ${cnt} Scan buttons`);
    for(let i=0;i<cnt;i++){
      const b = btns.nth(i);
      if(await b.isVisible()){
        await b.click({ timeout: 2000 });
        clicked = true; break;
      }
    }
    if(!clicked){
      await page.evaluate(()=>{
        const els = Array.from(document.querySelectorAll('button'));
        const found = els.find(b=> b.textContent?.toLowerCase().includes('scan'));
        if(found) found.click();
      });
      clicked = true;
    }
  } catch(e){ console.log('mobile click fail', e.message) }
  await page.waitForTimeout(800);
  body = await page.textContent('body');
  assert(body?.includes('Scan a suspicious message'), 'Mobile nav Scan works');
  // test horizontal scroll of bottom nav contains all 7 items
  const navCount = await page.evaluate(()=>{
    const bar = document.querySelector('div.fixed.bottom-0');
    if(!bar) return 0;
    return bar.querySelectorAll('button').length;
  });
  assert(navCount===7, `Mobile bottom nav has 7 items, found ${navCount}`);
  // reset viewport
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(500);

  // safety copy audit
  console.log('=== Safety copy audit ===');
  body = (await page.textContent('body')) || '';
  const forbidden = ['100% safe','Guaranteed safe','100% official','prevents all UPI fraud','detects every scam'];
  for(const f of forbidden){
    assert(!body.toLowerCase().includes(f.toLowerCase()), `No forbidden phrase "${f}"`);
  }

  console.log(`\n=== UI Tests Summary: ${pass} passed, ${fail} failed ===`);
  await browser.close();
  if(fail>0) process.exit(1);
}

run().catch(e=>{ console.error(e); process.exit(1); });
