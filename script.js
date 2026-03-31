(() => {
'use strict';

gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

CustomEase.create('expo-out', 'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('expo-in',  'M0,0 C0.7,0 0.84,0 1,1');
CustomEase.create('smooth',   'M0,0 C0.25,0.1 0.25,1 1,1');

(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 30 : 70;

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
      this.r = Math.random() * 1 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.life = Math.random() * 300 + 100;
      this.age = 0;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.age++;
      if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha * Math.sin((this.age / this.life) * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
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
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.05;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.4;
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

(function initCursor() {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.06, ease: 'none' });
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.08;
    ry += (my - ry) * 0.08;
    gsap.set(ring, { x: rx, y: ry });
  });

  document.querySelectorAll('a, button, .proj-row, .edu-row, .ab-item, .sg-block').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(ring, { width: 60, height: 60, opacity: 0.8, duration: 0.3, ease: 'back.out(2)' });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(ring, { width: 36, height: 36, opacity: 0.5, duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    });
  });
})();

document.body.classList.add('loading');

(function initPreloader() {
  const letters   = document.querySelectorAll('.plc');
  const preBar    = document.getElementById('preBar');
  const preNum    = document.getElementById('preNum');
  const preloader = document.getElementById('preloader');
  const panelL    = document.querySelector('.pre-panel-l');
  const panelR    = document.querySelector('.pre-panel-r');
  if (!preloader) return;

  const counter = { v: 0 };

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!';
  let scrambleFrame = 0;
  const originals = ['R','I','F','L','A','N'];

  const scrambleInterval = setInterval(() => {
    scrambleFrame++;
    letters.forEach((el, i) => {
      if (scrambleFrame > i * 4 + 5) return;
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
    });
    if (scrambleFrame > 25) {
      letters.forEach((el, i) => el.textContent = originals[i]);
      clearInterval(scrambleInterval);
    }
  }, 55);

  const tl = gsap.timeline({
    delay: 0.3,
    onComplete: () => {
      gsap.timeline()
        .to(panelL, { scaleX: 1, duration: 0.55, ease: 'expo-in' })
        .to(panelR, { scaleX: 1, duration: 0.55, ease: 'expo-in' }, '<')
        .call(() => {
          preloader.remove();
          document.body.classList.remove('loading');
          runHero();
        });
    }
  });

  tl
    .to(letters, {
      y: 0, opacity: 1,
      stagger: { each: 0.06, from: 'start' },
      duration: 0.9, ease: 'expo-out'
    })
    .to(counter, {
      v: 100, duration: 1.8, ease: 'power2.inOut',
      onUpdate() {
        const v = Math.floor(counter.v);
        preNum.textContent = String(v).padStart(3, '0');
        preBar.style.width = v + '%';
      }
    }, '-=0.4')
    .to(letters, {
      y: -30, opacity: 0,
      stagger: { each: 0.05, from: 'end' },
      duration: 0.4, ease: 'expo-in'
    }, '-=0.35');
})();

function runHero() {
  const tl = gsap.timeline({ defaults: { ease: 'expo-out' } });

  tl
    .to('#hEyebrow', { opacity: 1, y: 0, duration: 0.7 })
    .to('#hnRow1 .hn-a', { y: '0%', duration: 1.2 }, '-=0.3')
    .to('#hnRow1 .hn-b', { y: '0%', duration: 1.2, delay: 0.08 }, '<')
    .to('#hnRow2 .hn-c', { y: '0%', duration: 1.2 }, '-=0.85')
    .to('#hnRow2 .hn-a', { y: '0%', duration: 1.2, delay: 0.06 }, '<')
    .to('#heroYear', { opacity: 1, duration: 0.6 }, '-=0.5')
    .to('#heroDesc', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('#heroBtns', { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
    .to('#heroStats', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('#heroRoleBadge', { opacity: 1, duration: 0.6 }, '-=0.2')
    .to('#heroScroll', { opacity: 1, duration: 0.5 }, '-=0.2')
    .to('.hero-bg-word', { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.1);

  document.querySelectorAll('.hs-count').forEach(el => {
    const target = +el.dataset.t;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 2.4, ease: 'power3.out', delay: 1.5,
      onUpdate() { el.textContent = Math.round(obj.v); }
    });
  });

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
        .to(roleEl, { opacity: 0, y: -14, duration: 0.28, ease: 'expo-in' })
        .set(roleEl, { textContent: roles[rIdx], y: 14 })
        .to(roleEl, { opacity: 1, y: 0, duration: 0.38, ease: 'expo-out' });
    };
    gsap.delayedCall(3, () => setInterval(cycleRole, 2600));
  }

  gsap.to('.hero-bg-word', {
    y: -100, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2.5
    }
  });

  gsap.to('.hero-bottom', {
    y: 50, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.8
    }
  });

  gsap.to('#heroScroll', {
    y: 9, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3
  });
}

(function initMarquee() {
  const inner = document.getElementById('mqInner');
  if (!inner) return;

  let scrollV = 0, lastY = 0;
  window.addEventListener('scroll', () => {
    scrollV = window.scrollY - lastY;
    lastY = window.scrollY;
  });

  gsap.ticker.add(() => {
    const speed = Math.max(20 - Math.abs(scrollV) * 0.5, 5);
    inner.style.animationDuration = speed + 's';
  });

  gsap.from('.marquee-band', {
    opacity: 0, y: 28, duration: 0.8, ease: 'expo-out',
    scrollTrigger: { trigger: '.marquee-band', start: 'top 92%' }
  });
})();

(function initSectionHeadings() {
  document.querySelectorAll('.sl').forEach(line => {
    ScrollTrigger.create({
      trigger: line, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to(line, { y: '0%', opacity: 1, duration: 1.1, ease: 'expo-out' });
      }
    });
  });
})();

(function initScrollReveals() {
  document.querySelectorAll('.about-lead, .about-body').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo-out',
      delay: i * 0.12,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  document.querySelectorAll('.ab-item').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.7, ease: 'expo-out', delay: i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  gsap.to('.exp-card', {
    opacity: 1, y: 0, duration: 0.9, ease: 'expo-out',
    scrollTrigger: { trigger: '.exp-card', start: 'top 82%' }
  });

  ScrollTrigger.batch('.sg-block', {
    onEnter: els => {
      gsap.to(els, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: 'expo-out'
      });
    },
    start: 'top 86%', once: true
  });

  document.querySelectorAll('.edu-row').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.75, ease: 'expo-out', delay: i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  document.querySelectorAll('.clink').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.7, ease: 'expo-out', delay: i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  gsap.to('.contact-sub', {
    opacity: 1, y: 0, duration: 0.7, ease: 'expo-out',
    scrollTrigger: { trigger: '.contact-sub', start: 'top 88%' }
  });
})();

document.querySelectorAll('.sect-tag').forEach(tag => {
  gsap.from(tag, {
    opacity: 0, x: -22, duration: 0.6, ease: 'expo-out',
    scrollTrigger: { trigger: tag, start: 'top 90%' }
  });
});

(function initProjectRows() {
  gsap.from('.proj-row', {
    opacity: 0, x: -36,
    stagger: 0.07, duration: 0.7, ease: 'expo-out',
    scrollTrigger: { trigger: '.proj-list', start: 'top 85%' }
  });
})();

(function initFilters() {
  const buttons = document.querySelectorAll('.pf');
  const items   = document.querySelectorAll('.proj-row');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.f;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });

      const show = [], hide = [];
      items.forEach(item => {
        const cats = (item.dataset.cats || '').split(' ');
        (f === 'all' || cats.includes(f) ? show : hide).push(item);
      });

      gsap.to(hide, {
        opacity: 0, x: 16, duration: 0.22, ease: 'expo-in',
        onComplete: () => {
          hide.forEach(el => el.classList.add('hidden'));
          show.forEach(el => el.classList.remove('hidden'));
          gsap.fromTo(show,
            { opacity: 0, x: -24 },
            { opacity: 1, x: 0, stagger: 0.06, duration: 0.45, ease: 'expo-out' }
          );
        }
      });
    });
  });
})();

(function initSkillsHover() {
  document.querySelectorAll('.sg-items span').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, { color: 'var(--ink)', scale: 1.1, duration: 0.18, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { color: 'var(--ink)', scale: 1, duration: 0.25, ease: 'elastic.out(1,0.4)' });
    });
  });
})();

(function initNav() {
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-center a');
  const sections = document.querySelectorAll('section[id]');

  gsap.from('#nav', { y: -72, opacity: 0, duration: 0.9, ease: 'expo-out', delay: 0.1 });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const y = window.scrollY + 120;
    sections.forEach(s => {
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = nav.querySelector(`a[href="#${s.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  });
})();

(function initMenu() {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('fullMenu');
  if (!btn || !menu) return;

  let open = false;

  const openMenu = () => {
    open = true;
    btn.classList.add('open');
    menu.classList.add('open');
    gsap.to(menu.querySelectorAll('.fm-t, .fm-n'), {
      y: '0%', stagger: 0.07, duration: 0.7, ease: 'expo-out', delay: 0.35
    });
  };

  const closeMenu = () => {
    open = false;
    btn.classList.remove('open');
    gsap.to(menu.querySelectorAll('.fm-t, .fm-n'), {
      y: '110%', stagger: { each: 0.04, from: 'end' }, duration: 0.32, ease: 'expo-in',
      onComplete: () => menu.classList.remove('open')
    });
  };

  btn.addEventListener('click', () => open ? closeMenu() : openMenu());
  menu.querySelectorAll('.fm-link').forEach(l => l.addEventListener('click', closeMenu));
})();

(function initTheme() {
  const btn  = document.getElementById('themeBtn');
  const lbl  = document.getElementById('themeLbl');
  const root = document.documentElement;

  const saved = localStorage.getItem('rfln2-theme');
  const pref  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || pref, false);

  btn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  function applyTheme(t, animate) {
    root.setAttribute('data-theme', t);
    lbl.textContent = t.toUpperCase();
    localStorage.setItem('rfln2-theme', t);
    if (animate) {
      gsap.fromTo(btn, { scale: 0.8, rotate: -18 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2.5)' });
      const flash = document.createElement('div');
      Object.assign(flash.style, {
        position: 'fixed', inset: 0,
        background: t === 'light' ? '#f8f8f8' : '#0c0c0c',
        zIndex: 7000, pointerEvents: 'none'
      });
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 0, duration: 0.5, ease: 'power2.in', onComplete: () => flash.remove() });
    }
  }
})();

(function initMagnet() {
  document.querySelectorAll('.hbtn-primary, .hbtn-ghost, .clink, .pf').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.2;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.2;
      gsap.to(el, { x: dx, y: dy, duration: 0.45, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
})();

(function initScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  document.querySelectorAll('.hn-a, .hn-c').forEach(el => {
    const orig = el.textContent;
    el.addEventListener('mouseenter', () => {
      let iter = 0;
      const interval = setInterval(() => {
        el.textContent = orig.split('').map((c, i) => {
          if (i < iter) return c;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (iter >= orig.length) clearInterval(interval);
        iter += 1/2.5;
      }, 38);
    });
  });
})();

(function initProgressBar() {
  const line = document.createElement('div');
  Object.assign(line.style, {
    position: 'fixed', top: 0, left: 0, height: '1px',
    background: 'rgba(255,255,255,0.5)', zIndex: 9000, width: '0%',
    pointerEvents: 'none'
  });
  document.body.appendChild(line);

  gsap.to(line, {
    width: '100%', ease: 'none',
    scrollTrigger: { start: 'top top', end: 'bottom bottom', scrub: 0.4 }
  });
})();

(function initParallax() {
  [
    { sel: '.sect-tag', y: -12 },
    { sel: '.section-h', y: -22 },
  ].forEach(({ sel, y }) => {
    document.querySelectorAll(sel).forEach(el => {
      gsap.to(el, {
        y, ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.sect') || el,
          start: 'top bottom', end: 'bottom top', scrub: 1.6
        }
      });
    });
  });
})();

(function initAboutReveal() {
  gsap.set('.al-left', { opacity: 0, x: -50 });
  gsap.set('.al-right', { opacity: 0, x: 50 });

  ScrollTrigger.create({
    trigger: '#about', start: 'top 78%', once: true,
    onEnter: () => {
      gsap.to('.al-left',  { opacity: 1, x: 0, duration: 1, ease: 'expo-out' });
      gsap.to('.al-right', { opacity: 1, x: 0, duration: 1, ease: 'expo-out', delay: 0.15 });
    }
  });
})();

(function initExpCardAnimations() {
  ScrollTrigger.create({
    trigger: '.exp-card', start: 'top 80%', once: true,
    onEnter: () => {
      gsap.from('.ec-side', { opacity: 0, x: -30, duration: 0.7, ease: 'expo-out', delay: 0.2 });
      gsap.from('.ec-title', { opacity: 0, y: 24, duration: 0.6, ease: 'expo-out', delay: 0.35 });
      gsap.from('.ec-list li', { opacity: 0, x: -18, stagger: 0.09, duration: 0.5, ease: 'expo-out', delay: 0.45 });
      gsap.from('.ec-tags span', { opacity: 0, scale: 0.75, stagger: 0.06, duration: 0.4, ease: 'back.out(2)', delay: 0.6 });
    }
  });
})();

(function initContactReveal() {
  ScrollTrigger.create({
    trigger: '#contact', start: 'top 78%', once: true,
    onEnter: () => {
      gsap.from('.contact-h .sl', {
        y: '110%', stagger: 0.1, duration: 1, ease: 'expo-out'
      });
    }
  });
})();

gsap.from('.site-footer > *', {
  opacity: 0, y: 18, stagger: 0.12, duration: 0.65, ease: 'expo-out',
  scrollTrigger: { trigger: '.site-footer', start: 'top 96%' }
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
  });
});

(function initHeroGridLines() {
  gsap.from('.hero-grid-lines span', {
    scaleY: 0, duration: 1.4, ease: 'expo-out',
    stagger: { each: 0.08, from: 'center' },
    delay: 0.5,
    transformOrigin: 'top'
  });
})();

(function initSplitTextHover() {
  document.querySelectorAll('.fm-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link.querySelector('.fm-t'), {
        letterSpacing: '.08em', duration: 0.3, ease: 'power2.out'
      });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link.querySelector('.fm-t'), {
        letterSpacing: '.03em', duration: 0.35, ease: 'power2.out'
      });
    });
  });
})();

(function initBorderGlowOnHover() {
  document.querySelectorAll('.edu-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      gsap.to(row.querySelector('.er-yr'), { opacity: 1, x: 4, duration: 0.25, ease: 'power2.out' });
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(row.querySelector('.er-yr'), { opacity: 1, x: 0, duration: 0.3 });
    });
  });
})();

(function initProjectNumReact() {
  document.querySelectorAll('.proj-row').forEach(row => {
    const num = row.querySelector('.pr-num');
    row.addEventListener('mouseenter', () => {
      gsap.to(num, { y: -4, duration: 0.22, ease: 'power2.out' });
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(num, { y: 0, duration: 0.35, ease: 'elastic.out(1,0.5)' });
    });
  });
})();

(function initLiveDotPulse() {
  gsap.to('.ecl-dot', {
    scale: 1.8, opacity: 0.2, duration: 0.9,
    repeat: -1, yoyo: true, ease: 'sine.inOut'
  });
})();

(function initHeroStatsHover() {
  document.querySelectorAll('.hs-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item.querySelector('.hs-n'), { y: -3, duration: 0.2, ease: 'power2.out' });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item.querySelector('.hs-n'), { y: 0, duration: 0.35, ease: 'elastic.out(1,0.5)' });
    });
  });
})();

(function initTextSplitRevealMarquee() {
  let ticking = false;
  let scrollDelta = 0;
  let lastScroll = window.scrollY;

  window.addEventListener('scroll', () => {
    scrollDelta = Math.abs(window.scrollY - lastScroll);
    lastScroll = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => { ticking = false; });
      ticking = true;
    }
  });
})();

(function initNavBrandSplit() {
  const brand = document.querySelector('.nav-brand');
  if (!brand) return;
  brand.addEventListener('mouseenter', () => {
    gsap.to(brand, { letterSpacing: '.12em', duration: 0.3, ease: 'power2.out' });
  });
  brand.addEventListener('mouseleave', () => {
    gsap.to(brand, { letterSpacing: '.06em', duration: 0.4, ease: 'elastic.out(1,0.5)' });
  });
})();

console.log('%c✦ RIFLAN v2 — Animation System Loaded · B&W Edition', 
  'color: #ffffff; font-family: monospace; font-size: 12px; background: #0c0c0c; padding: 4px 10px;');

})();