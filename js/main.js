/**
 * Abil K Baby — Portfolio Rebuild Motion Controller
 * Integrates Lenis Smooth Scroll, GSAP, and ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Preloader & Motion Pipeline
  initLoader(isReducedMotion);
  initLenis(isReducedMotion);
  initNavigation();
  initMobileMenu();
  initProjectAnimations();
  initContactForm();
  initProjectIndexToggles();
  initReducedMotion(isReducedMotion);
});

/**
 * 1. Preloader Progress & Page Entrance Sequence
 */
function initLoader(isReducedMotion) {
  const preloader = document.querySelector('.preloader');
  const progressText = document.querySelector('.preloader-progress');
  if (!preloader) return;

  if (isReducedMotion) {
    preloader.style.display = 'none';
    revealHeroContent();
    return;
  }

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Animate preloader exit
      setTimeout(() => {
        if (typeof gsap !== 'undefined') {
          gsap.timeline({
            onComplete: () => {
              preloader.style.display = 'none';
              // Start hero timeline
              initHeroTimeline();
            }
          })
          .to(progressText, { opacity: 0, duration: 0.3 })
          .to(preloader, {
            y: '-100%',
            duration: 0.85,
            ease: 'power4.inOut'
          });
        } else {
          preloader.style.display = 'none';
          revealHeroContent();
        }
      }, 200);
    }
    if (progressText) progressText.textContent = `${progress}%`;
  }, 80);
}

/**
 * 2. Lenis Smooth Scroll Setup
 */
let lenisInstance = null;
function initLenis(isReducedMotion) {
  if (isReducedMotion || typeof Lenis === 'undefined') return;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical'
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync GSAP ScrollTrigger with Lenis
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

/**
 * 3. Header Scroll States
 */
function initNavigation() {
  const header = document.querySelector('.header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll(); // Run immediately on load
}

/**
 * 4. Fullscreen Mobile Hamburger Overlay Menu
 */
function initMobileMenu() {
  const trigger = document.querySelector('.menu-btn');
  const overlay = document.querySelector('.mobile-nav');
  const links = document.querySelectorAll('.mobile-nav-list a');

  if (!trigger || !overlay) return;

  const toggleMenu = () => {
    const isOpen = trigger.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (lenisInstance) lenisInstance.stop();

      // Sequential staggered reveal of links
      links.forEach((link, idx) => {
        link.style.transitionDelay = `${idx * 0.08}s`;
      });
    } else {
      document.body.style.overflow = '';
      if (lenisInstance) lenisInstance.start();

      links.forEach(link => {
        link.style.transitionDelay = '0s';
      });
    }
  };

  trigger.addEventListener('click', toggleMenu);

  // Close menu on link selection
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (trigger.classList.contains('open')) toggleMenu();
    });
  });

  // Escape key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && trigger.classList.contains('open')) toggleMenu();
  });
}

/**
 * 5. Hero Entrance Timeline (GSAP)
 */
function initHeroTimeline() {
  if (typeof gsap === 'undefined') {
    revealHeroContent();
    return;
  }

  const tl = gsap.timeline();

  // Reveal navigation
  tl.fromTo('.header', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    // Reveal Eyebrow status
    .fromTo('.hero-eyebrow-row', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    // Reveal main heading lines
    .to('.hero-heading .reveal-inner', { y: '0%', duration: 0.85, ease: 'power4.out', stagger: 0.12 }, '-=0.4')
    // Reveal description
    .fromTo('.hero-description', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
    // Reveal Action Buttons
    .fromTo('.hero-buttons', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.45')
    // Reveal Hero Right Visuals
    .fromTo('.hero-photo-frame', { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
    .to('.hero-photo-img', { scale: 1, duration: 1.2, ease: 'power2.out' }, '-=0.8')
    // Reveal stats and scroll prompt
    .fromTo('.hero-footer', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4')
    // Draw section dividers
    .fromTo('.line-draw', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.out', stagger: 0.1 }, '-=0.8');
}

// Fallback visibility when GSAP is not available
function revealHeroContent() {
  document.querySelectorAll('.reveal-inner').forEach(inner => {
    inner.style.transform = 'translateY(0)';
  });
  const heroEl = document.querySelector('.hero');
  if (heroEl) heroEl.style.opacity = 1;
}

/**
 * 6. Visual Animation Hooks (ScrollTrigger Reveals)
 */
function initProjectAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Vanilla Intersection Observer Fallback
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return;
  }

  // Animate Section Headings and Project Cards via GSAP
  document.querySelectorAll('.reveal-on-scroll').forEach(section => {
    // Animate lines if nested
    const lineInners = section.querySelectorAll('.reveal-inner');
    if (lineInners.length > 0) {
      gsap.to(lineInners, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
        },
        y: '0%',
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out'
      });
    }

    // Fade up other elements
    const fadeElements = section.querySelectorAll('p, .tag-badge, .btn-secondary, .project-key-highlights, .cap-item-tag, .chrono-item, .education-step, .cta-banner-wrapper, .contact-form-wrap, .contact-info-card');
    if (fadeElements.length > 0) {
      gsap.fromTo(fadeElements, 
        { opacity: 0, y: 25 },
        {
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
          },
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out'
        }
      );
    }

    // Animate Project Image Scale & clip-path reveal
    const projectFrame = section.querySelector('.browser-frame-wrap');
    const projectImg = section.querySelector('.browser-frame-body img');
    if (projectFrame && projectImg) {
      gsap.fromTo(projectFrame,
        { clipPath: 'inset(10% 0% 10% 0% round 8px)', opacity: 0 },
        {
          scrollTrigger: {
            trigger: projectFrame,
            start: 'top 85%',
          },
          clipPath: 'inset(0% 0% 0% 0% round 8px)',
          opacity: 1,
          duration: 0.95,
          ease: 'power3.out'
        }
      );
      
      gsap.fromTo(projectImg,
        { scale: 1.1 },
        {
          scrollTrigger: {
            trigger: projectFrame,
            start: 'top 90%',
            end: 'bottom 20%',
            scrub: true
          },
          scale: 1,
          ease: 'none'
        }
      );
    }
  });

  // Word-by-word reveal for Introductory Statement
  const statement = document.querySelector('.intro-statement-text');
  if (statement) {
    const rawText = statement.textContent.trim();
    const words = rawText.split(/\s+/);
    statement.innerHTML = words.map(w => `<span class="reveal-word">${w}</span>`).join(' ');
    const spans = statement.querySelectorAll('.reveal-word');

    gsap.to(spans, {
      scrollTrigger: {
        trigger: statement,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 0.5
      },
      color: '#111111',
      stagger: 0.06
    });
  }

  // Draw dividers on scroll trigger
  document.querySelectorAll('.line-draw').forEach(line => {
    gsap.fromTo(line,
      { scaleX: 0 },
      {
        scrollTrigger: {
          trigger: line,
          start: 'top 92%',
        },
        scaleX: 1,
        duration: 1.1,
        ease: 'power3.out'
      }
    );
  });

  // Parallax on about sidebar photo
  const aboutPhoto = document.querySelector('.about-photo-sidebar img');
  if (aboutPhoto) {
    gsap.to(aboutPhoto, {
      scrollTrigger: {
        trigger: '.about-photo-sidebar',
        start: 'top 85%',
        end: 'bottom 15%',
        scrub: true
      },
      yPercent: 12,
      ease: 'none'
    });
  }
}

/**
 * 7. Reduced Motion Fallbacks
 */
function initReducedMotion(isReducedMotion) {
  if (isReducedMotion) {
    document.querySelectorAll('.reveal-inner').forEach(inner => {
      inner.style.transform = 'translateY(0)';
    });
    document.querySelectorAll('.line-draw').forEach(line => {
      line.style.transform = 'scaleX(1)';
    });
    document.querySelectorAll('.reveal-word').forEach(word => {
      word.style.color = '#111111';
    });
    document.querySelectorAll('.header, .hero, .reveal-on-scroll, .browser-frame-wrap').forEach(el => {
      el.style.opacity = 1;
      el.style.clipPath = 'none';
    });
  }
}

/**
 * 8. Contact Form Interaction & Success State
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('contact-success-msg');
  if (!form || !successMsg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    console.log('Contact form submitted successfully:', { name, email, subject, message });

    // Transition elements out using GSAP
    const formElements = form.querySelectorAll('.form-group-row, .form-group, .btn-submit');
    if (typeof gsap !== 'undefined') {
      gsap.to(formElements, {
        opacity: 0,
        y: -10,
        duration: 0.35,
        stagger: 0.05,
        onComplete: () => {
          form.style.display = 'none';
          successMsg.style.display = 'flex';
          gsap.fromTo(successMsg, 
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }
          );
        }
      });
    } else {
      form.style.display = 'none';
      successMsg.style.display = 'flex';
    }
  });
}

/**
 * 9. Project List Accordion / Row Expansion
 */
function initProjectIndexToggles() {
  const rowToggles = document.querySelectorAll('.project-index-row.clickable');
  rowToggles.forEach(row => {
    row.addEventListener('click', (e) => {
      const container = row.closest('.project-index-row-container');
      const details = container.querySelector('.project-index-expanded');
      
      const isExpanded = details.classList.toggle('expanded');
      row.classList.toggle('active', isExpanded);
      
      const arrow = row.querySelector('.p-idx-arrow');
      if (arrow) {
        arrow.textContent = isExpanded ? '↑' : '↓';
      }
      
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });
}
