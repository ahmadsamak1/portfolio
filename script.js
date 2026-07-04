// Custom cursor
  const cur = document.getElementById('cur');
  const curR = document.getElementById('curR');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animCursor() {
    rx += (mx - rx) * .15;
    ry += (my - ry) * .15;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
    curR.style.left = rx + 'px';
    curR.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
  document.querySelectorAll('a, button, .skill-pill, .exp-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width = '18px';
      cur.style.height = '18px';
      curR.style.width = '50px';
      curR.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width = '10px';
      cur.style.height = '10px';
      curR.style.width = '36px';
      curR.style.height = '36px';
    });
  });
  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => obs.observe(r));
  // Active nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--cream)' : '';
    });
  });
