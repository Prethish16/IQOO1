import { useState } from 'react'
import { ShieldCheck, Bell, Sliders, Users, Lock, Database, FlaskConical, Info } from 'lucide-react'
import { useStore } from '../store/useStore'

export function Settings(){
  const { protectionActive, toggleProtection } = useStore()
  const [sensitivity, setSensitivity]=useState(70)
  const [notify, setNotify]=useState(true)
  const [dataRet, setDataRet]=useState('30 days')

  const Row = ({icon:Icon, title, desc, children}:{icon:any,title:string,desc:string,children:any})=>(
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0"><Icon size={16}/></span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white">{title}</div>
        <div className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Protection status • Notifications • Sensitivity • Privacy • Data • Lab</p>
      </div>

      <div className="grid gap-4">
        <Row icon={ShieldCheck} title="Protection status" desc="FINWALL monitoring and intervention.">
          <button onClick={toggleProtection} className={`rounded-full px-5 py-2 text-sm font-bold ${protectionActive?'bg-emerald-600 text-white':'bg-white/10 text-slate-300 border border-white/10'}`}>{protectionActive?'ACTIVE':'Paused'}</button>
        </Row>

        <Row icon={Bell} title="Notification preferences" desc="How you want to be warned — notification, sound, voice.">
          <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={notify} onChange={e=>setNotify(e.target.checked)} className="accent-teal-600"/> Enable</label>
        </Row>

        <Row icon={Sliders} title="Scam sensitivity" desc="Higher = earlier warnings but more false positives. FINWALL stacks signals.">
          <div className="w-48">
            <input type="range" min={0} max={100} value={sensitivity} onChange={e=>setSensitivity(Number(e.target.value))} className="w-full accent-teal-600"/>
            <div className="text-xs text-slate-400 text-right">{sensitivity}%</div>
          </div>
        </Row>

        <Row icon={Users} title="Trusted contacts" desc="Family Guardian — who gets a gentle alert when a high-risk message arrives.">
          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white">Manage</button>
        </Row>

        <Row icon={Lock} title="Privacy controls" desc="On-device where possible, minimal signal sharing, you control submissions.">
          <span className="text-xs rounded-full bg-emerald-600/15 border border-emerald-500/20 text-emerald-300 px-3 py-1 font-semibold">Privacy-first</span>
        </Row>

        <Row icon={Database} title="Data retention" desc="How long reports and chains are kept locally.">
          <select value={dataRet} onChange={e=>setDataRet(e.target.value)} className="rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2 text-sm text-white">
            <option>7 days</option><option>30 days</option><option>90 days</option><option>Forever</option>
          </select>
        </Row>

        <Row icon={FlaskConical} title="Simulation mode" desc="Enable/disable Scam Lab demo data injection.">
          <span className="text-xs text-slate-400">Demo ON</span>
        </Row>

        <Row icon={Info} title="About FINWALL" desc="AI risk estimate, not a guarantee. Explainable, context-centric firewall. Version 0.1 prototype.">
          <span className="text-xs font-mono text-slate-500">v0.1.0 • prototype</span>
        </Row>
      </div>
    </div>
  )
}
