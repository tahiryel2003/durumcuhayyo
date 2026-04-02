/* ============================================
   DÜRÜMCÜ HAYYO — Main Script
   ============================================ */

'use strict';

/* ---- BUTON FOCUS KALDIR — tıklama sonrası hover normal çalışsın ---- */
document.querySelectorAll('.btn-outline').forEach(btn => {
  btn.addEventListener('click', () => btn.blur());
});

/* ---- HERO BACKGROUND PHOTO: trigger zoom-out after load ---- */
(function initHeroBgLoad() {
  const bgEl = document.querySelector('.hero-bg-image');
  if (!bgEl) return;
  const img = new Image();
  img.src = 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=1800&q=90&fit=crop&crop=right';
  img.onload = () => bgEl.classList.add('loaded');
  // Fallback: add class after 500ms regardless
  setTimeout(() => bgEl.classList.add('loaded'), 500);
})();

/* ---- HEADER: fontlar yüklenince göster (font swap'ı gizler) ---- */
(function initHeaderReveal() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const reveal = () => header.classList.add('fonts-ready');

  // Font Loading API destekleniyorsa bekle, yoksa hemen göster
  if (document.fonts && document.fonts.ready) {
    // Maksimum 600ms bekle — sonra ne olursa olsun göster
    const timeout = setTimeout(reveal, 600);
    document.fonts.ready.then(() => {
      clearTimeout(timeout);
      reveal();
    });
  } else {
    reveal();
  }
})();

/* ---- STICKY HEADER ---- */
(function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- SCROLL SPY — aktif nav linkini işaretle ---- */
(function initScrollSpy() {
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  if (!navLinks.length) return;

  const sectionIds = Array.from(navLinks).map(a => a.getAttribute('href').slice(1));
  const sections   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const headerH    = 80;

  const onScroll = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - headerH - 40) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ---- MOBILE NAV ---- */
(function initMobileNav() {
  const toggle  = document.getElementById('nav-toggle');
  const overlay = document.getElementById('mobile-nav-overlay');

  if (!toggle || !overlay) return;

  const open  = () => { overlay.classList.add('open'); toggle.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { overlay.classList.remove('open'); toggle.classList.remove('open'); document.body.style.overflow = ''; };

  toggle.addEventListener('click', () => overlay.classList.contains('open') ? close() : open());

  /* Close on link click */
  overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

  /* Close on Escape */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ---- BESTSELLER CARDS — animasyon ---- */
(function initCardStagger() {
  const grid = document.querySelector('.bestseller-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.food-card'));
  if (!cards.length) return;

  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('card-visible'));
    return;
  }

  const isDesktop = () => window.innerWidth >= 1024;

  if (isDesktop()) {
    // Desktop: grid görününce tüm kartlar stagger ile soldan sağa gelir
    const gridObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('card-visible'), i * 140);
      });
      gridObserver.disconnect();
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    gridObserver.observe(grid);
  } else {
    // Mobil/tablet: her kart ekrana girince tek tek soldan gelir
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('card-visible');
        cardObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    cards.forEach(card => cardObserver.observe(card));
  }
})();

/* ---- SCROLL REVEAL ---- */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ---- MENU TABS + CARD ANIMATIONS ---- */
(function initMenuTabs() {
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  if (!tabs.length) return;

  const isDesktop = () => window.innerWidth >= 1024;

  /* Mobil/tablet: her kart ekrana girince TEK TEK animasyon */
  function observeMobile(panel) {
    const cards = Array.from(panel.querySelectorAll('.menu-card'));
    cards.forEach(c => c.classList.remove('mc-visible'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('mc-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
    cards.forEach(card => obs.observe(card));
  }

  /* Desktop: panel görününce stagger */
  function observeDesktop(panel) {
    const cards = Array.from(panel.querySelectorAll('.menu-card'));
    cards.forEach(c => c.classList.remove('mc-visible'));
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('mc-visible'), i * 120);
      });
      obs.disconnect();
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    obs.observe(panel);
  }

  function startAnimation(panel) {
    if (!('IntersectionObserver' in window)) {
      panel.querySelectorAll('.menu-card').forEach(c => c.classList.add('mc-visible'));
      return;
    }
    isDesktop() ? observeDesktop(panel) : observeMobile(panel);
  }

  /* İlk yüklemede aktif paneli başlat */
  const active = document.querySelector('.menu-panel.active');
  if (active) {
    active.classList.add('anim-in');
    startAnimation(active);
  }

  /* Tab değiştir */
  function switchTab(nextTab) {
    const target  = nextTab.dataset.tab;
    const current = document.querySelector('.menu-panel.active');
    const next    = document.getElementById('tab-' + target);
    if (!next || next === current) return;

    tabs.forEach(t => {
      const on = t === nextTab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    if (current) {
      current.classList.add('anim-out');
      current.addEventListener('animationend', () => {
        current.classList.remove('active', 'anim-in', 'anim-out');
        current.hidden = true;
      }, { once: true });
    }

    next.hidden = false;
    next.classList.add('active', 'anim-in');
    next.classList.remove('anim-out');

    /* Tab geçişinde animasyon — desktop stagger, mobil/tablet scroll-triggered */
    if (isDesktop()) {
      const cards = Array.from(next.querySelectorAll('.menu-card'));
      cards.forEach(c => c.classList.remove('mc-visible'));
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('mc-visible'), i * 120);
      });
    } else {
      observeMobile(next);
    }

    next.addEventListener('animationend', () => next.classList.remove('anim-in'), { once: true });
  }

  tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab)));
})();

/* ---- COUNTDOWN TIMER ---- */
(function initCountdown() {
  const hEl = document.getElementById('cd-h');
  const mEl = document.getElementById('cd-m');
  const sEl = document.getElementById('cd-s');

  if (!hEl || !mEl || !sEl) return;

  const pad = n => String(n).padStart(2, '0');

  const tick = () => {
    const now     = new Date();
    const close   = new Date();
    close.setHours(23, 0, 0, 0);

    if (now >= close) {
      hEl.textContent = '00';
      mEl.textContent = '00';
      sEl.textContent = '00';
      return;
    }

    const diff = Math.floor((close - now) / 1000);
    const h    = Math.floor(diff / 3600);
    const m    = Math.floor((diff % 3600) / 60);
    const s    = diff % 60;

    hEl.textContent = pad(h);
    mEl.textContent = pad(m);
    sEl.textContent = pad(s);
  };

  tick();
  setInterval(tick, 1000);
})();

/* ---- SMOOTH SCROLL FOR ANCHORS ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href   = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('site-header')?.offsetHeight || 70;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---- STAT COUNTER ANIMATION ---- */
(function initCounters() {
  const els = document.querySelectorAll('.count-up');
  if (!els.length) return;

  function animateCount(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1600; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * target;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Hero animasyonu bittikten sonra (stats ~1.22s + 0.9s = ~2.1s) çalıştır
  const statsDelay = 1500;
  setTimeout(() => {
    els.forEach(animateCount);
  }, statsDelay);
})();

/* ---- FLOATING WA BUTTON — hero geçince görün ---- */
(function initFloatWaVisibility() {
  const floatWa = document.querySelector('.float-wa');
  const hero    = document.getElementById('hero');
  if (!floatWa || !hero) return;

  const observer = new IntersectionObserver((entries) => {
    const inHero = entries[0].isIntersecting;
    floatWa.classList.toggle('visible', !inHero);
  }, { threshold: 0.3 });

  observer.observe(hero);
})();

/* ---- OPEN / CLOSED BADGE ---- */
(function initOpenBadge() {
  var badge = document.getElementById('openBadge');
  if (!badge) return;
  var now  = new Date();
  var hour = now.getHours() + now.getMinutes() / 60;
  var isOpen = hour >= 11 || hour < 3;
  badge.textContent = isOpen ? '● Şu an açık' : '● Şu an kapalı';
  badge.classList.toggle('closed', !isOpen);
})();

/* ---- REVIEW MARQUEE — clone tracks for seamless loop ---- */
(function initReviewMarquee() {
  document.querySelectorAll('.rmarquee-track').forEach(function(track) {
    /* Duplicate all children so translateX(-50%) loops seamlessly */
    const originals = Array.from(track.children);
    originals.forEach(function(card) {
      track.appendChild(card.cloneNode(true));
    });
  });
})();

/* ---- CARD HOVER PARALLAX (subtle) ---- */
(function initCardParallax() {
  const cards = document.querySelectorAll('.food-card');
  if (!window.matchMedia('(hover: hover)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
