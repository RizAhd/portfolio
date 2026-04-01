(() => {
'use strict';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

// Custom easing curves
CustomEase.create('expo-out', 'M0,0 C0.14,1 0.28,1 1,1');
CustomEase.create('expo-in', 'M0,0 C0.72,0 0.86,0 1,1');
CustomEase.create('smooth', 'M0,0 C0.22,0.08 0.22,1 1,1');
CustomEase.create('elastic-custom', 'M0,0 C0.5,0 0.5,1 1,1');

// ===== ENHANCED PARTICLE SYSTEM =====
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 40 : 90;
  let mouse = { x: 0, y: 0 };

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.2 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life = Math.random() * 400 + 150;
      this.age = 0;
      this.hue = Math.random() * 60 + 220; // Blue-ish particles
    }
    update() {
      // Mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.vx -= (dx / dist) * force * 0.2;
        this.vy -= (dy / dist) * force * 0.2;
      }
      
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      this.vx *= 0.99;
      this.vy *= 0.99;
      
      if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      const fade = Math.sin((this.age / this.life) * Math.PI);
      ctx.globalAlpha = this.alpha * fade;
      
      // Gradient particle
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, 1)`);
      gradient.addColorStop(1, `hsla(${this.hue}, 80%, 70%, 0)`);
      ctx.fillStyle = gradient;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = `hsla(240, 70%, 65%, 1)`;
          ctx.lineWidth = 0.6;
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
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(loop);
  };
  loop();
})();

// ===== ENHANCED CUSTOM CURSOR =====
(function initCursor() {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.05, ease: 'none' });
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    gsap.set(ring, { x: rx, y: ry });
  });

  // Enhanced hover effects
  document.querySelectorAll('a, button, .proj-row, .edu-row, .ab-item, .sg-block, .exp-card, .clink').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(ring, {
        width: 70,
        height: 70,
        opacity: 0.9,
        duration: 0.4,
        ease: 'back.out(2.5)'
      });
      gsap.to(dot, { scale: 0, duration: 0.25 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(ring, {
        width: 42,
        height: 42,
        opacity: 0.65,
        duration: 0.4,
        ease: 'power2.out'
      });
      gsap.to(dot, { scale: 1, duration: 0.25 });
    });
  });
})();

// ===== ENHANCED PRELOADER =====
document.body.classList.add('loading');

(function initPreloader() {
  const letters = document.querySelectorAll('.plc');
  const preBar = document.getElementById('preBar');
  const preNum = document.getElementById('preNum');
  const preloader = document.getElementById('preloader');
  const panelL = document.querySelector('.pre-panel-l');
  const panelR = document.querySelector('.pre-panel-r');
  if (!preloader) return;

  const counter = { v: 0 };
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';
  let scrambleFrame = 0;
  const originals = Array.from(letters).map(el => el.dataset.char);

  // Scramble effect
  const scrambleInterval = setInterval(() => {
    scrambleFrame++;
    letters.forEach((el, i) => {
      if (scrambleFrame > i * 5 + 8) return;
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
    });
    if (scrambleFrame > 35) {
      letters.forEach((el, i) => (el.textContent = originals[i]));
      clearInterval(scrambleInterval);
    }
  }, 45);

  // Enhanced timeline
  const tl = gsap.timeline({
    delay: 0.4,
    onComplete: () => {
      gsap.timeline()
        .to(panelL, { scaleX: 1, duration: 0.6, ease: 'expo-in' })
        .to(panelR, { scaleX: 1, duration: 0.6, ease: 'expo-in' }, '<')
        .call(() => {
          preloader.remove();
          document.body.classList.remove('loading');
          runHero();
        });
    }
  });

  tl.to(letters, {
    y: 0,
    opacity: 1,
    stagger: { each: 0.07, from: 'start' },
    duration: 1,
    ease: 'expo-out'
  })
    .to(
      counter,
      {
        v: 100,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate() {
          const v = Math.floor(counter.v);
          preNum.textContent = String(v).padStart(3, '0');
          preBar.style.width = v + '%';
        }
      },
      '-=0.5'
    )
    .to(
      letters,
      {
        y: -40,
        opacity: 0,
        stagger: { each: 0.06, from: 'end' },
        duration: 0.5,
        ease: 'expo-in'
      },
      '-=0.4'
    );
})();

// ===== ENHANCED HERO ANIMATIONS =====
function runHero() {
  const tl = gsap.timeline({
    defaults: { ease: 'expo-out' }
  });

  tl.to('#hEyebrow', { opacity: 1, y: 0, duration: 0.8 })
    .to('#hnRow1 .hn-a', { y: '0%', duration: 1.3 }, '-=0.4')
    .to('#hnRow1 .hn-b', { y: '0%', duration: 1.3, delay: 0.1 }, '<')
    .to('#hnRow2 .hn-c', { y: '0%', duration: 1.3 }, '-=0.9')
    .to('#hnRow2 .hn-a', { y: '0%', duration: 1.3, delay: 0.08 }, '<')
    .to('#heroYear', { opacity: 1, duration: 0.7 }, '-=0.6')
    .to('#heroDesc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('#heroBtns', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('#heroStats', { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
    .to('#heroRoleBadge', { opacity: 1, duration: 0.7 }, '-=0.25')
    .to('#heroScroll', { opacity: 1, duration: 0.6 }, '-=0.25')
    .to('.hero-bg-word', { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0.2);

  // Animated counter
  document.querySelectorAll('.hs-count').forEach(el => {
    const target = +el.dataset.t;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2.6,
      ease: 'power3.out',
      delay: 1.8,
      onUpdate() {
        el.textContent = Math.round(obj.v);
      }
    });
  });

  // Role cycling with smooth transitions
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
        .to(roleEl, { opacity: 0, y: -18, duration: 0.35, ease: 'expo-in' })
        .set(roleEl, { textContent: roles[rIdx], y: 18 })
        .to(roleEl, { opacity: 1, y: 0, duration: 0.45, ease: 'expo-out' });
    };
    gsap.delayedCall(3.2, () => setInterval(cycleRole, 3000));
  }

  // Parallax effects
  gsap.to('.hero-bg-word', {
    y: -120,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2.8
    }
  });

  gsap.to('.hero-bottom', {
    y: 60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2
    }
  });

  // Scroll indicator animation
  gsap.to('#heroScroll', {
    y: 12,
    duration: 1.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 3.5
  });

  // Grid lines fade-in
  gsap.from('.hero-grid-lines span', {
    scaleY: 0,
    duration: 1.6,
    ease: 'expo-out',
    stagger: { each: 0.1, from: 'center' },
    delay: 0.7,
    transformOrigin: 'top'
  });
}

// ===== ENHANCED MARQUEE =====
(function initMarquee() {
  const inner = document.getElementById('mqInner');
  if (!inner) return;

  let scrollV = 0,
    lastY = 0;
  window.addEventListener('scroll', () => {
    scrollV = window.scrollY - lastY;
    lastY = window.scrollY;
  });

  gsap.ticker.add(() => {
    const speed = Math.max(25 - Math.abs(scrollV) * 0.6, 8);
    inner.style.animationDuration = speed + 's';
  });

  gsap.from('.marquee-band', {
    opacity: 0,
    y: 32,
    duration: 0.9,
    ease: 'expo-out',
    scrollTrigger: { trigger: '.marquee-band', start: 'top 90%' }
  });
})();

// ===== SECTION HEADING REVEALS =====
(function initSectionHeadings() {
  document.querySelectorAll('.sl').forEach(line => {
    ScrollTrigger.create({
      trigger: line,
      start: 'top 86%',
      once: true,
      onEnter: () => {
        gsap.to(line, {
          y: '0%',
          opacity: 1,
          duration: 1.2,
          ease: 'expo-out'
        });
      }
    });
  });
})();

// ===== ENHANCED SCROLL REVEALS =====
(function initScrollReveals() {
  // About section
  document.querySelectorAll('.about-lead, .about-body').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'expo-out',
      delay: i * 0.15,
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  document.querySelectorAll('.ab-item').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'expo-out',
      delay: i * 0.12,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // Experience card
  gsap.to('.exp-card', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'expo-out',
    scrollTrigger: { trigger: '.exp-card', start: 'top 80%' }
  });

  // Skills grid
  ScrollTrigger.batch('.sg-block', {
    onEnter: els => {
      gsap.to(els, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.95,
        ease: 'expo-out'
      });
    },
    start: 'top 84%',
    once: true
  });

  // Education rows
  document.querySelectorAll('.edu-row').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.85,
      ease: 'expo-out',
      delay: i * 0.12,
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  // Contact links
  document.querySelectorAll('.clink').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'expo-out',
      delay: i * 0.12,
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  gsap.to('.contact-sub', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'expo-out',
    scrollTrigger: { trigger: '.contact-sub', start: 'top 86%' }
  });
})();

// ===== SECTION TAG REVEALS =====
document.querySelectorAll('.sect-tag').forEach(tag => {
  gsap.from(tag, {
    opacity: 0,
    x: -28,
    duration: 0.7,
    ease: 'expo-out',
    scrollTrigger: { trigger: tag, start: 'top 88%' }
  });
});

// ===== PROJECT ROWS =====
(function initProjectRows() {
  gsap.from('.proj-row', {
    opacity: 0,
    x: -42,
    stagger: 0.09,
    duration: 0.8,
    ease: 'expo-out',
    scrollTrigger: { trigger: '.proj-list', start: 'top 83%' }
  });
})();

// ===== PROJECT FILTERS =====
(function initFilters() {
  const buttons = document.querySelectorAll('.pf');
  const items = document.querySelectorAll('.proj-row');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.f;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gsap.fromTo(btn, { scale: 0.82 }, { scale: 1, duration: 0.5, ease: 'back.out(4)' });

      const show = [],
        hide = [];
      items.forEach(item => {
        const cats = (item.dataset.cats || '').split(' ');
        (f === 'all' || cats.includes(f) ? show : hide).push(item);
      });

      gsap.to(hide, {
        opacity: 0,
        x: 20,
        duration: 0.28,
        ease: 'expo-in',
        onComplete: () => {
          hide.forEach(el => el.classList.add('hidden'));
          show.forEach(el => el.classList.remove('hidden'));
          gsap.fromTo(
            show,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, stagger: 0.08, duration: 0.6, ease: 'expo-out' }
          );
        }
      });
    });
  });
})();

// ===== SKILLS HOVER EFFECTS =====
(function initSkillsHover() {
  document.querySelectorAll('.sg-items span').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        color: 'var(--accent-soft)',
        scale: 1.15,
        duration: 0.22,
        ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        color: 'var(--ink)',
        scale: 1,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
})();

// ===== NAVIGATION =====
(function initNav() {
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-center a');
  const sections = document.querySelectorAll('section[id]');

  gsap.from('#nav', {
    y: -80,
    opacity: 0,
    duration: 1,
    ease: 'expo-out',
    delay: 0.2
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    const y = window.scrollY + 140;
    sections.forEach(s => {
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = nav.querySelector(`a[href="#${s.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  });
})();

// ===== MENU =====
(function initMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('fullMenu');
  if (!btn || !menu) return;

  const menuItems = menu.querySelectorAll('.fm-t, .fm-n');
  const desktopMq = window.matchMedia('(min-width: 901px)');
  let open = false;

  const openMenu = () => {
    if (open) return;
    open = true;
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    gsap.set(menuItems, { y: '115%' });
    gsap.to(menuItems, {
      y: '0%',
      stagger: 0.08,
      duration: 0.8,
      ease: 'expo-out',
      delay: 0.4
    });
  };

  const closeMenu = () => {
    if (!open) return;
    open = false;
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    gsap.to(menuItems, {
      y: '115%',
      stagger: { each: 0.05, from: 'end' },
      duration: 0.4,
      ease: 'expo-in',
      onComplete: () => menu.classList.remove('open')
    });
  };

  btn.addEventListener('click', () => (open ? closeMenu() : openMenu()));
  menu.querySelectorAll('.fm-link').forEach(l => l.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
  desktopMq.addEventListener('change', e => {
    if (e.matches) closeMenu();
  });
})();

// ===== THEME SWITCHER =====
(function initTheme() {
  const btn = document.getElementById('themeBtn');
  const lbl = document.getElementById('themeLbl');
  const root = document.documentElement;

  const saved = localStorage.getItem('rfln2-theme');
  const pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || pref, false);

  btn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  function applyTheme(t, animate) {
    root.setAttribute('data-theme', t);
    lbl.textContent = t.toUpperCase();
    localStorage.setItem('rfln2-theme', t);
    if (animate) {
      gsap.fromTo(
        btn,
        { scale: 0.75, rotate: -22 },
        { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(3)' }
      );
      const flash = document.createElement('div');
      Object.assign(flash.style, {
        position: 'fixed',
        inset: 0,
        background: t === 'light' ? '#fafafa' : '#0a0a0a',
        zIndex: 7000,
        pointerEvents: 'none'
      });
      document.body.appendChild(flash);
      gsap.to(flash, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => flash.remove()
      });
    }
  }
})();

// ===== MAGNETIC EFFECT =====
(function initMagnet() {
  document.querySelectorAll('.hbtn-primary, .hbtn-ghost, .clink, .pf, .nav-brand').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
      gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    });
  });
})();

// ===== TEXT SCRAMBLE EFFECT =====
(function initScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
  document.querySelectorAll('.hn-a, .hn-c').forEach(el => {
    const orig = el.textContent;
    el.addEventListener('mouseenter', () => {
      let iter = 0;
      const interval = setInterval(() => {
        el.textContent = orig
          .split('')
          .map((c, i) => {
            if (i < iter) return c;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        if (iter >= orig.length) clearInterval(interval);
        iter += 1 / 3;
      }, 35);
    });
  });
})();

// ===== PROGRESS BAR =====
(function initProgressBar() {
  const line = document.createElement('div');
  Object.assign(line.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '2px',
    background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-soft) 100%)',
    zIndex: 9000,
    width: '0%',
    pointerEvents: 'none',
    boxShadow: '0 0 12px var(--accent-soft)'
  });
  document.body.appendChild(line);

  gsap.to(line, {
    width: '100%',
    ease: 'none',
    scrollTrigger: { start: 'top top', end: 'bottom bottom', scrub: 0.5 }
  });
})();

// ===== PARALLAX SECTIONS =====
(function initParallax() {
  [
    { sel: '.sect-tag', y: -15 },
    { sel: '.section-h', y: -28 }
  ].forEach(({ sel, y }) => {
    document.querySelectorAll(sel).forEach(el => {
      gsap.to(el, {
        y,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.sect') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8
        }
      });
    });
  });
})();

// ===== ABOUT SECTION REVEAL =====
(function initAboutReveal() {
  gsap.set('.al-left', { opacity: 0, x: -60 });
  gsap.set('.al-right', { opacity: 0, x: 60 });

  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 76%',
    once: true,
    onEnter: () => {
      gsap.to('.al-left', { opacity: 1, x: 0, duration: 1.1, ease: 'expo-out' });
      gsap.to('.al-right', {
        opacity: 1,
        x: 0,
        duration: 1.1,
        ease: 'expo-out',
        delay: 0.18
      });
    }
  });
})();

// ===== EXPERIENCE ANIMATIONS =====
(function initExpCardAnimations() {
  ScrollTrigger.create({
    trigger: '.exp-card',
    start: 'top 78%',
    once: true,
    onEnter: () => {
      gsap.from('.ec-side', {
        opacity: 0,
        x: -35,
        duration: 0.8,
        ease: 'expo-out',
        delay: 0.25
      });
      gsap.from('.ec-title', {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'expo-out',
        delay: 0.4
      });
      gsap.from('.ec-list li', {
        opacity: 0,
        x: -22,
        stagger: 0.1,
        duration: 0.6,
        ease: 'expo-out',
        delay: 0.5
      });
      gsap.from('.ec-tags span', {
        opacity: 0,
        scale: 0.7,
        stagger: 0.08,
        duration: 0.5,
        ease: 'back.out(2.5)',
        delay: 0.65
      });
    }
  });
})();

// ===== CONTACT REVEAL =====
(function initContactReveal() {
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 76%',
    once: true,
    onEnter: () => {
      gsap.from('.contact-h .sl', {
        y: '115%',
        stagger: 0.12,
        duration: 1.1,
        ease: 'expo-out'
      });
    }
  });
})();

// ===== FOOTER REVEAL =====
gsap.from('.site-footer > *', {
  opacity: 0,
  y: 22,
  stagger: 0.15,
  duration: 0.75,
  ease: 'expo-out',
  scrollTrigger: { trigger: '.site-footer', start: 'top 94%' }
});

// ===== SMOOTH ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById('nav')?.offsetHeight || 74;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

// ===== MENU LINK HOVER =====
(function initSplitTextHover() {
  document.querySelectorAll('.fm-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link.querySelector('.fm-t'), {
        letterSpacing: '.09em',
        duration: 0.35,
        ease: 'power2.out'
      });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link.querySelector('.fm-t'), {
        letterSpacing: '.04em',
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });
})();

// ===== EDU ROW HOVER =====
(function initBorderGlowOnHover() {
  document.querySelectorAll('.edu-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      gsap.to(row.querySelector('.er-yr'), {
        opacity: 1,
        x: 5,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(row.querySelector('.er-yr'), {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
})();

// ===== PROJECT NUMBER REACT =====
(function initProjectNumReact() {
  document.querySelectorAll('.proj-row').forEach(row => {
    const num = row.querySelector('.pr-num');
    row.addEventListener('mouseenter', () => {
      gsap.to(num, { y: -5, duration: 0.25, ease: 'power2.out' });
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(num, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.6)' });
    });
  });
})();

// ===== LIVE DOT PULSE =====
(function initLiveDotPulse() {
  gsap.to('.ecl-dot, .ns-dot', {
    scale: 1.9,
    opacity: 0.25,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
})();

// ===== HERO STATS HOVER =====
(function initHeroStatsHover() {
  document.querySelectorAll('.hs-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item.querySelector('.hs-n'), {
        y: -4,
        duration: 0.25,
        ease: 'power2.out'
      });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item.querySelector('.hs-n'), {
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.6)'
      });
    });
  });
})();

// ===== NAV BRAND HOVER =====
(function initNavBrandSplit() {
  const brand = document.querySelector('.nav-brand');
  if (!brand) return;
  brand.addEventListener('mouseenter', () => {
    gsap.to(brand, { letterSpacing: '.14em', duration: 0.35, ease: 'power2.out' });
  });
  brand.addEventListener('mouseleave', () => {
    gsap.to(brand, {
      letterSpacing: '.1em',
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
})();

// ===== BUTTON HOVER EFFECTS =====
document.querySelectorAll('.hbtn-primary').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    gsap.to(btn.querySelector('i'), { x: 4, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn.querySelector('i'), { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
  });
});

// ===== CONSOLE SIGNATURE =====
console.log(
  '%c✦ RIFLAN v3 — Enhanced Animation System • Modern Portfolio 2026',
  'color: #818cf8; font-family: monospace; font-size: 13px; font-weight: bold; background: #0a0a0a; padding: 6px 14px; border-radius: 4px;'
);

})();
