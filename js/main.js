/**
 * Abil K Baby — Interactive Motion & Luminous Glassmorphism Controller
 * Cool White × Midnight Navy × Glacial Ice Blue
 * Dependencies: Lenis Smooth Scroll + GSAP Core + ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initLenis(isReducedMotion);
  initNavigation();
  initScrollAnimations(isReducedMotion);
  initInteractiveHoverEffects(isReducedMotion);
  initFreelanceSlider();
  initCertificationsModule();
  initContactForm();
  updateDynamicYear();
});

/* ─────────────────────────────────────────────────────────
   1. LENIS SMOOTH SCROLLING
───────────────────────────────────────────────────────── */
let lenisInstance = null;

function initLenis(isReducedMotion) {
  if (isReducedMotion || typeof Lenis === 'undefined') return;

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical',
  });

  // Connect GSAP ScrollTrigger to Lenis ticker
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Smooth scroll for anchor clicks with offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        lenisInstance.scrollTo(targetEl, { offset: -70, duration: 1.1 });
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────
   2. NAVIGATION & ACTIVE SECTION TRACKING
───────────────────────────────────────────────────────── */
function initNavigation() {
  const header = document.getElementById('main-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  // Header background blur on scroll
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (toggleBtn && mobileMenu) {
    const toggleMenu = (forceClose = false) => {
      const shouldOpen = forceClose ? false : !toggleBtn.classList.contains('active');
      toggleBtn.classList.toggle('active', shouldOpen);
      mobileMenu.classList.toggle('open', shouldOpen);
      mobileMenu.setAttribute('aria-hidden', (!shouldOpen).toString());
      toggleBtn.setAttribute('aria-expanded', shouldOpen.toString());

      if (shouldOpen) {
        document.body.style.overflow = 'hidden';
        if (lenisInstance) lenisInstance.stop();
      } else {
        document.body.style.overflow = '';
        if (lenisInstance) lenisInstance.start();
      }
    };

    toggleBtn.addEventListener('click', () => toggleMenu());

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(true);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggleBtn.classList.contains('active')) {
        toggleMenu(true);
      }
    });
  }

  // Active section indicator tracking
  if (sections.length && navLinks.length) {
    const updateActiveNav = () => {
      const scrollPos = window.scrollY + 160;
      let currentSectionId = '';

      sections.forEach((sec) => {
        if (sec.offsetTop <= scrollPos) {
          currentSectionId = sec.id;
        }
      });

      navLinks.forEach((link) => {
        const matches = link.dataset.section === currentSectionId;
        link.classList.toggle('active', matches);
      });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }
}

/* ─────────────────────────────────────────────────────────
   3. GSAP SCROLL & ENTRANCE ANIMATIONS
───────────────────────────────────────────────────────── */
function initScrollAnimations(isReducedMotion) {
  if (isReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero Section Staggered Entrance
  const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  if (document.querySelector('.hero-stage-left')) {
    heroTl
      .fromTo('.hero-pre-badge', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 })
      .fromTo('.hero-name-primary', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
      .fromTo('.hero-name-secondary', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .fromTo('.hero-role-title', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
      .fromTo('.hero-summary-copy', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .fromTo('.hero-actions-row', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .fromTo('.portal-glass-plane', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.8')
      .fromTo('.portrait-frame', { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.7');
  }

  // Section Top Bar Entrance
  document.querySelectorAll('.section-top-bar').forEach((bar) => {
    gsap.fromTo(
      bar,
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: bar,
          start: 'top 88%',
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  });

  // Project Showcases Entrance
  document.querySelectorAll('.project-balanced-showcase').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power2.out',
      }
    );
  });

  // Experience and Education Cards
  document.querySelectorAll('.experience-architectural-stage, .education-editorial-box').forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 22 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 86%',
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  });

  // Technical Skills Category Boxes
  document.querySelectorAll('.skill-category-box').forEach((box, i) => {
    gsap.fromTo(
      box,
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: box,
          start: 'top 88%',
        },
        opacity: 1,
        y: 0,
        duration: 0.55,
        delay: (i % 2) * 0.08,
        ease: 'power2.out',
      }
    );
  });

  // Certifications and Achievement
  document.querySelectorAll('.cert-editorial-card, .achievement-showcase-box').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  });

  // Contact Closing Card
  const contactCard = document.querySelector('.contact-closing-card');
  if (contactCard) {
    gsap.fromTo(
      contactCard,
      { opacity: 0, y: 25 },
      {
        scrollTrigger: {
          trigger: contactCard,
          start: 'top 85%',
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      }
    );
  }
}

/* ─────────────────────────────────────────────────────────
   4. POLISHED INTERACTIVE HOVER & GLASS RESPONSE
───────────────────────────────────────────────────────── */
function initInteractiveHoverEffects(isReducedMotion) {
  if (isReducedMotion) return;

  // Subtle interactive parallax tilt on portrait portal
  const portal = document.querySelector('.portrait-sculptural-portal');
  if (portal && window.innerWidth > 992) {
    portal.addEventListener('mousemove', (e) => {
      const rect = portal.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const glassPlane = portal.querySelector('.portal-glass-plane');
      const glowHalo = portal.querySelector('.portal-glow-halo');

      if (glassPlane) {
        glassPlane.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
      }
      if (glowHalo) {
        glowHalo.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
      }
    });

    portal.addEventListener('mouseleave', () => {
      const glassPlane = portal.querySelector('.portal-glass-plane');
      const glowHalo = portal.querySelector('.portal-glow-halo');
      if (glassPlane) glassPlane.style.transform = '';
      if (glowHalo) glowHalo.style.transform = '';
    });
  }
}

/* ─────────────────────────────────────────────────────────
   5. CONTACT FORM HANDLER (Direct Mailto Trigger Fallback)
───────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-sent-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim() || '';
    const email = document.getElementById('contact-email')?.value.trim() || '';
    const message = document.getElementById('contact-message')?.value.trim() || '';

    if (!name || !email || !message) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    // Prefill user email client
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:abilkbaby7@gmail.com?subject=${subject}&body=${body}`;

    // Display graceful sent confirmation state
    form.style.display = 'none';
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.style.display = 'block';
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(statusEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────
   6. DYNAMIC COPYRIGHT YEAR
───────────────────────────────────────────────────────── */
function updateDynamicYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
}

/* ─────────────────────────────────────────────────────────
   7. FREELANCE 3-SITE INTERACTIVE CAROUSEL SLIDER
───────────────────────────────────────────────────────── */
function initFreelanceSlider() {
  const track = document.getElementById('freelance-track');
  const viewport = document.getElementById('freelance-viewport');
  const prevBtn = document.getElementById('freelance-prev-btn');
  const nextBtn = document.getElementById('freelance-next-btn');
  const counterEl = document.getElementById('freelance-curr-idx');
  const slides = document.querySelectorAll('.freelance-slide');
  const dots = document.querySelectorAll('.slider-dot');

  if (!track || !slides.length) return;

  const totalSlides = slides.length;
  let currentIndex = 0;

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      const isActive = i === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', (!isActive).toString());
    });

    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive.toString());
    });

    if (counterEl) {
      counterEl.textContent = String(currentIndex + 1).padStart(2, '0');
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-slide-to'), 10);
      if (!isNaN(targetIndex)) {
        goToSlide(targetIndex);
      }
    });
  });

  // Keyboard navigation when viewport is focused
  if (viewport) {
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
      }
    });
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  track.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 45;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff < 0) {
        goToSlide(currentIndex + 1); // Swipe left -> Next
      } else {
        goToSlide(currentIndex - 1); // Swipe right -> Prev
      }
    }
  }

  // Initialize first slide state
  goToSlide(0);
}

/* ─────────────────────────────────────────────────────────
   8. CERTIFICATIONS MODULE (COLLAPSIBLE & PREVIEW MODAL)
───────────────────────────────────────────────────────── */
function initCertificationsModule() {
  // 1. Collapsible toggle for Additional Certifications
  const toggleBtn = document.getElementById('btn-toggle-certs');
  const container = document.getElementById('collapsible-certs-grid');

  if (toggleBtn && container) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      const newExpanded = !isExpanded;

      toggleBtn.setAttribute('aria-expanded', newExpanded.toString());
      if (newExpanded) {
        container.hidden = false;
        const textSpan = toggleBtn.querySelector('.btn-collapse-text');
        if (textSpan) textSpan.textContent = 'Hide Additional Certifications';
      } else {
        container.hidden = true;
        const textSpan = toggleBtn.querySelector('.btn-collapse-text');
        if (textSpan) textSpan.textContent = 'Additional Certifications';
      }

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  }

  // 2. Certificate Preview Modal
  const modal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('cert-modal-img');
  const modalIframe = document.getElementById('cert-modal-iframe');
  const modalTitle = document.getElementById('cert-modal-heading');
  const modalBadge = document.getElementById('cert-modal-badge');
  const modalLink = document.getElementById('cert-modal-link');
  const closeBtn = document.getElementById('cert-modal-close');
  const dismissBtn = document.getElementById('cert-modal-dismiss');

  if (!modal) return;

  function openModal(title, org, imgSrc, docSrc) {
    if (modalTitle) modalTitle.textContent = title || 'Certificate';
    if (modalBadge) modalBadge.textContent = org || 'Verified Credential';
    if (modalLink) {
      modalLink.href = docSrc || imgSrc || '#';
    }

    const isPdf = docSrc && docSrc.toLowerCase().endsWith('.pdf');
    const isMobile = window.innerWidth <= 768;

    if (modalIframe && isPdf && !isMobile) {
      modalIframe.src = docSrc;
      modalIframe.hidden = false;
      if (modalImg) modalImg.hidden = true;
    } else {
      if (modalIframe) {
        modalIframe.src = '';
        modalIframe.hidden = true;
      }
      if (modalImg) {
        modalImg.src = imgSrc || '';
        modalImg.alt = title ? `${title} Preview` : 'Certificate Preview';
        modalImg.hidden = false;
      }
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenisInstance) lenisInstance.stop();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalIframe) modalIframe.src = '';
    if (lenisInstance) lenisInstance.start();
  }

  // Bind to cards with data-cert-modal
  document.querySelectorAll('[data-cert-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();

      const title = trigger.getAttribute('data-cert-title');
      const org = trigger.getAttribute('data-cert-org');
      const img = trigger.getAttribute('data-cert-img');
      const doc = trigger.getAttribute('data-cert-doc');
      openModal(title, org, img, doc);
    });
  });

  // Also bind clicking on the preview frame of the card
  document.querySelectorAll('.cert-editorial-card').forEach((card) => {
    const frame = card.querySelector('.cert-preview-frame');
    const trigger = card.querySelector('[data-cert-modal]');
    if (frame && trigger) {
      frame.addEventListener('click', () => {
        trigger.click();
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
