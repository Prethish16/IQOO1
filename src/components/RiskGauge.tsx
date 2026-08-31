import { motion } from 'framer-motion'

export function RiskGauge({ risk, level }: { risk:number, level:string }) {
  const normalized = Math.min(100, Math.max(0, risk))
  const angle = (normalized/100)*270 // 270 deg arc
  const color = level==='Critical' ? '#EF4444' : level==='High' ? '#F97316' : level==='Caution' ? '#EAB308' : '#10B981'
  const bg = '#1E293B'
  // SVG circular gauge 270deg from 135deg to 45deg (clockwise)
  const r = 72, cx=90, cy=90, stroke=10
  const startAngle = 135, endAngle = 135 + (normalized/100)*270
  const polar = (a:number)=> {
    const rad = (a*Math.PI)/180
    return { x: cx + r*Math.cos(rad), y: cy + r*Math.sin(rad)}
  }
  const p1 = polar(startAngle)
  const p2 = polar(endAngle)
  const large = angle>180 ? 1:0
  return (
    <div className="relative flex flex-col items-center" role="img" aria-label={`Scam risk ${risk} percent, level ${level}, AI Risk Estimate`}>
      <div className="relative w-[180px] h-[180px]">
        <svg width={180} height={180} viewBox="0 0 180 180" className="overflow-visible" aria-hidden="true">
          {/* track */}
          <path d={`M ${polar(135).x} ${polar(135).y} A ${r} ${r} 0 1 1 ${polar(405).x} ${polar(405).y}`} fill="none" stroke={bg} strokeWidth={stroke} strokeLinecap="round" />
          {/* value */}
          <motion.path d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:1.1, ease:'easeOut'}}
          />
          {/* ticks */}
          <circle cx={cx} cy={cy} r={2} fill="white" opacity={0.6}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-4xl font-black tracking-tight" style={{color}} aria-hidden="true">{risk}%</div>
          <div className="text-[11px] font-bold tracking-[0.18em] text-slate-400 mt-1" aria-hidden="true">{level.toUpperCase()}</div>
          <div className="text-[10px] text-slate-500 mt-1">AI Risk Estimate</div>
        </div>
      </div>
      <div className="flex gap-1.5 mt-2 text-[10px] font-semibold text-slate-500" aria-hidden="true">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/>Safe</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"/>Caution</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"/>High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"/>Critical</span>
      </div>
    </div>
  )
}
