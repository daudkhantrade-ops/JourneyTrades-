/**
 * Journey Trades — script.js  v2
 *
 * Responsibilities:
 * 1. Nav state — over-dark class + scrolled class
 * 2. Mobile menu toggle
 * 3. Scroll-triggered fade-in (IntersectionObserver)
 * 4. Entry rule draw (IntersectionObserver)
 * 5. Stat counter animation (IntersectionObserver)
 * 6. Footer year
 */

(function () {
  'use strict';

  /* ── 1. NAV STATE ─────────────────────────────────────────── */

  const nav  = document.getElementById('site-nav');
  const hero = document.querySelector('.hero');

  if (nav) {
    const SCROLL_THRESHOLD = 80;

    const updateNav = () => {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;

      // Scrolled: dark frosted nav
      nav.classList.toggle('is-scrolled', scrolled);

      // Over-dark: hero is visible in viewport — keep light text
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        const overHero   = heroBottom > 60;
        nav.classList.toggle('nav--over-dark', overHero && !scrolled);

        // When scrolled but still partially over hero: keep scrolled dark
        // nav--over-dark removed when scrolled so the dark bg reads correctly
        if (scrolled) nav.classList.remove('nav--over-dark');
      }
    };

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav(); // initialise on load
  }


  /* ── 2. MOBILE MENU TOGGLE ────────────────────────────────── */

  const menuToggle  = document.getElementById('menu-toggle');
  const mobileMenu  = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll(
      '.nav__mobile-link, .nav__mobile-cta'
    );

    const openMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      const first = mobileMenu.querySelector('.nav__mobile-link');
      if (first) first.focus();
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

    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' &&
          menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener('click', e => {
      if (menuToggle.getAttribute('aria-expanded') === 'true' &&
          !nav.contains(e.target)) {
        closeMenu();
      }
    });
  }


  /* ── 3. FADE-UP (IntersectionObserver) ───────────────────── */

  const fadeEls = document.querySelectorAll('.fade-up');

  if (fadeEls.length && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -32px 0px' });

    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('is-visible'));
  }


  /* ── 4. ENTRY RULE DRAW (IntersectionObserver) ───────────── */

  const rules = document.querySelectorAll('.entry-rule');

  if (rules.length && 'IntersectionObserver' in window) {
    const ruleObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          ruleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    rules.forEach(r => ruleObserver.observe(r));
  } else {
    rules.forEach(r => r.classList.add('is-visible'));
  }


  /* ── 5. STAT COUNTER ─────────────────────────────────────── */

  const statNums = document.querySelectorAll('.stat-card__number[data-count]');

  if (statNums.length && 'IntersectionObserver' in window) {

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const animateCount = el => {
      const target   = parseInt(el.getAttribute('data-count'), 10);
      const suffix   = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start    = performance.now();

      const tick = now => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value    = Math.round(easeOut(progress) * target);

        // Prefix $ if original had it
        const prefix = el.textContent.trim().startsWith('$') ? '$' : '';
        el.innerHTML = prefix + value + '<span>' + suffix + '</span>';

        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNums.forEach(el => counterObserver.observe(el));
  }


  /* ── 6. FOOTER YEAR ──────────────────────────────────────── */

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
