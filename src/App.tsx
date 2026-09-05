import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Search, FlaskConical, GitBranch, Shield, FileText, Settings as SettingsIcon,
  Menu, X, Zap, ShieldCheck, ArrowRight
} from 'lucide-react'
import { useStore } from './store/useStore'
import { Dashboard } from './routes/Dashboard'
import { ScanMessage } from './routes/ScanMessage'
import { ScamLab } from './routes/ScamLab'
import { FraudChain } from './routes/FraudChain'
import { Protection } from './routes/Protection'
import { Reports } from './routes/Reports'
import { Settings } from './routes/Settings'

const navItems = [
  { id:'dashboard', label:'Dashboard', icon: LayoutDashboard },
  { id:'scan', label:'Scan Message', icon: Search },
  { id:'lab', label:'Scam Lab', icon: FlaskConical },
  { id:'chain', label:'Fraud Chain', icon: GitBranch },
  { id:'protection', label:'Protection', icon: Shield },
  { id:'reports', label:'Reports', icon: FileText },
  { id:'settings', label:'Settings', icon: SettingsIcon },
] as const

export default function App(){
  const { nav, setNav, protectionActive, toggleProtection } = useStore()
  const [mobile,setMobile]=useState(false)

  const goto = (n: typeof nav)=> { setNav(n); setMobile(false); window.scrollTo({top:0, behavior:'smooth'}) }

  return (
    <div className="min-h-screen bg-[#070A14] text-slate-200 overflow-x-hidden">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-teal-700 focus:px-4 focus:py-2 focus:rounded-full focus:shadow">Skip to content</a>
      {/* bg accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[680px] h-[680px] bg-teal-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] -right-40 w-[520px] h-[520px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.5))]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070A14]/70 backdrop-blur-xl">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 flex items-center gap-3 h-[64px]">
          <button aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} aria-controls="mobile-menu" onClick={()=>setMobile(v=>!v)} className="lg:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            {mobile? <X size={16}/> : <Menu size={16}/>}
          </button>

          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-700/20">
              <ShieldCheck size={18} className="text-white"/>
            </span>
            <span className="text-[18px] font-black tracking-tight text-white">FINWALL</span>
            <span className="hidden sm:inline rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-widest text-slate-400">AI FIREWALL</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 ml-8" role="navigation" aria-label="Primary">
            {navItems.map(n=>(
              <button key={n.id} aria-current={nav===n.id ? 'page' : undefined} onClick={()=>goto(n.id as any)} className={`px-3.5 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${nav===n.id ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <n.icon size={14}/> {n.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={()=>goto('lab')} className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10">
              <Zap size={14} className="text-amber-300"/> Run Scam Simulation
            </button>
            <button onClick={()=>goto('scan')} className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-teal-500 transition shadow-lg shadow-teal-600/20">
              Scan a Message <ArrowRight size={14} className="hidden sm:inline"/>
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        <AnimatePresence>
        {mobile && (
          <motion.div id="mobile-menu" initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="lg:hidden border-t border-white/10 bg-[#0F172A] overflow-hidden">
            <nav className="p-3 grid grid-cols-2 gap-2" aria-label="Mobile navigation">
              {navItems.map(n=>(
                <button key={n.id} aria-current={nav===n.id ? 'page' : undefined} onClick={()=>goto(n.id as any)} className={`rounded-2xl border px-4 py-3 text-left flex items-center gap-2 text-sm font-semibold ${nav===n.id ? 'bg-white text-slate-900 border-white' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                  <n.icon size={16}/> {n.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
        </AnimatePresence>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-[240px] shrink-0">
          <div className="sticky top-[88px] space-y-4">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] backdrop-blur p-3">
              <div className="text-[11px] font-bold tracking-[0.16em] text-slate-500 px-2 py-1">NAVIGATION</div>
              <div className="mt-2 space-y-1">
                {navItems.map(n=>(
                  <button key={n.id} onClick={()=>goto(n.id as any)} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${nav===n.id ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <n.icon size={16}/> {n.label}
                    {n.id==='scan' && <span className="ml-auto w-2 h-2 rounded-full bg-teal-500"/>}
                    {n.id==='lab' && <span className="ml-auto text-[10px] rounded-full bg-amber-500 text-white px-1.5 py-0.5 font-black">DEMO</span>}
                  </button>
                ))}
              </div>
              <div className={`mt-4 rounded-2xl p-4 text-white border ${protectionActive ? 'bg-gradient-to-br from-teal-600 to-cyan-600 border-teal-500/30' : 'bg-slate-800 border-white/10'}`}>
                <div className="text-xs font-bold tracking-wide flex items-center gap-2">🛡 Protection: {protectionActive?'ACTIVE':'PAUSED'} <span className={`w-2 h-2 rounded-full ${protectionActive?'bg-emerald-300 animate-pulse':'bg-slate-500'}`} /></div>
                <div className={`text-xs mt-1 leading-relaxed ${protectionActive?'text-teal-100':'text-slate-400'}`}>{protectionActive?'Monitoring calls, messages, links & payment behavior.':'Protection paused — tap to resume monitoring.'}</div>
                <button onClick={()=> protectionActive ? goto('scan') : toggleProtection()} className="mt-3 w-full rounded-full bg-white py-2 text-xs font-black text-teal-700 hover:bg-slate-100 transition">{protectionActive?'Scan now':'Resume protection'}</button>
              </div>
            </div>

            <div className="rounded-[18px] border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs font-bold text-white">Scam categories</div>
              <div className="mt-2 space-y-1.5 text-xs">
                {['📦 Delivery','🏦 Bank','⚡ Utility','🎬 Subscription','👨‍👩‍👧 Family','💼 Job','📱 Spoof','🏛 Gov'].map(s=>(
                  <div key={s} className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-1.5 text-slate-400"><span>{s}</span><span className="w-1.5 h-1.5 rounded-full bg-teal-500/50"/></div>
                ))}
              </div>
              <div className="mt-3 text-[11px] leading-relaxed text-slate-500">Same attack → different stories. Impersonation → Urgency → Redirection → Payment.</div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs leading-relaxed text-emerald-200">
              <span className="font-bold text-white">Privacy-first.</span> Only security signals leave the device when required.
            </div>
          </div>
        </aside>

        {/* Main */}
        <main id="main" className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={nav} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} transition={{duration:0.2}}>
              {nav==='dashboard' && <Dashboard onScan={()=>goto('scan')} onLab={()=>goto('lab')} />}
              {nav==='scan' && <ScanMessage />}
              {nav==='lab' && <ScamLab onBlocked={()=>goto('chain')} />}
              {nav==='chain' && <FraudChain />}
              {nav==='protection' && <Protection />}
              {nav==='reports' && <Reports onOpenChain={()=>goto('chain')} />}
              {nav==='settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav - FIX: shows all 7 items with scroll, full labels for a11y */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-[#070A14]/95 backdrop-blur-xl">
        <div className="flex gap-1 px-2 py-2 overflow-x-auto scrollbar-none">
          {navItems.map(n=>(
            <button key={n.id} aria-label={n.label} aria-current={nav===n.id ? 'page' : undefined} onClick={()=>goto(n.id as any)} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold shrink-0 min-w-[68px] leading-tight ${nav===n.id?'text-white bg-white/10':'text-slate-500'}`}>
              <n.icon size={16}/> <span className="whitespace-nowrap">{n.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="lg:hidden h-[72px]" />
    </div>
  )
}
