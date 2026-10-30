/**
 * SUBASH P - INTERACTIVE PORTFOLIO ENGINE
 * Includes: Canvas neural network, Interactive Terminal Simulator,
 * Typing FX, Project Filtering & Modals, Web Audio FX, Real-time Skill Filter,
 * Theme Controller, and Toast Notification System.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. SOUND EFFECTS (Web Audio API - No external assets required)
  // -------------------------------------------------------------------------
  const SoundController = {
    enabled: false,
    audioCtx: null,

    init() {
      const soundToggle = document.getElementById('sound-toggle');
      const soundIcon = document.getElementById('sound-icon');

      if (!soundToggle) return;

      soundToggle.addEventListener('click', () => {
        this.enabled = !this.enabled;
        if (this.enabled && !this.audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.audioCtx = new AudioContext();
        }

        if (this.enabled) {
          soundIcon.className = 'fa-solid fa-volume-high text-accent';
          Toast.show('Sound effects enabled 🔊', 'info');
          this.playBeep(650, 0.08, 'sine');
        } else {
          soundIcon.className = 'fa-solid fa-volume-xmark';
          Toast.show('Sound effects muted 🔇', 'info');
        }
      });
    },

    playBeep(freq = 440, duration = 0.05, type = 'sine') {
      if (!this.enabled || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {
        console.warn('Audio playback not allowed or failed:', e);
      }
    },

    playSuccess() {
      if (!this.enabled) return;
      this.playBeep(520, 0.06, 'triangle');
      setTimeout(() => this.playBeep(780, 0.12, 'triangle'), 60);
    },

    playClick() {
      if (!this.enabled) return;
      this.playBeep(380, 0.04, 'sine');
    }
  };

  SoundController.init();

  // -------------------------------------------------------------------------
  // 2. TOAST NOTIFICATION SYSTEM
  // -------------------------------------------------------------------------
  const Toast = {
    container: document.getElementById('toast-container'),

    show(message, type = 'info', duration = 3000) {
      if (!this.container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let icon = 'fa-circle-info';
      if (type === 'success') icon = 'fa-circle-check';
      if (type === 'warn') icon = 'fa-triangle-exclamation';

      toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
      this.container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(15px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  };

  // -------------------------------------------------------------------------
  // 3. THEME TOGGLE (DARK / LIGHT)
  // -------------------------------------------------------------------------
  const ThemeController = {
    init() {
      const toggleBtn = document.getElementById('theme-toggle');
      const themeIcon = document.getElementById('theme-icon');
      const savedTheme = localStorage.getItem('subash-portfolio-theme') || 'dark';

      document.documentElement.setAttribute('data-theme', savedTheme);
      this.updateIcon(savedTheme, themeIcon);

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          SoundController.playClick();
          const current = document.documentElement.getAttribute('data-theme');
          const next = current === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          localStorage.setItem('subash-portfolio-theme', next);
          this.updateIcon(next, themeIcon);
          Toast.show(`Switched to ${next} theme`, 'info', 2000);
        });
      }
    },

    updateIcon(theme, iconEl) {
      if (!iconEl) return;
      if (theme === 'dark') {
        iconEl.className = 'fa-solid fa-moon';
      } else {
        iconEl.className = 'fa-solid fa-sun';
      }
    }
  };

  ThemeController.init();

  // -------------------------------------------------------------------------
  // 4. DYNAMIC TYPING EFFECT
  // -------------------------------------------------------------------------
  const TypingEffect = {
    words: [
      'Multi-Agent AI Systems Architect',
      'Full-Stack Machine Learning Engineer',
      'Cybersecurity & AI Safety Specialist',
      'FastAPI & Gemini LLM Pipeline Developer',
      'B.Tech AI & Data Science Undergrad @ CIT'
    ],
    el: document.getElementById('typed-text'),
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    delay: 110,

    init() {
      if (!this.el) return;
      this.type();
    },

    type() {
      const currentWord = this.words[this.wordIndex];
      if (this.isDeleting) {
        this.el.textContent = currentWord.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        this.el.textContent = currentWord.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      let speed = this.delay;
      if (this.isDeleting) speed /= 2;

      if (!this.isDeleting && this.charIndex === currentWord.length) {
        speed = 2200; // Pause at end of word
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        speed = 400;
      }

      setTimeout(() => this.type(), speed);
    }
  };

  TypingEffect.init();

  // -------------------------------------------------------------------------
  // 5. AMBIENT INTERACTIVE CANVAS (Neural Network / Constellation)
  // -------------------------------------------------------------------------
  const CanvasConstellation = {
    canvas: document.getElementById('ambient-canvas'),
    ctx: null,
    particles: [],
    mouse: { x: null, y: null, radius: 140 },
    particleCount: 50,

    init() {
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();

      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
      window.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });

      this.createParticles();
      this.animate();
    },

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.particleCount = Math.floor((this.canvas.width * this.canvas.height) / 24000);
      if (this.particleCount > 75) this.particleCount = 75;
      if (this.particleCount < 30) this.particleCount = 30;
      this.createParticles();
    },

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? '56, 189, 248' : '129, 140, 248'
        });
      }
    },

    animate() {
      requestAnimationFrame(() => this.animate());
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color}, 0.7)`;
        this.ctx.fill();

        // Connect particles
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = 1 - dist / 120;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.18})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        }

        // Mouse connection
        if (this.mouse.x !== null && this.mouse.y !== null) {
          const mdx = p.x - this.mouse.x;
          const mdy = p.y - this.mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < this.mouse.radius) {
            const alpha = 1 - mDist / this.mouse.radius;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.strokeStyle = `rgba(192, 132, 252, ${alpha * 0.35})`;
            this.ctx.lineWidth = 1.2;
            this.ctx.stroke();
          }
        }
      }
    }
  };

  CanvasConstellation.init();

  // -------------------------------------------------------------------------
  // 6. INTERACTIVE TERMINAL SIMULATOR ("Terminal AutoPilot Pro")
  // -------------------------------------------------------------------------
  const TerminalSimulator = {
    screen: document.getElementById('terminal-screen'),
    output: document.getElementById('terminal-output'),
    form: document.getElementById('terminal-form'),
    input: document.getElementById('terminal-input'),
    history: [],
    historyIdx: -1,

    commands: {
      help: `
<span class="term-cyan">⚡ TERMINAL AUTOPILOT PRO — COMMAND SYSTEM</span>
---------------------------------------------------------------
<span class="term-yellow">projects</span>      : List all 4 flagship production AI systems
<span class="term-yellow">skills</span>        : Inspect Subash's technical competencies & toolchain
<span class="term-yellow">safety-scan</span>   : Execute 3-tiered AI command risk validation check
<span class="term-loop">gemini-loop</span>   : Simulate Gemini API self-healing reflection engine
<span class="term-yellow">about</span>         : Print background summary & academic credentials
<span class="term-yellow">experience</span>    : View verified cybersecurity internships & education
<span class="term-yellow">contact</span>       : Display direct communication channels
<span class="term-yellow">whoami</span>        : Display current user credentials
<span class="term-bright-green">sudo hire</span>     : [CONFIDENTIAL] Dispatch an enthusiastic job/internship offer
<span class="term-yellow">clear</span>         : Clean current terminal workspace
---------------------------------------------------------------`,

      projects: `
<span class="term-bright-green">[1] Terminal AutoPilot Pro</span> (Multi-Agent System)
  Stack: Python, FastAPI, Gemini API, JavaScript, Subprocess
  Key: 7-agent pipeline (Planner, Safety, Executor, Reflection, Memory)
  Status: PRODUCTION READY / LIVE DEMO

<span class="term-cyan">[2] CreditSense AI</span> (Risk Assessment & FinTech)
  Stack: Python, Flask, scikit-learn, pandas, NumPy, JavaScript
  Key: Auto-selected Random Forest achieved 89.25% Accuracy & 85.52% F1 score
  Status: DEPLOYED REST API (/predict, /metrics)

<span class="term-purple">[3] WaterWise ML</span> (IoT Smart Water Leak Detection)
  Stack: Python, Flask, SQLAlchemy, scikit-learn, Chart.js, Bootstrap
  Key: Isolation Forest anomaly detector + Linear Regression 24/48h forecasts
  Status: 20+ REST Endpoints, Real-Time SSE alert engine

<span class="term-yellow">[4] MeetingOS</span> (Meeting-to-Execution Workflow)
  Stack: Python, FastAPI, spaCy, SQLite, JavaScript
  Key: Offline NLP pipeline extracting tasks/deadlines; tri-agent SLA monitoring`,

      skills: `
<span class="term-cyan">=== TECHNICAL COMPETENCIES MATRIX ===</span>
• <span class="term-green">Languages</span>         : Python (Expert), C++ (LeetCode 500+), JavaScript, SQL, HTML5, CSS3
• <span class="term-green">AI / Machine Learning</span> : scikit-learn, spaCy NLP, Gemini API, Multi-Agent Systems,
                           Random Forest, Isolation Forest, Logistic/Linear Regression
• <span class="term-green">Frameworks & Backend</span>: FastAPI, Flask, SQLAlchemy, Pydantic, REST APIs, SSE, Uvicorn
• <span class="term-green">Cybersecurity</span>       : Ethical Hacking, Subprocess Sandboxing, AICTE/ICAC Verified
• <span class="term-green">Cloud & Tools</span>       : AWS Cloud Practitioner, Git, GitHub, SQLite, Gunicorn, JSON`,

      'safety-scan': `
<span class="term-yellow">▶ [SAFETY AGENT INITIALIZED]</span>
[1/3] Scanning target command tree...
[2/3] Evaluating risk matrix:
      - Low Risk:    <code>ls</code>, <code>pwd</code>, <code>git status</code>, <code>python run.py</code> => [ALLOWED]
      - Medium Risk: <code>chmod</code>, <code>pip install</code>, <code>systemctl</code>       => [AUDIT LOGGED]
      - High Risk:   <code>rm -rf /</code>, <code>mkfs</code>, <code>shutdown</code>           => [BLOCKED BY GUARDRAIL]
[3/3] Result: <span class="term-bright-green">✔ SAFETY LAYER ACTIVE</span> — Zero unauthorized shell escalations allowed.`,

      'gemini-loop': `
<span class="term-purple">▶ [GEMINI API REFLECTION AGENT]</span>
• Injecting failing sub-task: <span class="term-red">Error 127: Missing module 'pandas'</span>
• Reflection Agent triggered: Analyzing stdout/stderr logs...
• Gemini API Diagnosis: "Environment requires dependency installation before proceeding."
• Self-Healing Resolution: Auto-generating command <code>pip install pandas</code>
• Workflow State Saved to JSON memory: <span class="term-bright-green">SUCCESS</span> (State restored in 180ms)`,

      about: `
<span class="term-cyan">=== ABOUT SUBASH P ===</span>
• <strong>Degree</strong>: B.Tech in Artificial Intelligence and Data Science
• <strong>Institution</strong>: Chennai Institute of Technology (2025–2029)
• <strong>Core Focus</strong>: Multi-Agent Architectures, Machine Learning, Defensive Cybersecurity
• <strong>LeetCode</strong>: 500+ problems solved in C++ & Python
• <strong>Hackathons</strong>: Semifinalist in ET-AI Hackathon 2026; Canadian Univ Dubai Hackathon`,

      experience: `
• <span class="term-green">Cyber Security Intern</span> @ Codec Technologies Pvt. Ltd. (May 2026 – Jun 2026)
  [AICTE & ICAC Approved | National Internship Portal]
• <span class="term-green">Cyber Security Intern</span> @ Thiranex (May 2026 – Jun 2026)
  [Verified Certificate of Achievement]
• <span class="term-purple">Virtual Intern</span> @ Eduskills
  [AI-ML by Google for Developers & Ethical Hacking]`,

      contact: `
<span class="term-cyan">=== DIRECT CONTACT CHANNELS ===</span>
• <strong>Email</strong>    : <a href="mailto:subash2007prakash@gmail.com" class="term-yellow">subash2007prakash@gmail.com</a>
• <strong>Phone</strong>    : <a href="tel:+917598520950" class="term-yellow">+91 7598520950</a>
• <strong>LinkedIn</strong> : <a href="https://www.linkedin.com/in/subash-p-bb01b1382/" target="_blank" class="term-cyan">linkedin.com/in/subash-p-bb01b1382</a>
• <strong>GitHub</strong>   : <a href="https://github.com/Subash13-alt" target="_blank" class="term-cyan">github.com/Subash13-alt</a>
• <strong>Location</strong> : Chennai, Tamil Nadu, India`,

      whoami: `
subash (AI & Data Science Undergrad @ CIT Chennai | 500+ LeetCode | Multi-Agent Systems Engineer)`,

      'sudo hire': `
<span class="term-bright-green">🎉 [AUTHENTICATION GRANTED] ACCESS LEVEL: EXECUTIVE</span>
---------------------------------------------------------------
🚀 Excellent decision! Subash brings:
   ✔ Strong foundational CS knowledge (500+ LeetCode solved)
   ✔ Practical full-stack AI skills (FastAPI, Flask, Gemini, scikit-learn)
   ✔ Verified cybersecurity defense acumen (Codec Tech & Thiranex)
   ✔ Collaborative team leadership (Coffee House, EDC CIT, Web3 Madras)

✉️ Launching email client to <a href="mailto:subash2007prakash@gmail.com?subject=Job/Internship%20Offer%20for%20Subash%20P" class="term-yellow">subash2007prakash@gmail.com</a>...
---------------------------------------------------------------`
    },

    init() {
      if (!this.form || !this.input) return;

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = this.input.value.trim();
        if (cmd) {
          this.execute(cmd);
          this.history.push(cmd);
          this.historyIdx = this.history.length;
          this.input.value = '';
        }
      });

      // Quick command pills
      document.querySelectorAll('.cmd-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const cmd = btn.getAttribute('data-cmd');
          SoundController.playClick();
          this.input.value = cmd;
          this.execute(cmd);
        });
      });

      // Arrow navigation for history
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          if (this.historyIdx > 0) {
            this.historyIdx--;
            this.input.value = this.history[this.historyIdx];
          }
        } else if (e.key === 'ArrowDown') {
          if (this.historyIdx < this.history.length - 1) {
            this.historyIdx++;
            this.input.value = this.history[this.historyIdx];
          } else {
            this.historyIdx = this.history.length;
            this.input.value = '';
          }
        }
      });
    },

    execute(cmdRaw) {
      const cmd = cmdRaw.toLowerCase().trim();
      SoundController.playClick();

      // Print prompt line
      const promptLine = document.createElement('div');
      promptLine.className = 'term-line';
      promptLine.innerHTML = `<span class="prompt-user">subash@autopilot</span><span class="prompt-separator">:</span><span class="prompt-path">~/portfolio</span><span class="prompt-symbol">$</span> <span class="term-cyan">${this.escapeHTML(cmdRaw)}</span>`;
      this.output.appendChild(promptLine);

      // Handle Clear
      if (cmd === 'clear') {
        this.output.innerHTML = '';
        SoundController.playSuccess();
        return;
      }

      // Check command
      const responseLine = document.createElement('div');
      responseLine.className = 'term-line';

      if (this.commands[cmd]) {
        responseLine.innerHTML = this.commands[cmd];
        SoundController.playSuccess();
        if (cmd === 'sudo hire') {
          Toast.show('🎉 Offer sequence triggered! Thank you!', 'success', 4000);
          setTimeout(() => {
            window.location.href = 'mailto:subash2007prakash@gmail.com?subject=Offer%20for%20Subash%20P';
          }, 1200);
        }
      } else {
        responseLine.innerHTML = `<span class="term-red">Command not recognized: '${this.escapeHTML(cmdRaw)}'.</span> Type <span class="term-yellow">'help'</span> for available commands.`;
      }

      this.output.appendChild(responseLine);
      this.screen.scrollTop = this.screen.scrollHeight;
    },

    escapeHTML(str) {
      return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag));
    }
  };

  TerminalSimulator.init();

  // -------------------------------------------------------------------------
  // 7. PROJECT FILTERING
  // -------------------------------------------------------------------------
  const ProjectFilter = {
    init() {
      const filterBtns = document.querySelectorAll('.filter-btn');
      const cards = document.querySelectorAll('.project-card');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          SoundController.playClick();
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filterValue = btn.getAttribute('data-filter');

          cards.forEach(card => {
            const categories = card.getAttribute('data-category') || '';
            if (filterValue === 'all' || categories.includes(filterValue)) {
              card.style.display = 'flex';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 50);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'scale(0.95)';
              setTimeout(() => {
                card.style.display = 'none';
              }, 250);
            }
          });
        });
      });
    }
  };

  ProjectFilter.init();

  // -------------------------------------------------------------------------
  // 8. PROJECT DEEP-DIVE MODAL SYSTEM
  // -------------------------------------------------------------------------
  const ProjectModal = {
    modal: document.getElementById('project-modal'),
    content: document.getElementById('modal-content'),
    closeBtn: document.getElementById('modal-close-btn'),

    data: {
      autopilot: {
        title: 'Terminal AutoPilot Pro — Deep Architectural Overview',
        tag: 'Agentic AI & Terminal Automation',
        desc: 'Terminal AutoPilot Pro bridges natural language human requests and operating system terminals with high reliability, structured validation, and self-healing error recovery.',
        architecture: [
          { name: '1. Planner Agent', role: 'Decomposes complex requests into sequential sub-tasks with dependency graphs.' },
          { name: '2. Safety Agent', role: 'Classifies commands into Low, Medium, and High hazard levels. Blocks commands like rm -rf, shutdown, and unauthorized file wipes.' },
          { name: '3. Command Agent', role: 'Synthesizes verified bash/terminal syntax tailored to the host environment.' },
          { name: '4. Executor Agent', role: 'Runs validated instructions using Python subprocess with asynchronous pipe capture, timeout protection, and exit code extraction.' },
          { name: '5. Verification Agent', role: 'Inspects terminal stdout/stderr against expected goals to verify task completion.' },
          { name: '6. Reflection Loop', role: 'Powered by Gemini API. When unexpected errors occur, reflection analyzes stack traces and generates remediation scripts.' },
          { name: '7. Memory Agent', role: 'Persists context, successful recipes, and execution logs in structured JSON storage.' }
        ],
        stack: ['Python', 'FastAPI', 'Google Gemini API', 'JavaScript', 'Subprocess', 'JSON Memory Store'],
        github: 'https://github.com/Subash13-alt'
      },

      creditsense: {
        title: 'CreditSense AI — Credit Risk Assessment & Classifier',
        tag: 'Machine Learning & Predictive Modeling',
        desc: 'An automated credit decision pipeline classifying applicants into Low Risk or High Risk with rigorous statistical benchmarking across multiple models.',
        architecture: [
          { name: 'Data Preprocessing', role: 'Synthetic financial dataset with feature imputation, standard scaling, and one-hot categorical encoding.' },
          { name: 'Model Benchmarking', role: 'Evaluated Logistic Regression, Decision Tree, and Random Forest on a held-out 20% test split.' },
          { name: 'Champion Model', role: 'Random Forest achieved 89.25% test accuracy and 85.52% F1 score.' },
          { name: 'Serving Layer', role: 'Flask REST API providing /predict for applicant risk scoring and /metrics for live model transparency.' },
          { name: 'Interactive UI', role: 'SVG animated risk gauge with instant client-side validation, dark mode, and dynamic confidence readouts.' }
        ],
        stack: ['Python', 'Flask', 'scikit-learn', 'pandas', 'NumPy', 'JavaScript', 'Chart UI'],
        github: 'https://github.com/Subash13-alt'
      },

      waterwise: {
        title: 'WaterWise ML — Smart Water Leak Detection & Forecasting',
        tag: 'IoT Analytics & Unsupervised Anomaly Detection',
        desc: 'Industrial-grade water conservation platform monitoring multi-zone consumption telemetry to detect anomalies and forecast municipal water demands.',
        architecture: [
          { name: 'Anomaly Detection', role: 'Unsupervised Isolation Forest isolates atypical flow spikes, drop-offs, and abnormal nighttime usage.' },
          { name: 'Usage Forecasting', role: 'Linear Regression model predicting next-hour and next-day water consumption across zones.' },
          { name: 'Alert Dispatcher', role: 'Rule-based and ML alert engine utilizing Server-Sent Events (SSE) for zero-latency dashboard alerts.' },
          { name: 'REST Infrastructure', role: '20+ endpoint API backed by SQLAlchemy ORM and SQLite database.' },
          { name: 'Analytics Dashboard', role: 'Interactive heatmaps, budget consumption calculators, and zone health scores via Chart.js.' }
        ],
        stack: ['Python', 'Flask', 'SQLAlchemy', 'scikit-learn', 'Chart.js', 'Bootstrap', 'SQLite'],
        github: 'https://github.com/Subash13-alt'
      },

      meetingos: {
        title: 'MeetingOS — Meeting-to-Execution AI Workflow System',
        tag: 'NLP Pipeline & Tri-Agent SLA Monitoring',
        desc: 'Transforms unstructured meeting transcripts and notes into structured deliverables, automated owners, deadlines, and SLA escalation tracking.',
        architecture: [
          { name: 'Offline NLP Extraction', role: 'Custom spaCy pipeline coupled with dateparser parses task verbs, owners, dates, and priorities without cloud APIs.' },
          { name: 'Escalation Agent', role: 'Continuously monitors task deadlines and flags overdue deliverables before SLA breaches.' },
          { name: 'Decision & Audit Agents', role: 'Calculates team workload distribution and maintains complete audit trails in SQLite.' },
          { name: 'Single Page UI', role: 'Fast JavaScript analytics dashboard showing pending tasks, team member load, and execution logs.' }
        ],
        stack: ['Python', 'FastAPI', 'spaCy', 'SQLite', 'JavaScript', 'dateparser'],
        github: 'https://github.com/Subash13-alt'
      }
    },

    init() {
      if (!this.modal || !this.content) return;

      document.querySelectorAll('.open-modal-btn, .btn-detail-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const projKey = btn.getAttribute('data-project');
          if (this.data[projKey]) {
            SoundController.playClick();
            this.render(this.data[projKey]);
            this.open();
          }
        });
      });

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.close();
        }
      });
    },

    render(p) {
      let archHTML = p.architecture.map(a => `
        <div style="margin-bottom: 0.85rem; padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-card);">
          <strong style="color: var(--accent-cyan); display: block; margin-bottom: 0.2rem;">${a.name}</strong>
          <span style="font-size: 0.88rem; color: var(--text-secondary);">${a.role}</span>
        </div>
      `).join('');

      let stackHTML = p.stack.map(s => `<span class="tech-tag">${s}</span>`).join(' ');

      this.content.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <span class="project-tag tag-cyan" style="margin-bottom: 0.5rem;">${p.tag}</span>
          <h2 style="font-size: 1.6rem; margin-top: 0.4rem; margin-bottom: 0.5rem;">${p.title}</h2>
          <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">${p.desc}</p>
        </div>

        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--text-primary);"><i class="fa-solid fa-network-wired text-accent"></i> Key Components & Pipeline</h4>
        <div style="margin-bottom: 1.5rem;">${archHTML}</div>

        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--text-primary);"><i class="fa-solid fa-microchip text-purple"></i> Technologies Used</h4>
        <div class="tech-stack-pills" style="margin-bottom: 1.75rem;">${stackHTML}</div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-github"></i> View GitHub Repository
          </a>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('modal-close-btn').click()">
            Close Window
          </button>
        </div>
      `;
    },

    open() {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  ProjectModal.init();

  // -------------------------------------------------------------------------
  // 9. RESUME MODAL & PRINT HANDLER
  // -------------------------------------------------------------------------
  const ResumeController = {
    modal: document.getElementById('resume-modal'),
    openBtn: document.getElementById('open-resume-btn'),
    closeBtn: document.getElementById('resume-close-btn'),
    printBtn: document.getElementById('print-resume-btn'),

    init() {
      if (!this.modal) return;

      if (this.openBtn) {
        this.openBtn.addEventListener('click', () => {
          SoundController.playClick();
          this.open();
        });
      }

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      if (this.printBtn) {
        this.printBtn.addEventListener('click', () => {
          SoundController.playClick();
          window.print();
        });
      }

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.close();
        }
      });
    },

    open() {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      Toast.show('Viewing Subash P Resume Document', 'info', 2000);
    },

    close() {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  ResumeController.init();

  // -------------------------------------------------------------------------
  // 10. REAL-TIME SKILL SEARCH FILTER
  // -------------------------------------------------------------------------
  const SkillSearch = {
    input: document.getElementById('skill-search'),
    clearBtn: document.getElementById('skill-search-clear'),
    items: document.querySelectorAll('.skill-item'),

    init() {
      if (!this.input) return;

      this.input.addEventListener('input', () => {
        const query = this.input.value.toLowerCase().trim();
        if (this.clearBtn) {
          this.clearBtn.style.display = query ? 'block' : 'none';
        }

        this.items.forEach(item => {
          const text = (item.getAttribute('data-name') || '') + ' ' + item.textContent.toLowerCase();
          if (!query) {
            item.classList.remove('dimmed', 'highlighted');
          } else if (text.includes(query)) {
            item.classList.remove('dimmed');
            item.classList.add('highlighted');
          } else {
            item.classList.add('dimmed');
            item.classList.remove('highlighted');
          }
        });
      });

      if (this.clearBtn) {
        this.clearBtn.addEventListener('click', () => {
          this.input.value = '';
          this.input.dispatchEvent(new Event('input'));
          this.input.focus();
        });
      }
    }
  };

  SkillSearch.init();

  // -------------------------------------------------------------------------
  // 11. METRIC NUMBER COUNTER ANIMATION
  // -------------------------------------------------------------------------
  const MetricCounter = {
    init() {
      const metrics = document.querySelectorAll('.metric-value');
      if (!metrics.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-target'));
            const isDecimal = el.hasAttribute('data-decimal');
            const suffix = el.textContent.includes('%') ? '%' : (el.textContent.includes('+') ? '+' : '');

            let current = 0;
            const duration = 1200;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = (isDecimal ? current.toFixed(2) : Math.floor(current)) + suffix;
            }, stepTime);

            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      metrics.forEach(m => observer.observe(m));
    }
  };

  MetricCounter.init();

  // -------------------------------------------------------------------------
  // 12. COPY TO CLIPBOARD & CONTACT FORM DISPATCH
  // -------------------------------------------------------------------------
  const ClipboardActions = {
    init() {
      const emailCopyBtn = document.getElementById('copy-email-btn');
      const phoneCopyBtn = document.getElementById('copy-phone-btn');

      if (emailCopyBtn) {
        emailCopyBtn.addEventListener('click', () => {
          SoundController.playSuccess();
          this.copyText('subash2007prakash@gmail.com', 'Email copied to clipboard!');
        });
      }

      if (phoneCopyBtn) {
        phoneCopyBtn.addEventListener('click', () => {
          SoundController.playSuccess();
          this.copyText('+91 7598520950', 'Phone number copied to clipboard!');
        });
      }

      // Contact Form Submission
      const form = document.getElementById('contact-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          SoundController.playSuccess();

          const name = document.getElementById('contact-name').value.trim();
          const email = document.getElementById('contact-email').value.trim();
          const subject = document.getElementById('contact-subject').value;
          const message = document.getElementById('contact-message').value.trim();

          const mailtoURL = `mailto:subash2007prakash@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;

          Toast.show(`Thank you ${name}! Launching your mail client...`, 'success', 3500);

          setTimeout(() => {
            window.location.href = mailtoURL;
          }, 800);

          form.reset();
        });
      }
    },

    copyText(text, successMsg) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          Toast.show(successMsg, 'success');
        }).catch(() => {
          this.fallbackCopy(text, successMsg);
        });
      } else {
        this.fallbackCopy(text, successMsg);
      }
    },

    fallbackCopy(text, successMsg) {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      Toast.show(successMsg, 'success');
    }
  };

  ClipboardActions.init();

  // -------------------------------------------------------------------------
  // 13. NAVBAR SCROLL, ACTIVE SPY & MOBILE DRAWER
  // -------------------------------------------------------------------------
  const NavHandler = {
    navbar: document.getElementById('navbar'),
    mobileToggle: document.getElementById('mobile-toggle'),
    mobileDrawer: document.getElementById('mobile-drawer'),
    backToTopBtn: document.getElementById('back-to-top'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section[id]'),

    init() {
      // Navbar scroll listener
      window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Navbar blur shadow
        if (scrollY > 50) {
          this.navbar.classList.add('scrolled');
        } else {
          this.navbar.classList.remove('scrolled');
        }

        // Back-to-top button visibility
        if (this.backToTopBtn) {
          if (scrollY > 400) {
            this.backToTopBtn.classList.add('visible');
          } else {
            this.backToTopBtn.classList.remove('visible');
          }
        }

        // Active link spy for on-page hash links
        this.sections.forEach(sec => {
          const top = sec.offsetTop - 120;
          const height = sec.offsetHeight;
          const id = sec.getAttribute('id');

          if (scrollY >= top && scrollY < top + height) {
            this.navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href && href.startsWith('#')) {
                link.classList.remove('active');
                if (href === `#${id}`) {
                  link.classList.add('active');
                }
              }
            });
          }
        });
      });

      // Highlight active link by current HTML page file
      const currentFile = window.location.pathname.split('/').pop() || 'index.html';
      this.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentFile || (currentFile === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
      document.querySelectorAll('.mobile-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentFile || (currentFile === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });

      // Back-to-top click
      if (this.backToTopBtn) {
        this.backToTopBtn.addEventListener('click', () => {
          SoundController.playClick();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // Mobile Drawer Toggle
      if (this.mobileToggle && this.mobileDrawer) {
        this.mobileToggle.addEventListener('click', () => {
          SoundController.playClick();
          this.mobileDrawer.classList.toggle('open');
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
          link.addEventListener('click', () => {
            this.mobileDrawer.classList.remove('open');
          });
        });
      }
    }
  };

  NavHandler.init();

  // -------------------------------------------------------------------------
  // 14. 3D TILT EFFECT ON PROFILE CARD
  // -------------------------------------------------------------------------
  const CardTilt = {
    card: document.getElementById('profile-card'),

    init() {
      if (!this.card || window.innerWidth < 1024) return;

      this.card.addEventListener('mousemove', (e) => {
        const rect = this.card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        this.card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      this.card.addEventListener('mouseleave', () => {
        this.card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    }
  };

  CardTilt.init();

  // -------------------------------------------------------------------------
  // 15. KEYBOARD SHORTCUTS (Easter Eggs & Quick Navigation)
  // -------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    // Avoid interfering with inputs
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 't' || e.key === 'T') {
      const term = document.getElementById('terminal-section');
      if (term) {
        term.scrollIntoView({ behavior: 'smooth' });
        const input = document.getElementById('terminal-input');
        if (input) setTimeout(() => input.focus(), 500);
      } else {
        window.location.href = 'index.html#terminal-section';
      }
    } else if (e.key === 'p' || e.key === 'P') {
      const proj = document.getElementById('projects');
      if (proj) proj.scrollIntoView({ behavior: 'smooth' });
      else window.location.href = 'projects.html';
    } else if (e.key === 'c' || e.key === 'C') {
      const cont = document.getElementById('contact');
      if (cont) cont.scrollIntoView({ behavior: 'smooth' });
      else window.location.href = 'contact.html';
    } else if (e.key === 'r' || e.key === 'R') {
      ResumeController.open();
    }
  });

  console.log('%cSubash P — AI & Data Science Portfolio Loaded Successfully 🚀', 'color: #38bdf8; font-size: 14px; font-weight: bold;');
});
