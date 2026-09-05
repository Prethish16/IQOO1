import { motion } from 'framer-motion'
import { ShieldCheck, MessageSquare, AlertTriangle, GitBranch, Zap, Activity, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'

export function Dashboard({ onScan, onLab }: { onScan:()=>void, onLab:()=>void }) {
  const { protectionActive, toggleProtection, reports } = useStore()
  const scanned = 1248 + reports.length
  const threats = 23 + (reports.filter(r=>r.risk==='Critical').length)
  const chains = 7 + (reports.filter(r=>r.action==='Blocked').length)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0F172A] via-[#111E3A] to-[#0B1220] p-6 sm:p-8">
        <div className="absolute -right-20 -top-20 w-[420px] h-[420px] bg-teal-500/10 rounded-full blur-[80px]" />
        <div className="absolute -left-20 -bottom-20 w-[380px] h-[380px] bg-violet-500/10 rounded-full blur-[80px]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold tracking-wide text-teal-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> FINWALL — Stop the scam before the payment.
          </div>
          <h1 className="mt-4 text-[30px] sm:text-[42px] font-black leading-[0.95] tracking-tight">
            An AI <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">financial firewall</span><br/> that understands the chain.
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-slate-400">
            <span className="text-slate-200 font-medium">Traditional fraud asks: “Is this transaction suspicious?”</span> <br/> <span className="text-white font-semibold">FINWALL asks: “Why is this person making this transaction right now?”</span> — analyzing <span className="text-slate-200">Message → Sender → Language → Link → Website → QR → Payment → Behavior</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onScan} className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-teal-500 transition shadow-[0_10px_30px_rgba(13,148,136,0.35)]">
              Scan a Message <ArrowRight size={16} />
            </button>
            <button onClick={onLab} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition backdrop-blur">
              Enter Scam Lab <Zap size={16} className="text-amber-300"/>
            </button>
          </div>
          {/* mini chain */}
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-semibold">
            {['Message','Link','Website','QR','Payment'].map((s,i)=>(
              <span key={s} className="flex items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">{s}</span>
                {i<4 && <span className="text-slate-600">→</span>}
              </span>
            ))}
            <span className="text-slate-600">→</span>
            <span className="rounded-full bg-red-600 px-3 py-1.5 text-white flex items-center gap-1.5 shadow-lg"><span>🛑</span> FINWALL</span>
          </div>
        </div>
      </div>

      {/* Protection status large card */}
      <div className={`relative overflow-hidden rounded-[24px] border p-[1px] ${protectionActive? 'bg-gradient-to-r from-emerald-500/40 via-teal-500/25 to-emerald-500/40' : 'bg-white/10'}`}>
        <div className="rounded-[23px] bg-gradient-to-br from-[#0F172A] to-[#0B1229] p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px]" />
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between relative">
            <div className="flex items-center gap-4">
              <motion.div animate={{ scale: protectionActive ? [1,1.06,1]:1 }} transition={{ repeat: protectionActive? Infinity:0, duration:2 }} className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${protectionActive?'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]':'bg-slate-800 text-slate-400 border-white/10'}`}>
                <ShieldCheck size={26} />
              </motion.div>
              <div>
                <div className="text-xs font-bold tracking-[0.18em] text-emerald-300 flex items-center gap-2">🛡 FINWALL PROTECTION <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${protectionActive?'bg-emerald-500 text-white':'bg-slate-700 text-slate-300'}`}>{protectionActive?'ACTIVE':'PAUSED'}</span></div>
                <div className="text-sm font-medium text-slate-300 mt-1 max-w-xl">Monitoring security-relevant activity and looking for suspicious social-engineering patterns.</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2"><Activity size={12}/> Cross-channel: message • sender • link • site • payment • behavior</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleProtection} className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${protectionActive?'bg-white text-slate-900 hover:bg-slate-100':'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{protectionActive?'Pause':'Activate'}</button>
              <button onClick={onScan} className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">Scan now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Universal model teaser */}
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur p-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-[0.18em] text-teal-300">UNIVERSAL SCAM MODEL</div>
          <h3 className="mt-2 text-xl font-black text-white">Different stories. Same attack.</h3>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
                  {['Delivery Scam','Bank Scam','Job Scam','Family Scam','Government Scam'].map(s=> <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-300">{s}</span>)}
          </div>
          <div className="mt-3 flex justify-center"><span className="text-slate-600">↓</span></div>
          <div className="text-xs text-slate-400">Different stories</div>
          <div className="text-slate-600">↓</div>
          <div className="text-xs text-slate-400">Same underlying manipulation</div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-bold">
            {['Impersonation','Urgency','Fear / Greed / Emotion','Redirection','Credential or Payment Request'].map(n=> <span key={n} className="rounded-full bg-teal-600 text-white px-3 py-1.5">{n}</span>)}
          </div>
          <div className="mt-4 flex justify-center"><span className="rounded-full bg-white text-slate-900 px-4 py-1.5 text-xs font-black">FINWALL</span></div>
        </div>
      </div>

      {/* Final CTA section inline preview */}
      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-[#0F766E] to-[#0B4A42] p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative">
          <div className="text-sm font-bold tracking-widest text-teal-100">FINAL</div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white">Don't just ask if the payment is suspicious.<br/>Ask why the user is making it.</h3>
          <div className="mt-2 text-teal-100 font-semibold">Understand the attack. Explain the risk. Stop the scam.</div>
          <button onClick={onScan} className="mt-5 rounded-full bg-white px-7 py-3 text-sm font-black text-teal-700 hover:bg-slate-100 transition">Try FINWALL — Scan a message</button>
        </div>
      </div>
    </div>
  )
}
