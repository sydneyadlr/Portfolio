/* =============================================
   EMAILJS KONFIGURATION
   ============================================= */

const EMAILJS_SERVICE_ID  = 'service_djw10nq';
const EMAILJS_TEMPLATE_ID = 'template_3zj80dt';
const EMAILJS_PUBLIC_KEY  = 'zQnowrSWxXXv7QVNM';

/* =============================================
   SYDNEY ADLER WEB SOLUTIONS — PORTFOLIO JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // EmailJS initialisieren – muss vor dem ersten Formular-Absenden passieren
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  initNavbar();
  initMobileMenu();
  initHeroCanvas();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initSmoothScroll();
  initActiveNavLink();
});

/* =============================================
   NAVBAR — Scroll-Effekt
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
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
   HERO CANVAS — Partikel-Netzwerk
   ============================================= */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const mouse = { x: null, y: null };

  const COLORS = [
    '0, 212, 255',
    '124, 58, 237',
    '0, 212, 255',
    '0, 255, 136',
  ];

  class Particle {
    constructor() { this.reset(true); }

    reset(randomY) {
      this.x       = Math.random() * canvas.width;
      this.y       = randomY ? Math.random() * canvas.height : canvas.height + 10;
      this.vx      = (Math.random() - 0.5) * 0.45;
      this.vy      = (Math.random() - 0.5) * 0.45;
      this.size    = Math.random() * 1.6 + 0.4;
      this.opacity = Math.random() * 0.55 + 0.1;
      this.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (mouse.x !== null) {
        const dx   = this.x - mouse.x;
        const dy   = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const force = (130 - dist) / 130;
          this.x += dx * force * 0.025;
          this.y += dy * force * 0.025;
        }
      }

      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.save();
      ctx.shadowBlur  = 8;
      ctx.shadowColor = `rgba(${this.color}, 0.7)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function buildParticles() {
    particles = [];
    const density = Math.floor((canvas.width * canvas.height) / 14000);
    const count   = Math.min(Math.max(density, 40), 110);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawConnections() {
    const MAX_DIST = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      buildParticles();
      animate();
    }, 150);
  });

  resize();
  buildParticles();
  animate();
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

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
        setTimeout(() => { bar.style.width = width + '%'; }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* =============================================
   KONTAKTFORMULAR — EmailJS Integration
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

  // Ursprünglichen Button-Inhalt speichern zum Zurücksetzen nach dem Senden
  const originalBtnHTML = btn.innerHTML;

  /* --- Validierung --- */
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

  // Feldfehler sofort bei Eingabe entfernen
  Object.values(fields).forEach(f => {
    if (f.el) {
      f.el.addEventListener('input', () => {
        f.el.classList.remove('error');
        if (f.err) f.err.textContent = '';
      });
    }
  });

  /* --- Ladeanimation --- */
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

  /* --- Formular abschicken --- */
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // Vorherige Meldungen ausblenden
    if (success)  success.classList.remove('visible');
    if (errorMsg) errorMsg.classList.remove('visible');

    showLoading();

    // Prüfen ob EmailJS geladen ist
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS konnte nicht geladen werden. Prüfe deine Internetverbindung.');
      resetBtn();
      if (errorMsg) errorMsg.classList.add('visible');
      return;
    }

    // Formularwerte mit den Template-Variablennamen mappen
    const templateParams = {
      from_name:  document.getElementById('name').value.trim(),
      from_email: document.getElementById('email').value.trim(),
      subject:    document.getElementById('subject').value.trim() || 'Neue Anfrage',
      message:    document.getElementById('message').value.trim(),
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        resetBtn();
        form.reset();
        if (success) {
          success.classList.add('visible');
          setTimeout(() => success.classList.remove('visible'), 7000);
        }
      })
      .catch(error => {
        console.error('EmailJS Fehler:', error);
        resetBtn();
        if (errorMsg) {
          errorMsg.classList.add('visible');
          setTimeout(() => errorMsg.classList.remove('visible'), 9000);
        }
      });
  });
}

/* =============================================
   SMOOTH SCROLL — Sanftes Scrollen zu Ankern
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
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

  const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;

  const setActive = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - navbarHeight - 80;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}
