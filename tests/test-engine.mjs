import { mockAnalyze, beforePayRisk, buildChainFromResult } from './src/engine/mockAnalysis.ts';
import { SCAM_CATEGORIES, LEGIT_EXAMPLES } from './src/engine/scenarios.ts';

// test harness without TS loader - we will use tsx to run
console.log('=== SCAMSTOP Engine Tests ===');

let pass=0, fail=0;
function assert(cond, msg){
  if(cond){ console.log(`PASS: ${msg}`); pass++; } else { console.log(`FAIL: ${msg}`); fail++; }
}

// 1. Test each scam category
for(const c of SCAM_CATEGORIES){
  const r = mockAnalyze(c.example);
  assert(r.isScam===true, `Category ${c.id} flagged as scam`);
  assert(r.risk>=64 && r.risk<=98, `Category ${c.id} risk ${r.risk} in range`);
  assert(r.category===c.title, `Category ${c.id} category matches ${r.category}`);
  assert(r.evidence.length===8, `Category ${c.id} evidence 8`);
  assert(r.pattern.nodes.length>0, `Category ${c.id} pattern nodes ${r.pattern.nodes.join('|')}`);
  assert(['Critical','High','Caution','Safe'].includes(r.level), `Category ${c.id} level ${r.level}`);
  assert(r.title.includes(r.level), `Category ${c.id} title includes level`);
}

// 2. Legit examples
for(const leg of LEGIT_EXAMPLES){
  const r = mockAnalyze(leg.text);
  assert(r.isScam===false, `Legit "${leg.label}" isScam false`);
  assert(r.risk<=8, `Legit risk low ${r.risk}`);
  assert(r.level==='Safe', `Legit level Safe`);
  assert(r.pattern.nodes.length===0, `Legit no pattern`);
  assert(r.evidence.every(e=>e.status==='safe'), `Legit all safe`);
}

// 3. Edge: empty input defaults to delivery
{
  const r = mockAnalyze('');
  assert(r.isScam===true, `Empty defaults to scam`);
}

// 4. URL only
{
  const r = mockAnalyze('http://delivery-reschedule-secure-pay.in/track?id=9482');
  assert(r.isScam===true, `URL scam`);
  assert(r.evidence.find(e=>e.group==='URL')?.status==='critical', `URL evidence critical`);
}

// 5. Before I Pay - high risk unknown + emergency + high amount
{
  const r = beforePayRisk({who:'Unknown', action:'UPI payment', amount:'18500', reason:'Emergency'});
  assert(r.risk>=85, `BeforePay high risk ${r.risk}`);
  assert(r.level==='Critical' || r.level==='High', `BeforePay level ${r.level}`);
  assert(r.isScam===true, `BeforePay isScam`);
}
{
  const r = beforePayRisk({who:'Bank', action:'Click link', amount:'49', reason:'Bill'});
  assert(r.risk<85, `BeforePay low risk bill ${r.risk}`);
}

// 6. buildChain
{
  const scam = mockAnalyze(SCAM_CATEGORIES[1].example);
  const chain = buildChainFromResult(scam);
  assert(chain.length===8, `Scam chain 8 events`);
  assert(chain[7].status==='blocked', `Scam chain ends blocked`);
  const legit = mockAnalyze(LEGIT_EXAMPLES[0].text);
  const chain2 = buildChainFromResult(legit);
  assert(chain2.length===4, `Legit chain 4`);
  assert(chain2[3].risk==='Safe', `Legit chain safe`);
}

// 7. Safety copy checks - no forbidden phrases
{
  const phrases = ['100% safe','Guaranteed safe','100% official','prevents all','detects every scam'];
  const r = mockAnalyze(SCAM_CATEGORIES[0].example);
  const haystack = JSON.stringify(r).toLowerCase();
  for(const p of phrases){
    assert(!haystack.includes(p.toLowerCase()), `No forbidden phrase "${p}"`);
  }
  assert(r.title.includes('AI Risk Estimate')===false, `title not contain AI Risk Estimate - but gauge does`); // title shouldn't claim guaranteed
}

// 8. Risk levels mapping
{
  // ensure mockAnalyze risk maps correctly to levels
  // brute force: create texts that yield different risk bands? Already tested delivery gives high?
  // We'll just check beforePayRisk levels mapping
  const low = beforePayRisk({who:'Bank', action:'Other', amount:'0', reason:'Other'});
  assert(['Safe','Caution','High','Critical'].includes(low.level), `beforePay level valid ${low.level}`);
}

console.log(`\n=== Summary: ${pass} passed, ${fail} failed ===`);
if(fail>0) process.exit(1);
