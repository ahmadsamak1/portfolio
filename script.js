// Animated 3D chrome humanoid — hero background
  if (window.THREE) {
    const mount = document.getElementById('hero-3d');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.2, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Lights — key + colored rim lights matching the site accent palette
    scene.add(new THREE.AmbientLight(0x1a1a1f, 1.2));

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 6);
    scene.add(key);

    const rimGreen = new THREE.PointLight(0xc8ff5f, 14, 25, 2);
    rimGreen.position.set(-3.5, 1.5, 3.5);
    scene.add(rimGreen);

    const rimCyan = new THREE.PointLight(0x5fffc8, 12, 25, 2);
    rimCyan.position.set(3.5, -1, 3);
    scene.add(rimCyan);

    const backLight = new THREE.PointLight(0xffffff, 6, 20, 2);
    backLight.position.set(0, 2, -5);
    scene.add(backLight);

    // Chrome / liquid-metal material
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c10,
      metalness: 1,
      roughness: 0.22
    });

    const human = new THREE.Group();

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 48, 48), chromeMat);
    head.position.y = 1.95;
    human.add(head);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.35, 24), chromeMat);
    neck.position.y = 1.45;
    human.add(neck);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.6, 1.9, 32), chromeMat);
    torso.position.y = 0.4;
    human.add(torso);

    const torsoTop = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 32), chromeMat);
    torsoTop.scale.set(1, 0.4, 0.8);
    torsoTop.position.y = 1.35;
    human.add(torsoTop);

    const shoulderGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const lShoulder = new THREE.Mesh(shoulderGeo, chromeMat);
    lShoulder.position.set(-0.95, 1.15, 0);
    human.add(lShoulder);
    const rShoulder = lShoulder.clone();
    rShoulder.position.x = 0.95;
    human.add(rShoulder);

    const armGeo = new THREE.CylinderGeometry(0.19, 0.15, 1.5, 20);
    const lArm = new THREE.Mesh(armGeo, chromeMat);
    lArm.position.set(-1.05, 0.15, 0.1);
    lArm.rotation.z = 0.22;
    human.add(lArm);
    const rArm = lArm.clone();
    rArm.position.x = 1.05;
    rArm.rotation.z = -0.22;
    human.add(rArm);

    human.position.set(1.1, -0.9, 0);
    human.scale.set(1.15, 1.15, 1.15);
    scene.add(human);

    let targetRotY = 0;
    let mouseX = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    });

    function animate(t) {
      requestAnimationFrame(animate);
      targetRotY = mouseX * 0.35 + Math.sin(t * 0.00025) * 0.25;
      human.rotation.y += (targetRotY - human.rotation.y) * 0.03;
      human.position.y = -0.9 + Math.sin(t * 0.0008) * 0.12;
      rimGreen.position.x = -3.5 + Math.sin(t * 0.0005) * 1.2;
      rimCyan.position.x = 3.5 + Math.cos(t * 0.0006) * 1.2;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });
  }

  // Animated particle background
  if (window.particlesJS) {
    particlesJS('particles-bg', {
      particles: {
        number: { value: 70, density: { enable: true, value_area: 900 } },
        color: { value: ['#c8ff5f', '#5fffc8', '#ffffff'] },
        shape: { type: 'circle' },
        opacity: {
          value: 0.35,
          random: true,
          anim: { enable: true, speed: 0.4, opacity_min: 0.05, sync: false }
        },
        size: {
          value: 2.2,
          random: true,
          anim: { enable: false }
        },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#c8ff5f',
          opacity: 0.12,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.6,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: { enable: false },
          onclick: { enable: false },
          resize: true
        }
      },
      retina_detect: true
    });
  }

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
