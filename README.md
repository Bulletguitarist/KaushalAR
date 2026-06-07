<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=3FB950&height=200&section=header&text=KaushalAR&fontSize=90&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=AR-Powered%20Skill%20Training%20for%20Blue-Collar%20India&descAlignY=60&descSize=18" width="100%"/>

<br/>

[![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-SDK%2056-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-1.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![License](https://img.shields.io/badge/License-MIT-3FB950?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey?style=for-the-badge&logo=android)](https://expo.dev)

<br/>

**KaushalAR** is India's first augmented reality skill training platform built for ITI (Industrial Training Institute) students and blue-collar workers. We deliver hands-on AR-guided training directly through a standard Android smartphone — no expensive hardware required.

<br/>

| 47M+ | ₹0 | 12+ | 3× |
|:---:|:---:|:---:|:---:|
| Target Students | Hardware Cost | Regional Languages | Faster Learning |

<br/>

</div>

---

## The Problem

India has **47 million blue-collar workers** who need quality skill training. Existing solutions are either English-only, require expensive VR hardware costing ₹5L+, or provide passive video content with no real guidance.

| Solution | Cost | Language | AR | Offline |
|---|---|---|---|---|
| Simbott | ₹5,00,000 headset | English | ✓ | ✗ |
| NSDC Portal | Free | English only | ✗ | ✗ |
| YouTube | Free | Mixed | ✗ | Partial |
| **KaushalAR** | **₹8,000 phone** | **Hindi + 11 langs** | **✓** | **✓** |

---

## Features

### AR Overlay Training
Real-time augmented reality overlays delivered directly through the phone camera. Step-by-step visual instructions appear on top of actual tools and workspaces — no markers, no headsets.

```
Supported Trades
─────────────────────────────────────────
⚡  Electrician     Domestic wiring, MCB, earthing
🔧  Plumber         Pipe fitting, valves, sanitation
🔥  Welder          Arc welding, MIG/TIG, safety
❄️  HVAC Tech       AC servicing, refrigerant, compressor
☀️  Solar (v1.2)    Panel installation, inverter, battery
🪚  Carpenter (v1.2) Furniture, joints, wood finishing
```

### Vernacular AI Mentor
Powered by Google Gemini 1.5 Flash. Students interact in Hindi (and 11+ regional languages) and receive instant, contextual answers. No English required.

### DigiLocker Certificate
Upon completing a trade module, students automatically receive a verifiable digital certificate aligned with NSDC standards — directly integrated with India's official DigiLocker platform.

### Offline-First Architecture
Entire course content compresses to under 50MB. The app functions fully without internet connectivity and syncs progress automatically when a connection becomes available.

### Gamification Engine
Streak tracking, points system, badges, and leaderboards modeled after Duolingo — driving 3× higher retention compared to passive video platforms.

```
Levels:  Beginner → Intermediate → Advanced → Expert
Badges:  First Step · Electrician · Centurion · 3-Day Streak · Expert
```

---

## Tech Stack

```yaml
Framework:      React Native + Expo SDK 56
AR Engine:      expo-camera with custom overlay system
AI Integration: Google Gemini 1.5 Flash API
Offline Storage: AsyncStorage with sync queue
Certificate:    DigiLocker API + native Share API
Backend (v2):   Node.js + Express + PostgreSQL
Hosting:        Railway.app / Render.com
Theme:          GitHub Premium Dark (#0D1117)
```

---

## Getting Started

### Prerequisites

```
Node.js  >= 18.0.0
npm      >= 9.0.0
Expo Go  (install from Google Play / App Store)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/KaushalAR.git
cd KaushalAR/mobile-app

# Install dependencies
npm install

# Start the development server
npx expo start
```

Open **Expo Go** on your phone, scan the QR code, and the app loads instantly.

### AI Mentor Setup

```bash
# 1. Visit aistudio.google.com
# 2. Generate a free API key
# 3. In the app: AI tab → ⚙️ Settings → Paste key → Save
# 4. Hindi AI mentor is now live
```

---

## Project Structure

```
KaushalAR/
├── mobile-app/
│   ├── src/
│   │   └── app/
│   │       └── index.tsx        # Main application (single-file architecture)
│   ├── assets/                  # Icons, splash screen
│   ├── app.json                 # Expo configuration
│   └── package.json
└── README.md
```

---

## Roadmap

```
v1.0  ✅  Core app — AR trainer, Hindi AI, Certificate, Gamification
v1.1  🔄  Real DigiLocker API + blockchain certificate verification
v1.2  📋  Solar Installer and Carpenter trade modules
v2.0  🔮  Voice input — speak in Hindi, AI responds with audio
v2.1  🔮  Employer marketplace — direct hiring by verified companies
v2.2  🔮  Peer learning — student-to-student mentorship
v3.0  🔮  NSDC empanelment + state government MoU integration
```

---

## Business Model

KaushalAR operates a B2B2C model with four revenue channels:

| Stream | Customer | Unit Economics |
|---|---|---|
| Platform License | ITI Institutes | ₹2–5L per institute / year |
| CSR Sponsorship | Employers (Tata, Bosch, L&T) | ₹5–25L per company / year |
| Per-Hire Fee | Employers hiring students | ₹3,000–8,000 per placement |
| Student Premium | Self-funded learners | ₹99–299 / month |

**Year 1 Target:** ₹80L ARR · 10 pilot ITIs · 5,000 active students

---

## Contributing

Contributions are welcome. Please follow the standard GitHub flow:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: description of your change"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please ensure your code is clean, commented, and follows the existing style conventions. Open an issue first for major changes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built for India's 47 million blue-collar workers.**

*Skill them. Certify them. Employ them.*

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/KaushalAR?style=social)](https://github.com/yourusername/KaushalAR)

<img src="https://capsule-render.vercel.app/api?type=waving&color=3FB950&height=100&section=footer" width="100%"/>

</div>
