/* Theme Toggle */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeIcon.classList.replace('bi-moon', 'bi-brightness-high');
    }
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('bi-moon', 'bi-brightness-high');
      } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('bi-brightness-high', 'bi-moon');
      }
    });

    /* Active nav highlight */
    const sections = document.querySelectorAll('.section[id]');
    const navAs = document.querySelectorAll('.dot-nav a');
    window.addEventListener('scroll', () => {
      let cur = '';
      sections.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
      navAs.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
    });

    /* Section Up/Down Buttons */
    const navUp = document.getElementById('navUp');
    const navDown = document.getElementById('navDown');
    
    function scrollDir(dir) {
      let cur = 0;
      sections.forEach((s, i) => { if (window.scrollY >= s.offsetTop - 100) cur = i; });
      let next = cur + dir;
      if (next >= 0 && next < sections.length) {
        sections[next].scrollIntoView({ behavior: 'smooth' });
      }
    }
    navUp.addEventListener('click', () => scrollDir(-1));
    navDown.addEventListener('click', () => scrollDir(1));
    
    window.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowUp') { e.preventDefault(); scrollDir(-1); }
      if (e.key === 'ArrowDown') { e.preventDefault(); scrollDir(1); }
    });

    window.addEventListener('scroll', () => {
      let cur = 0;
      sections.forEach((s, i) => { if (window.scrollY >= s.offsetTop - 100) cur = i; });
      navUp.style.opacity = cur > 0 ? '1' : '0';
      navUp.style.pointerEvents = cur > 0 ? 'auto' : 'none';
      navDown.style.opacity = cur < sections.length - 1 ? '1' : '0';
      navDown.style.pointerEvents = cur < sections.length - 1 ? 'auto' : 'none';
    });

    /* Reveal on scroll */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* Skill bars */
    const skillObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.querySelectorAll('.skill-fill').forEach(b => b.style.width = b.dataset.width + '%'); skillObs.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('.skills-grid').forEach(g => skillObs.observe(g));

    /* Modals */
    function closeAllModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active')); document.body.style.overflow = ''; }
    document.querySelectorAll('[data-modal]').forEach(card => {
      card.addEventListener('click', () => {
        document.getElementById(card.dataset.modal).classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeAllModals));
    document.querySelectorAll('.modal-overlay').forEach(ov => {
      ov.addEventListener('click', e => { if (e.target === ov) closeAllModals(); });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals(); });

    /* Contact form (Formspree) */
    const form = document.getElementById('contact-form');
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.textContent = 'Sending...'; status.className = 'form-status';
      try {
        const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (r.ok) { status.textContent = 'Your message has been sent. Thank you!'; status.className = 'form-status success'; form.reset(); }
        else throw 0;
      } catch { status.textContent = 'Something went wrong. Please try again.'; status.className = 'form-status error'; }
    });
