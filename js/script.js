/**
 * Journey Trades — script.js
 * Responsibilities (4 only):
 * 1. Nav scroll state
 * 2. Mobile menu toggle
 * 3. Scroll-triggered fade-in (IntersectionObserver)
 * 4. Stat counter animation (IntersectionObserver)
 */

(function () {
  'use strict';

  /* ── 1. NAV SCROLL STATE ──────────────────────────────────── */

  const nav = document.getElementById('site-nav');

  if (nav) {
    const SCROLL_THRESHOLD = 60;

    const updateNav = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };

    // Passive listener — does not block scrolling
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav(); // Run once on load
  }


  /* ── 2. MOBILE MENU TOGGLE ────────────────────────────────── */

  const menuToggle  = document.getElementById('menu-toggle');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.nav__mobile-link, .nav__mobile-cta') : [];

  if (menuToggle && mobileMenu) {

    const openMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      // Move focus into menu for accessibility
      const firstLink = mobileMenu.querySelector('.nav__mobile-link');
      if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    // Close on link click (smooth scroll to section)
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close when clicking outside the nav
    document.addEventListener('click', (e) => {
      if (
        menuToggle.getAttribute('aria-expanded') === 'true' &&
        !nav.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }


  /* ── 3. SCROLL-TRIGGERED FADE-IN ─────────────────────────── */

  const fadeElements = document.querySelectorAll('.fade-up');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target); // Fire once only
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback: make all visible immediately
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }


  /* ── 4. STAT COUNTER ANIMATION ────────────────────────────── */

  const statNumbers = document.querySelectorAll('.stat-card__number[data-count]');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateCount = (el) => {
      const target   = parseInt(el.getAttribute('data-count'), 10);
      const suffix   = el.getAttribute('data-suffix') || '';
      const duration = 1600; // ms
      const start    = performance.now();

      const tick = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOut(progress);
        const current  = Math.round(eased * target);

        // Rebuild inner HTML preserving suffix span
        el.innerHTML = current + '<span>' + suffix + '</span>';

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(el => counterObserver.observe(el));
  }


  /* ── FOOTER YEAR ──────────────────────────────────────────── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
