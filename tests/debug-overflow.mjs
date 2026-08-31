import { chromium } from 'playwright';
const BASE='http://localhost:5173';
async function r(){
  const b=await chromium.launch({channel:'msedge', headless:true});
  const p=await b.newPage();
  await p.goto(BASE, {waitUntil:'domcontentloaded'});
  await p.waitForTimeout(1000);
  for(const vp of [{width:1280,height:900},{width:320,height:812}]){
    await p.setViewportSize(vp);
    await p.waitForTimeout(500);
    const info = await p.evaluate(()=>{
      const de=document.documentElement;
      const body=document.body;
      return {deScroll:de.scrollWidth, deClient:de.clientWidth, bodyScroll:body.scrollWidth, bodyClient:body.clientWidth, winInner:window.innerWidth, overflowingEls: Array.from(document.querySelectorAll('*')).filter(el=> el.scrollWidth > el.clientWidth + 5).map(el=>({tag:el.tagName, cls: (el.className||'').toString().slice(0,100), sw:el.scrollWidth, cw:el.clientWidth})).slice(0,8)}
    });
    console.log('VP', vp);
    console.log(JSON.stringify(info, null, 2));
  }
  await b.close();
}
r();
