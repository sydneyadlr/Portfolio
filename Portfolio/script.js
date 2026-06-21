/* =============================================
   N8N WEBHOOK KONFIGURATION
   ============================================= */

const N8N_WEBHOOK_URL = 'https://sydney-adler.app.n8n.cloud/webhook/kundenanfrage';

/* =============================================
   SYDNEY ADLER WEB SOLUTIONS — PORTFOLIO JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initSmoothScroll();
  initActiveNavLink();
  initFaq();
});

/* =============================================
   NAVBAR — Scroll-Effekt
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =============================================
   MOBILE MENÜ — Overlay
   ============================================= */
function initMobileMenu() {
  const toggle   = document.getElementById('navbar-toggle');
  const overlay  = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('mobile-overlay-close');
  const links    = document.querySelectorAll('.mobile-overlay__link');
  if (!toggle || !overlay) return;

  const open = () => {
    overlay.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    overlay.classList.contains('open') ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  links.forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* =============================================
   SCROLL REVEAL — IntersectionObserver
   ============================================= */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* =============================================
   SKILL BARS — Animation beim Einblenden
   ============================================= */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-card__fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width') || '0';
        setTimeout(() => { bar.style.width = width + '%'; }, 80);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* =============================================
   KONTAKTFORMULAR — n8n Webhook Integration
   ============================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('name-error') },
    email:   { el: document.getElementById('email'),   err: document.getElementById('email-error') },
    message: { el: document.getElementById('message'), err: document.getElementById('message-error') },
  };
  const success  = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error-global');
  const btn      = form.querySelector('button[type="submit"]');
  const originalBtnHTML = btn.innerHTML;

  const validate = () => {
    let valid = true;

    Object.values(fields).forEach(f => {
      if (f.el && f.err) {
        f.el.classList.remove('error');
        f.err.textContent = '';
      }
    });

    if (!fields.name.el.value.trim()) {
      fields.name.err.textContent = 'Bitte gib deinen Namen ein.';
      fields.name.el.classList.add('error');
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.el.value.trim()) {
      fields.email.err.textContent = 'Bitte gib deine E-Mail-Adresse ein.';
      fields.email.el.classList.add('error');
      valid = false;
    } else if (!emailPattern.test(fields.email.el.value.trim())) {
      fields.email.err.textContent = 'Bitte gib eine gültige E-Mail-Adresse ein.';
      fields.email.el.classList.add('error');
      valid = false;
    }

    if (!fields.message.el.value.trim()) {
      fields.message.err.textContent = 'Bitte schreibe eine Nachricht.';
      fields.message.el.classList.add('error');
      valid = false;
    } else if (fields.message.el.value.trim().length < 10) {
      fields.message.err.textContent = 'Die Nachricht ist zu kurz (mindestens 10 Zeichen).';
      fields.message.el.classList.add('error');
      valid = false;
    }

    return valid;
  };

  Object.values(fields).forEach(f => {
    if (f.el) {
      f.el.addEventListener('input', () => {
        f.el.classList.remove('error');
        if (f.err) f.err.textContent = '';
      });
    }
  });

  const showLoading = () => {
    btn.disabled = true;
    btn.classList.add('btn--loading');
    btn.innerHTML = '<div class="btn-spinner"></div><span>Wird gesendet...</span>';
  };

  const resetBtn = () => {
    btn.disabled = false;
    btn.classList.remove('btn--loading');
    btn.innerHTML = originalBtnHTML;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    if (success)  success.classList.remove('visible');
    if (errorMsg) errorMsg.classList.remove('visible');

    showLoading();

    const payload = {
      name:    document.getElementById('name').value.trim(),
      email:   document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value.trim() || 'Neue Anfrage',
      message: document.getElementById('message').value.trim(),
    };

    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Webhook-Fehler: ' + res.status);
        return res.json();
      })
      .then(() => {
        resetBtn();
        form.reset();
        if (success) {
          success.classList.add('visible');
          setTimeout(() => success.classList.remove('visible'), 7000);
        }
      })
      .catch(error => {
        console.error('Webhook Fehler:', error);
        resetBtn();
        if (errorMsg) {
          errorMsg.classList.add('visible');
          setTimeout(() => errorMsg.classList.remove('visible'), 9000);
        }
      });
  });
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* =============================================
   FAQ — Accordion
   ============================================= */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-item__question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');

      items.forEach(i => {
        i.classList.remove('faq-item--open');
        i.querySelector('.faq-item__question')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('faq-item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* =============================================
   AKTIVER NAV-LINK — beim Scrollen hervorheben
   ============================================= */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.navbar__link');
  if (!sections.length || !links.length) return;

  const navbarHeight = document.getElementById('navbar')?.offsetHeight || 64;

  const setActive = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - navbarHeight - 80) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}
