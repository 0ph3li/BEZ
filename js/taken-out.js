/* =========================================================
   BEZ — taken-out.js (everything we took out, and what we put back)
   basics · drag-to-swap stripes · bibimbap · never-missed cover · bez-time
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const B = window.BZ;
  const { $, $$ } = B;
  const M = B.motion;

  /* ---------- the swaps: one stripe each, drag to put it back ---------- */
  const SWAPS = [
    { a: 'beef', b: 'king oyster', why: 'torn by hand, seared hard, 3 minutes a side', ta: '#7a2a20', tb: '#c9a77a' },
    { a: 'tuna', b: 'watermelon', why: 'smoked six hours, marinated in soy and nori', ta: '#b2363a', tb: '#e04a4a' },
    { a: 'cream', b: 'oat', why: 'oat cream, reduced until it gives up', ta: '#efe6d2', tb: '#e3d2a8' },
    { a: 'eggs', b: 'chickpea water', why: 'aquafaba: whipped, folded, lying to you', ta: '#f0c64a', tb: '#e9ddb9' },
    { a: 'cheese', b: 'cashew', why: 'cultured 21 days. we don\'t talk about it', ta: '#f2c447', tb: '#e8d8b0' },
    { a: 'bacon', b: 'rice paper', why: 'brushed with smoke and maple, fried crisp', ta: '#9d3a1c', tb: '#c27a3a' },
  ];
  const slug = (t) => t.replace(/[^a-z]+/g, '');
  const list = $('#swapsList');
  list.innerHTML = SWAPS.map((s) => `
    <div class="swap" data-cursor="drag">
      <div class="slot swap__a" data-img="img/TAKEN/swap-${slug(s.a)}.jpg" data-label="swap-${slug(s.a)}.jpg · ${s.a}, macro texture. 16:5" style="--tone:${s.ta}"></div>
      <div class="slot swap__b" data-img="img/TAKEN/swap-${slug(s.b)}.jpg" data-label="swap-${slug(s.b)}.jpg · ${s.b}, macro texture. 16:5" style="--tone:${s.tb}"></div>
      <p class="swap__lbl swap__lbl--a"><s>${s.a}</s></p>
      <p class="swap__lbl swap__lbl--b">${s.b}<small>${s.why}</small></p>
      <i class="swap__handle"></i>
    </div>`).join('');
  B.slots(list);
  const swaps = $$('.swap', list);
  const setP = (el, p) => { el.style.setProperty('--p', `${p}%`); el.classList.toggle('is-back', p < 55); };
  swaps.forEach((el) => {
    let drag = false;
    const at = (e) => { const r = el.getBoundingClientRect(); setP(el, B.clamp(((e.clientX - r.left) / r.width) * 100, 0, 100)); };
    el.addEventListener('pointerdown', (e) => { drag = true; el.setPointerCapture(e.pointerId); window.gsap?.killTweensOf(el); at(e); });
    el.addEventListener('pointermove', (e) => { if (drag || (B.fine && e.buttons === 0 && el.dataset.hover === '1')) at(e); });
    el.addEventListener('pointerup', () => { drag = false; });
    el.addEventListener('pointerenter', () => (el.dataset.hover = '1'));
    el.addEventListener('pointerleave', () => (el.dataset.hover = '0'));
  });

  /* ---------- the slapped label ---------- */
  $('#basicsTag')?.addEventListener('click', () => B.toast('put back: flavour, smoke, crunch, and the reason you came. taken out: the animals.'));

  if (!M) { swaps.forEach((el) => setP(el, 50)); return; }

  /* ================= motion ================= */

  /* ---------- 01 · basics ---------- */
  const tC = B.split($('#basicsT'));
  gsap.set(tC, { yPercent: 110 });
  gsap.set('#basicsPerson', { yPercent: 60 });
  gsap.set('#basicsTag', { scale: 0, rotate: -60 });
  gsap.set('.basics__side, .basics__k', { opacity: 0, x: -40 });
  B.ready.then(() => {
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('#basicsBg', { scale: 1.2, duration: 2 }, 0)
      .to(tC, { yPercent: 0, duration: 1.1, stagger: .05, ease: 'back.out(1.4)' }, .2)
      .to('#basicsPerson', { yPercent: 0, duration: 1.4 }, .5)
      .to('.basics__side, .basics__k', { opacity: 1, x: 0, duration: .9, stagger: .1 }, 1)
      .to('#basicsTag', { scale: 1, rotate: 0, duration: 1.1, ease: 'elastic.out(1, .45)' }, 1.2)
      .call(() => {
        gsap.timeline({ scrollTrigger: { trigger: '#basics', start: 'top top', end: 'bottom top', scrub: true } })
          .to('#basicsBg', { yPercent: 10, ease: 'none' }, 0)
          .to('#basicsT', { yPercent: 40, ease: 'none' }, 0)
          .to('#basicsPerson', { yPercent: -10, ease: 'none' }, 0)
          .to('#basicsTag', { rotate: 30, y: -80, ease: 'none' }, 0);
      });
  });

  /* ---------- 02 · the swaps: each stripe slides half-way back on its own ---------- */
  swaps.forEach((el, i) => {
    gsap.from(el, { clipPath: 'inset(0% 100% 0% 0%)', duration: 1, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } });
    ScrollTrigger.create({
      trigger: el, start: 'top 60%', once: true,
      onEnter: () => { const o = { p: 100 }; gsap.to(o, { p: 50, duration: 1.2, delay: .2 + (i % 2) * .1, ease: 'power3.inOut', onUpdate: () => setP(el, o.p) }); },
    });
    gsap.fromTo($$('.slot', el), { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- 03 · bibimbap: the blocks slide in, the bowl spins up ---------- */
  gsap.timeline({ scrollTrigger: { trigger: '#putback', start: 'top 70%' } })
    .from('.bbp__block--a', { xPercent: -100, duration: 1, ease: 'expo.out' })
    .from('.bbp__block--b', { yPercent: -100, duration: 1, ease: 'expo.out' }, .1)
    .from('.bbp__block--c', { xPercent: 100, duration: 1, ease: 'expo.out' }, .15)
    .from('.bbp__block--d', { yPercent: 100, duration: 1, ease: 'expo.out' }, .2)
    .from('.bbp__pill', { scale: 0, duration: .7, ease: 'back.out(2)' }, .5)
    .from(B.split($('.bbp__t')), { yPercent: 100, opacity: 0, duration: .9, stagger: .04, ease: 'back.out(1.6)' }, .6)
    .from('.bbp__sub, .bbp__c', { opacity: 0, y: 20, duration: .7, stagger: .1 }, .9);
  gsap.fromTo('#bbpBowl', { rotate: -120, scale: .5 }, { rotate: 30, scale: 1, ease: 'none', scrollTrigger: { trigger: '#putback', start: 'top bottom', end: 'bottom 60%', scrub: .6 } });

  /* ---------- 04 · never missed: the words ride their curves ---------- */
  const tpA = $('#tpA'), tpB = $('#tpB');
  const curve = { a: 30, b: -10 };
  gsap.to(curve, {
    a: 2, b: 22, ease: 'none',
    scrollTrigger: { trigger: '#cover', start: 'top bottom', end: 'bottom top', scrub: true },
    onUpdate: () => { tpA.setAttribute('startOffset', `${curve.a}%`); tpB.setAttribute('startOffset', `${curve.b}%`); },
  });
  $$('.cover__c').forEach((c, i) => {
    gsap.from(c, { scale: 0, rotate: -90, duration: 1.1, delay: i * .1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '#cover', start: 'top 60%' } });
    gsap.to(c, { y: (i % 2 ? -1 : 1) * 60, ease: 'none', scrollTrigger: { trigger: '#cover', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from(B.split($('#coverMast')), { yPercent: -100, opacity: 0, duration: 1, stagger: .05, ease: 'bounce.out', scrollTrigger: { trigger: '#cover', start: 'top 70%' } });

  /* ---------- 05 · bez-time ---------- */
  gsap.from('#mie1, #mie2', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, stagger: .2, ease: 'expo.inOut', scrollTrigger: { trigger: '#mie', start: 'top 70%' } });
  gsap.from('.mie__q', { y: 40, opacity: 0, duration: 1, stagger: .2, ease: 'expo.out', scrollTrigger: { trigger: '#mie', start: 'top 60%' } });
  $$('.mie__ph .slot').forEach((s) => gsap.fromTo(s, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: s.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('.mie__t', { scale: .6, opacity: 0, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '#mie2', start: 'top 70%' } });

  $$('.ft__title .ln').forEach((ln, i) => gsap.from(ln, { yPercent: 105, rotate: 3, duration: 1.1, ease: 'expo.out', delay: i * .12, scrollTrigger: { trigger: ln.parentElement, start: 'top 90%' } }));

  ScrollTrigger.refresh();
})();
