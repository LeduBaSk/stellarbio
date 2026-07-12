/**
 * AstroBioRhythm — Premium Animations & Micro-Interactions
 * Elite luxury UI layer: scroll reveals, parallax, cursor glow, ripple, stagger
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
   * 1. SCROLL PROGRESS BAR
   * ───────────────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    const scroller = document.querySelector('.viewport-content');
    if (!scroller) return;

    scroller.addEventListener('scroll', () => {
      const scrollTop = scroller.scrollTop;
      const scrollHeight = scroller.scrollHeight - scroller.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
   * 2. SCROLL REVEAL — IntersectionObserver
   * ───────────────────────────────────────────── */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Don't unobserve — keeps state if user scrolls back
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  }

  /* ─────────────────────────────────────────────
   * 3. STAGGERED CARD REVEAL (zodiac grid + astro cards)
   * ───────────────────────────────────────────── */
  function initStaggerReveal() {
    const groups = document.querySelectorAll('.stagger-group');
    if (!groups.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll('.stagger-item');
          children.forEach((child, i) => {
            setTimeout(() => {
              child.classList.add('stagger-visible');
            }, i * 90);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    groups.forEach((g) => observer.observe(g));
  }

  /* ─────────────────────────────────────────────
   * 4. CURSOR GLOW (desktop only)
   * ───────────────────────────────────────────── */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let raf;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });

    function animateCursor() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
      raf = requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  /* ─────────────────────────────────────────────
   * 5. BUTTON RIPPLE EFFECT
   * ───────────────────────────────────────────── */
  function initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.gold-btn, .submit-btn, .btn-read-start');
      if (!btn) return;

      const existingRipple = btn.querySelector('.ripple-wave');
      if (existingRipple) existingRipple.remove();

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple-expand 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 9;
      `;
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  }

  /* ─────────────────────────────────────────────
   * 6. PARALLAX STAR FIELD (subtle mouse tracking)
   * ───────────────────────────────────────────── */
  function initParallaxStars() {
    const starsEl = document.querySelector('.stars');
    if (!starsEl) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx * 10;
      targetY = (e.clientY - cy) / cy * 10;
    }, { passive: true });

    function animateStars() {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      starsEl.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(animateStars);
    }
    animateStars();
  }

  /* ─────────────────────────────────────────────
   * 7. GENERATE STAR PARTICLES (populates .stars div)
   * ───────────────────────────────────────────── */
  function generateStars() {
    const starsEl = document.querySelector('.stars');
    if (!starsEl || starsEl.children.length > 0) return; // already populated by CSS

    const count = 120;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      const size = Math.random() * 2.5 + 0.5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = Math.random() * 6 + 4;
      const depth = Math.random(); // 0=back, 1=front

      star.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(${191 + Math.round(depth * 64)}, ${149 + Math.round(depth * 100)}, ${63 + Math.round(depth * 120)}, ${0.3 + depth * 0.7});
        animation: starTwinkle ${duration}s ${delay}s ease-in-out infinite;
        box-shadow: 0 0 ${size * 3}px rgba(191,149,63,${0.2 + depth * 0.3});
      `;
      fragment.appendChild(star);
    }
    starsEl.appendChild(fragment);
  }

  /* ─────────────────────────────────────────────
   * 8. TYPEWRITER EFFECT for hero subtitle
   * ───────────────────────────────────────────── */
  function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    const text = el.getAttribute('data-text') || el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    let i = 0;

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 55 + Math.random() * 30);
      }
    }

    // Delay start so page renders first
    setTimeout(type, 800);
  }

  /* ─────────────────────────────────────────────
   * 9. NAVBAR SCROLL GLOSS (makes top-bar more glassy on scroll)
   * ───────────────────────────────────────────── */
  function initNavScroll() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;
    const scroller = document.querySelector('.viewport-content');
    if (!scroller) return;

    scroller.addEventListener('scroll', () => {
      if (scroller.scrollTop > 30) {
        topBar.classList.add('top-bar--scrolled');
      } else {
        topBar.classList.remove('top-bar--scrolled');
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
   * 10. ZODIAC CARD 3D TILT (premium micro-interaction)
   * ───────────────────────────────────────────── */
  function initCardTilt() {
    const cards = document.querySelectorAll('.zodiac-book-item, .astro-card, .horoscope-card');
    if (!cards.length || window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.12s ease';
      });
    });
  }

  /* ─────────────────────────────────────────────
   * 11. COVER PAGE ENTRANCE ANIMATION
   * ───────────────────────────────────────────── */
  function initCoverEntrance() {
    const cover = document.getElementById('main-cover-page');
    if (!cover) return;

    cover.style.opacity = '0';
    cover.style.transform = 'translateY(30px) scale(0.97)';
    cover.style.transition = 'opacity 1s cubic-bezier(0.25,0.8,0.25,1), transform 1s cubic-bezier(0.25,0.8,0.25,1)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cover.style.opacity = '1';
        cover.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  /* ─────────────────────────────────────────────
   * INJECT KEYFRAMES dynamically
   * ───────────────────────────────────────────── */
  function injectKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple-expand {
        to { transform: scale(1); opacity: 0; }
      }
      @keyframes starTwinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.4); }
      }
      .reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.75s cubic-bezier(0.25, 0.8, 0.25, 1),
                    transform 0.75s cubic-bezier(0.25, 0.8, 0.25, 1);
      }
      .reveal.reveal-left {
        transform: translateX(-32px);
      }
      .reveal.reveal-right {
        transform: translateX(32px);
      }
      .reveal.revealed {
        opacity: 1;
        transform: none;
      }
      .stagger-item {
        opacity: 0;
        transform: translateY(20px) scale(0.96);
        transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
      }
      .stagger-item.stagger-visible {
        opacity: 1;
        transform: none;
      }
      .top-bar--scrolled {
        background-color: rgba(0, 0, 0, 0.55) !important;
        backdrop-filter: blur(24px) !important;
        border-bottom-color: rgba(191, 149, 63, 0.4) !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.5) !important;
      }
      #cursor-glow {
        pointer-events: none;
        position: fixed;
        top: 0; left: 0;
        width: 400px; height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(191,149,63,0.08) 0%, transparent 65%);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.4s ease;
        will-change: transform;
      }
      #scroll-progress-bar {
        position: fixed;
        top: 0; left: 0;
        height: 2px;
        width: 0%;
        background: linear-gradient(90deg, #bf953f, #fcf6ba, #b38728);
        z-index: 10000;
        transition: width 0.1s linear;
        box-shadow: 0 0 8px rgba(191,149,63,0.7);
      }
    `;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────────
   * INJECT DOM HELPERS (progress bar, cursor glow)
   * ───────────────────────────────────────────── */
  function injectDOMHelpers() {
    if (!document.getElementById('scroll-progress-bar')) {
      const bar = document.createElement('div');
      bar.id = 'scroll-progress-bar';
      document.body.prepend(bar);
    }
    if (!document.getElementById('cursor-glow')) {
      const glow = document.createElement('div');
      glow.id = 'cursor-glow';
      document.body.appendChild(glow);
    }
  }

  /* ─────────────────────────────────────────────
   * ADD REVEAL CLASSES to elements dynamically
   * ───────────────────────────────────────────── */
  function addRevealClasses() {
    // Story section elements
    document.querySelectorAll('.editorial-story > *').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
    });

    // Narrative blocks
    document.querySelectorAll('.narrative-col').forEach((el, i) => {
      el.classList.add('reveal', i % 2 === 0 ? 'reveal-left' : 'reveal-right');
      el.style.transitionDelay = `${i * 0.15}s`;
    });

    // Footer sections
    document.querySelectorAll('.footer-section').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.12}s`;
    });

    // Form card
    const formCard = document.getElementById('form-card-container');
    if (formCard) {
      formCard.classList.add('reveal');
    }

    // Zodiac book items => stagger
    const zodiacGrid = document.querySelector('.zodiac-grid');
    if (zodiacGrid) {
      zodiacGrid.classList.add('stagger-group');
      zodiacGrid.querySelectorAll('.zodiac-book-item').forEach((item) => {
        item.classList.add('stagger-item');
      });
    }
  }

  /* ─────────────────────────────────────────────
   * INIT — runs after DOM ready
   * ───────────────────────────────────────────── */
  function init() {
    injectKeyframes();
    injectDOMHelpers();
    addRevealClasses();
    generateStars();
    initScrollProgress();
    initScrollReveal();
    initStaggerReveal();
    initCursorGlow();
    initRipple();
    initParallaxStars();
    initTypewriter();
    initNavScroll();
    initCardTilt();
    initCoverEntrance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
