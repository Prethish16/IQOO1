import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Link2, Image as ImageIcon, QrCode, Trash2, Sparkles, ShieldAlert, CheckCircle2, ChevronDown, AlertCircle } from 'lucide-react'
import { mockAnalyze } from '../engine/mockAnalysis'
import { SCAM_CATEGORIES, LEGIT_EXAMPLES } from '../engine/scenarios'
import { useStore } from '../store/useStore'
import { RiskGauge } from '../components/RiskGauge'

const STEPS = [
  'Reading message',
  'Identifying sender',
  'Detecting impersonation',
  'Analyzing language',
  'Inspecting URLs',
  'Checking organization consistency',
  'Detecting social-engineering tactics',
  'Building attack pattern',
  'Calculating scam risk',
]

export function ScanMessage() {
  const { scanInput, setScanInput, setLastResult, lastResult } = useStore()
  const [input, setInput] = useState(scanInput || SCAM_CATEGORIES[0].example)
  const [mode, setMode] = useState<'idle'|'analyzing'|'result'>('idle')
  const [progress, setProgress] = useState(0)
  const [expanded, setExpanded] = useState(true)
  const [inputType, setInputType] = useState<'message'|'url'|'qr'|'screenshot'>('message')
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<number| null>(null)

  useEffect(()=>{ setScanInput(input) }, [input, setScanInput])
  useEffect(()=>()=>{ if(timerRef.current) window.clearInterval(timerRef.current) }, [])

  const run = (text = input, type: typeof inputType = inputType) => {
    const trimmed = text.trim()
    if (!trimmed) { setError('Please paste a message, URL or payment request first.'); return }
    setError(null)
    setInputType(type)
    setMode('analyzing')
    setProgress(0)
    if(timerRef.current) window.clearInterval(timerRef.current)
    let i=0
    timerRef.current = window.setInterval(()=>{
      i++
      setProgress(i)
      if (i>=STEPS.length) {
        if(timerRef.current) window.clearInterval(timerRef.current)
        const r = mockAnalyze(text, type)
        setLastResult(r)
        setMode('result')
      }
    }, 300)
  }

  const clear = ()=> {
    setInput('')
    setMode('idle')
    setProgress(0)
    setError(null)
    // keep lastResult for reports history, but hide current result view
  }

  const handlePasteUrl = async () => {
    try{
      const txt = await navigator.clipboard.readText().catch(()=> '')
      if(txt && txt.trim()){ setInput(txt); run(txt,'url') } else { run(input,'url') }
    } catch { run(input,'url') }
  }

  const handleFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0]
    if(f){
      // mock OCR: set a synthetic scam-ish URL from image
      setInput(`[Screenshot: ${f.name}] ${SCAM_CATEGORIES[1].example.slice(0,120)}`)
      run(`[Screenshot: ${f.name}] ${SCAM_CATEGORIES[1].example}`, 'screenshot')
    }
    e.target.value=''
  }

  const handleScanQr = () => {
    // mock QR leads to suspicious pay link
    const qrText = 'QR: http://pay-secure-verify-qr.in/upi?pa=scam@upi&am=18500'
    setInput(qrText)
    run(qrText,'qr')
  }

  const canAnalyze = input.trim().length>0 && mode!=='analyzing'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Scan a suspicious message</h1>
        <p className="text-sm text-slate-400 mt-1">Paste a message, URL, or payment request and let FINWALL analyze it.</p>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold tracking-widest text-slate-400 flex items-center gap-2">INPUT <span className={`rounded-full px-2 py-0.5 text-[10px] border ${inputType==='message'?'bg-teal-600 text-white border-teal-500': inputType==='url'?'bg-blue-600 text-white': inputType==='qr'?'bg-amber-500 text-white':'bg-violet-600 text-white'}`}>{inputType.toUpperCase()}</span></div>
          <div className="flex items-center gap-2">
            <button onClick={()=>{setInput(SCAM_CATEGORIES[1].example); setInputType('message'); setError(null)}} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">Try an example</button>
            <button onClick={()=>{setInput(LEGIT_EXAMPLES[0].text); setInputType('message'); setError(null)}} className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500">Try legitimate ✓</button>
          </div>
        </div>
        <label htmlFor="scan-input" className="sr-only">Message to analyze</label>
        <textarea id="scan-input" aria-label="Message to analyze" value={input} onChange={e=>{setInput(e.target.value); if(error) setError(null)}} placeholder="Paste the suspicious SMS, WhatsApp message, email, or notification here..." className={`w-full min-h-[140px] rounded-2xl border px-4 py-3 text-sm leading-relaxed text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${error ? 'border-red-500/50 bg-red-500/[0.06] focus:ring-red-500' : 'border-white/10 bg-[#0F172A] focus:ring-teal-600'}`} />
        {error && <div className="mt-2 flex items-center gap-1.5 text-xs text-red-300"><AlertCircle size={12}/>{error}</div>}
        {!error && <div className={`mt-2 text-xs ${input.trim().length>500 ? 'text-amber-300':'text-slate-500'}`}>{input.length} chars {inputType!=='message' ? `• ${inputType}`:''}</div>}

        <div className="mt-4 flex flex-wrap gap-2">
          <button disabled={!canAnalyze} onClick={()=>run()} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition shadow-lg ${canAnalyze ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-teal-700/20' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`} aria-disabled={!canAnalyze}>
            <Search size={16}/> Analyze Message
          </button>
          <button onClick={handlePasteUrl} className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 flex items-center gap-1.5"><Link2 size={14}/> Paste URL</button>
          <label className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 flex items-center gap-1.5 cursor-pointer">
            <ImageIcon size={14}/> Upload Screenshot
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" aria-label="Upload screenshot" />
          </label>
          <button onClick={handleScanQr} className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 flex items-center gap-1.5"><QrCode size={14}/> Scan QR</button>
          <button onClick={clear} className="ml-auto rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-white/10 flex items-center gap-1.5"><Trash2 size={14}/> Clear</button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="text-slate-500">Also try:</span>
          {SCAM_CATEGORIES.slice(0,4).map(c=>(
            <button key={c.id} onClick={()=>{setInput(c.example); setInputType('message')}} className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-slate-400 hover:text-white hover:bg-white/10">{c.emoji} {c.title}</button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode==='analyzing' && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="rounded-[24px] border border-teal-500/20 bg-teal-500/[0.06] backdrop-blur p-6" role="status" aria-live="polite" aria-label="Analyzing">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white"><Sparkles size={16}/></span>
              <div>
                <div className="text-sm font-black tracking-wide text-white">FINWALL AI ANALYSIS</div>
                <div className="text-xs text-teal-200">Analyzing chain: message → sender → language → link → behavior</div>
              </div>
              <span className="ml-auto text-xs font-bold text-teal-300">{Math.round((progress/STEPS.length)*100)}%</span>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden" aria-hidden="true">
              <motion.div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400" initial={{width:0}} animate={{width:`${(progress/STEPS.length)*100}%`}} transition={{duration:0.28}} />
            </div>
            <div className="mt-4 grid sm:grid-cols-3 gap-2">
              {STEPS.map((s, idx)=>{
                const active = idx === progress-1
                const done = idx < progress
                return (
                  <div key={s} className={`rounded-xl border px-3 py-2.5 flex items-center gap-2 text-xs font-medium ${done ? 'bg-teal-600 text-white border-teal-500' : active ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done?'bg-white text-teal-700': active?'bg-teal-500 text-white animate-pulse':'bg-white/10 text-slate-400'}`}>{done?'✓':idx+1}</span>
                    <span className="leading-tight">{s}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 text-xs text-teal-200/70">Do not close — building attack pattern and calculating AI Risk Estimate…</div>
          </motion.div>
        )}

        {mode==='result' && lastResult && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-4">
            {/* Main result card */}
            <div className={`rounded-[24px] border p-[1px] ${lastResult.isScam ? (lastResult.level==='Critical' ? 'bg-gradient-to-r from-red-500/50 to-orange-500/40' : 'bg-gradient-to-r from-orange-500/40 to-amber-500/40') : 'bg-gradient-to-r from-emerald-500/40 to-teal-500/30'}`}>
              <div className="rounded-[23px] bg-[#0F172A] p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <RiskGauge risk={lastResult.risk} level={lastResult.level} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-black tracking-wide text-white ${lastResult.isScam ? (lastResult.level==='Critical' ? 'bg-red-600' : 'bg-orange-500') : 'bg-emerald-600'}`}>
                        {lastResult.isScam ? `🔴 SCAM RISK: ${lastResult.risk}%` : `🟢 SCAM RISK: ${lastResult.risk}%`}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">Confidence: {lastResult.confidence}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">AI Risk Estimate — Estimated Scam Probability</span>
                    </div>
                    <h3 className="mt-3 text-lg font-black text-white">{lastResult.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{lastResult.isScam ? 'High-risk social-engineering pattern detected. Do not tap links, share OTP, or pay.' : 'This message appears consistent with a legitimate communication based on the available signals.'}</p>

                    {!lastResult.isScam && (
                      <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-200">
                        No automated system can guarantee that a message is genuine. Verify sensitive requests through official channels when in doubt.
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {lastResult.isScam ? (
                        <>
                          <button onClick={()=>alert('Reported — thank you. This helps protect others nearby.')} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-500">Block & Report</button>
                          <button onClick={()=>alert('Summary copied to share with family.')} className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">Ask Family</button>
                          <button onClick={()=>{ setInput(''); setMode('idle');}} className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10">Scan another</button>
                        </>
                      ): (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/15 border border-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300"><CheckCircle2 size={14}/> Appears legitimate — still verify sensitive actions independently</span>
                      )}
                    </div>

                    <div className="mt-4 text-[11px] text-slate-500">Analyzed at {lastResult.analyzedAt} • {lastResult.inputType} • Paste/URL/QR/Screenshot share same engine</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why flagged */}
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur overflow-hidden">
              <button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><ShieldAlert size={14} className="text-amber-300"/></span>
                  <span className="text-sm font-bold text-white">Why was this flagged? — {lastResult.evidence.length} checks</span>
                </div>
                <span className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition ${expanded ? 'rotate-180':''}`} aria-hidden="true"><ChevronDown size={14}/></span>
              </button>
              <AnimatePresence>
              {expanded && (
                <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="px-6 pb-6">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {lastResult.evidence.map(e=> (
                      <div key={e.id} className={`rounded-2xl border p-3 flex gap-3 ${e.status==='critical' ? 'bg-red-500/10 border-red-500/20' : e.status==='warn' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${e.status==='critical' ? 'bg-red-600 text-white' : e.status==='warn' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>{e.status==='critical' ? '!' : e.status==='warn' ? '•' : '✓'}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white flex items-center gap-2">{e.group} <span className="text-[11px] font-normal text-slate-400">— {e.label}</span></div>
                          <div className="text-xs leading-relaxed text-slate-300 mt-1">{e.detail}</div>
                          <div className="mt-1.5 text-[10px] font-bold tracking-widest text-slate-500">{e.status.toUpperCase()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-slate-300">
                    <span className="font-bold text-white">FINWALL reasoning:</span> Detected a coordinated social-engineering pattern rather than relying on a single suspicious signal. The chain accumulates risk across sender → impersonation → urgency → redirection.
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            {/* Attack pattern */}
            <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-[#0F172A] to-[#0B1229] p-6">
              <div className="text-xs font-bold tracking-[0.16em] text-teal-300">DETECTED ATTACK PATTERN</div>
              <div className="mt-1 text-sm font-semibold text-white">{lastResult.pattern.raw}</div>

              <div className="mt-5 flex flex-col items-center">
                <div className="flex flex-col items-center gap-1.5 w-full max-w-xl">
                  {lastResult.pattern.nodes.length ? lastResult.pattern.nodes.map((n,i)=>(
                    <div key={n+i} className="flex flex-col items-center w-full">
                      <motion.div initial={{opacity:0, scale:0.96}} animate={{opacity:1, scale:1}} transition={{delay:i*0.09}} className={`w-full rounded-2xl border px-4 py-3 text-center text-sm font-black tracking-wide shadow ${i===0 ? 'bg-red-600 text-white border-red-500' : i===lastResult.pattern.nodes.length-1 ? 'bg-slate-900 text-white border-white/20' : 'bg-white/[0.06] border-white/10 text-white'}`}>
                        {n.toUpperCase()}
                      </motion.div>
                      {i < lastResult.pattern.nodes.length-1 && <motion.div initial={{height:0}} animate={{height:18}} transition={{delay:i*0.09+0.12}} className="w-0.5 bg-gradient-to-b from-teal-500 to-white/20" />}
                    </div>
                  )) : <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300">No attack pattern detected ✓</div>}
                  {lastResult.isScam && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}} className="mt-3 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white">
                      ✕ BLOCKED — FINWALL <span className="w-1 h-1 bg-white rounded-full"/> Payment paused
                    </motion.div>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-1.5 text-xs font-semibold">
                  {lastResult.pattern.nodes.map((n,i)=>(
                    <span key={n+i} className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full ${i%2===0?'bg-red-600':'bg-slate-800 border border-white/10'} text-white`}>{n.split(' ')[0]}</span>
                      {i<lastResult.pattern.nodes.length-1 && <span className="text-slate-600">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-300">
              <span className="font-bold text-white">Safety note:</span> Never claim 100% official / guaranteed safe. Always use <span className="font-semibold text-white">AI Risk Estimate</span>, verify independently through official apps or numbers. FINWALL explains <em>why</em> — you stay in control.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
