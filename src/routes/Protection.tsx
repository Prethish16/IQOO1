import { useState } from 'react'
import { motion } from 'framer-motion'
import { beforePayRisk } from '../engine/mockAnalysis'
import { RiskGauge } from '../components/RiskGauge'
import { Shield, Eye, Lock, Users, Smartphone, Globe } from 'lucide-react'

export function Protection() {
  const [who,setWho]=useState('Unknown')
  const [act,setAct]=useState('UPI payment')
  const [amt,setAmt]=useState('18500')
  const [reason,setReason]=useState('Emergency')
  const [res,setRes]=useState<ReturnType<typeof beforePayRisk>|null>(null)

  const analyze = ()=> setRes(beforePayRisk({who, action:act, amount:amt, reason}))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Protection</h1>
        <p className="text-sm text-slate-400 mt-1">Before I Pay • Privacy • AI Architecture • Universal Model</p>
      </div>

      {/* Before I Pay */}
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur p-6">
        <h2 className="text-lg font-black text-white">Before I Pay</h2>
        <p className="text-sm text-slate-400">Someone asking you for money? Check before you send it.</p>

        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="space-y-1.5">
            <span className="text-xs font-bold tracking-widest text-slate-400">WHO CONTACTED YOU?</span>
            <select value={who} onChange={e=>setWho(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white">
              {['Bank','Courier','Government','Friend/Family','Employer','Merchant','Unknown','Other'].map(o=> <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold tracking-widest text-slate-400">WHAT ARE THEY ASKING?</span>
            <select value={act} onChange={e=>setAct(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white">
              {['UPI payment','Scan QR','Share OTP','Share card details','Click link','Install app','Transfer money','Other'].map(o=> <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold tracking-widest text-slate-400">AMOUNT ₹</span>
            <input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="18500" className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white placeholder:text-slate-600" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold tracking-widest text-slate-400">WHY ARE YOU PAYING?</span>
            <select value={reason} onChange={e=>setReason(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white">
              {['Bill','Purchase','Emergency','Investment','Verification','Job/task','Other'].map(o=> <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>
        <button onClick={analyze} className="mt-4 rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-500">Analyze Before Paying</button>

        {res && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="mt-6 grid lg:grid-cols-[auto_1fr] gap-6 rounded-2xl border border-white/10 bg-[#0F172A] p-6">
            <RiskGauge risk={res.risk} level={res.level} />
            <div>
              <div className={`inline-flex rounded-full px-3 py-1 text-xs font-black text-white ${res.level==='Critical'?'bg-red-600': res.level==='High'?'bg-orange-500':'bg-emerald-600'}`}>{res.level} • {res.risk}% AI Risk Estimate</div>
              <div className="mt-2 text-sm font-bold text-white">{res.input}</div>
              <div className="mt-2 text-xs leading-relaxed text-slate-400">The AI combines your intent with available context (sender, urgency, domain, recipient). This is an AI risk estimate — verify independently via official channels.</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Share workflow */}
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
        <div className="text-xs font-bold tracking-[0.16em] text-teal-300">SHARE / PASTE WORKFLOW</div>
        <div className="mt-3 grid sm:grid-cols-4 gap-3 text-xs font-semibold">
          {[
            ['Paste Message','Paste any SMS/WhatsApp/email + analyze'],
            ['Paste URL','Check link reputation + domain mismatch'],
            ['Upload Screenshot','OCR reads image + QR + language'],
            ['Share to FINWALL','System share sheet → same engine'],
          ].map(([t,d])=> (
            <div key={t} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="font-bold text-white text-sm">{t}</div>
              <div className="text-slate-400 mt-1 leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-500">All inputs route to the same explainable analysis engine — reusable for future backend API.</div>
      </div>

      {/* Privacy */}
      <div className="rounded-[24px] border border-emerald-500/20 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 p-6">
        <h3 className="text-lg font-black text-white flex items-center gap-2"><Lock size={18} className="text-emerald-300"/> Your data. Your device. Your control.</h3>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs leading-relaxed">
          {[
            ['On-device where practical', 'Security analysis should prioritize on-device processing.'],
            ['Minimal signal sharing', 'Only security-relevant signals sent to backend when required.'],
            ['User control', 'You control what you submit for analysis.'],
          ].map(([k,v])=>(
            <div key={k} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="font-bold text-white">{k}</div><div className="text-slate-400 mt-1">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-300 flex gap-2"><Eye size={14} className="shrink-0 mt-0.5"/> Designed with privacy-first processing principles. <span className="text-slate-500">We do not claim “100% private” or “nothing ever leaves your phone.”</span></div>
      </div>

      {/* AI Architecture */}
      <div className="rounded-[24px] border border-white/10 bg-[#0F172A] p-6">
        <div className="text-xs font-bold tracking-[0.16em] text-teal-300 text-center">AI ARCHITECTURE</div>
        <div className="mt-6 flex flex-col items-center">
          {['MESSAGE • CALL CONTEXT • BROWSER • SCREEN / QR • PAYMENT • USER BEHAVIOR','EVENT EXTRACTION','CONTEXT FUSION','SOCIAL ENGINEERING ANALYSIS','FRAUD CHAIN ENGINE','RISK ENGINE','EXPLAINABLE RESULT','INTERVENTION'].map((n,i)=>(
            <div key={n} className="flex flex-col items-center w-full max-w-xl">
              <div className={`w-full rounded-xl border px-4 py-2.5 text-center text-xs font-bold ${i===0?'bg-white text-slate-900': i>=7?'bg-emerald-600 text-white border-emerald-500':'bg-white/5 text-slate-200 border-white/10'}`}>{n}</div>
              {i<7 && <div className="w-0.5 h-4 bg-white/20" />}
            </div>
          ))}
        </div>
      </div>

      {/* Key innovation */}
      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 text-center">
        <div className="text-xs font-bold tracking-[0.16em] text-slate-400">WE DON'T JUST DETECT SCAMS.</div>
        <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white">We detect the story that causes the payment.</h3>
        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-bold tracking-widest text-slate-500">TRADITIONAL SYSTEMS</div>
            <div className="mt-2 font-mono text-sm text-slate-300">Transaction → Fraud Score</div>
          </div>
          <div className="rounded-2xl border border-teal-500/30 bg-teal-600/10 p-4">
            <div className="text-xs font-bold tracking-widest text-teal-300">FINWALL</div>
            <div className="mt-2 font-mono text-sm text-white">Communication + Browser + Context + Behavior + Payment → Attack Chain → Risk</div>
          </div>
        </div>
        <div className="mt-4 inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-black text-slate-900">Transaction-centric → Context-centric</div>
      </div>
    </div>
  )
}
