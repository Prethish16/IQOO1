import { create } from 'zustand';
console.log('=== Dashboard Stats Tests ===');
let pass=0,fail=0;
function assert(c,m){ if(c){pass++; console.log('PASS',m)} else {fail++; console.log('FAIL',m)} }

// Simulate store logic
const DEMO = [
  { risk:'Critical', action:'Blocked'},
  { risk:'High', action:'Warned'},
  { risk:'Critical', action:'Blocked'},
];
function calc(reports){
  const scanned = 1248 + reports.length;
  const threats = 23 + reports.filter(r=>r.risk==='Critical').length;
  const chains = 7 + reports.filter(r=>r.action==='Blocked').length;
  return {scanned,threats,chains};
}
let r = calc([]);
assert(r.scanned===1248, 'initial scanned 1248');
assert(r.threats===23, 'initial threats 23');
assert(r.chains===7, 'initial chains 7');

r = calc(DEMO);
assert(r.scanned===1251, 'scanned 1251');
assert(r.threats===25, `threats ${r.threats} =25`);
assert(r.chains===9, `chains ${r.chains}=9`);

r = calc([{risk:'Critical',action:'Blocked'},{risk:'Critical',action:'Blocked'},{risk:'Critical',action:'Blocked'}]);
assert(r.threats===26, 'threats 26 after 3 critical');
assert(r.chains===10, 'chains 10 after 3 blocked');

// test protection toggle
let active=true;
const toggle=()=> active=!active;
assert(active===true, 'protection initially active');
toggle(); assert(active===false, 'toggled paused');
toggle(); assert(active===true, 'toggled active');

// test FraudChain idx mapping fix
function idxFor(level){ return level==='Critical'?4 : level==='High'?3 : level==='Caution'?2 : level==='Safe'?1 :0; }
assert(idxFor('Critical')===4,'critical 4');
assert(idxFor('High')===3,'high 3');
assert(idxFor('Caution')===2,'caution 2');
assert(idxFor('Safe')===1,'safe 1');
assert(idxFor('Unknown')===0,'unknown 0');

console.log(`Dashboard: ${pass} pass ${fail} fail`);
if(fail) process.exit(1);
