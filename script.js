document.addEventListener('DOMContentLoaded', () => {

  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('done');
      }, 1300);
    });

    setTimeout(() => preloader.classList.add('done'), 2500);
  }

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  const burger  = document.getElementById('navBurger');
  const menu    = document.getElementById('navMenu');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    menu.querySelectorAll('.nm-link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  const toReveal = [
    '.sb-card', '.rv-card', '.tpc-card', '.val-card',
    '.is-item', '.lsn-item', '.svcc-card', '.aw-card',
    '.tf-member', '.asv-card', '.amen-item', '.ci-block',
    '.why-point', '.astat-card'
  ];

  toReveal.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-right')) {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${(i % 6) * 0.08}s`;
      }
    });
  });

  document.querySelectorAll(
    '.sec-head:not(.centered), .ls-text, .tp-left, .as-text, ' +
    '.amb-left, .cg-form, .loc-text, .about-text, .why-left, .why-right'
  ).forEach(el => {
    if (!el.classList.contains('reveal-up')) el.classList.add('reveal-up');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll('[data-target]').forEach(el => {
    const co = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const step = 16;
      const inc = target / (duration / step);
      let val = 0;

      const timer = setInterval(() => {
        val += inc;
        if (val >= target) {
          val = target;
          clearInterval(timer);
        }
        el.textContent = Math.round(val).toLocaleString();
      }, step);

      co.disconnect();
    }, { threshold: 0.5 });
    co.observe(el);
  });

  const indicator = document.getElementById('openIndicator');
  if (indicator) {
    const now  = new Date();
    const day  = now.getDay();
    const hour = now.getHours();
    const min  = now.getMinutes();
    const time = hour + min / 60;

    let status, color, bg;

    if (day === 0) {
   
      status = '● Closed today (Sunday)';
      color  = '#C0392B';
      bg     = '#FDECEA';
    } else if (day === 6) {

      if (time >= 9 && time < 17) {
        status = '● Open now — closes at 5:00pm';
        color  = '#1A6B35';
        bg     = '#E8F5EE';
      } else if (time < 9) {
        status = '● Opens today at 9:00am';
        color  = '#B8630A';
        bg     = '#FEF3E6';
      } else {
        status = '● Closed — reopens Monday at 10:00am';
        color  = '#C0392B';
        bg     = '#FDECEA';
      }
    } else {

      if (time >= 10 && time < 19) {
        status = '● Open now — closes at 7:00pm';
        color  = '#1A6B35';
        bg     = '#E8F5EE';
      } else if (time < 10) {
        status = '● Opens today at 10:00am';
        color  = '#B8630A';
        bg     = '#FEF3E6';
      } else {
        const nextDay = day === 5 ? 'Saturday at 9:00am' : 'tomorrow at 10:00am';
        status = `● Closed — reopens ${nextDay}`;
        color  = '#C0392B';
        bg     = '#FDECEA';
      }
    }

    indicator.textContent = status;
    indicator.style.color = color;
    indicator.style.background = bg;
    indicator.style.padding = '8px 14px';
    indicator.style.borderRadius = '8px';
    indicator.style.fontSize = '0.8rem';
    indicator.style.fontWeight = '600';
    indicator.style.marginTop = '12px';
    indicator.style.display = 'inline-block';
  }

  const form = document.getElementById('contactForm');
  if (form) {
    const nameEl    = document.getElementById('f-name');
    const emailEl   = document.getElementById('f-email');
    const msgEl     = document.getElementById('f-msg');
    const nameErr   = document.getElementById('nameErr');
    const emailErr  = document.getElementById('emailErr');
    const msgErr    = document.getElementById('msgErr');
    const submitBtn = document.getElementById('submitBtn');
    const btnTxt    = document.getElementById('btnTxt');
    const btnLoad   = document.getElementById('btnLoad');
    const success   = document.getElementById('formSuccess');

    const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const setErr  = (el, msg) => { if (el) el.textContent = msg; };
    const clrErr  = (el)      => { if (el) el.textContent = ''; };

    nameEl  && nameEl.addEventListener('blur',  () => nameEl.value.trim().length < 2   ? setErr(nameErr,  'Please enter your name')        : clrErr(nameErr));
    emailEl && emailEl.addEventListener('blur', () => !isEmail(emailEl.value.trim())    ? setErr(emailErr, 'Please enter a valid email')     : clrErr(emailErr));
    msgEl   && msgEl.addEventListener('blur',   () => msgEl.value.trim().length < 5    ? setErr(msgErr,   'Please enter a message')          : clrErr(msgErr));

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;

      if (!nameEl  || nameEl.value.trim().length < 2)   { setErr(nameErr,  'Please enter your name');       ok = false; } else clrErr(nameErr);
      if (!emailEl || !isEmail(emailEl.value.trim()))    { setErr(emailErr, 'Please enter a valid email');   ok = false; } else clrErr(emailErr);
      if (!msgEl   || msgEl.value.trim().length < 5)     { setErr(msgErr,   'Please enter a message');       ok = false; } else clrErr(msgErr);

      if (!ok) return;

      if (btnTxt)    btnTxt.style.display   = 'none';
      if (btnLoad)   btnLoad.style.display  = 'inline';
      if (submitBtn) submitBtn.disabled     = true;

      setTimeout(() => {
        form.style.display = 'none';
        if (success) {
          success.style.display = 'block';
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1400);
    });
  }

  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href ||
        href.startsWith('#') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('http')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 320);
    });
  });

  setTimeout(() => {
    document.querySelectorAll('.hero-h1, .hero-pill, .hero-p, .hero-btns, .hero-stats').forEach((el, i) => {
      if (el.classList.contains('reveal-up')) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      el.style.transitionDelay = `${0.1 + i * 0.1}s`;
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }, 1400);

  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nm-link').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
    }
  });

});
