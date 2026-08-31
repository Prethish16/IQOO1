import { create } from 'zustand'
import type { ChainEvent, Report, ScamResult } from '../engine/types'
import { DEMO_REPORTS, buildChainFromResult } from '../engine/mockAnalysis'

type Nav = 'dashboard'|'scan'|'lab'|'chain'|'protection'|'reports'|'settings'

interface State {
  nav: Nav
  setNav: (n: Nav)=>void
  lastResult: ScamResult|null
  setLastResult: (r: ScamResult|null)=>void
  chain: ChainEvent[]
  setChain: (c: ChainEvent[])=>void
  reports: Report[]
  addReport: (r: Report)=>void
  protectionActive: boolean
  toggleProtection: ()=>void
  scanInput: string
  setScanInput: (s:string)=>void
  selectedChainIdx: number|null
  setSelectedChainIdx: (i:number|null)=>void
}

export const useStore = create<State>((set)=>({
  nav: 'dashboard',
  setNav: (nav)=>set({nav}),
  lastResult: null,
  setLastResult: (lastResult)=> {
    if (lastResult) {
      const chain = buildChainFromResult(lastResult)
      set({ lastResult, chain })
      // also auto-add report
      const rep: Report = {
        id: lastResult.id,
        date: 'Just now',
        type: lastResult.category,
        risk: lastResult.level,
        action: lastResult.level==='Critical' ? 'Blocked' : lastResult.level==='High' ? 'Warned' : lastResult.isScam ? 'Reviewed' : 'Cleared',
        detail: lastResult.pattern.raw
      }
      // add locally via same set?
      // do separate
      set((s)=>({ reports: [rep, ...s.reports].slice(0,12) }))
    } else set({ lastResult })
  },
  chain: [
    { time:'10:02 AM', label:'Unknown caller', sub:'+91 62•••••11', status:'critical', detail:'Unknown caller before message', risk:'Critical' },
    { time:'10:04 AM', label:'Suspicious message', sub:'Bank impersonation', status:'critical', detail:'Your account will be blocked…', risk:'High' },
    { time:'10:05 AM', label:'External link opened', sub:'sbi-kyc-secure…', status:'critical', detail:'External link', risk:'Critical' },
    { time:'10:07 AM', label:'Fake website visited', sub:'Phishing site', status:'critical', detail:'Domain mismatch', risk:'Critical' },
    { time:'10:08 AM', label:'QR code detected', sub:'Payment QR', status:'warn', detail:'QR', risk:'High' },
    { time:'10:09 AM', label:'New beneficiary', sub:'First-time payee', status:'critical', detail:'New recipient', risk:'Critical' },
    { time:'10:09 AM', label:'₹18,500 payment initiated', sub:'7-min sequence', status:'critical', detail:'Rapid payment', risk:'Critical' },
    { time:'10:09 AM', label:'🛑 SCAMSTOP INTERVENTION', sub:'Payment paused', status:'blocked', detail:'Chain blocked', risk:'Blocked' },
  ],
  setChain: (chain)=>set({chain}),
  reports: DEMO_REPORTS,
  addReport: (r)=>set(s=>({ reports:[r,...s.reports]})),
  protectionActive: true,
  toggleProtection: ()=>set(s=>({ protectionActive: !s.protectionActive})),
  scanInput: '',
  setScanInput: (scanInput)=>set({scanInput}),
  selectedChainIdx: null,
  setSelectedChainIdx: (selectedChainIdx)=>set({selectedChainIdx}),
}))
