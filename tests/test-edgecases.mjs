import { mockAnalyze, beforePayRisk } from './src/engine/mockAnalysis.ts';
console.log('=== Edge Cases ===');
let pass=0,fail=0;
function assert(c,m){ if(c){pass++; console.log('PASS',m)} else {fail++; console.log('FAIL',m)}}

// 1. Empty input -> defaults to delivery scam (should not crash)
{
  const r = mockAnalyze('');
  assert(r.isScam, 'empty defaults to scam not crash');
  assert(r.input.length>0, 'empty input replaced with example');
}
// 2. Very long input
{
  const long = 'A'.repeat(5000) + ' http://delivery-reschedule-secure-pay.in';
  const r = mockAnalyze(long);
  assert(r.isScam, 'long input handled');
  assert(r.risk<=98, 'long risk capped');
}
// 3. XSS attempt
{
  const xss = '<script>alert(1)</script> Your SBI account blocked http://sbi-secure-verify-kyc.net';
  const r = mockAnalyze(xss);
  assert(r.isScam, 'xss flagged as scam');
  assert(!r.input.includes('<script>') || r.input===xss, 'xss preserved as text not executed');
}
// 4. Only URL
{
  const r = mockAnalyze('http://sbi-secure-verify-kyc.net/login');
  assert(r.isScam, 'url only scam');
}
// 5. Legit with suspicious word but official domain should still be legit due to legitSignals?
{
  const legit = 'Your SBI account ending 4521 was credited with ₹12,000 on 30 Aug 2026. Avl bal: ₹84,320. If not you, call 18004253800. -SBI';
  const r = mockAnalyze(legit);
  assert(!r.isScam, 'legit SBI not flagged despite SBI word');
}
// 6. Mixed legit + scam signals? contains both legit pattern and urgent -> should prefer legit if 2 signals? Test bluedart legit
{
  const legit2 = 'Your BlueDart AWB 39201844561 is out for delivery today. Track at bluedart.com. OTP 8842 for delivery.';
  const r = mockAnalyze(legit2);
  assert(!r.isScam, 'legit bluedart not flagged');
}
// 7. Before I Pay edge: amount with commas, spaces, empty
{
  const r1 = beforePayRisk({who:'Unknown', action:'UPI payment', amount:'18,500', reason:'Emergency'});
  assert(r1.risk>=85, 'amount with comma parsed high risk');
  const r2 = beforePayRisk({who:'Bank', action:'Other', amount:'', reason:'Other'});
  assert(r2.risk<50, 'empty amount low risk');
  const r3 = beforePayRisk({who:'Unknown', action:'Share OTP', amount:'999999', reason:'Verification'});
  assert(r3.level==='Critical', 'huge amount critical');
}
// 8. beforePay with unknown who + qr
{
  const r = beforePayRisk({who:'Unknown', action:'Scan QR', amount:'50000', reason:'Emergency'});
  assert(r.risk>=90, 'unknown qr emergency huge risk');
}
// 9. mockAnalyze inputType preserved
{
  const r = mockAnalyze('http://pay-qr.in', 'qr');
  assert(r.inputType==='qr', 'qr type preserved');
  const r2 = mockAnalyze('screenshot fake', 'screenshot');
  assert(r2.inputType==='screenshot', 'screenshot type preserved');
}
// 10. Evidence for legit should all be safe, for scam at least one critical
{
  const scam = mockAnalyze('Your SBI blocked http://sbi-secure-verify-kyc.net');
  assert(scam.evidence.some(e=>e.status==='critical'), 'scam has critical');
  const legit = mockAnalyze('Your BlueDart AWB 39201844561 is out for delivery today. Track at bluedart.com. OTP 8842 for delivery.');
  assert(legit.evidence.every(e=>e.status==='safe'), 'legit all safe');
}
// 11. RiskLevel mapping sanity for beforePay
{
  const low = beforePayRisk({who:'Bank', action:'Other', amount:'10', reason:'Bill'});
  assert(low.level!=='Critical', 'low beforePay not critical');
  const high = beforePayRisk({who:'Unknown', action:'Transfer money', amount:'25000', reason:'Emergency'});
  assert(high.level==='Critical' || high.level==='High', 'high beforePay high/critical');
}

console.log(`Edge: ${pass} pass ${fail} fail`);
if(fail) process.exit(1);
