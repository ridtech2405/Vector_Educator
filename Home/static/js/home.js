/* =========================================================
PREMIUM HERO SLIDER - FINAL STABLE JS
========================================================= */

(function () {

  const root = document.querySelector('[data-edu-slider]');

  if (!root) return;

  const slideEls = Array.from(
    root.querySelectorAll('[data-edu-slide]')
  );

  const prevBtn = root.querySelector('[data-edu-prev]');
  const nextBtn = root.querySelector('[data-edu-next]');
  const dotsWrap = root.querySelector('[data-edu-dots]');

  let index = 0;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const autoplayMs = 6000;

  let timer = null;

  /* =========================================================
  INITIAL SETUP
  ========================================================= */

  slideEls.forEach((slide, i) => {

    if (i === 0) {

      slide.classList.add('is-active');

      slide.style.opacity = '1';
      slide.style.visibility = 'visible';
      slide.style.pointerEvents = 'auto';

    } else {

      slide.classList.remove('is-active');

      slide.style.opacity = '0';
      slide.style.visibility = 'hidden';
      slide.style.pointerEvents = 'none';

    }

  });

  /* =========================================================
  ACTIVE SLIDE
  ========================================================= */

  function setActive(i) {

    index = (i + slideEls.length) % slideEls.length;

    slideEls.forEach((el, idx) => {

      if (idx === index) {

        el.classList.add('is-active');

        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
        el.style.transform = 'translateX(0)';

      } else {

        el.classList.remove('is-active');

        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
        el.style.transform = 'translateX(60px)';

      }

    });

    updateDots();

    revealContent();

  }

  /* =========================================================
  DOTS
  ========================================================= */

  function buildDots() {

    if (!dotsWrap) return;

    dotsWrap.innerHTML = '';

    slideEls.forEach((_, i) => {

      const btn = document.createElement('button');

      btn.type = 'button';

      btn.className =
        'edu-dot' + (i === index ? ' is-active' : '');

      btn.setAttribute(
        'aria-label',
        'Go to slide ' + (i + 1)
      );

      btn.addEventListener('click', () => {

        setActive(i);

        restart();

      });

      dotsWrap.appendChild(btn);

    });

  }

  function updateDots() {

    if (!dotsWrap) return;

    const dots = dotsWrap.querySelectorAll('.edu-dot');

    dots.forEach((dot, idx) => {

      dot.classList.toggle(
        'is-active',
        idx === index
      );

    });

  }

  /* =========================================================
  CONTENT REVEAL
  ========================================================= */

  function revealContent() {

    const slide = slideEls[index];

    if (!slide) return;

    const items = slide.querySelectorAll('[data-reveal="up"]');

    items.forEach((el) => {

      const delay =
        Number(el.getAttribute('data-delay') || 0);

      el.classList.remove('is-revealed');

      setTimeout(() => {

        el.classList.add('is-revealed');

      }, delay);

    });

  }

  /* =========================================================
  NEXT / PREV
  ========================================================= */

  function next() {

    setActive(index + 1);

  }

  function prev() {

    setActive(index - 1);

  }

  /* =========================================================
  AUTOPLAY
  ========================================================= */

  function restart() {

    if (timer) {

      clearInterval(timer);

    }

    if (prefersReduced) return;

    timer = setInterval(() => {

      if (document.hidden) return;

      next();

    }, autoplayMs);

  }

  /* =========================================================
  PARALLAX
  ========================================================= */

  function setupParallax() {

    if (prefersReduced) return;

    const parallaxEls = Array.from(
      root.querySelectorAll('[data-parallax]')
    );

    if (!parallaxEls.length) return;

    const state = {
      x: 0,
      y: 0
    };

    root.addEventListener(
      'mousemove',
      (e) => {

        const rect = root.getBoundingClientRect();

        const px =
          (e.clientX - rect.left) / rect.width;

        const py =
          (e.clientY - rect.top) / rect.height;

        state.x = (px - 0.5) * 2;
        state.y = (py - 0.5) * 2;

        parallaxEls.forEach((el) => {

          const depth = Number(
            el.getAttribute('data-depth') || 0.3
          );

          const tx = state.x * 12 * depth;
          const ty = state.y * 12 * depth;

          el.style.transform =
            `translate3d(${tx}px, ${ty}px, 0)`;

        });

      },
      { passive: true }
    );

    root.addEventListener('mouseleave', () => {

      parallaxEls.forEach((el) => {

        el.style.transform =
          'translate3d(0px,0px,0px)';

      });

    });

  }

  /* =========================================================
  BUTTON EVENTS
  ========================================================= */

  if (prevBtn) {

    prevBtn.addEventListener('click', () => {

      prev();

      restart();

    });

  }

  if (nextBtn) {

    nextBtn.addEventListener('click', () => {

      next();

      restart();

    });

  }

  /* =========================================================
  RESIZE FIX
  ========================================================= */

  window.addEventListener('resize', () => {

    slideEls.forEach((slide) => {

      slide.style.transform = '';

    });

  });

  /* =========================================================
  INIT
  ========================================================= */

  buildDots();

  setActive(0);

  restart();

  setupParallax();

})();