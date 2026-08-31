import { useStore } from '../store/useStore'
import { mockAnalyze, buildChainFromResult } from '../engine/mockAnalysis'
import { SCAM_CATEGORIES } from '../engine/scenarios'

function seedForReportType(type:string){
  const id = type.toLowerCase().includes('bank') ? 'bank'
    : type.toLowerCase().includes('delivery') ? 'delivery'
    : type.toLowerCase().includes('job') ? 'job'
    : type.toLowerCase().includes('family') ? 'family'
    : type.toLowerCase().includes('government') || type.toLowerCase().includes('gov') ? 'gov'
    : type.toLowerCase().includes('subscription') ? 'subscription'
    : type.toLowerCase().includes('utility') || type.toLowerCase().includes('toll') ? 'utility'
    : 'bank'
  return SCAM_CATEGORIES.find(c=>c.id===id)?.example ?? SCAM_CATEGORIES[0].example
}

export function Reports({ onOpenChain }: { onOpenChain:()=>void }) {
  const { reports } = useStore()
  const open = (r: typeof reports[0]) => {
    const ex = seedForReportType(r.type)
    const res = mockAnalyze(ex)
    res.level = r.risk as any
    res.risk = r.risk==='Critical' ? 94 : r.risk==='High' ? 76 : r.risk==='Caution' ? 42 : 8
    res.category = r.type
    res.title = `${r.risk} Risk — ${r.type}`
    const ch = buildChainFromResult(res)
    useStore.setState({ lastResult: res, chain: ch, selectedChainIdx: null })
    onOpenChain()
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Reports</h1>
        <p className="text-sm text-slate-400 mt-1">Historical incidents — click to open its complete Fraud Chain.</p>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold tracking-widest text-slate-500">
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Risk</th>
                <th className="text-left px-5 py-3">Action</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r=>(
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-5 py-4 text-slate-300 whitespace-nowrap">{r.date}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{r.type}</div>
                    <div className="text-xs text-slate-500">{r.detail.slice(0,48)}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold text-white ${r.risk==='Critical'?'bg-red-600': r.risk==='High'?'bg-orange-500': r.risk==='Caution'?'bg-yellow-500 text-slate-900':'bg-emerald-600'}`}>{r.risk}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${r.action==='Blocked'?'border-red-500/30 bg-red-500/10 text-red-300': r.action==='Warned'?'border-amber-500/30 bg-amber-500/10 text-amber-300':'border-white/10 bg-white/5 text-slate-300'}`}>{r.action}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={()=>open(r)} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-slate-100">View Chain</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-400">
        Demo data — reports are generated locally from your scans and simulations. Click <span className="text-white font-semibold">View Chain</span> to load that incident’s full Fraud Chain (timeline + risk). No backend required for prototype (§24). In production this would sync encrypted.
      </div>
    </div>
  )
}
