gsap.registerPlugin(ScrollTrigger);

/* ---------- Locomotive Scroll ---------- */
const scrollEl = document.querySelector('#main');
const locoScroll = new LocomotiveScroll({
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
window.addEventListener('load', () => ScrollTrigger.refresh());

/* ---------- Preloader ---------- */
const preloaderTl = gsap.timeline({
  onComplete: () => {
    document.getElementById('preloader').style.display = 'none';
    locoScroll.update();
    heroTl.play();
  }
});
preloaderTl.to('.preloader-text', { opacity: 0.3, repeat: 3, yoyo: true, duration: 0.35 })
           .to('#preloader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' });

/* ---------- Hero entrance timeline ---------- */
const heroTl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });

heroTl
  .from('.navbar', { y: -40, opacity: 0, duration: 0.8 })
  .from('[data-anim="fade-up"].eyebrow, .eyebrow', { y: 20, opacity: 0, duration: 0.7 }, '-=0.4')
  .from('.hero-title .line', {
    yPercent: 120,
    opacity: 0,
    duration: 1,
    stagger: 0.12
  }, '-=0.3')
  .from('.hero-desc', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
  .from('.hero-cta > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.45')
  .from('.hero-image-wrap', {
    scale: 0.85,
    opacity: 0,
    y: 60,
    duration: 1.2,
    ease: 'power3.out'
  }, '-=0.9')
  .from('.hero-image-glow', { opacity: 0, duration: 1 }, '-=0.6')
  .from('.award-banner', { x: 30, opacity: 0, duration: 0.7 }, '-=0.8')
  .from('.award-list li', { x: 30, opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.5')
  .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.3')
  .from('.brands-strip', { opacity: 0, duration: 0.8 }, '-=0.2');

/* ---------- Ambient float on hero image ---------- */
gsap.to('.hero-image-wrap', {
  y: -14,
  duration: 3.2,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true,
  delay: 2.4
});

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

/* ---------- Subtle parallax: glow + image drift on scroll ---------- */
gsap.to('.hero-glow', {
  y: 120,
  scrollTrigger: {
    scroller: '#main',
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

gsap.to('.hero-image-wrap', {
  yPercent: -8,
  scrollTrigger: {
    scroller: '#main',
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

ScrollTrigger.refresh();