gsap.registerPlugin(ScrollTrigger);

/* ---------- Locomotive Scroll (Safely initialized) ---------- */
let locoScroll = null;
try {
  const scrollEl = document.querySelector('#main');
  if (scrollEl && window.LocomotiveScroll) {
    locoScroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      multiplier: 0.9,
      lerp: 0.09,
      smartphone: { smooth: false },
      tablet: { smooth: false }
    });

    locoScroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy('#main', {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: scrollEl.style.transform ? 'transform' : 'fixed'
    });

    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
  }
} catch (e) {
  console.warn('LocomotiveScroll disabled fallback:', e);
}

/* ---------- Preloader ---------- */
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
  if (locoScroll) locoScroll.update();
  if (window.heroTl) heroTl.play();
}

const preloaderTl = gsap.timeline({ onComplete: hidePreloader });
preloaderTl.to('.preloader-text', { opacity: 0.3, repeat: 2, yoyo: true, duration: 0.3 })
           .to('#preloader', { yPercent: -100, duration: 0.7, ease: 'power4.inOut' });

// Safety timeout for preloader
setTimeout(hidePreloader, 1000);

/* ---------- Hero entrance timeline ---------- */
const heroTl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });

heroTl
  .from('[data-anim="fade-up"].eyebrow, .eyebrow', { y: 20, opacity: 0, duration: 0.7 })
  .from('.hero-desc', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
  .from('.hero-cta > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.45')
  .from('.hero-image-glow', { opacity: 0, duration: 1 }, '-=0.6')
  .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.3')
  .from('.brands-strip', { opacity: 0, duration: 0.8 }, '-=0.2');

/* ---------- Magnetic hover on primary CTA ---------- */
const magnetBtn = document.querySelector('.btn-fill');
if (magnetBtn) {
  magnetBtn.addEventListener('mousemove', (e) => {
    const b = magnetBtn.getBoundingClientRect();
    const x = e.clientX - b.left - b.width / 2;
    const y = e.clientY - b.top - b.height / 2;
    gsap.to(magnetBtn, { x: x * 0.3, y: y * 0.4, duration: 0.4, ease: 'power2.out' });
  });
  magnetBtn.addEventListener('mouseleave', () => {
    gsap.to(magnetBtn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
  });
}

/* ---------- Horizontal Navbar Drawer & Energy Menu Engine ---------- */
function initNavbarToggle() {
  const burgerMenuBtn = document.getElementById('burgerMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const energyMenuBtn = document.getElementById('energyMenuBtn');
  const energyMenuParent = document.getElementById('energyMenuParent');
  const themeSwitch = document.getElementById('themeSwitch');
  const reduceMotionSwitch = document.getElementById('reduceMotionSwitch');

  if (burgerMenuBtn && navLinks) {
    burgerMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      burgerMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (energyMenuParent) {
        energyMenuBtn?.classList.remove('active');
        energyMenuParent.classList.remove('active');
      }
    });
  }

  if (energyMenuBtn && energyMenuParent) {
    energyMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      energyMenuBtn.classList.toggle('active');
      energyMenuParent.classList.toggle('active');
      if (navLinks) {
        burgerMenuBtn?.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (navLinks && !navLinks.contains(e.target) && e.target !== burgerMenuBtn && !burgerMenuBtn.contains(e.target)) {
      burgerMenuBtn?.classList.remove('active');
      navLinks.classList.remove('active');
    }
    if (energyMenuParent && !energyMenuParent.contains(e.target) && e.target !== energyMenuBtn && !energyMenuBtn.contains(e.target)) {
      energyMenuBtn?.classList.remove('active');
      energyMenuParent.classList.remove('active');
    }
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burgerMenuBtn?.classList.remove('active');
      navLinks?.classList.remove('active');
    });
  });

  if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
      themeSwitch.classList.toggle('active');
    });
  }

  if (reduceMotionSwitch) {
    reduceMotionSwitch.addEventListener('click', () => {
      const isReduced = reduceMotionSwitch.classList.toggle('active');
      if (window.gsap) {
        gsap.globalTimeline.timeScale(isReduced ? 0.001 : 1);
      }
    });
  }
}

/* ---------- Circular Arch Project Orbit Animation ---------- */
function initProjectOrbit() {
  const cards = document.querySelectorAll('.orbit-card');
  const archInner = document.getElementById('archInner');

  if (!cards.length || !archInner) return;

  let progress = 0;
  let isHovered = false;
  const speed = 0.0022;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => isHovered = true);
    card.addEventListener('mouseleave', () => isHovered = false);
  });

  function animateOrbit() {
    if (!isHovered) {
      progress += speed;
    }

    const radiusX = 220;
    const radiusY = 210;
    const totalCards = cards.length;

    cards.forEach((card, index) => {
      const offset = (progress + index / totalCards) % 1;
      const startAngle = Math.PI * 1.08;
      const endAngle = -Math.PI * 0.08;
      const angle = startAngle + (endAngle - startAngle) * offset;

      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;

      const normalizedHeight = Math.max(0, Math.sin(angle));
      const scale = 0.5 + 0.8 * Math.pow(normalizedHeight, 1.3);
      const opacity = 0.35 + 0.65 * normalizedHeight;
      const zIndex = Math.round(10 + 20 * normalizedHeight);

      card.style.transform = `translate(${x}px, ${-y}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
    });

    requestAnimationFrame(animateOrbit);
  }

  animateOrbit();
}

/* ---------- Interactive Proximity Text Illumination ---------- */
function initInteractiveTextHover() {
  const titleLines = document.querySelectorAll('.hero-title .line');
  if (!titleLines.length) return;

  const characters = [];

  titleLines.forEach(line => {
    const cursorEl = line.querySelector('.cursor');
    let text = '';
    
    line.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      }
    });

    if (!text.trim()) return;

    const isAccent = line.classList.contains('accent');
    line.textContent = ''; // clear plain text

    const colors = [
      '#f0c876', // Soft Gold
      '#ffd700', // Radiant Amber Gold
      '#ffaa44', // Warm Flame Gold
      '#ffe082', // Bright Gold
      '#ffffff'  // Pure Diamond White
    ];

    Array.from(text).forEach((charText, idx) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = charText === ' ' ? '\u00A0' : charText;
      
      span.dataset.activeColor = isAccent 
        ? '#ffffff' 
        : colors[idx % colors.length];

      line.appendChild(span);
      characters.push(span);
    });

    if (cursorEl) {
      line.appendChild(cursorEl);
    }
  });

  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  let mouseX = -9999;
  let mouseY = -9999;

  heroSection.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateCharProximity();
  });

  heroSection.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
    updateCharProximity();
  });

  function updateCharProximity() {
    const radius = 140;

    characters.forEach(char => {
      const rect = char.getBoundingClientRect();
      const charX = rect.left + rect.width / 2;
      const charY = rect.top + rect.height / 2;

      const dist = Math.hypot(mouseX - charX, mouseY - charY);

      if (dist < radius) {
        const intensity = Math.pow(1 - dist / radius, 1.2);
        const translateY = -8 * intensity;
        const scale = 1 + 0.22 * intensity;
        const rotate = (mouseX - charX) * -0.06 * intensity;
        const activeColor = char.dataset.activeColor;

        char.style.transform = `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
        char.style.color = activeColor;
        char.style.textShadow = `0 0 ${22 * intensity}px ${activeColor}, 0 0 ${38 * intensity}px rgba(217, 164, 65, ${0.75 * intensity})`;
      } else {
        char.style.transform = 'translateY(0px) scale(1) rotate(0deg)';
        char.style.color = '';
        char.style.textShadow = '';
      }
    });
  }
}

/* ---------- Crazy Mouse Follower & Golden Particle Trail ---------- */
function initCrazyCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const canvas = document.getElementById('particleCanvas');
  
  if (!dot || !ring || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = width / 2;
  let mouseY = height / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  const particles = [];
  const maxParticles = 40;

  class Particle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 10;
      this.y = y + (Math.random() - 0.5) * 10;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2 - 0.5;
      this.size = Math.random() * 3 + 1.5;
      this.alpha = 1;
      this.color = Math.random() > 0.3 ? '#f0c876' : '#ffd700';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.025;
      this.size *= 0.96;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let lastEmit = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    const now = Date.now();
    if (now - lastEmit > 20) {
      if (particles.length < maxParticles) {
        particles.push(new Particle(mouseX, mouseY));
      }
      lastEmit = now;
    }
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0 || p.size <= 0.2) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(renderCursor);
  }

  renderCursor();

  const hoverTargets = 'a, button, .reveal-word, .orbit-card, .btn-fill, .btn-outline, .menu-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.add('hovering');
      const label = ring.querySelector('.cursor-label');
      if (label) label.textContent = 'EXPLORE';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.remove('hovering');
    }
  });
}

/* ---------- Interactive 3D Catalog Header Popup Parallax ---------- */
function initCatalogPopupParallax() {
  const headerWrap = document.getElementById('catalogHeaderWrap');
  const popupFan = document.getElementById('popupImagesFan');
  if (!headerWrap || !popupFan) return;

  headerWrap.addEventListener('mousemove', (e) => {
    const rect = headerWrap.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / rect.height) * -12;
    const tiltY = (x / rect.width) * 16;

    gsap.to(popupFan, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  headerWrap.addEventListener('mouseleave', () => {
    gsap.to(popupFan, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  });
}

/* ---------- GSAP Ultra-Smooth Project Row Accordion Expansion ---------- */
function initProjectRowHover() {
  const rows = document.querySelectorAll('.project-row');
  let activeRow = null;

  rows.forEach(row => {
    const bg = row.getAttribute('data-bg') || '#0f141c';
    const drawer = row.querySelector('.project-row-drawer');
    const drawerContent = row.querySelector('.drawer-content');
    const mediaBoxes = row.querySelectorAll('.media-box');

    if (!drawer || !drawerContent) return;

    row.addEventListener('mouseenter', () => {
      // Smoothly collapse previously opened row
      if (activeRow && activeRow !== row) {
        const prevDrawer = activeRow.querySelector('.project-row-drawer');
        const prevMedia = activeRow.querySelectorAll('.media-box');

        gsap.killTweensOf([activeRow, prevDrawer, prevMedia]);
        gsap.to(activeRow, { backgroundColor: 'transparent', duration: 0.6, ease: 'power2.out' });
        gsap.to(prevDrawer, { height: 0, opacity: 0, duration: 0.5, ease: 'power3.inOut' });
        gsap.to(prevMedia, { y: 25, scale: 0.95, opacity: 0, duration: 0.35, ease: 'power2.in' });
        activeRow.classList.remove('active');
      }

      activeRow = row;
      row.classList.add('active');

      // Animate row background color
      gsap.killTweensOf(row);
      gsap.to(row, {
        backgroundColor: bg,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Calculate target height
      const targetHeight = drawerContent.offsetHeight;

      // GSAP Smooth Expansion of Drawer
      gsap.killTweensOf([drawer, mediaBoxes]);
      gsap.to(drawer, {
        height: targetHeight,
        opacity: 1,
        duration: 0.75,
        ease: 'power3.out'
      });

      // Staggered pop-in of media boxes
      gsap.fromTo(mediaBoxes,
        { y: 35, scale: 0.94, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'back.out(1.2)' }
      );
    });

    row.addEventListener('mouseleave', () => {
      gsap.killTweensOf([row, drawer, mediaBoxes]);

      // Retract drawer height smoothly
      gsap.to(drawer, {
        height: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut'
      });

      // Fade out background color
      gsap.to(row, {
        backgroundColor: 'transparent',
        duration: 0.6,
        ease: 'power2.out'
      });

      // Reset media boxes
      gsap.to(mediaBoxes, {
        y: 25,
        scale: 0.95,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      });

      row.classList.remove('active');
      if (activeRow === row) activeRow = null;
    });
  });
}

/* ---------- Localized Proximity 3D Tech Icon Pop ---------- */
function initProximityTechIcons() {
  const container = document.getElementById('skillsHeadingContainer');
  const letters = document.querySelectorAll('.skill-letter');
  const icons = document.querySelectorAll('.tech-icon-pop');
  
  if (!container || letters.length === 0 || icons.length === 0) return;

  container.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    letters.forEach((letter, index) => {
      const rect = letter.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2;
      const letterCenterY = rect.top + rect.height / 2;
      
      const distance = Math.hypot(mouseX - letterCenterX, mouseY - letterCenterY);
      const matchingIcon = document.querySelector(`.tech-icon-pop[data-target-index="${index}"]`);

      // If mouse is within 140px proximity of letter
      if (distance < 140) {
        letter.classList.add('active-letter');
        if (matchingIcon) {
          matchingIcon.classList.add('pop-active');
        }
      } else {
        letter.classList.remove('active-letter');
        if (matchingIcon) {
          matchingIcon.classList.remove('pop-active');
        }
      }
    });
  });

  container.addEventListener('mouseleave', () => {
    letters.forEach(letter => letter.classList.remove('active-letter'));
    icons.forEach(icon => icon.classList.remove('pop-active'));
  });
}

/* ---------- Footer 3D Folding Ribbon Shader Interactivity ---------- */
function initFooterLiquidShaderName() {
  const wrap = document.getElementById('footerHeroNameWrap');
  const chars = document.querySelectorAll('.fold-char');
  if (!wrap || chars.length === 0) return;

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / rect.height) * -20;
    const rotY = (x / rect.width) * 24;

    chars.forEach((char, index) => {
      const charDelay = index * 2.5;
      gsap.to(char, {
        rotateX: rotX,
        rotateY: rotY + charDelay,
        translateZ: 15 + Math.abs(rotY) * 0.4,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  wrap.addEventListener('mouseleave', () => {
    chars.forEach((char) => {
      gsap.to(char, {
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  });
}

/* Master Initialization */
function boot() {
  initNavbarToggle();
  initProjectOrbit();
  initInteractiveTextHover();
  initCrazyCursor();
  initCatalogPopupParallax();
  initProjectRowHover();
  initProximityTechIcons();
  initFooterLiquidShaderName();
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

//maruee tage

function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        totalWidth, curX, distanceToStart, distanceToLoop, item, i;
    gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el) => {
            let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
            return xPercents[i];
        }
    });
    gsap.set(items, {x: 0});
    totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
          .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
          .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
            vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }
    tl.next = vars => toIndex(curIndex+1, vars);
    tl.previous = vars => toIndex(curIndex-1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
      tl.vars.onReverseComplete();
      tl.reverse();
    }
    return tl;
    }
    const elems = gsap.utils.toArray(".elem");
    const loop = horizontalLoop(elems, {paused: false,repeat:-1});
    
         var a = document.querySelectorAll(".stripe");
         a.forEach(function(stripe){
           stripe.addEventListener("mousemove",()=>{
                gsap.to(stripe.children[0],{
                    height:"100%",
                    ease:"expo.out",
                    duration:.3
                });
                gsap.to(stripe.children[1],{
                    opacity:0,
                    ease:"expo.out",
                    duration:.3,
                    delay:.1
                });
                gsap.to(stripe.children[0].children[0],{
                    opacity:1,
                    ease:"expo.out",
                    duration:.1
                });
             });
             stripe.addEventListener("mouseleave",()=>{
                gsap.to(stripe.children[0],{
                    height:"0%",
                    ease:"expo.out",
                    duration:.3
                });
                gsap.to(stripe.children[1],{
                    opacity:1,
                    ease:"expo.out",
                    duration:.3,
                    delay:.3
                });
                gsap.to(stripe.children[0].children[0],{
                    opacity:0,
                    ease:"expo.out",
                    duration:.1
                });
             });
         });