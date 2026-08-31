import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react'

export function FraudChain() {
  const { chain, selectedChainIdx, setSelectedChainIdx, lastResult } = useStore()
  const riskLevel = lastResult?.level ?? 'Critical'
  const riskNum = lastResult?.risk ?? 94

  const steps = ['Normal','Low','Medium','High','Critical']
  const idx = riskLevel==='Critical'?4 : riskLevel==='High'?3 : riskLevel==='Caution'?2 : riskLevel==='Safe'?1 :0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Fraud Chain</h1>
        <p className="text-sm text-slate-400 mt-1">SCAMSTOP doesn't just analyze the final transaction. It reconstructs what happened before it.</p>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-6">
        {/* timeline */}
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur p-6">
          <div className="text-xs font-bold tracking-[0.16em] text-teal-300">INTERACTIVE TIMELINE — CLICK ANY EVENT</div>
          <div className="mt-6 relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/10" />
            <div className="absolute left-[15px] top-2 w-0.5 bg-gradient-to-b from-teal-500 via-amber-500 to-red-600" style={{height: `${(chain.length-1)*64}px`}} />
            <div className="space-y-3">
              {chain.map((e,i)=>(
                <button key={i} onClick={()=>setSelectedChainIdx(i)} className={`relative w-full text-left flex gap-4 rounded-2xl border p-4 transition ${selectedChainIdx===i ? 'bg-white text-slate-900 border-white shadow-lg scale-[1.01]' : e.status==='blocked' ? 'bg-red-600 text-white border-red-500' : e.status==='critical' ? 'bg-white/[0.06] border-white/10 hover:bg-white/10 text-white' : 'bg-white/[0.03] border-white/5 text-slate-300'}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${e.status==='blocked' ? 'bg-white text-red-600 border-white' : e.status==='critical' ? 'bg-red-600 text-white border-red-500' : e.status==='warn' ? 'bg-amber-500 text-white border-amber-400' : 'bg-white/10 text-slate-400 border-white/10'}`}>
                    {e.status==='blocked' ? '🛑' : i+1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold ${selectedChainIdx===i?'text-slate-900' : e.status==='blocked'?'text-white':'text-white'}`}>{e.time}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold border ${e.status==='blocked' ? 'bg-white/20 border-white/30 text-white' : selectedChainIdx===i ? 'bg-slate-900 text-white' : 'bg-white/10 border-white/10 text-slate-300'}`}>{e.risk}</span>
                    </div>
                    <div className={`text-sm font-bold mt-1 ${selectedChainIdx===i?'text-slate-900':'text-white'}`}>{e.label}</div>
                    <div className={`text-xs ${selectedChainIdx===i?'text-slate-600':'text-slate-400'}`}>{e.sub}</div>
                  </div>
                  <ChevronRight size={14} className={`${selectedChainIdx===i?'text-slate-400':'text-white/30'} mt-2 shrink-0`} />
                </button>
              ))}
            </div>
          </div>
          {selectedChainIdx!==null && (
            <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="mt-4 rounded-2xl border border-white/10 bg-[#0F172A] p-4">
              <div className="text-xs font-bold tracking-widest text-slate-400">EVIDENCE</div>
              <div className="mt-1 text-sm font-bold text-white">{chain[selectedChainIdx].label} — {chain[selectedChainIdx].time}</div>
              <div className="text-xs text-slate-400">{chain[selectedChainIdx].sub}</div>
              <div className="mt-2 text-sm leading-relaxed text-slate-300">{chain[selectedChainIdx].detail}</div>
              <div className="mt-2 text-xs font-semibold text-teal-300">Risk contribution: {chain[selectedChainIdx].risk} — this event raised the chain score.</div>
              <button onClick={()=>setSelectedChainIdx(null)} className="mt-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white">Close</button>
            </motion.div>
          )}
        </div>

        {/* score */}
        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-[#0F172A] to-[#0B1229] p-6">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-teal-300"><AlertTriangle size={14}/> FRAUD CHAIN RISK</div>
            <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-black text-white ${riskLevel==='Critical' ? 'bg-red-600' : riskLevel==='High' ? 'bg-orange-500' : 'bg-emerald-600'}`}>{riskLevel.toUpperCase()} • {riskNum}% AI Risk Estimate</div>

            <div className="mt-5 space-y-2">
              {steps.map((s,i)=>(
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-20 text-xs font-bold ${i===idx ? 'text-white' : 'text-slate-500'}`}>{s}</div>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div initial={{width:0}} animate={{width: i<=idx? '100%' : '0%'}} transition={{delay:i*0.08}} className={`h-full ${i<=1?'bg-emerald-500': i===2?'bg-amber-500': i===3?'bg-orange-500':'bg-red-600'}`} />
                  </div>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${i===idx?'bg-white text-slate-900 border-white':'bg-white/10 border-white/10 text-transparent'}`}>✓</span>
                </div>
              ))}
            </div>

            <div className="mt-5 text-xs font-bold tracking-widest text-slate-400">CONTRIBUTING FACTORS</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {['Unknown sender','Impersonation','Urgency','Suspicious URL','New beneficiary','Unusual amount','Rapid event sequence'].map(f=>(
                <span key={f} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">{f}</span>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-slate-300">
              The chain accumulates evidence. One flag is not enough — SCAMSTOP waits until several independent signals line up, so you get fewer false alarms and fewer missed scams.
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            <div className="text-xs font-bold text-white">Why am I being warned?</div>
            <div className="mt-3 space-y-2 text-xs">
              {[
                ['Communication','An unknown sender initiated contact.'],
                ['Identity','The sender claims to represent a financial institution.'],
                ['Language','Urgent and threatening language was detected.'],
                ['Web','The message redirected to an external domain.'],
                ['Payment','A new payment recipient was introduced.'],
                ['Timeline','Multiple suspicious events occurred within minutes.'],
              ].map(([k,v])=>(
                <div key={k} className="flex gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                  <span className="font-bold text-white w-24 shrink-0">{k}</span><span className="text-slate-400">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-teal-600/15 border border-teal-500/20 p-3 text-xs leading-relaxed text-teal-100">
              <ShieldCheck size={14} className="inline -mt-0.5 mr-1"/> SCAMSTOP detected a <span className="font-bold text-white">coordinated social-engineering pattern</span> rather than relying on a single suspicious signal.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
