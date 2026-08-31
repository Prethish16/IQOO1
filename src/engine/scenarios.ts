export type ScamCategory = {
  id: string
  title: string
  emoji: string
  indicators: string[]
  pattern: string
  example: string
  color: string
}

export const SCAM_CATEGORIES: ScamCategory[] = [
  { id:'delivery', title:'Fake Delivery Alerts', emoji:'📦', color:'bg-orange-500', pattern:'Delivery impersonation → Urgency → Link → Payment', indicators:['Unexpected package','Unknown sender','Fake delivery company','Small payment request','Address update request','Suspicious URL','Urgency'], example:'Your parcel could not be delivered due to incomplete address. Pay ₹49 to reschedule: http://delivery-reschedule-secure-pay.in/track?id=9482\nLast attempt today or parcel returned.' },
  { id:'bank', title:'Bank & Financial Scams', emoji:'🏦', color:'bg-red-600', pattern:'Bank impersonation → Fear → Urgency → Phishing → Credential/payment request', indicators:['Bank impersonation','Account suspension threat','Unauthorized transaction claim','Urgency','Login request','OTP/password request','Suspicious URL'], example:'ALERT: Your SBI account will be BLOCKED within 2 hours due to suspicious activity. Verify immediately: http://sbi-secure-verify-kyc.net/login\nFailure to verify will suspend your account.' },
  { id:'utility', title:'Utility / Toll Scams', emoji:'⚡', color:'bg-amber-500', pattern:'Authority impersonation → Threat → Urgency → Payment', indicators:['Fake unpaid bill','Threat of service disconnection','Late fee threat','Fake toll violation','Suspicious payment link','QR/payment request'], example:'Your electricity connection will be disconnected TONIGHT at 9 PM due to unpaid bill of ₹1,240. Pay immediately: http://bescom-bill-pay-fast.in\nAvoid late fee of ₹500.' },
  { id:'subscription', title:'Subscription & Billing Scams', emoji:'🎬', color:'bg-violet-600', pattern:'Brand impersonation → Account threat → Fake login → Credential/card theft', indicators:['Fake payment failure','Subscription cancellation threat','Fake renewal','Card details requested','Login request','Suspicious domain'], example:'Your Netflix payment failed. Your subscription will be cancelled today. Update card details: http://netflix-billing-update-secure.in\nLogin to continue watching.' },
  { id:'family', title:'Family Emergency Scams', emoji:'👨‍👩‍👧', color:'bg-rose-500', pattern:'Relationship impersonation → Emotional pressure → Urgency → Money transfer', indicators:['Unknown/new number','Claims to be family member','Sudden emergency','Emotional pressure','Urgent money request','New payment recipient'], example:'Hi mum, I lost my phone, this is my new number. I had an accident, need ₹25,000 urgently for hospital. Please UPI to 98765-43210 now. I will call later, phone battery low. Don\'t tell dad, he will worry.' },
  { id:'job', title:'Fake Job & Task Scams', emoji:'💼', color:'bg-teal-600', pattern:'Opportunity → Trust → Task → Deposit → Payment escalation', indicators:['Unsolicited job offer','Unrealistic earnings','No proper recruitment','Registration fee','Equipment fee','Task deposit','Repeated payment requests'], example:'Congratulations! You are selected for Amazon Work From Home. Earn ₹5,000/day completing simple tasks. Pay ₹499 registration fee to start: http://amazon-task-earning-pro.in\nLimited slots!' },
  { id:'spoof', title:'Own-Number Spoofing', emoji:'📱', color:'bg-slate-600', pattern:'Identity anomaly → Curiosity → Link → Phishing', indicators:['Message appears from own number','User did not perform claimed action','Curiosity/fear trigger','External verification link'], example:'You attempted to transfer ₹50,000 at 11:42 AM. If this was not you, verify immediately: http://self-verify-secure-check.in\nThis message is from your own number.' },
  { id:'gov', title:'Government & Tax Impersonation', emoji:'🏛', color:'bg-blue-700', pattern:'Authority impersonation → Fear/reward → Urgency → Data/payment request', indicators:['Government impersonation','Legal threat','Tax refund bait','Court/arrest threat','Benefits claim','Urgent payment/data request','Fake government domain'], example:'Income Tax Dept: Your refund of ₹18,420 is pending. Verify PAN immediately: http://incometax-refund-gov-verify.in\nLast day or refund will be forfeited. Legal action may follow.' },
]

export const LEGIT_EXAMPLES = [
  { label:'Legitimate bank alert ✓', text:'Your SBI account ending 4521 was credited with ₹12,000 on 30 Aug 2026. Avl bal: ₹84,320. If not you, call 18004253800. -SBI', risk:3 },
  { label:'Genuine delivery update', text:'Your BlueDart AWB 39201844561 is out for delivery today. Track at bluedart.com. OTP 8842 for delivery.', risk:8 },
]

export type LabScenario = {
  id: string
  title: string
  subtitle: string
  emoji: string
  steps: { type:'call'|'message'|'website'|'qr'|'payment', title:string, body:string, cta:string }[]
  amount?: string
}

export const LAB_SCENARIOS: LabScenario[] = [
  { id:'bank', emoji:'🏦', title:'Bank Impersonation', subtitle:'"Your account will be suspended."', amount:'₹18,500', steps:[
    { type:'call', title:'Incoming call — +91 80•••••09', body:'"This is your bank\'s security department. We detected suspicious activity on your account. You will receive an SMS to verify — do it immediately or your account will be blocked."', cta:'Continue' },
    { type:'message', title:'SMS from Unknown • +91 62•••••11', body:'SBI ALERT: Your account will be BLOCKED within 30 mins due to KYC failure. Verify now: http://sbi-kyc-secure-verify.net/login', cta:'Open Link' },
    { type:'website', title:'Secure Account Verification — sbi-kyc-secure-verify.net', body:'Enter net banking ID, password and OTP to restore access. Secure • Encrypted • RBI Approved (fake badges)', cta:'Submit Credentials' },
    { type:'qr', title:'Payment Verification Required', body:'Scan QR to pay ₹1 verification fee (refundable). Then your account will be restored.', cta:'Initiate Payment ₹18,500' },
  ]},
  { id:'delivery', emoji:'📦', title:'Fake Delivery', subtitle:'"Your package requires a ₹49 payment."', amount:'₹49', steps:[
    { type:'message', title:'SMS • Unknown courier', body:'Your DTDC parcel AWB 88291 could not be delivered — address incomplete. Pay ₹49 to reschedule: http://dtdc-reschedule-secure.in', cta:'Open Link' },
    { type:'website', title:'DTDC — Reschedule Delivery', body:'Enter address + pay ₹49 with card/UPI. Delivery tomorrow 10am.', cta:'Pay ₹49' },
    { type:'payment', title:'Payment request — New beneficiary', body:'UPI ID: dtdc-fee@fastpay • Amount: ₹49 (then escalates to ₹2,999)', cta:'Confirm Payment' },
  ]},
  { id:'electricity', emoji:'⚡', title:'Electricity Scam', subtitle:'"Your connection will be disconnected."', amount:'₹1,240', steps:[
    { type:'message', title:'SMS — BESCOM Power', body:'Your electricity will be DISCONNECTED tonight 9 PM. Unpaid bill ₹1,240. Pay now: http://bescom-quickpay-secure.in to avoid penalty.', cta:'Pay Now' },
    { type:'website', title:'BESCOM Quick Pay — overdue', body:'Enter consumer ID, mobile, then UPI/QR pay.', cta:'Pay ₹1,240' },
  ]},
  { id:'family', emoji:'👨‍👩‍👧', title:'Family Emergency', subtitle:'"I lost my phone. Send money urgently."', amount:'₹25,000', steps:[
    { type:'message', title:'WhatsApp • Unknown number', body:'Hi dad, its me Riya, lost my phone, using friend\'s phone. I need ₹25,000 urgently for hostel deposit, please send now to this UPI. I\'ll call after class. Don\'t call, network bad.', cta:'Send Money' },
    { type:'payment', title:'New UPI recipient', body:'upi: riya-new-urgent@okaxis • First-time payee • ₹25,000', cta:'Transfer ₹25,000' },
  ]},
  { id:'job', emoji:'💼', title:'Fake Job', subtitle:'"Earn ₹5,000/day from home."', amount:'₹499', steps:[
    { type:'message', title:'Telegram • HR Recruiter', body:'Amazon Hiring! Earn ₹5k/day liking products. No interview. Pay ₹499 registration + start earning today. http://amazon-tasks-pro.com', cta:'Register & Pay' },
    { type:'payment', title:'Task deposit', body:'Pay ₹499 → get task 1 → pay ₹2,000 to unlock higher earnings (escalation)', cta:'Pay Deposit' },
  ]},
  { id:'gov', emoji:'🏛', title:'Government Scam', subtitle:'"Your tax refund requires verification."', amount:'₹0', steps:[
    { type:'message', title:'SMS — IT Dept Govt of India', body:'IT Dept: Refund ₹18,420 approved. Verify PAN/bank in 24h: http://incometax-gov-refund.in/verify — Aadhaar required.', cta:'Verify PAN' },
    { type:'website', title:'Income Tax e-Filing — Refund', body:'Enter PAN, Aadhaar, bank account, OTP for refund credit.', cta:'Submit Details' },
  ]},
]
