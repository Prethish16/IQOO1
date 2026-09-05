import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Phone, MessageSquare, Globe, QrCode, CreditCard, ShieldAlert, ArrowRight } from 'lucide-react'
import { LAB_SCENARIOS } from '../engine/scenarios'
import { mockAnalyze } from '../engine/mockAnalysis'
import { useStore } from '../store/useStore'

export function ScamLab({ onBlocked }: { onBlocked: ()=>void }) {
  const { setLastResult } = useStore()
  const [active, setActive] = useState<string|null>(null)
  const [step, setStep] = useState(0)
  const [showGraph, setShowGraph] = useState(false)
  const sc = LAB_SCENARIOS.find(s=>s.id===active) ?? null
  const atEnd = sc ? step >= sc.steps.length : false

  const launch = (id:string)=> { setActive(id); setStep(0); setShowGraph(false) }
  const next = ()=> {
    if (!sc) return
    if (step < sc.steps.length-1) setStep(s=>s+1)
    else {
      // when reaching payment, generate a realistic ScamResult so FraudChain + Reports reflect this lab
      const msgStep = sc.steps.find(x=>x.type==='message') ?? sc.steps[0]
      const r = mockAnalyze(msgStep.body, 'message')
      // ensure high risk for lab demo
      r.risk = Math.max(r.risk, 91)
      r.level = 'Critical'
      r.category = sc.title
      r.title = `Critical Risk — ${sc.title} (Lab)`
      setLastResult(r)
      setStep(sc.steps.length);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">SCAM LAB</h1>
        <p className="text-sm text-slate-400 mt-1">Experience how a social-engineering attack unfolds — safely. No real money, no real links.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LAB_SCENARIOS.map(s=>(
          <div key={s.id} className="rounded-[22px] border border-white/10 bg-white/[0.04] backdrop-blur p-5 flex flex-col">
            <div className="text-2xl">{s.emoji}</div>
            <div className="mt-2 text-sm font-black text-white">{s.title}</div>
            <div className="text-xs text-slate-400">{s.subtitle}</div>
            <div className="mt-4 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300 w-fit">{s.amount ? `Amount: ${s.amount}` : 'Data theft risk'}</div>
            <button onClick={()=>launch(s.id)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-900 hover:bg-slate-100"><Play size={14}/> Launch Simulation</button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {sc && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="rounded-[24px] border border-white/10 bg-[#0F172A] overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-white/[0.03]">
              <div>
                <div className="text-xs font-bold tracking-[0.16em] text-teal-300">{sc.emoji} {sc.title.toUpperCase()} — SIMULATION</div>
                <div className="text-sm text-slate-400">{sc.subtitle} • Step {Math.min(step+1, sc.steps.length)} / {sc.steps.length}</div>
              </div>
              <button onClick={()=>setActive(null)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">Exit Lab</button>
            </div>

            <div className="p-6">
              {/* progress */}
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400" animate={{width:`${(Math.min(step, sc.steps.length)/sc.steps.length)*100}%`}} transition={{duration:0.4}} />
              </div>

              {!atEnd ? (
                <div className="mt-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400">
                      {sc.steps[step].type==='call' && <Phone size={12}/>}
                      {sc.steps[step].type==='message' && <MessageSquare size={12}/>}
                      {sc.steps[step].type==='website' && <Globe size={12}/>}
                      {sc.steps[step].type==='qr' && <QrCode size={12}/>}
                      {sc.steps[step].type==='payment' && <CreditCard size={12}/>}
                      STEP {step+1} — {sc.steps[step].type.toUpperCase()}
                    </div>
                    <div className="mt-3 text-sm font-bold text-white">{sc.steps[step].title}</div>
                    <div className="mt-2 rounded-xl bg-[#070A14] border border-white/10 p-4 text-sm leading-relaxed text-slate-300">
                      {sc.steps[step].body}
                    </div>
                    {sc.steps[step].type==='website' && (
                      <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">⚠️ Fake site preview — note the suspicious domain mismatch vs official bank.</div>
                    )}
                    {sc.steps[step].type==='qr' && (
                      <div className="mt-3 flex justify-center">
                        <div className="w-28 h-28 rounded-xl bg-white p-2 grid grid-cols-7 gap-0.5">
                          {Array.from({length:49}).map((_,i)=> <span key={i} className={`rounded-[1px] ${Math.random()>0.45?'bg-slate-900':'bg-white'}`} />)}
                        </div>
                      </div>
                    )}
                    <button onClick={next} className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-500">{sc.steps[step].cta} <ArrowRight size={16}/></button>
                  </div>

                  {/* mini why */}
                  <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="font-bold text-white">Who contacted?</div><div className="text-slate-400">Unknown • first contact</div></div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="font-bold text-white">Emotion triggered</div><div className="text-slate-400">Fear + urgency</div></div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="font-bold text-white">Where redirected?</div><div className="text-slate-400">External domain / QR</div></div>
                  </div>
                </div>
              ) : !showGraph ? (
                <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} className="mt-6">
                  <div className="rounded-[20px] border border-red-500/30 bg-gradient-to-br from-red-600/20 to-orange-500/10 p-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-black text-white">🛑 PAYMENT PAUSED</div>
                    <h3 className="mt-3 text-xl font-black text-white">CRITICAL SOCIAL-ENGINEERING RISK</h3>
                    <div className="mt-1 text-sm text-red-200">FINWALL interrupted the chain before money left.</div>

                    <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-bold">
                      {['Impersonation','Fear','Urgency','Phishing','Payment'].map((n,i)=>(
                        <span key={n} className="flex items-center gap-2">
                          <span className="rounded-full bg-red-600 text-white px-3 py-1.5">{n}</span>
                          {i<4 && <span className="text-red-300">→</span>}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 grid sm:grid-cols-3 gap-2 text-xs text-left">
                      {[
                        'Unknown caller — first contact',
                        'Fake identity — bank impersonation',
                        'Urgent threat — “blocked in 30 mins”',
                        'Suspicious website — domain mismatch',
                        'Payment request — new recipient',
                        'Rapid sequence — minutes',
                      ].map(e=> <div key={e} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300">• {e}</div>)}
                    </div>

                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                      <button onClick={()=>setShowGraph(true)} className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-900 hover:bg-slate-100">View Attack Graph</button>
                      <button onClick={()=>{ onBlocked(); setActive(null)}} className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">Back to Dashboard</button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-6">
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-6">
                    <div className="text-xs font-bold tracking-[0.16em] text-teal-300 text-center">ATTACK GRAPH — WHERE FINWALL INTERVENED</div>
                    <div className="mt-6 flex flex-col items-center">
                      {[
                        'FAKE BANK','IMPERSONATION','FEAR','URGENCY','PHISHING LINK','FAKE WEBSITE','QR','PAYMENT'
                      ].map((n,i)=>(
                        <div key={n} className="flex flex-col items-center w-full max-w-sm">
                          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} className={`w-full rounded-xl border px-4 py-2.5 text-center text-xs font-black tracking-wide ${n==='PAYMENT' ? 'bg-red-600 text-white border-red-500' : n==='FAKE BANK' ? 'bg-white text-slate-900' : 'bg-white/5 text-white border-white/10'}`}>{n}</motion.div>
                          {i<7 && <motion.div initial={{height:0}} animate={{height:16}} transition={{delay:i*0.08+0.05}} className="w-0.5 bg-white/20" />}
                        </div>
                      ))}
                      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.9, type:'spring'}} className="mt-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black">✕</motion.div>
                      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}} className="mt-2 rounded-full bg-emerald-600 px-5 py-2 text-xs font-black text-white">FINWALL — INTERVENTION</motion.div>
                      <div className="mt-4 text-center text-xs text-slate-400 max-w-md">Every scam is a <span className="text-white font-bold">story that causes payment</span>. FINWALL traces communication + context + behavior → attack chain → risk → explainable intervention.</div>
                    </div>
                    <div className="mt-6 flex justify-center">
                      <button onClick={()=>setActive(null)} className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-900">Done</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!active && (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-center">
          <div className="text-sm font-bold text-white">Tip for judges</div>
          <div className="text-xs text-slate-400 mt-1">Launch any scenario → click through call → message → fake site → QR → watch FINWALL pause the ₹ payment and show the Attack Graph. This is the core hackathon demo.</div>
        </div>
      )}
    </div>
  )
}
