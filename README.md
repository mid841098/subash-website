# Subash P — Professional Interactive AI Portfolio Website

A modern, high-performance portfolio website built for **Subash P**, an Artificial Intelligence and Data Science undergraduate at **Chennai Institute of Technology**.

---

## 🚀 Key Highlights & Interactive Features

1. **Terminal AutoPilot Pro — Live In-Browser Simulator**
   - Directly models Subash's flagship multi-agent terminal automation project.
   - Interactive CLI with realistic typing, color-coded stdout, safety guardrail checks, and simulated Gemini reflection loop.
   - Try commands: `help`, `projects`, `skills`, `safety-scan`, `gemini-loop`, `about`, `experience`, `contact`, and `sudo hire` (easter egg!).

2. **Hero Section with Holographic Profile Visual**
   - High-resolution professional portrait in an interactive 3D tilt glassmorphism card.
   - Futuristic scanline animation, radar status pill (`● Available for Internships`), and live metric counters (500+ LeetCode, 89.25% ML Accuracy, 4 Systems, 6 Certifications).
   - Dynamic typing effect cycling through Subash's key technical specializations.

3. **Flagship Projects Showcase**
   - Interactive category filter (`All`, `Agentic AI & LLMs`, `Machine Learning`, `Security & Systems`).
   - Deep-dive modals displaying architecture pipelines, component flowcharts, metrics, and GitHub links for:
     - **Terminal AutoPilot Pro** (7-Agent Pipeline, Safety Guardrail, Gemini Reflection)
     - **CreditSense AI** (Random Forest 89.25% accuracy / 85.52% F1 score, Flask REST API)
     - **WaterWise ML** (Isolation Forest anomaly detection, Linear Regression 24/48h forecasts, SSE alerts)
     - **MeetingOS** (Offline spaCy NLP extraction, Tri-agent SLA escalation)

4. **Interactive Technical Skills Matrix**
   - Real-time search filter: type any technology (e.g. `Python`, `FastAPI`, `Gemini`, `SQL`, `scikit-learn`) to instantly highlight matching skills and dim others.
   - Category breakdown with animated proficiency bars.

5. **Verified Timeline & Achievements**
   - Interactive vertical timeline for Cyber Security Internships (**Codec Technologies** - AICTE/ICAC approved on National Internship Portal, **Thiranex** verified certificate, and **Eduskills** virtual programs).
   - Undergraduate degree at **Chennai Institute of Technology** (2025–2029).
   - 6 Cisco & AWS Certifications cards with verified badges.
   - Competitive honors (Semifinalist in **ET-AI Hackathon 2026**, 500+ LeetCode problems, Canadian University Dubai Hackathon).
   - Volunteer & leadership roles (Coffee House CIT, EDC CIT, Web3 Madras).

6. **Interactive Contact & Dispatch**
   - Direct cards with 1-click clipboard copy (`subash2007prakash@gmail.com` and `+91 7598520950`) and direct profiles for GitHub (`@Subash13-alt`) and LinkedIn (`subash-p-bb01b1382`).
   - Working interactive contact form that compiles inquiries into prefilled email dispatches.

7. **Theme Switcher & Web Audio FX**
   - Dark Mode (cyberpunk deep obsidian) & Light Mode toggle with persistence in `localStorage`.
   - Built-in futuristic sound effects generated via Web Audio API (no audio files needed, can be toggled on/off).
   - Verified printable Resume Modal viewable directly by clicking "Resume PDF" or pressing shortcut `R`.

---

## 📁 File Structure

```
d:\subash website\
├── index.html          # Main landing: Hero, Terminal AutoPilot Simulator & Partitions Grid
├── about.html          # Partition 1: Background, CIT Chennai B.Tech & Leadership
├── skills.html         # Partition 2: Interactive Technical Skills Matrix with live search
├── projects.html       # Partition 3: Flagship Projects with category filters & deep-dive modals
├── experience.html     # Partition 4: Career timeline, Cisco/AWS certs & hackathon honors
├── contact.html        # Partition 5: Direct channels, 1-click clipboard copy & dispatch form
├── README.md           # Documentation & deployment guide
├── assets\
│   └── subash.jpg      # Professional portrait photo
├── css\
│   └── style.css       # Unified responsive CSS, glassmorphism, animations & partition layout
└── js\
    └── main.js         # Unified engine (terminal, canvas, sound FX, filters, modal, routing)
```

---

## ⚡ How to Run & Preview

### Option 1: Direct Double Click
Simply double-click `index.html` in Windows File Explorer to open it in Chrome, Edge, Brave, or Firefox.

### Option 2: Local Python Server (Recommended)
Open PowerShell or Terminal in `d:\subash website` and run:
```powershell
python -m http.server 8000
```
Then visit: [http://localhost:8000](http://localhost:8000)

### Option 3: Node.js / NPX
```powershell
npx serve .
```

---

## 🌐 1-Click Deployment to the Web

### Deploying to GitHub Pages (Free)
1. Initialize git in `d:\subash website`:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit of Subash P portfolio"
   ```
2. Create a repository on GitHub (e.g. `subash-portfolio` or `Subash13-alt.github.io`).
3. Push to GitHub:
   ```powershell
   git remote add origin https://github.com/Subash13-alt/subash-portfolio.git
   git branch -M main
   git push -u origin main
   ```
4. In GitHub Repo Settings -> **Pages**, set source to `main` branch root `/`. Your website will be live in seconds!

### Deploying to Vercel or Netlify
- Drag and drop the `d:\subash website` folder into [Netlify Drop](https://app.netlify.com/drop) or import from GitHub on [Vercel](https://vercel.com) — zero configuration required!

---

## ⌨️ Keyboard Shortcuts
- `T` : Quick jump and focus on the **Terminal AutoPilot Simulator**
- `P` : Jump to **Projects**
- `C` : Jump to **Contact**
- `R` : Open **Resume Document Modal**
- `Esc` : Close open modals
