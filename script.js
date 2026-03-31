/* =============================================
   RIFLAN PORTFOLIO — script.js
   Full GSAP Animation System (Rebuilt)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     0. REGISTER GSAP PLUGINS
  ───────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

  CustomEase.create('smooth', 'M0,0 C0.25,0 0.25,1 1,1');
  CustomEase.create('bounce-out', 'M0,0 C0.19,1 0.22,1 1,1');

  /* ─────────────────────────────────────────
     1. CURSOR
  ───────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, {
        x: mouseX, y: mouseY,
        duration: 0.05,
        ease: 'none'
      });
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      gsap.set(follower, { x: followerX, y: followerY });
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Scale on interactive elements
    document.querySelectorAll('a, button, .pcard, .vcard, .skcard, .aitem').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(follower, { scale: 1.5, duration: 0.3, ease: 'back.out(2)', borderColor: 'var(--accent)', opacity: 0.8 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(follower, { scale: 1, duration: 0.3, ease: 'back.out(2)', borderColor: 'var(--brand)', opacity: 0.5 });
      });
    });
  }

  /* ─────────────────────────────────────────
     2. PRELOADER ANIMATION
  ───────────────────────────────────────── */
  document.body.classList.add('loading');

  const preloader = document.getElementById('preloader');
  const preLetters = document.querySelectorAll('#preLetters span');
  const preBar = document.getElementById('preBar');
  const prePct = document.getElementById('prePct');

  const counter = { val: 0 };

  const preTL = gsap.timeline({
    onComplete: () => {
      // Slide preloader out
      gsap.to(preloader, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
        onComplete: () => {
          preloader.remove();
          document.body.classList.remove('loading');
          runHeroAnimation();
        }
      });
    }
  });

  preTL
    .to(preLetters, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.06,
      ease: 'power3.out'
    })
    .to(counter, {
      val: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate() {
        const v = Math.round(counter.val);
        prePct.textContent = v;
        preBar.style.width = v + '%';
      }
    }, '-=0.3')
    .to(preLetters, {
      letterSpacing: '0.4em',
      opacity: 0.4,
      duration: 0.4,
      ease: 'power2.in'
    }, '-=0.3');

  /* ─────────────────────────────────────────
     3. HERO ANIMATION (runs after preloader)
  ───────────────────────────────────────── */
  function runHeroAnimation() {
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTL
      .to('#heroBadge', {
        opacity: 1,
        y: 0,
        duration: 0.6
      })
      .to('#hnLine1', {
        y: 0,
        opacity: 1,
        duration: 0.9
      }, '-=0.2')
      .to('#hnLine2', {
        y: 0,
        opacity: 1,
        duration: 0.9
      }, '-=0.65')
      .to('.hero-role', {
        y: 0,
        opacity: 1,
        duration: 0.6
      }, '-=0.5')
      .to('#heroDesc', {
        y: 0,
        opacity: 1,
        duration: 0.6
      }, '-=0.4')
      .to('#heroBtns', {
        y: 0,
        opacity: 1,
        duration: 0.6
      }, '-=0.35')
      .to('#heroStats', {
        y: 0,
        opacity: 1,
        duration: 0.6
      }, '-=0.3')
      .to('#heroScroll', {
        opacity: 1,
        duration: 0.6
      }, '-=0.2');

    // Animate stat counters
    document.querySelectorAll('.hstat-num').forEach(el => {
      const target = parseInt(el.dataset.count);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        delay: 1.2,
        onUpdate() {
          el.textContent = Math.round(obj.val);
        }
      });
    });

    // Typewriter role text
    if (TextPlugin) {
      const roles = [
        'Software Engineer',
        'AI Engineer',
        'React Native Developer',
        'Full-Stack Builder',
        'Real-Time Dev'
      ];
      let roleIdx = 0;
      const roleEl = document.getElementById('heroRole');

      const cycleRole = () => {
        roleIdx = (roleIdx + 1) % roles.length;
        gsap.timeline()
          .to(roleEl, {
            opacity: 0,
            x: -15,
            duration: 0.3,
            ease: 'power2.in'
          })
          .set(roleEl, { text: roles[roleIdx], x: 15 })
          .to(roleEl, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
      };

      gsap.delayedCall(2.5, () => {
        setInterval(cycleRole, 2800);
      });
    }

    // Floating orbs
    gsap.to('.hero-orb-1', {
      x: -30,
      y: 40,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.hero-orb-2', {
      x: 25,
      y: -35,
      duration: 8.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  /* ─────────────────────────────────────────
     4. SCROLL ANIMATIONS
  ───────────────────────────────────────── */
  // Section titles
  document.querySelectorAll('.reveal-title').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%'
      }
    });
  });

  // Fade elements
  document.querySelectorAll('.reveal-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%'
      }
    });
  });

  // Cards with stagger via data-delay
  document.querySelectorAll('.reveal-card').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%'
      }
    });
  });

  // About pills stagger
  document.querySelectorAll('.reveal-pill').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%'
      }
    });
  });

  /* ─────────────────────────────────────────
     5. SECTION LABEL ANIMATED LINE
  ───────────────────────────────────────── */
  document.querySelectorAll('.section-label').forEach(label => {
    gsap.from(label, {
      opacity: 0,
      x: -20,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: label,
        start: 'top 90%'
      }
    });
  });

  /* ─────────────────────────────────────────
     6. PARALLAX HERO ELEMENTS ON SCROLL
  ───────────────────────────────────────── */
  gsap.to('.hero-inner', {
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  gsap.to('.hero-grid-lines', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '40% top',
      scrub: 1
    }
  });

  /* ─────────────────────────────────────────
     7. PROJECT FILTER ANIMATION
  ───────────────────────────────────────── */
  const filterButtons = document.querySelectorAll('.fb');
  const allCards = document.querySelectorAll('.pcard');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Animate filter button click
      gsap.fromTo(btn, 
        { scale: 0.92 },
        { scale: 1, duration: 0.3, ease: 'back.out(2.5)' }
      );

      const toShow = [];
      const toHide = [];

      allCards.forEach(card => {
        const cats = (card.dataset.cat || '').split(' ');
        const matches = filter === 'all' || cats.includes(filter);
        if (matches) toShow.push(card);
        else toHide.push(card);
      });

      // Hide non-matching
      gsap.to(toHide, {
        opacity: 0,
        scale: 0.94,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          toHide.forEach(c => c.classList.add('hidden'));
          // Show matching
          toShow.forEach(c => c.classList.remove('hidden'));
          gsap.fromTo(toShow,
            { opacity: 0, y: 24, scale: 0.97 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.45,
              stagger: 0.06,
              ease: 'power2.out'
            }
          );
        }
      });
    });
  });

  /* ─────────────────────────────────────────
     8. NAVIGATION
  ───────────────────────────────────────── */
  const mainNav = document.getElementById('mainNav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile menu
  let menuOpen = false;

  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    burger.classList.toggle('open', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);

    if (menuOpen) {
      const links = mobileMenu.querySelectorAll('a');
      gsap.fromTo(links,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: 'power2.out', delay: 0.1 }
      );
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNavLink() {
    const y = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;
      if (y >= top && y < bottom) {
        navLinks.forEach(n => n.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  /* ─────────────────────────────────────────
     9. THEME TOGGLE
  ───────────────────────────────────────── */
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  const saved = localStorage.getItem('riflan-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  setTheme(initial, false);

  themeBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark', true);
  });

  function setTheme(theme, animate) {
    root.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    localStorage.setItem('riflan-theme', theme);

    if (animate) {
      gsap.fromTo(themeBtn,
        { rotation: -30, scale: 0.8 },
        { rotation: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' }
      );
    }
  }

  /* ─────────────────────────────────────────
     10. HOVER MAGNETIC EFFECT ON BUTTONS
  ───────────────────────────────────────── */
  document.querySelectorAll('.hbtn, .clink, .fb').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.2;
      const dy = (e.clientY - cy) * 0.2;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ─────────────────────────────────────────
     11. CARD TILT EFFECT
  ───────────────────────────────────────── */
  document.querySelectorAll('.pcard, .vcard, .skcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = (e.clientY - cy) / (rect.height / 2) * -6;
      const ry = (e.clientX - cx) / (rect.width / 2) * 6;
      gsap.to(card, {
        rotateX: rx,
        rotateY: ry,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });

  /* ─────────────────────────────────────────
     12. SECTION NUMBER COUNTER (Skills/Edu)
  ───────────────────────────────────────── */
  document.querySelectorAll('.sl-num').forEach(el => {
    gsap.from(el, {
      textContent: '00',
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%'
      }
    });
  });

  /* ─────────────────────────────────────────
     13. PROJECTS GRID INITIAL REVEAL (GSAP batch)
  ───────────────────────────────────────── */
  ScrollTrigger.batch('.pcard', {
    onEnter: els => {
      gsap.from(els, {
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      });
    },
    start: 'top 90%',
    once: true
  });

  /* ─────────────────────────────────────────
     14. FOOTER FADE
  ───────────────────────────────────────── */
  gsap.from('.site-footer', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.site-footer',
      start: 'top 95%'
    }
  });

  /* ─────────────────────────────────────────
     15. SMOOTH ANCHOR SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      gsap.to(window, {
        scrollTo: { y: target, offsetY: 70 },
        duration: 1.1,
        ease: 'power3.inOut'
      });
    });
  });

  // ScrollTo plugin fallback (if not loaded, use native)
  if (!gsap.plugins || !gsap.plugins.scrollTo) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ─────────────────────────────────────────
     16. APPROACH ITEMS: SEQUENTIAL HIGHLIGHT
  ───────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#approach',
    start: 'top 70%',
    onEnter: () => {
      gsap.fromTo('.aitem',
        { borderColor: 'var(--border)' },
        {
          borderColor: 'var(--brand)',
          duration: 0.4,
          stagger: 0.25,
          ease: 'none',
          yoyo: true,
          repeat: 1
        }
      );
    },
    once: true
  });

  /* ─────────────────────────────────────────
     17. EDUCATION ROWS REVEAL
  ───────────────────────────────────────── */
  gsap.utils.toArray('.edu-row').forEach((row, i) => {
    gsap.from(row, {
      opacity: 0,
      x: i % 2 === 0 ? -30 : 30,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: row,
        start: 'top 88%'
      }
    });
  });

  /* ─────────────────────────────────────────
     18. CONTACT SECTION ENTRANCE
  ───────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 75%',
    onEnter: () => {
      gsap.fromTo('.clink',
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, stagger: 0.12, duration: 0.55, ease: 'power2.out', delay: 0.4 }
      );
    },
    once: true
  });

  /* ─────────────────────────────────────────
     19. BACKGROUND GRADIENT SHIFT ON SCROLL
  ───────────────────────────────────────── */
  const bgSections = [
    { id: '#home', color: 'rgba(0,229,200,0.03)' },
    { id: '#projects', color: 'rgba(255,107,53,0.03)' },
    { id: '#contact', color: 'rgba(0,229,200,0.05)' }
  ];

  bgSections.forEach(({ id, color }) => {
    const el = document.querySelector(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => gsap.to('body', { '--brand-dim': color, duration: 0.8 }),
      onLeave: () => gsap.to('body', { '--brand-dim': 'rgba(0,229,200,0.12)', duration: 0.8 })
    });
  });

  /* ─────────────────────────────────────────
     20. SKILL PILL STAGGER REVEAL
  ───────────────────────────────────────── */
  document.querySelectorAll('.skcard').forEach(card => {
    const pills = card.querySelectorAll('.sk-pills span');
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(pills,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4, ease: 'back.out(2)', delay: 0.3 }
        );
      },
      once: true
    });
  });

  console.log('%c✦ Riflan Portfolio — GSAP Animations Ready', 'color: #00e5c8; font-family: monospace; font-size: 14px;');

});