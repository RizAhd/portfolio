document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loading");

  const root = document.documentElement;
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  const navLinks = nav.querySelectorAll("a");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");
  const roleText = document.getElementById("heroRoleText");

  const preloader = document.getElementById("preloader");
  const preloaderBrand = document.getElementById("preloaderBrand");
  const preloaderSub = document.getElementById("preloaderSub");
  const preloaderProgress = document.getElementById("preloaderProgress");
  const preloaderCount = document.getElementById("preloaderCount");

  const filterWrap = document.getElementById("projectFilters");
  const filterButtons = filterWrap ? Array.from(filterWrap.querySelectorAll(".filter-btn")) : [];
  const projectItems = Array.from(document.querySelectorAll(".project-item"));

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("portfolio-theme");
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    localStorage.setItem("portfolio-theme", theme);
  };

  setTheme(initialTheme);

  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "light";
    setTheme(current === "light" ? "dark" : "light");
  });

  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 14) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  const sections = Array.from(document.querySelectorAll("section[id]"));
  const setActiveLink = () => {
    const y = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");
      const link = nav.querySelector(`a[href="#${id}"]`);

      if (!link) {
        return;
      }

      if (y >= top && y < bottom) {
        navLinks.forEach((n) => n.classList.remove("active"));
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", setActiveLink);
  setActiveLink();

  const preloaderWords = [
    "Engineering Premium Digital Products",
    "AI + Mobile + Full-Stack",
    "Modern Experiences, Real Impact"
  ];

  const hidePreloader = () => {
    document.body.classList.remove("is-loading");
    if (preloader) {
      preloader.remove();
    }
  };

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    if (preloaderCount) {
      preloaderCount.textContent = "100%";
    }
    if (preloaderProgress) {
      preloaderProgress.style.width = "100%";
    }
    setTimeout(hidePreloader, 400);

    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (typeof TextPlugin !== "undefined") {
    gsap.registerPlugin(TextPlugin);
  }

  if (preloader && preloaderBrand && preloaderSub && preloaderProgress && preloaderCount) {
    const loadingState = { value: 0 };
    const preloaderTimeline = gsap.timeline({
      onComplete: hidePreloader
    });

    preloaderTimeline
      .from(preloaderBrand, { y: 22, opacity: 0, duration: 0.5, ease: "power2.out" })
      .from(preloaderSub, { y: 14, opacity: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
      .to(loadingState, {
        value: 100,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          const value = Math.round(loadingState.value);
          preloaderCount.textContent = `${value}%`;
          preloaderProgress.style.width = `${value}%`;
        }
      }, "-=0.2")
      .to(preloaderBrand, { letterSpacing: "0.28em", duration: 0.35, ease: "power1.out" }, "-=0.55")
      .to(preloader, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "+=0.1");

    if (typeof TextPlugin !== "undefined") {
      let index = 0;
      const rotateLoaderText = () => {
        gsap.to(preloaderSub, {
          text: preloaderWords[index],
          duration: 0.45,
          ease: "none",
          onComplete: () => {
            index = (index + 1) % preloaderWords.length;
          }
        });
      };

      rotateLoaderText();
      gsap.to({}, {
        duration: 0.4,
        repeat: 2,
        repeatDelay: 0.28,
        onRepeat: rotateLoaderText
      });
    }
  } else {
    hidePreloader();
  }

  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out", delay: 0.15 } });
  heroTimeline
    .from(".eyebrow", { y: -28, opacity: 0, duration: 0.52 })
    .from(".hero-title", { y: 44, opacity: 0, duration: 0.82 }, "-=0.2")
    .from(".hero-role", { y: 20, opacity: 0, duration: 0.5 }, "-=0.35")
    .from(".hero-summary", { y: 22, opacity: 0, duration: 0.56 }, "-=0.25")
    .from(".hero-actions .btn", { y: 14, opacity: 0, stagger: 0.1, duration: 0.45 }, "-=0.2")
    .from(".quick-stats article", { y: 18, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.15");

  if (typeof TextPlugin !== "undefined") {
    const rolePhrases = [
      "Software Engineer",
      "AI Engineer",
      "React Native Developer",
      "Full-Stack Application Builder",
      "Real-Time Systems Developer"
    ];

    let idx = 0;
    gsap.to({}, {
      repeat: -1,
      repeatDelay: 0.7,
      duration: 2.1,
      onRepeat: () => {
        idx = (idx + 1) % rolePhrases.length;
      },
      onStart: () => {
        roleText.textContent = rolePhrases[0];
      },
      onUpdate: function () {
        const progress = this.progress();
        if (progress > 0.08 && progress < 0.85) {
          gsap.to(roleText, {
            duration: 0.45,
            text: rolePhrases[idx],
            ease: "none",
            overwrite: true
          });
        }
      }
    });
  }

  gsap.to(".orb-1", {
    x: -24,
    y: 34,
    duration: 5.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".orb-2", {
    x: 18,
    y: -26,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  document.querySelectorAll(".reveal").forEach((section) => {
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.82,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 84%"
      }
    });
  });

  gsap.utils
    .toArray(".value-card, .approach-item, .project-card, .skill-block, .edu-card, .timeline-card")
    .forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 28,
        scale: 0.985,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%"
        }
      });
    });

  gsap.utils.toArray(".contact-link, .btn").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      gsap.to(item, { y: -2, duration: 0.2, ease: "power1.out" });
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(item, { y: 0, duration: 0.2, ease: "power1.out" });
    });
  });

  const filterProjects = (category) => {
    const shown = projectItems.filter((item) => {
      const categories = (item.dataset.category || "").split(" ");
      const match = category === "all" || categories.includes(category);
      item.classList.toggle("is-hidden", !match);
      return match;
    });

    gsap.fromTo(
      shown,
      { opacity: 0, y: 20, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "opacity,transform"
      }
    );
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      filterProjects(category);
    });
  });
});
