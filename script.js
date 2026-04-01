'use strict';

// Mark JS as loaded (used for CSS :not(.js) no-JS fallback)
document.documentElement.classList.add('js');

/* ===================================================
   THEME
   =================================================== */
const root      = document.documentElement;
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(t, animate) {
  root.setAttribute('data-theme', t);
  localStorage.setItem('rm-theme', t);
  themeIcon.className = t === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';

  if (animate) {
    // Quick flash overlay for smooth theme transition
    const flash = document.createElement('div');
    Object.assign(flash.style, {
      position: 'fixed',
      inset: '0',
      background: t === 'dark' ? '#0d0e14' : '#f6f7fc',
      zIndex: '9000',
      pointerEvents: 'none',
      opacity: '0.5',
      transition: 'opacity 0.3s ease'
    });
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 320);
      });
    });
  }
}

// Init theme from storage or system preference
const savedTheme    = localStorage.getItem('rm-theme');
const prefersDark   = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'), false);

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next, true);
});

/* ===================================================
   MOBILE DRAWER
   =================================================== */
const menuBtn = document.getElementById('menuBtn');
const drawer  = document.getElementById('drawer');
let drawerOpen = false;

function openDrawer() {
  drawerOpen = true;
  drawer.style.display = 'flex';
  menuBtn.classList.add('open');
  menuBtn.setAttribute('aria-expanded', 'true');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Double rAF forces CSS transition to fire after display change
  requestAnimationFrame(() => {
    requestAnimationFrame(() => drawer.classList.add('open'));
  });
}

function closeDrawer() {
  if (!drawerOpen) return;
  drawerOpen = false;
  drawer.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (!drawerOpen) drawer.style.display = 'none';
  }, 240);
}

menuBtn.addEventListener('click', () => (drawerOpen ? closeDrawer() : openDrawer()));
drawer.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
window.matchMedia('(min-width: 901px)').addEventListener('change', e => {
  if (e.matches) closeDrawer();
});

/* ===================================================
   NAV — scroll style + active link
   =================================================== */
const nav      = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Scrolled state (glass blur)
  nav.classList.toggle('scrolled', y > 40);

  // Active link (closest section in viewport)
  const offset = y + nav.offsetHeight + 60;
  let current = '';
  sections.forEach(s => {
    if (offset >= s.offsetTop) current = s.id;
  });
  navLinks.forEach(l =>
    l.classList.toggle('active', l.getAttribute('data-section') === current)
  );

  lastScroll = y;
}, { passive: true });

/* ===================================================
   SMOOTH ANCHOR SCROLL
   =================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navH = nav.offsetHeight || 64;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===================================================
   SCROLL REVEAL — IntersectionObserver
   =================================================== */
const revealSections = document.querySelectorAll('.reveal-section');

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
  );
  revealSections.forEach(s => sectionObserver.observe(s));
} else {
  // Fallback: reveal everything immediately
  revealSections.forEach(s => s.classList.add('is-visible'));
}

/* ===================================================
   COUNTER ANIMATION
   =================================================== */
function animateCounter(el, target, duration) {
  const start  = performance.now();
  const update = now => {
    const p    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3); // cubic-out
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statEls       = document.querySelectorAll('.stat-n[data-target]');
const heroStats     = document.querySelector('.hero-stats');
let countersDone    = false;

if (heroStats && statEls.length) {
  const counterObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersDone) {
      countersDone = true;
      statEls.forEach(el => animateCounter(el, +el.dataset.target, 1400));
      counterObs.disconnect();
    }
  }, { threshold: 0.5 });
  counterObs.observe(heroStats);
}

/* ===================================================
   PROJECT FILTERS
   =================================================== */
const filterBtns = document.querySelectorAll('.pf');
const projItems  = document.querySelectorAll('.proj-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    projItems.forEach(item => {
      const cats   = item.dataset.cats || '';
      const hidden = f !== 'all' && !cats.split(' ').includes(f);
      item.classList.toggle('hidden', hidden);
    });
  });
});
