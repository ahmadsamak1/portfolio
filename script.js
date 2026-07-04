// ============================================================
// Cinematic 3D hero — centered chrome humanoid with a glowing
// multi-color aura ring swirling around the head.
// ============================================================
if (window.THREE) {
  const mount = document.getElementById('hero-3d');
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0.3, 11.5); // starts further back for the intro dolly-in

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  // ── Lights ──
  scene.add(new THREE.AmbientLight(0x1a1a1f, 1.1));

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2, 5, 6);
  scene.add(key);

  const rimPurple = new THREE.PointLight(0xb985ff, 18, 26, 2);
  rimPurple.position.set(-2.2, 2.2, 3.2);
  scene.add(rimPurple);

  const rimCyan = new THREE.PointLight(0x40e0ff, 16, 26, 2);
  rimCyan.position.set(2.4, 1.6, 3);
  scene.add(rimCyan);

  const rimGold = new THREE.PointLight(0xffcb57, 11, 22, 2);
  rimGold.position.set(0, 3.4, 3.6);
  scene.add(rimGold);

  const backLight = new THREE.PointLight(0xffffff, 6, 20, 2);
  backLight.position.set(0, 1.5, -5);
  scene.add(backLight);

  // ── Chrome material for the humanoid ──
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c10,
    metalness: 1,
    roughness: 0.2
  });

  const human = new THREE.Group();

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 48, 48), chromeMat);
  head.position.y = 1.98;
  human.add(head);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.25, 0.32, 24), chromeMat);
  neck.position.y = 1.5;
  human.add(neck);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.58, 1.85, 32), chromeMat);
  torso.position.y = 0.42;
  human.add(torso);

  const torsoTop = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 32), chromeMat);
  torsoTop.scale.set(1, 0.4, 0.8);
  torsoTop.position.y = 1.34;
  human.add(torsoTop);

  const hip = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), chromeMat);
  hip.scale.set(1.1, 0.55, 0.85);
  hip.position.y = -0.58;
  human.add(hip);

  // Shoulders
  const shoulderGeo = new THREE.SphereGeometry(0.3, 24, 24);
  const lShoulder = new THREE.Mesh(shoulderGeo, chromeMat);
  lShoulder.position.set(-0.9, 1.18, 0);
  human.add(lShoulder);
  const rShoulder = lShoulder.clone();
  rShoulder.position.x = 0.9;
  human.add(rShoulder);

  // Two-segment bent arms (upper arm + forearm raised, like the reference pose)
  function buildArm(side) {
    const s = side === 'l' ? -1 : 1;
    const armGroup = new THREE.Group();

    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.85, 20), chromeMat);
    upper.position.set(s * 0.98, 0.75, 0.05);
    upper.rotation.z = s * 0.5;
    armGroup.add(upper);

    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 20), chromeMat);
    elbow.position.set(s * 1.28, 0.42, 0.15);
    armGroup.add(elbow);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.78, 20), chromeMat);
    forearm.position.set(s * 1.5, 0.68, 0.35);
    forearm.rotation.z = s * -1.15;
    forearm.rotation.x = -0.35;
    armGroup.add(forearm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), chromeMat);
    hand.position.set(s * 1.62, 1.05, 0.55);
    armGroup.add(hand);

    return armGroup;
  }
  human.add(buildArm('l'));
  human.add(buildArm('r'));

  // Legs (feet just implied, cropped at bottom of viewport)
  const legGeo = new THREE.CylinderGeometry(0.22, 0.17, 1.5, 20);
  const lLeg = new THREE.Mesh(legGeo, chromeMat);
  lLeg.position.set(-0.3, -1.55, 0);
  human.add(lLeg);
  const rLeg = lLeg.clone();
  rLeg.position.x = 0.3;
  human.add(rLeg);

  human.position.set(0, -0.15, 0);
  // Smaller so it stays in the background behind the content
  human.scale.set(0.6, 0.6, 0.6);
  scene.add(human);

  // ── Swirling multi-color aura ring around the head ──
  const auraGroup = new THREE.Group();
  auraGroup.position.set(0, 2.55, 0.1);

  function makeAuraRing(radius, tube, colorHex, opacity, tiltX, tiltZ) {
    const geo = new THREE.TorusGeometry(radius, tube, 24, 120);
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = tiltX;
    ring.rotation.z = tiltZ;
    return ring;
  }

  const ringPurple = makeAuraRing(1.5, 0.045, 0xb985ff, 0.55, Math.PI / 2.3, 0.2);
  const ringCyan   = makeAuraRing(1.75, 0.03, 0x40e0ff, 0.5, Math.PI / 2.1, -0.35);
  const ringGold   = makeAuraRing(1.3, 0.02, 0xffcb57, 0.45, Math.PI / 1.9, 0.55);
  auraGroup.add(ringPurple, ringCyan, ringGold);

  // soft glow sprite behind the head to sell the "plasma" look
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = 256; glowCanvas.height = 256;
  const gctx = glowCanvas.getContext('2d');
  const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(185,133,255,0.9)');
  grad.addColorStop(0.4, 'rgba(64,224,255,0.5)');
  grad.addColorStop(1, 'rgba(64,224,255,0)');
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 256, 256);
  const glowTex = new THREE.CanvasTexture(glowCanvas);
  const glowMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const glowSprite = new THREE.Sprite(glowMat);
  glowSprite.scale.set(4.4, 4.4, 1);
  glowSprite.position.set(0.3, -0.1, -0.6);
  auraGroup.add(glowSprite);

  human.add(auraGroup);

  // ── Horizontal placement: keep the figure centered in the hero ──
  function layoutFigure() {
    human.position.x = 0;
    camera.position.x = 0;
  }
  layoutFigure();
  window.addEventListener('resize', layoutFigure);

  // ── Cinematic intro: dolly the camera in as the page opens ──
  const introStart = performance.now();
  const introDuration = 1800;
  function introEase(t) { return 1 - Math.pow(1 - t, 3); }

  // Full 360° spin driven by mouse position across the whole window
  let targetRotY = 0;
  let mouseX = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1; // -1 .. 1
  });

  function animate(t) {
    requestAnimationFrame(animate);

    // Intro dolly-in
    const elapsed = performance.now() - introStart;
    const introT = Math.min(elapsed / introDuration, 1);
    const eased = introEase(introT);
    camera.position.z = 11.5 - eased * 3.0; // 11.5 -> 8.5
    camera.position.y = 0.3 - eased * 0.1;

    // Idle motion — mouseX now spans a full 360° (2π) turn across the screen width
    targetRotY = mouseX * Math.PI;
    human.rotation.y += (targetRotY - human.rotation.y) * 0.06;
    human.position.y = -0.15 + Math.sin(t * 0.0008) * 0.1;

    // Aura ring swirl
    ringPurple.rotation.z += 0.006;
    ringCyan.rotation.z -= 0.0085;
    ringGold.rotation.z += 0.011;
    auraGroup.rotation.y += 0.004;
    const pulse = 1 + Math.sin(t * 0.0016) * 0.06;
    glowSprite.scale.set(4.4 * pulse, 4.4 * pulse, 1);

    // Colored lights drifting, matching aurora background
    rimPurple.position.x = -2.2 + Math.sin(t * 0.0005) * 1.1;
    rimCyan.position.x = 2.4 + Math.cos(t * 0.0006) * 1.1;
    rimGold.position.y = 3.4 + Math.cos(t * 0.0004) * 0.7;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  });
}

// ============================================================
// Animated particle background
// ============================================================
if (window.particlesJS) {
  particlesJS('particles-bg', {
    particles: {
      number: { value: 110, density: { enable: true, value_area: 850 } },
      color: { value: ['#b985ff', '#40e0ff', '#ffcb57', '#ffffff'] },
      shape: { type: 'circle' },
      opacity: {
        value: 0.65,
        random: true,
        anim: { enable: true, speed: 0.7, opacity_min: 0.1, sync: false }
      },
      size: {
        value: 2.6,
        random: true,
        anim: { enable: true, speed: 1.5, size_min: 0.5, sync: false }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#b985ff',
        opacity: 0.16,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.9,
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

// ============================================================
// Custom cursor
// ============================================================
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

// ============================================================
// Preloader — cinematic curtain reveal
// ============================================================
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) {
    setTimeout(() => {
      pre.classList.add('done');
      setTimeout(() => pre.remove(), 700);
    }, 900);
  }
});

// ============================================================
// Nav — compact + opaque once the page has scrolled
// ============================================================
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 40);
});

// ============================================================
// Magnetic buttons — subtle pull toward the cursor
// ============================================================
document.querySelectorAll('.btn, .social-btn').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const relX = e.clientX - r.left - r.width / 2;
    const relY = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.35}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// ============================================================
// Project cards — soft 3D tilt following the cursor
// ============================================================
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${py * -6}deg) rotateY(${px * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============================================================
// Scroll reveal
// ============================================================
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

// ============================================================
// Active nav highlight
// ============================================================
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


