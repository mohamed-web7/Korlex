/* =====================================================
   KORLEX.PREMIUM V2 — script.js
   Vanilla, minimal, performance-first.
   ===================================================== */
(function () {
    'use strict';

    /* ----- Header scroll state ----- */
    const header = document.getElementById('siteHeader');
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (header) {
                    header.classList.toggle('is-scrolled', window.scrollY > 12);
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ----- Mobile nav toggle ----- */
    const toggle = document.getElementById('navToggle');
    const mobile = document.getElementById('navMobile');
    if (toggle && mobile) {
        toggle.addEventListener('click', () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
            mobile.hidden = isOpen;
            if (!isOpen) {
                mobile.classList.add('is-open');
            } else {
                mobile.classList.remove('is-open');
            }
        });

        mobile.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
                mobile.hidden = true;
                mobile.classList.remove('is-open');
            });
        });
    }

    /* ----- FAQ accordion (single open at a time) ----- */
    const faqList = document.getElementById('faqList');
    if (faqList) {
        const items = faqList.querySelectorAll('.faq-item');
        items.forEach((item) => {
            const btn = item.querySelector('.faq-q');
            const ans = item.querySelector('.faq-a');
            if (!btn || !ans) return;

            btn.addEventListener('click', () => {
                const isOpen = btn.getAttribute('aria-expanded') === 'true';

                items.forEach((other) => {
                    const oBtn = other.querySelector('.faq-q');
                    const oAns = other.querySelector('.faq-a');
                    if (!oBtn || !oAns) return;
                    oBtn.setAttribute('aria-expanded', 'false');
                    oAns.style.maxHeight = '0px';
                });

                if (!isOpen) {
                    btn.setAttribute('aria-expanded', 'true');
                    ans.style.maxHeight = ans.scrollHeight + 'px';
                }
            });
        });
    }

    /* ----- VIP form (no backend — graceful demo success) ----- */
    const form = document.getElementById('vipForm');
    const success = document.getElementById('formSuccess');
    if (form && success) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('#vName');
            const service = form.querySelector('#vService');
            const desc = form.querySelector('#vDesc');

            if (!name.value.trim() || !service.value.trim() || !desc.value.trim()) {
                [name, service, desc].forEach(f => {
                    if (f && !f.value.trim()) {
                        f.style.borderColor = 'rgba(239,68,68,.6)';
                        f.addEventListener('input', function once() {
                            f.style.borderColor = '';
                            f.removeEventListener('input', once);
                        });
                    }
                });
                return;
            }

            success.hidden = false;
            form.reset();
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    /* ----- Active bottom-nav state (mobile) ----- */
    const bnItems = document.querySelectorAll('.bn-item');
    if (bnItems.length && 'IntersectionObserver' in window) {
        const sections = ['#top', '#work', '#method', '#vip', '#audit']
            .map(id => document.querySelector(id))
            .filter(Boolean);

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = '#' + entry.target.id;
                    bnItems.forEach(b => {
                        const target = b.getAttribute('href');
                        b.classList.toggle('is-active', target === id);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

        sections.forEach(s => io.observe(s));
    }

    /* ----- Footer year ----- */
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());

    /* ----- Smooth in-page anchors (with header offset) ----- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ----- Reveal-on-scroll (lightweight) ----- */
    if ('IntersectionObserver' in window) {
        const targets = document.querySelectorAll(
            '.svc, .principle, .step, .math-cell, .cwv-item, .wn-list li, .paradigm-meta .pmeta, .speed-side, .speed-result'
        );
        targets.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(12px)';
            el.style.transition = 'opacity .6s var(--ease, ease), transform .6s var(--ease, ease)';
        });
        const ro = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    ro.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        targets.forEach(el => ro.observe(el));
    }
})();
