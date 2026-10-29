/* =========================================================
   BEZ — index.js (home)
   lazy nights · nôm · no tuna · guláš · without · anatomy · žižkov
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const B = window.BZ;
  const { $, $$ } = B;
  const M = B.motion;

  /* ---------- vertical giant type: as long as the page is tall ---------- */
  // the lazy-nights column: "Bez." runs the full height, "without" sits small beside it
  const fitLazy = () => {
    const type = $('.lazy__type'), panel = $('#lazyPanel'), big = $('#lazyBig');
    type.style.fontSize = '100px';
    const len = big.offsetHeight;
    if (!len) return;
    const byLength = (100 * (panel.clientHeight * .97)) / len;
    const byThick = panel.clientWidth * (innerWidth < 860 ? .9 : .7);
    type.style.fontSize = `${Math.min(byLength, byThick)}px`;
  };
  // the chow-mein column: guláš runs past the bottom and gets cropped, like the poster
  const fitGulas = () => {
    const word = $('.gulas__word'), sec = $('#gulas'), a = $('#gulasA');
    word.style.fontSize = '100px';
    const len = a.offsetHeight;
    if (!len) return;
    word.style.fontSize = `${Math.min((100 * sec.clientHeight * 1.02) / len, sec.clientWidth * .3)}px`;
  };
  const fitAll = () => { fitLazy(); fitGulas(); syncBB(); };

  /* ---------- budbites rows share the fitted size ---------- */
  const syncBB = () => {
    const f = $('.bb__row [data-fit]');
    if (f) $('#bb').style.setProperty('--bbfs', f.style.fontSize);
  };
  fitAll();
  document.addEventListener('bz:fit', fitAll);
  document.fonts?.ready.then(fitAll);

  /* ---------- žižkov ® ---------- */
  $('#zzReg')?.addEventListener('click', () => B.toast('registered. without trademark lawyers. žižkov belongs to the babies on the tv tower.'));

  if (!M) return;

  /* ================= motion ================= */

  /* ---------- 01 · lazy nights: the spread gets laid out ---------- */
  const bigC = B.split($('#lazyBig'));
  const smallC = B.split($('#lazySmall'));
  fitLazy();
  gsap.set('#lazyPanel', { clipPath: 'inset(0% 100% 0% 0%)' });
  gsap.set('#lazyPhoto .slot', { scale: 1.3 });
  gsap.set(bigC, { xPercent: -120 });
  gsap.set(smallC, { xPercent: -160, opacity: 0 });
  gsap.set('#lazyDiamond', { scale: 0, rotate: -40 });
  gsap.set('#lazyNote', { yPercent: 140, rotate: 6 });
  B.ready.then(() => {
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('#lazyPanel', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }, 0)
      .to('#lazyPhoto .slot', { scale: 1, duration: 2 }, .2)
      .to(bigC, { xPercent: 0, duration: 1.1, stagger: .07, ease: 'back.out(1.4)' }, .6)
      .to(smallC, { xPercent: 0, opacity: 1, duration: .8, stagger: .04 }, 1)
      .to('#lazyDiamond', { scale: 1, rotate: 0, duration: 1.2, ease: 'elastic.out(1, .5)' }, 1.3)
      .to('#lazyNote', { yPercent: 0, rotate: -2, duration: 1.1 }, 1.4)
      .call(lazyScroll);
  });
  function lazyScroll() {
    gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('#lazyPhoto .slot', { yPercent: 14, ease: 'none' }, 0)
      .to('#lazyBig', { y: -120, ease: 'none' }, 0)
      .to('#lazySmall', { y: 80, ease: 'none' }, 0)
      .to('#lazyDiamond', { rotate: 30, y: -60, ease: 'none' }, 0)
      .to('#lazyNote', { y: -140, rotate: 3, ease: 'none' }, 0);
  }
  if (B.fine) {
    const px = gsap.quickTo('#lazyPhoto .slot', 'x', { duration: 1, ease: 'power3.out' });
    $('#hero').addEventListener('pointermove', (e) => px((e.clientX / innerWidth - .5) * -30));
  }

  /* ---------- 02 · nôm: the poster gets pasted on the wall ---------- */
  gsap.timeline({ scrollTrigger: { trigger: '#intro', start: 'top 70%' } })
    .from('.nom__poster', { y: 80, rotate: -2, opacity: 0, duration: 1.1, ease: 'expo.out' })
    .from('.nom__sidephoto', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, .1)
    .from('.nom__tags li', { y: -30, opacity: 0, stagger: .07, duration: .6, ease: 'back.out(2)' }, .4)
    .from('.nom__q', { y: 20, opacity: 0, stagger: .15, duration: .7 }, .5)
    .from('#nomWin', { clipPath: 'inset(50% 50% 50% 50% round 16px)', duration: 1.1, ease: 'expo.inOut' }, .6)
    .from(B.split($('#nomWord')), { yPercent: 100, duration: 1, stagger: .08, ease: 'back.out(1.8)' }, .7)
    .from('.nom__tape', { xPercent: -60, rotate: -40, opacity: 0, duration: 1, ease: 'back.out(1.6)' }, 1);
  gsap.fromTo('#nomGiant', { xPercent: 0 }, { xPercent: -28, ease: 'none', scrollTrigger: { trigger: '#intro', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('#nomSide', { yPercent: 0 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '#intro', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- 03 · NO TUNA: pinned, the plate turns in, the words slam ---------- */
  const pokeFits = $$('.poke__ln [data-fit]');
  gsap.set(pokeFits, { yPercent: 100 });
  gsap.set('.poke__ing li', { y: 40, opacity: 0 });
  gsap.timeline({ scrollTrigger: { trigger: '#poke', start: 'top top', end: '+=140%', pin: '.poke__pin', scrub: .6 } })
    .fromTo('#pokePlate', { xPercent: -60, rotate: -140 }, { xPercent: 0, rotate: 0, ease: 'power2.out', duration: 1 }, 0)
    .from('.poke__box', { y: -30, opacity: 0, duration: .4 }, .1)
    .to(pokeFits, { yPercent: 0, stagger: .18, ease: 'power3.out', duration: .5 }, .25)
    .to('.poke__ing li', { y: 0, opacity: 1, stagger: .08, duration: .4 }, .8)
    .to('#pokePlate', { rotate: 40, ease: 'none', duration: 1 }, 1)
    .fromTo('#pokeNote', { opacity: 0, y: 30, rotate: 4 }, { opacity: 1, y: 0, rotate: -5, duration: .3 }, 1.4)
    .to({}, { duration: .2 });

  /* ---------- 04 · guláš: the column rises, the bowl rolls in ---------- */
  gsap.fromTo('#gulasA', { y: 260 }, { y: -60, ease: 'none', scrollTrigger: { trigger: '#gulas', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('#gulasB', { y: 420 }, { y: -160, ease: 'none', scrollTrigger: { trigger: '#gulas', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('#gulasBowl', { rotate: -40, xPercent: 20 }, { rotate: 12, xPercent: 0, ease: 'none', scrollTrigger: { trigger: '#gulas', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('#gulasPlate', { rotate: 0 }, { rotate: 90, ease: 'none', scrollTrigger: { trigger: '#gulas', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.gulas__tag, .gulas__cap', { opacity: 0, duration: .8, scrollTrigger: { trigger: '#gulas', start: 'top 50%' } });

  /* ---------- 05 · without, in every language ---------- */
  $$('.bb__row--run').forEach((row) => {
    const dir = +row.dataset.dir;
    gsap.fromTo($('span', row), { xPercent: dir > 0 ? -50 : 0 }, { xPercent: dir > 0 ? 0 : -50, ease: 'none', scrollTrigger: { trigger: '#bb', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.fromTo('#bbBowl', { rotate: -50, scale: .75 }, { rotate: 40, scale: 1.04, ease: 'none', scrollTrigger: { trigger: '#bb', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('.bb__row:not(.bb__row--run) [data-fit]').forEach((w) => {
    gsap.from(B.split(w), { yPercent: 100, opacity: 0, duration: .9, stagger: .04, ease: 'back.out(1.6)', scrollTrigger: { trigger: w, start: 'top 90%' } });
  });

  /* ---------- 06 · anatomy: tiles open one by one, bacon gets crossed out ---------- */
  $$('.tile').forEach((t, i) => {
    gsap.fromTo(t, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut', delay: (i % 2) * .15, scrollTrigger: { trigger: t, start: 'top 85%' } });
    const img = $('.tile__img', t);
    if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true } });
    const w = $('.tile__w', t);
    if (w) gsap.from(w, { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', delay: .5 + (i % 2) * .15, scrollTrigger: { trigger: t, start: 'top 85%' } });
    if (img && B.fine) {
      const xTo = gsap.quickTo(img, 'x', { duration: .8, ease: 'power3.out' });
      const yTo = gsap.quickTo(img, 'y', { duration: .8, ease: 'power3.out' });
      t.addEventListener('pointermove', (e) => { const r = t.getBoundingClientRect(); xTo(((e.clientX - r.left) / r.width - .5) * -30); yTo(((e.clientY - r.top) / r.height - .5) * -30); });
      t.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    }
  });
  gsap.timeline({ scrollTrigger: { trigger: '.tile__s', start: 'top 70%' } })
    .to('.tile__s', { '--s': 1, duration: .5, ease: 'power2.in', delay: .9 })
    .to('.tile__s', { opacity: .55, duration: .3 })
    .from('.tile__new', { yPercent: 80, opacity: 0, rotate: -6, duration: .8, ease: 'back.out(2)' }, '-=.1');
  gsap.from('.tile--prod .slot', { scale: .6, rotate: -20, duration: 1.4, ease: 'elastic.out(1, .5)', scrollTrigger: { trigger: '.tile--prod', start: 'top 80%' } });

  // every other <s> gets crossed out when it arrives
  $$('main s').filter((x) => !x.closest('.tile__lbl')).forEach((x) => {
    gsap.fromTo(x, { '--s': 0 }, { '--s': 1, duration: .35, delay: .5, ease: 'power2.in', scrollTrigger: { trigger: x, start: 'top 85%' } });
  });

  /* ---------- 07 · žižkov: letters drop, the hand comes up with lunch ---------- */
  gsap.from('.zz__row span', { yPercent: -120, rotate: () => B.rand(-20, 20), duration: 1.1, stagger: .07, ease: 'bounce.out', scrollTrigger: { trigger: '#visit', start: 'top 65%' } });
  gsap.fromTo('#zzHand', { yPercent: 70, rotate: 8 }, { yPercent: 0, rotate: -3, ease: 'none', scrollTrigger: { trigger: '#visit', start: 'top bottom', end: 'center center', scrub: .6 } });
  gsap.from('.zz__book', { scale: 0, rotate: -90, duration: 1.2, ease: 'elastic.out(1, .45)', scrollTrigger: { trigger: '#visit', start: 'top 30%' } });

  /* ---------- footer ---------- */
  $$('.ft__title .ln').forEach((ln, i) => {
    gsap.from(ln, { yPercent: 105, rotate: 3, duration: 1.1, ease: 'expo.out', delay: i * .12, scrollTrigger: { trigger: ln.parentElement, start: 'top 90%' } });
  });

  ScrollTrigger.refresh();
})();
