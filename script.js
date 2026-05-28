/* ============================================================
   PyAuto Course — script.js
   Interactive features: particles, scroll animations,
   terminal typing, FAQ accordion, progress tracking, copy code
   ============================================================ */

/* ── 1. Loading Screen ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const ls = document.getElementById('loading-screen');
    if (ls) ls.classList.add('hidden');
    // Start animations after load
    initScrollAnimations();
    initProgressWidget();
  }, 1900);
});

/* ── 2. Particle Background Canvas ── */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#00ff88', '#00d4ff', '#7b2fff'];
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: Math.random() * 0.5 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(0, 255, 136, ${0.05 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      });
    });

    // Draw particles
    particles.forEach(p => {
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
  }

  (function loop() { update(); draw(); requestAnimationFrame(loop); })();
}
initParticles();

/* ── 3. Navbar Scroll Progress ── */
function initNavProgress() {
  const bar = document.querySelector('.nav-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  });
}
initNavProgress();

/* ── 4. Mobile Hamburger ── */
(function() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav-links');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  // Close on link click
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
})();

/* ── 5. Smooth Scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 6. Scroll Animations ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.fade-in, .fade-in-right').forEach(el => observer.observe(el));
}

/* ── 7. FAQ Accordion ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ── 8. Copy Code Button ── */
document.querySelectorAll('.code-copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const block = btn.closest('.code-block');
    const code  = block.querySelector('pre').innerText;
    navigator.clipboard.writeText(code).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✓ COPIED';
      btn.style.color = '#00ff88';
      setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 2000);
    });
  });
});

/* ── 9. Counter Animation ── */
function animateCounter(el, target, duration = 1400) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      animateCounter(e.target, target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── 10. Terminal Typing Animation ── */
function initTerminal() {
  const terminal = document.getElementById('hero-terminal-output');
  if (!terminal) return;

  const lines = [
    { type: 'cmd',  text: 'python --version' },
    { type: 'out',  text: 'Python 3.12.0', cls: 'ok' },
    { type: 'cmd',  text: 'pip install -r requirements.txt' },
    { type: 'out',  text: 'Installing openpyxl, selenium, requests...', cls: 'info' },
    { type: 'out',  text: 'Successfully installed 12 packages ✓', cls: 'ok' },
    { type: 'cmd',  text: 'python auto_report.py' },
    { type: 'out',  text: '📊 Генерация Excel-отчёта...', cls: 'info' },
    { type: 'out',  text: '✅ Отчёт сохранён: report_2024.xlsx', cls: 'ok' },
    { type: 'cmd',  text: 'python bot.py --daemon' },
    { type: 'out',  text: '🤖 Telegram-бот запущен. Работает 24/7', cls: 'ok' },
    { type: 'cursor', text: '' },
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let isTyping = false;

  function typeChar() {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];

    if (!isTyping) {
      // Create new DOM element for the line
      const div = document.createElement('div');
      div.className = 't-line';

      if (line.type === 'cmd') {
        div.innerHTML = `<span class="t-prompt">❯</span><span class="t-cmd"></span>`;
      } else if (line.type === 'out') {
        div.innerHTML = `<span class="t-out t-${line.cls || 'info'}"></span>`;
      } else if (line.type === 'cursor') {
        div.innerHTML = `<span class="t-prompt">❯</span><span class="t-cursor"></span>`;
        terminal.appendChild(div);
        return;
      }

      terminal.appendChild(div);
      isTyping = true;
      charIdx = 0;
    }

    const allLines = terminal.querySelectorAll('.t-line');
    const currentLineEl = allLines[allLines.length - 1];
    const textEl = currentLineEl.querySelector('.t-cmd, .t-out');

    if (!textEl) { lineIdx++; isTyping = false; setTimeout(typeChar, 200); return; }

    if (charIdx < line.text.length) {
      textEl.textContent += line.text[charIdx];
      charIdx++;
      const delay = line.type === 'cmd' ? 60 : 15;
      setTimeout(typeChar, delay);
    } else {
      lineIdx++;
      isTyping = false;
      const delay = line.type === 'cmd' ? 800 : 200;
      setTimeout(typeChar, delay);
    }

    // Scroll terminal
    terminal.scrollTop = terminal.scrollHeight;
  }

  // Start after loading ends
  setTimeout(typeChar, 2200);
}
initTerminal();

/* ── 11. Progress Widget (Reading Progress) ── */
function initProgressWidget() {
  const widget = document.querySelector('.progress-widget');
  if (!widget) return;

  // Show widget after scrolling a bit
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) widget.style.display = 'block';
    else widget.style.display = 'none';

    const bar = widget.querySelector('.pw-bar');
    const text = widget.querySelector('.pw-text');
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = Math.round(scrolled / total * 100);

    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = pct + '% изучено';
  });
}

/* ── 12. Active Sidebar Link (lectures page) ── */
function initSidebarActive() {
  const sections = document.querySelectorAll('.lecture-section[id]');
  const links    = document.querySelectorAll('.sidebar-link');
  if (!sections.length || !links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.sidebar-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => obs.observe(s));
}
initSidebarActive();

/* ── 13. Lecture Next/Prev Navigation (lectures.html) ── */
(function() {
  const ids = ['lecture-1','lecture-2','lecture-3','lecture-4','lecture-5','lecture-6'];

  document.querySelectorAll('.lecture-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir    = btn.dataset.dir;
      const currId = btn.closest('.lecture-section').id;
      const idx    = ids.indexOf(currId);
      const nextId = dir === 'next' ? ids[idx + 1] : ids[idx - 1];
      if (nextId) {
        document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ── 14. Study Timer ── */
(function() {
  let seconds = 0;
  const timerEl = document.getElementById('study-timer');
  if (!timerEl) return;

  setInterval(() => {
    seconds++;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    timerEl.textContent =
      String(h).padStart(2,'0') + ':' +
      String(m).padStart(2,'0') + ':' +
      String(s).padStart(2,'0');
  }, 1000);
})();

/* ── 15. Glitch Effect on hover for Hero Title ── */
(function() {
  const title = document.querySelector('.hero-title-line2');
  if (!title) return;
  title.addEventListener('mouseenter', () => {
    title.style.animation = 'none';
    void title.offsetWidth; // reflow
    title.style.animation = '';
  });
})();

/* ── 16. Code Block Line Numbers ── */
document.querySelectorAll('.code-block pre').forEach(pre => {
  // Just ensure good tab rendering; syntax colors are inline HTML
});

/* ── 17. Lazy load stagger animations ── */
document.querySelectorAll('.lecture-card, .practice-card, .about-card, .tool-card').forEach((el, i) => {
  el.style.transitionDelay = (i * 60) + 'ms';
  el.classList.add('fade-in');
});

/* ── 18. Keyboard shortcuts ── */
document.addEventListener('keydown', e => {
  if (e.key === '/' && !['INPUT','TEXTAREA'].includes(e.target.tagName)) {
    e.preventDefault();
    document.querySelector('.nav-brand')?.focus();
  }
});

/* ── 19. Smooth Navbar background on scroll ── */
(function() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(5,10,15,0.97)';
    } else {
      nav.style.background = 'rgba(5,10,15,0.85)';
    }
  });
})();

/* ── 20. Tooltip for tech icons ── */
document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.addEventListener('mouseenter', function() {
    const tip = document.createElement('div');
    tip.className = 'tooltip-popup';
    tip.textContent = this.dataset.tooltip;
    tip.style.cssText = `
      position:absolute; background:rgba(5,10,15,0.95);
      border:1px solid #00ff88; color:#00ff88; font-family:'JetBrains Mono',monospace;
      font-size:0.7rem; padding:4px 10px; border-radius:4px; pointer-events:none;
      z-index:9998; white-space:nowrap; top:calc(100% + 6px); left:50%;
      transform:translateX(-50%); letter-spacing:1px;
    `;
    this.style.position = 'relative';
    this.appendChild(tip);
  });
  el.addEventListener('mouseleave', function() {
    this.querySelector('.tooltip-popup')?.remove();
  });
});

console.log('%cPyAuto Course 🐍', 'color:#00ff88; font-size:20px; font-weight:bold; font-family:monospace;');
console.log('%copen devtools? отличный выбор!', 'color:#00d4ff; font-family:monospace;');
