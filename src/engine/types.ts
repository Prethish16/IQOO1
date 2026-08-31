export type RiskLevel = 'Safe'|'Caution'|'High'|'Critical'
export type Confidence = 'Low'|'Medium'|'High'

export interface Evidence {
  id: string
  label: string
  group: 'Sender'|'Claimed organization'|'URL'|'Domain consistency'|'Language'|'Threat'|'Requested action'|'Social engineering'
  status: 'safe'|'warn'|'critical'
  detail: string
  icon: string
}

export interface AttackPattern {
  nodes: string[]
  raw: string // "Impersonation → Fear → ..."
}

export interface ScamResult {
  id: string
  input: string
  inputType: 'message'|'url'|'qr'|'screenshot'
  risk: number // 0-100
  level: RiskLevel
  confidence: Confidence
  evidence: Evidence[]
  pattern: AttackPattern
  category: string
  isScam: boolean
  title: string
  analyzedAt: string
}

export interface ChainEvent {
  time: string
  label: string
  sub: string
  status: 'normal'|'warn'|'critical'|'blocked'
  detail: string
  risk: string
}

export interface Report {
  date: string
  type: string
  risk: RiskLevel
  action: 'Blocked'|'Warned'|'Reviewed'|'Cleared'
  detail: string
  id: string
}
export type BeforePayInput = {
  who: string
  action: string
  amount: string
  reason: string
}
