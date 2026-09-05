# FINWALL — AI Financial Firewall

A real-time scam detection and fraud chain analysis tool that helps users identify social engineering attacks before they lose money.

## 🎯 Features

- **Message Analysis**: Scan SMS, WhatsApp, email, and payment requests for scam indicators
- **Fraud Chain Timeline**: Interactive visualization of how an attack unfolds step-by-step
- **Scam Lab**: Safe simulations of real-world social engineering attacks
- **Before I Pay**: Risk assessment tool to evaluate payment requests before sending money
- **Protection Status**: Real-time monitoring of security-relevant activity
- **Report History**: Track all scans and incidents with detailed analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Prethish16/SCAM-STOP.git
cd SCAM-STOP

# Install dependencies
npm install
```

### Development

```bash
# Start dev server (port 8000)
npm run dev

# Open in browser
# http://localhost:8000
```

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
SCAM-STOP/
├── src/
│   ├── components/          # Reusable UI components
│   ├── routes/              # Page components
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── ScanMessage.tsx   # Message scanning interface
│   │   ├── ScamLab.tsx       # Interactive simulations
│   │   ├── FraudChain.tsx    # Attack timeline visualization
│   │   ├── Protection.tsx    # Before-I-Pay risk assessor
│   │   ├── Reports.tsx       # Incident history
│   │   └── Settings.tsx      # User preferences
│   ├── engine/              # Core analysis engine
│   │   ├── mockAnalysis.ts   # Risk calculation & pattern detection
│   │   ├── scenarios.ts      # Pre-defined scam examples
│   │   └── types.ts          # TypeScript interfaces
│   ├── store/               # State management (Zustand)
│   ├── lib/                 # Utilities
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles (Tailwind)
│
├── config/                  # Optional configuration files
├── tests/                   # Test files & debug scripts
├── public/                  # Static assets
├── dist/                    # Production build output
│
├── vite.config.ts           # Vite bundler config
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies & scripts
└── README.md                # This file
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **State**: Zustand
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build**: PostCSS, Autoprefixer

## 📊 How It Works

### Risk Analysis Pipeline
1. **Parse Input** → Extract message, URL, or screenshot
2. **Identify Patterns** → Detect impersonation, urgency, language anomalies
3. **Cross-Channel Analysis** → Check sender, domain, consistency
4. **Calculate Score** → Combine signals into risk percentage
5. **Build Chain** → Create interactive timeline of attack progression

### Risk Levels
- 🟢 **Safe** (0-25%): Legitimate
- 🟡 **Caution** (26-50%): Minor red flags
- 🟠 **High** (51-75%): Significant risk
- 🔴 **Critical** (76-100%): Scam detected

## 🔒 Privacy

- **On-device processing**: All analysis happens in browser
- **No backend**: Demo is fully client-side
- **No data sent**: Messages aren't logged or transmitted
- **Demo mode**: Pre-populated with example scams

## 📱 Features Breakdown

### Dashboard
- Stats overview (messages scanned, threats detected)
- Protection status toggle
- Quick access to scanning tools

### Scan Message
- Paste messages, URLs, or payment requests
- Upload screenshots for OCR
- Scan QR codes
- Real-time analysis with progress tracking
- Example scams for testing

### Scam Lab
- Interactive simulations of real attacks
- Step-by-step progression through attack chain
- Educational visualization of how scams unfold
- No real money or links involved

### Fraud Chain
- Interactive timeline of all attack events
- Click any event to see evidence & risk contribution
- Visual risk meter (Safe → Critical)
- Contributing factors breakdown

### Before I Pay
- Input payment details (who, what, amount, why)
- Get AI risk estimate before sending money
- Verify independently via official channels

### Reports
- Historical incident tracking
- Click any report to load its Fraud Chain
- Risk categorization and action taken

### Settings
- Toggle protection status
- Adjust sensitivity
- Notification preferences
- Data retention policy
- Privacy controls

## 🧪 Testing

Test files are in `/tests`:
```bash
npm test                    # Run all tests
node tests/test-engine.mjs  # Test analysis engine
```

## 📝 Example Scams

Pre-loaded scenarios include:
- 📦 Delivery Scams (fake tracking)
- 🏦 Bank Impersonation (OTP requests)
- 💼 Job Scams (remote work fraud)
- 👨‍👩‍👧 Family Scams (urgent money requests)
- 🏛️ Government Scams (tax/legal threats)
- 🎁 Subscription Fraud
- 💡 Utility Scams (overdue bills)

## 🚀 Deployment

```bash
# Build for production
npm run build

# Output goes to dist/
# Deploy dist/ to any static hosting (Vercel, Netlify, GitHub Pages)
```

## 📄 License

This is a prototype/demo. Use for educational purposes.

## 🤝 Contributing

Feedback and improvements welcome!

---

**Stay safe. Think before you pay. FINWALL.** 🛡️
