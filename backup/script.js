// FINWALL — interactions (vanilla, no deps)

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Header shadow on scroll
  const header = $('#site-header');
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('header-scrolled');
    else header.classList.remove('header-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuBtn = $('#menu-btn');
  const mobileMenu = $('#mobile-menu');
  let menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    mobileMenu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    // swap icon
    menuBtn.innerHTML = open
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>';
  }
  menuBtn.addEventListener('click', () => setMenu(!menuOpen));
  $$('#mobile-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) setMenu(false); });
  document.addEventListener('click', (e) => {
    if (menuOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });

  //_smooth scroll offset already handled via CSS scroll-padding; enhance with JS for exact header height_
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = $(hash);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 74;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', hash);
      // accessibility: move focus after scroll
      setTimeout(() => target.setAttribute('tabindex', '-1'), 400);
    });
  });

  // Reveal on scroll
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // Feature tabs
  const tabs = $$('.feature-tab');
  const panels = $$('.feature-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.classList.toggle('bg-white', active);
        t.classList.toggle('shadow-sm', active);
        t.classList.toggle('border', active);
        t.classList.toggle('border-slate-200', active);
        t.classList.toggle('text-slate-600', !active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach(p => {
        const show = p.id === `panel-${target}`;
        p.classList.toggle('hidden', !show);
        if (show) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      });
    });
    tab.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); tabs[(idx + 1) % tabs.length].click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); tabs[(idx - 1 + tabs.length) % tabs.length].click(); }
    });
  });

  // FAQ accordion — single-open optional, here allow one open at a time
  const faqItems = $$('.faq-item');
  faqItems.forEach(item => {
    const btn = $('.faq-trigger', item);
    const panel = $('.faq-panel', item);
    const icon = $('.faq-icon', item);
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close all
      faqItems.forEach(other => {
        const b = $('.faq-trigger', other);
        const p = $('.faq-panel', other);
        const ic = $('.faq-icon', other);
        b.setAttribute('aria-expanded', 'false');
        p.classList.add('hidden');
        ic.textContent = '+';
        ic.className = 'w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 faq-icon';
        other.classList.remove('border-slate-200', 'bg-white');
        other.classList.add('border-slate-100', 'bg-slate-50');
      });
      // open clicked if it was closed
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.remove('hidden');
        icon.textContent = '−';
        icon.className = 'w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 faq-icon';
        item.classList.remove('border-slate-100', 'bg-slate-50');
        item.classList.add('border-slate-200', 'bg-white');
      }
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  // Waitlist form validation (front-end only)
  const form = $('#waitlist-form');
  const emailInput = $('#wl-email');
  const emailError = $('#wl-email-error');
  const consent = $('#wl-consent');
  const consentError = $('#wl-consent-error');
  const success = $('#wl-success');
  const successEmail = $('#wl-success-email');
  const toast = $('#toast');
  const toastMsg = $('#toast-msg');

  function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
  function clearError(el) {
    el.textContent = '';
    el.classList.add('hidden');
  }
  function isValidEmail(v) {
    // simple RFC-lite
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }
  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hidden');
    }, 3400);
  }

  emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() && isValidEmail(emailInput.value.trim())) {
      clearError(emailError);
      emailInput.classList.remove('border-red-300','ring-red-200');
      emailInput.classList.add('border-slate-200');
    }
  });
  consent.addEventListener('change', () => clearError(consentError));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const emailVal = emailInput.value.trim();

    clearError(emailError);
    clearError(consentError);

    if (!emailVal) {
      showError(emailError, 'Please enter your email address.');
      emailInput.classList.add('border-red-300');
      ok = false;
    } else if (!isValidEmail(emailVal)) {
      showError(emailError, 'That email doesn’t look right — try like name@example.com');
      emailInput.classList.add('border-red-300');
      ok = false;
    }

    if (!consent.checked) {
      showError(consentError, 'Please tick the box to agree to the launch email.');
      ok = false;
    }

    if (!ok) return;

    // success (no backend)
    successEmail.textContent = emailVal;
    success.classList.remove('hidden');
    form.querySelector('button[type="submit"]').disabled = true;
    form.querySelector('button[type="submit"]').textContent = 'You’re on the list ✓';
    form.querySelector('button[type="submit"]').classList.add('opacity-60','cursor-not-allowed');
    showToast(`Added ${emailVal} to the waitlist`);
    // confetti-ish small effect not needed
    emailInput.value = '';
    // keep name
  });

  // Report demo link — gentle handler
  $$('a[href="#report"]').forEach(a => {
    a.addEventListener('click', (e) => {
      // allow scroll, then show toast
      setTimeout(() => showToast('Report form coming soon — join waitlist to be notified'), 300);
    });
  });

})();
