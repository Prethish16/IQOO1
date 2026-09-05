import type { ChainEvent, Evidence, Report, ScamResult } from './types'
import { SCAM_CATEGORIES } from './scenarios'

const DOMAIN_RE = /https?:\/\/[^\s/$.?#].[^\s]*/gi

function analyze(input: string): { risks: string[], categoryId: string, domain?: string, isLegitHint: boolean } {
  const s = input.toLowerCase()
  const risks: string[] = []
  let cat = 'bank'
  let domain: string | undefined
  const m = input.match(DOMAIN_RE)
  if (m) domain = m[0]
  // legit heuristics: check official domains + no urgency
  const legitSignals = [
    input.includes('bluedart.com') && !s.includes('secure-pay'),
    s.includes('if not you, call 1800'),
    s.includes('avl bal:') && s.includes('sbi'),
  ].filter(Boolean).length

  if (legitSignals >= 2 || (s.includes('otp 8842') && s.includes('bluedart'))) {
    return { risks:[], categoryId:'legit', isLegitHint: true, domain }
  }

  if (s.includes('delivery') || s.includes('parcel') || s.includes('dtdc') || (s.includes('bluedart') && s.includes('secure'))) { risks.push('delivery'); cat='delivery' }
  if (s.includes('sbi')||s.includes('kyc')||s.includes('blocked')||s.includes('suspend')|| (s.includes('account')&&s.includes('verify'))) { risks.push('bank'); cat='bank' }
  if (s.includes('bescom')||s.includes('electricity')||s.includes('disconnected')||s.includes('toll')|| (s.includes('bill')&&s.includes('pay'))) { risks.push('utility'); cat='utility' }
  if (s.includes('netflix')||s.includes('subscription')||s.includes('payment failed')) { risks.push('subscription'); cat='subscription' }
  if (s.includes('mum')||s.includes('mom')||s.includes('new number')||s.includes('lost my phone')||s.includes('hospital')) { risks.push('family'); cat='family' }
  if ((s.includes('earn')&&s.includes('per day'))||s.includes('registration fee')||(s.includes('amazon')&&s.includes('task'))) { risks.push('job'); cat='job' }
  if (s.includes('own number')||s.includes('from your own')) { risks.push('spoof'); cat='spoof' }
  if (s.includes('income tax')||(s.includes('refund')&&s.includes('pan'))||(s.includes('gov')&&s.includes('verify'))) { risks.push('gov'); cat='gov' }

  if (s.includes('urgent')||s.includes('immediately')||s.includes('last attempt')||s.includes('tonight')||(s.includes('within')&&s.includes('hour'))) risks.push('urgency')
  if ((domain && !domain.includes('sbi.co.in') && !domain.includes('bluedart.com') && !domain.includes('gov.in')) || s.includes('secure-pay') || s.includes('secure-verify') || (domain && (domain.includes('secure')||domain.includes('verify')))) risks.push('suspicious-link')
  if (s.includes('otp')||s.includes('password')||s.includes('card')||s.includes('upi')||s.includes('qr')||s.includes('pay ₹')) risks.push('payment-request')
  if (s.match(/\+91/)||s.includes('unknown')) risks.push('sender')

  return { risks, categoryId: cat, domain, isLegitHint: false }
}

export function mockAnalyze(input: string, inputType: 'message'|'url'|'qr'|'screenshot' = 'message'): ScamResult {
  const trimmed = input.trim()
  if (!trimmed) {
    // default demo
    input = SCAM_CATEGORIES[0].example
  } else input = trimmed

  const { risks, categoryId, domain, isLegitHint } = analyze(input)
  if (isLegitHint) {
    const ev: Evidence[] = [
      { id:'sender', label:'Sender consistency', group:'Sender', status:'safe', detail:'Known pattern, not first-time unknown', icon:'✅' },
      { id:'org', label:'Organization consistency', group:'Claimed organization', status:'safe', detail:'Matches official sender ID', icon:'✅' },
      { id:'domain', label:'Official domain', group:'URL', status:'safe', detail:'No suspicious external link', icon:'✅' },
      { id:'lang', label:'Normal language', group:'Language', status:'safe', detail:'No urgency or threat language', icon:'✅' },
      { id:'urgency', label:'No suspicious urgency', group:'Threat', status:'safe', detail:'No “act now” pressure', icon:'✅' },
      { id:'cred', label:'No credential request', group:'Requested action', status:'safe', detail:'No OTP/password/payment push', icon:'✅' },
      { id:'pattern', label:'No known attack pattern detected', group:'Social engineering', status:'safe', detail:'Signals do not form a scam chain', icon:'✅' },
    ]
    return {
      id: Math.random().toString(36).slice(2,8),
      input,
      inputType,
      risk: Math.floor(2 + Math.random()*6),
      level: 'Safe',
      confidence: 'High',
      evidence: ev,
      pattern: { nodes: [], raw: 'No pattern' },
      category: 'Legitimate',
      isScam: false,
      title: 'Low Risk — Appears legitimate',
      analyzedAt: new Date().toLocaleString(),
    }
  }

  const cat = SCAM_CATEGORIES.find(c=>c.id===categoryId) ?? SCAM_CATEGORIES[1]
  // score
  let score = 52
  if (risks.includes('sender')) score+=10
  if (risks.includes('urgency')) score+=12
  if (risks.includes('suspicious-link')) score+=15
  if (risks.includes('payment-request')) score+=9
  if (risks.length >=4) score+=8
  score = Math.min(98, Math.max(64, score + Math.floor(Math.random()*6)))

  let level: ScamResult['level'] = 'High'
  if (score >= 88) level='Critical'
  else if (score >= 68) level='High'
  else if (score >= 38) level='Caution'
  else level='Safe'

  const evidence: Evidence[] = [
    { id:'sender', label:'Sender', group:'Sender', status: risks.includes('sender') ? 'critical' : risks.length>0 ? 'warn' : 'safe', detail: risks.includes('sender') ? 'Unknown sender — first contact, not in contacts' : risks.length>0 ? 'Sender not verified — first-time contact pattern' : 'Sender appears verified', icon:'🔴' },
    { id:'claimed', label:'Claimed organization', group:'Claimed organization', status:'critical', detail: `Claims to represent ${cat.title.split(' ')[0]} — impersonation`, icon:'🏦' },
    { id:'url', label:'URL', group:'URL', status: domain ? 'critical':'warn', detail: domain ? `Suspicious domain: ${domain?.slice(0,38)}` : 'External link detected', icon:'🔗' },
    { id:'domain', label:'Domain consistency', group:'Domain consistency', status:'critical', detail:'Does not match claimed organization’s official domain', icon:'🔴' },
    { id:'lang', label:'Language', group:'Language', status: risks.includes('urgency') ? 'critical':'warn', detail: risks.includes('urgency') ? 'Urgency detected — “last attempt”, “immediately”' : 'Persuasive language', icon:'🔴' },
    { id:'threat', label:'Threat', group:'Threat', status:'critical', detail:'Account suspension / service disconnection threat', icon:'⚠️' },
    { id:'action', label:'Requested action', group:'Requested action', status:'critical', detail:'Credential / payment request (OTP, link, UPI)', icon:'🔴' },
    { id:'social', label:'Social engineering', group:'Social engineering', status:'critical', detail:'Strong indicators — fear + urgency + redirection', icon:'🧠' },
  ]

  // adjust a couple to warn if lower score
  if (score < 85) {
    evidence[4].status='warn'
  }

  const patternNodes = cat.pattern.split('→').map(s=>s.trim())
  return {
    id: Math.random().toString(36).slice(2,8),
    input,
    inputType,
    risk: score,
    level,
    confidence: score>85?'High': score>65?'Medium':'Low',
    evidence,
    pattern: { nodes: patternNodes, raw: cat.pattern },
    category: cat.title,
    isScam: true,
    title: `${level} Risk — ${cat.title}`,
    analyzedAt: new Date().toLocaleString(),
  }
}

export function buildChainFromResult(r: ScamResult): ChainEvent[] {
  if (!r.isScam) return [
    { time:'10:04 AM', label:'Message received', sub:'Known sender • SBI', status:'normal', detail:'Matches official pattern, no threat', risk:'Low' },
    { time:'10:05 AM', label:'Domain check', sub:'sbi.co.in — verified', status:'normal', detail:'Official domain', risk:'Low' },
    { time:'10:06 AM', label:'Language check', sub:'No urgency', status:'normal', detail:'Normal transactional language', risk:'Low' },
    { time:'10:06 AM', label:'FINWALL', sub:'No chain detected', status:'normal', detail:'No intervention needed', risk:'Safe' },
  ]
  return [
    { time:'10:02 AM', label:'Unknown caller', sub:'+91 62•••••11 • First contact', status:'critical', detail:'Unknown sender initiated contact before message', risk:'Critical' },
    { time:'10:04 AM', label:'Suspicious message', sub:r.category, status:'critical', detail:r.input.slice(0,80), risk:'High' },
    { time:'10:05 AM', label:'External link opened', sub:r.evidence.find(e=>e.group==='URL')?.detail.slice(0,50) ?? 'Suspicious link', status:'critical', detail:'Redirect to external domain', risk:'Critical' },
    { time:'10:07 AM', label:'Fake website visited', sub:'Phishing — impersonating '+r.category.split(' ')[0], status:'critical', detail:'Domain mismatch', risk:'Critical' },
    { time:'10:08 AM', label:'QR code detected', sub:'Payment QR', status:'warn', detail:'QR leads to external UPI', risk:'High' },
    { time:'10:09 AM', label:'New beneficiary', sub:'First-time payee • Not in contacts', status:'critical', detail:'New recipient introduced', risk:'Critical' },
    { time:'10:09 AM', label:'₹18,500 payment initiated', sub:'Rapid sequence — 7 mins', status:'critical', detail:'Unusual amount + new beneficiary', risk:'Critical' },
    { time:'10:09 AM', label:'🛑 FINWALL INTERVENTION', sub:'Payment paused — social-engineering chain', status:'blocked', detail:'Impersonation → Fear → Urgency → Phishing → Payment', risk:'Blocked' },
  ]
}

export function beforePayRisk(i: { who:string, action:string, amount:string, reason:string }): ScamResult {
  const txt = `${i.who} ${i.action} ${i.amount} ${i.reason}`.toLowerCase()
  let s = 30
  if (['unknown','friend/family','courier'].includes(i.who.toLowerCase())||i.who==='Unknown') s+=18
  if (['upi payment','scan qr','share otp','transfer money'].includes(i.action.toLowerCase())) s+=16
  if (i.reason.toLowerCase().includes('emergency')||i.reason.toLowerCase().includes('verification')) s+=14
  if (Number(i.amount.replace(/[^0-9]/g,''))>10000) s+=10
  if (txt.includes('unknown')) s+=8
  s = Math.min(96, s)
  // reuse mockAnalyze with synthetic text
  const synthetic = `From ${i.who}: asks to ${i.action} ₹${i.amount} for ${i.reason}. Unknown sender, urgency, link.`
  const base = mockAnalyze(synthetic)
  base.risk = s
  base.level = s>=85?'Critical': s>=60?'High': s>=35?'Caution':'Safe'
  base.isScam = s>=45
  base.category = 'Before I Pay — '+i.reason
  base.input = synthetic
  return base
}

export const DEMO_REPORTS: Report[] = [
  { id:'1', date:'Today 10:09 AM', type:'Bank impersonation', risk:'Critical', action:'Blocked', detail:'SBI KYC phishing → payment ₹18,500' },
  { id:'2', date:'Yesterday 4:22 PM', type:'Delivery', risk:'High', action:'Warned', detail:'₹49 courier fee → fake link' },
  { id:'3', date:'Aug 28 11:03 AM', type:'Job scam', risk:'High', action:'Reviewed', detail:'₹5,000/day task scam → deposit' },
  { id:'4', date:'Aug 26 09:15 AM', type:'Subscription', risk:'Caution', action:'Cleared', detail:'Netflix billing — checked domain' },
  { id:'5', date:'Aug 24 07:40 PM', type:'Family emergency', risk:'Critical', action:'Blocked', detail:'“New number” ₹25k request' },
  { id:'6', date:'Aug 22 02:10 PM', type:'Government', risk:'High', action:'Warned', detail:'Tax refund PAN verification' },
]
