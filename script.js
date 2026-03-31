/* ╔══════════════════════════════════════════╗
   ║  RIFLAN PORTFOLIO — script.js            ║
   ║  25+ Heavy GSAP Animation Systems        ║
   ╚══════════════════════════════════════════╝ */

(() => {
'use strict';

/* ════════════════════════════════════════════
   0 · GSAP PLUGIN REGISTRATION
════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

CustomEase.create('expo-out',  'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('expo-in',   'M0,0 C0.7,0 0.84,0 1,1');
CustomEase.create('smooth',    'M0,0 C0.25,0.1 0.25,1 1,1');
CustomEase.create('bounce',    'M0,0 C0.07,0 0.12,0.97 0.54,0.985 0.73,0.99 0.79,1.005 1,1');

/* ════════════════════════════════════════════
   1 · CANVAS PARTICLE FIELD
════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 40 : 90;

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.2 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life = Math.random() * 200 + 100;
      this.age = 0;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.age++;
      if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha * Math.sin((this.age / this.life) * Math.PI);
      ctx.fillStyle = '#e8d45a';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw connecting lines
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = '#e8d45a';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  };

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  };
  loop();
})();

/* ════════════════════════════════════════════
   2 · CUSTOM CURSOR
════════════════════════════════════════════ */
(function initCursor() {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.05, ease: 'none' });
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    gsap.set(ring, { x: rx, y: ry });
  });

  // Expand cursor on interactive elements
  document.querySelectorAll('a, button, .proj-item, .edu-row, .ab-row').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(ring, { width: 56, height: 56, borderColor: '#e84a3a', opacity: 0.9, duration: 0.3, ease: 'back.out(2)' });
      gsap.to(dot,  { scale: 0, duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(ring, { width: 32, height: 32, borderColor: '#e8d45a', opacity: 0.5, duration: 0.3 });
      gsap.to(dot,  { scale: 1, duration: 0.2 });
    });
  });
})();

/* ════════════════════════════════════════════
   3 · PRELOADER — CINEMATIC ENTRANCE
════════════════════════════════════════════ */
document.body.classList.add('loading');

(function initPreloader() {
  const letters  = document.querySelectorAll('.plc');
  const preLine  = document.getElementById('preLine');
  const preNum   = document.getElementById('preNum');
  const tagline  = document.getElementById('preTagline');
  const preloader= document.getElementById('preloader');
  if (!preloader) return;

  const counter = { v: 0 };

  const tl = gsap.timeline({
    onComplete: () => {
      // Split preloader in half — both sides slide out
      gsap.to('.pre-left', {
        x: '-100%', duration: 0.8, ease: 'expo-in',
        onComplete: () => {
          preloader.remove();
          document.body.classList.remove('loading');
          runHero();
        }
      });
      gsap.to('.pre-right', { x: '100%', duration: 0.8, ease: 'expo-in' });
    }
  });

  tl
    .to(letters, {
      y: 0, opacity: 1,
      stagger: { each: 0.07, from: 'random' },
      duration: 0.8, ease: 'expo-out'
    })
    .to(tagline, { y: 0, opacity: 1, duration: 0.7, ease: 'expo-out' }, '-=0.4')
    .to(counter, {
      v: 100, duration: 1.6, ease: 'power2.inOut',
      onUpdate() {
        const v = Math.floor(counter.v);
        preNum.textContent = String(v).padStart(3, '0');
        preLine.style.width = v + '%';
      }
    }, '-=0.3')
    .to(letters, {
      y: -20, opacity: 0,
      stagger: 0.04, duration: 0.35, ease: 'expo-in'
    }, '-=0.3');
})();

/* ════════════════════════════════════════════
   4 · HERO ANIMATION SEQUENCE
════════════════════════════════════════════ */
function runHero() {
  const tl = gsap.timeline({ defaults: { ease: 'expo-out' } });

  // Eye brow
  tl.to('#hEyebrow', { opacity: 1, y: 0, duration: 0.6 })

  // Hero name — lines emerge from below
  .to('#hnRow1 .hn-solid', { y: '0%', duration: 1.1 }, '-=0.2')
  .to('#hnRow1 .hn-italic', { y: '0%', duration: 1.1, delay: 0.05 }, '<')
  .to('#hnRow2 .hn-outline', { y: '0%', duration: 1.1 }, '-=0.8')
  .to('#hnRow2 .hn-solid', { y: '0%', duration: 1.1, delay: 0.05 }, '<')

  // Desc, btns, stats
  .to('#heroDesc',  { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
  .to('#heroBtns',  { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
  .to('#heroStats', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
  .to('#heroRoleBadge', { opacity: 1, duration: 0.6 }, '-=0.2')
  .to('#heroScrollCue', { opacity: 1, duration: 0.6 }, '-=0.2')
  .to('.hero-bg-text', {
    opacity: 1, duration: 1.2, ease: 'power2.out',
    onStart() { gsap.set('.hero-bg-text', { opacity: 0 }); }
  }, 0.2);

  // ── STAT COUNTERS ──
  document.querySelectorAll('.hsg-count').forEach(el => {
    const target = +el.dataset.t;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 2.2, ease: 'power3.out', delay: 1.4,
      onUpdate() { el.textContent = Math.round(obj.v); }
    });
  });

  // ── ROLE TEXT CYCLER ──
  const roles = [
    'Software Engineer',
    'AI Engineer',
    'React Native Dev',
    'Full-Stack Builder',
    'Real-Time Systems'
  ];
  let rIdx = 0;
  const roleEl = document.getElementById('hrbRole');
  if (roleEl) {
    const cycleRole = () => {
      rIdx = (rIdx + 1) % roles.length;
      gsap.timeline()
        .to(roleEl, { opacity: 0, y: -12, duration: 0.3, ease: 'expo-in' })
        .set(roleEl, { textContent: roles[rIdx], y: 12 })
        .to(roleEl, { opacity: 1, y: 0, duration: 0.4, ease: 'expo-out' });
    };
    gsap.delayedCall(3, () => setInterval(cycleRole, 2800));
  }

  // ── HERO BG TEXT PARALLAX ──
  gsap.to('.hero-bg-text', {
    y: -120, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2
    }
  });

  // ── HERO BOTTOM PARALLAX ──
  gsap.to('.hero-bottom', {
    y: 60, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5
    }
  });

  // ── SCROLL CUE PULSE ──
  gsap.to('#heroScrollCue', {
    y: 8, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3
  });
}

/* ════════════════════════════════════════════
   5 · MARQUEE SPEED ON SCROLL
════════════════════════════════════════════ */
(function initMarquee() {
  const track = document.getElementById('mqTrack');
  if (!track) return;

  let scrollV = 0, lastY = 0;
  window.addEventListener('scroll', () => {
    scrollV = (window.scrollY - lastY);
    lastY = window.scrollY;
  });

  // Dynamically scale animation speed
  gsap.ticker.add(() => {
    const speed = Math.max(22 - Math.abs(scrollV) * 0.6, 6);
    track.style.animationDuration = speed + 's';
  });

  // Entrance
  gsap.from('.marquee-wrap', {
    opacity: 0, y: 30, duration: 0.8, ease: 'expo-out',
    scrollTrigger: { trigger: '.marquee-wrap', start: 'top 92%' }
  });
})();

/* ════════════════════════════════════════════
   6 · STAGGERED SECTION HEADING REVEAL
      (Char-by-char using Bebas letters)
════════════════════════════════════════════ */
(function initHeadings() {
  document.querySelectorAll('.sh-line').forEach(line => {
    ScrollTrigger.create({
      trigger: line,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(line.querySelectorAll('.sh-reveal, .sh-italic') .length
          ? line.querySelectorAll('.sh-reveal, .sh-italic')
          : [line],
        {
          y: '0%', opacity: 1,
          duration: 1, ease: 'expo-out',
          stagger: 0.05
        });
        // Also animate the line itself if it IS the reveal
        if (line.classList.contains('sh-reveal') || line.classList.contains('sh-italic')) {
          gsap.to(line, { y: '0%', opacity: 1, duration: 1, ease: 'expo-out' });
        }
      },
      once: true
    });
  });
})();

/* ════════════════════════════════════════════
   7 · GENERIC SCROLL REVEALS
════════════════════════════════════════════ */
(function initScrollReveals() {
  // Fade up
  document.querySelectorAll('.sh-reveal-fade').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo-out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // Cards
  ScrollTrigger.batch('.sh-reveal-card', {
    onEnter: els => {
      gsap.to(els, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo-out',
        stagger: 0.1
      });
    },
    start: 'top 88%',
    once: true
  });

  // Slide from left
  document.querySelectorAll('.sh-reveal-slide').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.7, ease: 'expo-out',
      delay: i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // Slide from right
  document.querySelectorAll('.sh-reveal-link').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.7, ease: 'expo-out',
      delay: i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
})();

/* ════════════════════════════════════════════
   8 · SECTION TAG REVEAL
════════════════════════════════════════════ */
document.querySelectorAll('.sect-tag').forEach(tag => {
  gsap.from(tag, {
    opacity: 0, x: -20, duration: 0.6, ease: 'expo-out',
    scrollTrigger: { trigger: tag, start: 'top 90%' }
  });
});

/* ════════════════════════════════════════════
   9 · PROJECT LIST — ROW ANIMATIONS
════════════════════════════════════════════ */
(function initProjectRows() {
  // Initial staggered entrance
  gsap.from('.proj-item', {
    opacity: 0, x: -40,
    stagger: 0.08, duration: 0.7, ease: 'expo-out',
    scrollTrigger: { trigger: '.proj-list', start: 'top 85%' }
  });

  // Hover — animated underline bar on each row
  document.querySelectorAll('.proj-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item.querySelector('.pi-bar'), {
        scaleX: 1, duration: 0.35, ease: 'expo-out'
      });
      gsap.to(item.querySelector('.pi-num'), {
        color: '#e8d45a', duration: 0.2
      });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item.querySelector('.pi-bar'), {
        scaleX: 0, duration: 0.3, ease: 'expo-in', transformOrigin: 'right'
      });
      gsap.to(item.querySelector('.pi-num'), {
        color: 'var(--rule-2)', duration: 0.2
      });
    });
  });
})();

/* ════════════════════════════════════════════
   10 · PROJECT FILTER SYSTEM
════════════════════════════════════════════ */
(function initFilters() {
  const buttons = document.querySelectorAll('.pf');
  const items   = document.querySelectorAll('.proj-item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.f;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Ripple on button
      gsap.fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });

      const show = [], hide = [];
      items.forEach(item => {
        const cats = (item.dataset.cats || '').split(' ');
        (f === 'all' || cats.includes(f) ? show : hide).push(item);
      });

      gsap.to(hide, {
        opacity: 0, x: 20, duration: 0.25, ease: 'expo-in',
        onComplete: () => {
          hide.forEach(el => el.classList.add('hidden'));
          show.forEach(el => el.classList.remove('hidden'));
          gsap.fromTo(show,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, stagger: 0.07, duration: 0.5, ease: 'expo-out' }
          );
        }
      });
    });
  });
})();

/* ════════════════════════════════════════════
   11 · SKILLS WALL — WORD CLOUD FLOAT
════════════════════════════════════════════ */
(function initSkillsWall() {
  ScrollTrigger.create({
    trigger: '.skills-wall',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.swg-tags span', {
        opacity: 0, scale: 0.5, y: 20,
        stagger: { each: 0.04, from: 'random' },
        duration: 0.6, ease: 'back.out(2)'
      });
    },
    once: true
  });

  // Hover shimmer on individual skill words
  document.querySelectorAll('.swg-tags span').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, { color: '#e8d45a', scale: 1.12, duration: 0.2, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { color: 'var(--ink)', scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.5)' });
    });
  });
})();

/* ════════════════════════════════════════════
   12 · EDUCATION TIMELINE REVEAL
════════════════════════════════════════════ */
(function initEdu() {
  gsap.from('.edu-row', {
    opacity: 0, x: -50, stagger: 0.15, duration: 0.8, ease: 'expo-out',
    scrollTrigger: { trigger: '.edu-rows', start: 'top 80%' }
  });

  // Hover highlight on row numbers
  document.querySelectorAll('.edu-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      gsap.to(row.querySelector('.er-yr'), {
        letterSpacing: '.18em', duration: 0.3, ease: 'power2.out'
      });
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(row.querySelector('.er-yr'), {
        letterSpacing: '.1em', duration: 0.3
      });
    });
  });
})();

/* ════════════════════════════════════════════
   13 · NAVIGATION SCROLL & ACTIVE LINK
════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-center a');
  const sections = document.querySelectorAll('section[id]');

  // Nav entrance
  gsap.from('#nav', { y: -var_or(-68), opacity: 0, duration: 0.8, ease: 'expo-out', delay: 0.1 });

  function var_or(def) { return def; }

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    // Active link
    const y = window.scrollY + 110;
    sections.forEach(s => {
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = nav.querySelector(`a[href="#${s.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  });
})();

/* ════════════════════════════════════════════
   14 · FULLSCREEN MENU
════════════════════════════════════════════ */
(function initMenu() {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('fullMenu');
  if (!btn || !menu) return;

  let open = false;

  const openMenu = () => {
    open = true;
    btn.classList.add('open');
    menu.classList.add('open');
    // Animate links with stagger
    const spans = menu.querySelectorAll('.fm-link span, .fm-link em');
    gsap.to(spans, { y: '0%', stagger: 0.07, duration: 0.65, ease: 'expo-out', delay: 0.35 });
  };

  const closeMenu = () => {
    open = false;
    btn.classList.remove('open');
    // Reverse stagger to close
    const spans = menu.querySelectorAll('.fm-link span, .fm-link em');
    gsap.to(spans, {
      y: '110%', stagger: { each: 0.04, from: 'end' }, duration: 0.35, ease: 'expo-in',
      onComplete: () => menu.classList.remove('open')
    });
  };

  btn.addEventListener('click', () => open ? closeMenu() : openMenu());
  menu.querySelectorAll('.fm-link').forEach(l => l.addEventListener('click', closeMenu));
})();

/* ════════════════════════════════════════════
   15 · THEME TOGGLE
════════════════════════════════════════════ */
(function initTheme() {
  const btn  = document.getElementById('themeBtn');
  const lbl  = document.getElementById('themeLbl');
  const root = document.documentElement;

  const saved = localStorage.getItem('rfln-theme');
  const pref  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || pref, false);

  btn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  function applyTheme(t, animate) {
    root.setAttribute('data-theme', t);
    lbl.textContent = t.toUpperCase();
    localStorage.setItem('rfln-theme', t);
    if (animate) {
      gsap.fromTo(btn, { scale: 0.8, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2.5)' });
      // Flash overlay transition
      const flash = document.createElement('div');
      Object.assign(flash.style, {
        position:'fixed', inset:0, background: t === 'light' ? '#f5f0e8' : '#0a0906',
        zIndex:7000, pointerEvents:'none'
      });
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 0, duration: 0.5, ease: 'power2.in', onComplete: () => flash.remove() });
    }
  }
})();

/* ════════════════════════════════════════════
   16 · MAGNETIC BUTTON EFFECT
════════════════════════════════════════════ */
(function initMagnet() {
  document.querySelectorAll('.hbtn-main, .hbtn-line, .cl-item, .pf').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2))  * 0.22;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.22;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
})();

/* ════════════════════════════════════════════
   17 · EXPERIENCE CARD — WIPE IN
════════════════════════════════════════════ */
(function initExpCard() {
  const card = document.querySelector('.exp-card');
  if (!card) return;

  ScrollTrigger.create({
    trigger: card,
    start: 'top 80%',
    onEnter: () => {
      gsap.timeline()
        .from(card, { opacity: 0, x: -60, duration: 0.9, ease: 'expo-out' })
        .from(card.querySelector('.ec-role'), {
          opacity: 0, y: 30, duration: 0.6, ease: 'expo-out'
        }, '-=0.4')
        .from(card.querySelectorAll('.ec-list li'), {
          opacity: 0, x: -20, stagger: 0.1, duration: 0.5, ease: 'expo-out'
        }, '-=0.3')
        .from(card.querySelectorAll('.ec-tags span'), {
          opacity: 0, scale: 0.7, stagger: 0.07, duration: 0.4, ease: 'back.out(2)'
        }, '-=0.2');
    },
    once: true
  });
})();

/* ════════════════════════════════════════════
   18 · CONTACT SECTION — STAGGERED ENTRANCE
════════════════════════════════════════════ */
(function initContact() {
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 75%',
    onEnter: () => {
      gsap.timeline()
        .from('.contact-h .sh-line', {
          y: '110%', stagger: 0.12, duration: 1, ease: 'expo-out'
        })
        .from('.contact-sub', {
          opacity: 0, y: 20, duration: 0.6, ease: 'expo-out'
        }, '-=0.3');
    },
    once: true
  });
})();

/* ════════════════════════════════════════════
   19 · SMOOTH ANCHOR SCROLL
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    gsap.to(window, {
      scrollTo: { y: target.offsetTop - 60 },
      duration: 1.2, ease: 'expo-out'
    });
  });
});
// Fallback if ScrollTo plugin not loaded
if (!gsap.plugins?.scrollTo) {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════
   20 · FOOTER REVEAL
════════════════════════════════════════════ */
gsap.from('.site-footer > *', {
  opacity: 0, y: 20, stagger: 0.15, duration: 0.7, ease: 'expo-out',
  scrollTrigger: { trigger: '.site-footer', start: 'top 96%' }
});

/* ════════════════════════════════════════════
   21 · PROGRESS LINE (top of page)
════════════════════════════════════════════ */
(function initProgressLine() {
  const line = document.createElement('div');
  Object.assign(line.style, {
    position: 'fixed', top: 0, left: 0, height: '2px',
    background: '#e8d45a', zIndex: 9000, width: '0%',
    transformOrigin: 'left', pointerEvents: 'none'
  });
  document.body.appendChild(line);

  gsap.to(line, {
    width: '100%', ease: 'none',
    scrollTrigger: {
      start: 'top top', end: 'bottom bottom', scrub: 0.3
    }
  });
})();

/* ════════════════════════════════════════════
   22 · HERO NAME HOVER — SCRAMBLE EFFECT
════════════════════════════════════════════ */
(function initScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const name = document.querySelector('.hero-name');
  if (!name) return;

  const scrambleEl = (el, original) => {
    let iterations = 0;
    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((c, i) => i < iterations ? c : chars[Math.floor(Math.random() * chars.length)])
        .join('');
      if (iterations >= original.length) clearInterval(interval);
      iterations += 1/3;
    }, 40);
  };

  document.querySelectorAll('.hn-solid, .hn-outline').forEach(el => {
    const orig = el.textContent;
    el.addEventListener('mouseenter', () => scrambleEl(el, orig));
  });
})();

/* ════════════════════════════════════════════
   23 · EXPERIENCE CARD LIVE DOT PULSE
════════════════════════════════════════════ */
gsap.to('.ec-live-dot', {
  scale: 1.6, opacity: 0.3,
  duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut'
});

/* ════════════════════════════════════════════
   24 · SCROLL-TRIGGERED COUNTER ANIMATION
      (section tags reveal with count up)
════════════════════════════════════════════ */
(function initAboutReveal() {
  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 75%',
    onEnter: () => {
      gsap.from('.about-layout', {
        opacity: 0, duration: 0.01,
        onComplete: () => {
          gsap.to('.al-left', { opacity: 1, x: 0, duration: 1, ease: 'expo-out' });
          gsap.to('.al-right', { opacity: 1, x: 0, duration: 1, ease: 'expo-out', delay: 0.15 });
        }
      });
    },
    once: true
  });
  gsap.set('.al-left', { opacity: 0, x: -50 });
  gsap.set('.al-right', { opacity: 0, x: 50 });
})();

/* ════════════════════════════════════════════
   25 · PARALLAX SECTIONS DEPTH
════════════════════════════════════════════ */
(function initParallax() {
  [
    { sel: '.sect-tag',   y: -15 },
    { sel: '.section-h',  y: -25 },
  ].forEach(({ sel, y }) => {
    document.querySelectorAll(sel).forEach(el => {
      gsap.to(el, {
        y, ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.sect') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });
  });
})();

/* ════════════════════════════════════════════
   26 · SKILLS WALL BORDER LIGHT ON HOVER
════════════════════════════════════════════ */
document.querySelectorAll('.sw-group').forEach(g => {
  g.addEventListener('mouseenter', () => {
    gsap.to(g, { boxShadow: 'inset 0 0 30px rgba(232,212,90,.06)', duration: 0.4 });
  });
  g.addEventListener('mouseleave', () => {
    gsap.to(g, { boxShadow: 'none', duration: 0.4 });
  });
});

/* ════════════════════════════════════════════
   27 · PRELOADER LETTERS RANDOM SCRAMBLE
      (while loading, letters shuffle)
════════════════════════════════════════════ */
(function shufflePreloader() {
  const plcs = document.querySelectorAll('.plc');
  const original = ['R','I','F','L','A','N'];
  const chars = 'RIFTLANGMBDCO123';
  if (!plcs.length) return;

  let frame = 0;
  const interval = setInterval(() => {
    frame++;
    plcs.forEach((el, i) => {
      if (frame > i * 3) return; // freeze each letter in order
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
    });
    if (frame > 20) {
      plcs.forEach((el, i) => el.textContent = original[i]);
      clearInterval(interval);
    }
  }, 60);
})();

console.log('%c✦ RIFLAN — Animation System Loaded · 27 Systems Active', 
  'color: #e8d45a; font-family: monospace; font-size: 13px; background: #0a0906; padding: 4px 8px;');

})();