/* =========================================================
   BEZ — kitchen.js (the place, the day, the crew, a table)
   pour-in hero · pills · dumpling counter + crumbs · banners · flip cards · booking
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const B = window.BZ;
  const { $, $$ } = B;
  const M = B.motion;

  /* ---------- hero: is the stove on? ---------- */
  const state = $('#frState');
  const stove = () => { if (state) state.textContent = B.isOpen() ? 'the stove is on' : 'the stove is resting'; };
  stove(); setInterval(stove, 60000);

  /* ---------- made here: every pill tells you how ---------- */
  $$('.tw__pill').forEach((p) => p.addEventListener('click', () => {
    $$('.tw__pill').forEach((o) => o.classList.toggle('is-on', o === p));
    B.toast(p.dataset.say);
  }));

  /* ---------- by hand: crumbs + a counter that follows the clock ---------- */
  const crumbs = $('#dpCrumbs');
  crumbs.innerHTML = Array.from({ length: 26 }, () => `<i style="--x:${B.rand(48, 92).toFixed(1)}%; --y:${B.rand(10, 92).toFixed(1)}%; --s:${B.rand(4, 14).toFixed(0)}px"></i>`).join('');
  // folding starts at 09:00, ends at 15:00: 600 a day
  const folded = () => { const d = B.praha(); const h = d.getHours() + d.getMinutes() / 60; return Math.round(B.clamp((h - 9) / 6, 0, 1) * 600); };
  const dpN = $('#dpN');
  dpN.textContent = folded();
  $('#dpFig')?.addEventListener('click', () => { dpN.textContent = Math.min(600, +dpN.textContent + 1); B.toast(+dpN.textContent >= 600 ? 'that\'s 600. go home.' : 'one more. 18 folds.'); });

  /* ---------- a day: which banner is happening right now ---------- */
  const SLOTS = [[7, 10, 0], [10, 12, 1], [12, 23, 2], [23, 24, 3]];
  const banners = $$('.bn__b');
  const now = () => {
    const h = B.praha().getHours();
    const hit = SLOTS.find(([a, b]) => h >= a && h < b);
    banners.forEach((b, i) => b.classList.toggle('is-now', !!hit && hit[2] === i));
    $('#bnNow b').textContent = hit ? banners[hit[2]].querySelector('.bn__w').textContent.toLowerCase() : 'everyone asleep. even the broth.';
  };
  now(); setInterval(now, 60000);

  /* ---------- the crew: four mini posters, flip for what they cook without ---------- */
  const CREW = [
    { n: 'Bára', r: 'head chef · broths', w: 'a stock cube', q: 'twelve hours or nothing.', bg: '#e8432a', fg: '#fbe6c8' },
    { n: 'Kuba', r: 'noodles · dough', w: 'a pasta machine', q: 'slap it on the counter. louder.', bg: '#f6c335', fg: '#1f2d6e' },
    { n: 'Lin', r: 'dumplings · tofu', w: 'a single shortcut', q: 'eighteen folds, every time.', bg: '#17652f', fg: '#f37fe7' },
    { n: 'Ondra', r: 'front of house', w: 'saying "vegan" first', q: 'they find out at dessert.', bg: '#a9dce6', fg: '#2e2b6e' },
  ];
  const grid = $('#crewGrid');
  grid.innerHTML = CREW.map((c, i) => `
    <article class="cc" style="--bg:${c.bg}; --fg:${c.fg}" tabindex="0" data-cursor="flip">
      <div class="cc__f">
        <div><h3 class="cc__name">${c.n}</h3><p class="cc__role mono">${c.r}</p></div>
        <div class="cc__ph"><div class="slot" data-img="img/KITCHEN/crew-${i + 1}.jpg" data-label="crew-${i + 1}.jpg · ${c.n}, a cook at work, portrait. 3:4" style="--tone:${c.fg}"></div></div>
        <div class="cc__row"><span class="mono">bez crew · 0${i + 1}</span><b>B</b></div>
      </div>
      <div class="cc__b">
        <p class="mono">cooks without</p>
        <p class="cc__w"><s>${c.w}</s></p>
        <p class="mono">"${c.q}"</p>
      </div>
    </article>`).join('');
  B.slots(grid);
  $$('.cc', grid).forEach((c) => {
    const flip = () => c.classList.toggle('is-flip');
    c.addEventListener('click', flip);
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });

  /* ---------- book: two product cards, nothing is really sent ---------- */
  const seg = (root) => $$('button', root).forEach((b) => b.addEventListener('click', () => {
    $$('button', root).forEach((o) => o.setAttribute('aria-pressed', o === b ? 'true' : 'false'));
  }));
  seg($('#bkPeople')); seg($('#bkTime'));
  const pick = (id) => $(`#${id} [aria-pressed="true"]`).textContent;
  const note = $('#bkNote');
  const held = B.store.get('table');
  if (held) { note.textContent = `last time you held: ${held}.`; note.classList.add('is-on'); }
  $('#bkGo').addEventListener('click', () => {
    const t = `${pick('bkPeople')} · ${pick('bkTime')} · tonight`;
    B.store.set('table', t);
    note.textContent = `held: ${t}. for 15 minutes. (it's a concept, call +420 555 010 057)`;
    note.classList.add('is-on');
    B.toast('table held. come hungry.');
    if (M) gsap.fromTo('#bkCard', { rotate: -2 }, { rotate: 0, duration: .8, ease: 'elastic.out(1, .4)' });
  });
  let jars = 1;
  const jar = () => { $('#jarN').textContent = jars; $('#jarSum').textContent = `${jars} bowl${jars > 1 ? 's' : ''} · ${jars * 219} Kč · bring ${jars > 1 ? 'them' : 'it'} back, get 20 off`; };
  $('#jarMinus').addEventListener('click', () => { jars = Math.max(1, jars - 1); jar(); });
  $('#jarPlus').addEventListener('click', () => { jars = Math.min(9, jars + 1); jar(); if (jars === 9) B.toast('nine bowls. are you opening a restaurant?'); });
  $('#jarGo').addEventListener('click', () => B.toast(`${jars} bowl${jars > 1 ? 's' : ''} put aside. window opens at 17:00.`));

  if (!M) return;

  /* ================= motion ================= */

  /* ---------- 01 · the kitchen: the cook rises, the word sinks ---------- */
  const tC = B.split($('#frT'));
  gsap.set(tC, { yPercent: 100, opacity: 0 });
  gsap.set('#frFig', { yPercent: 40, opacity: 0 });
  gsap.set('.fr__k, .fr__cz, .fr__v, .fr__foot', { opacity: 0 });
  B.ready.then(() => {
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to(tC, { yPercent: 0, opacity: 1, duration: 1.2, stagger: .06 }, .1)
      .to('#frFig', { yPercent: 0, opacity: 1, duration: 1.6 }, .3)
      .to('.fr__k, .fr__cz, .fr__v, .fr__foot', { opacity: 1, duration: .8, stagger: .08 }, .9)
      .call(() => {
        gsap.timeline({ scrollTrigger: { trigger: '#fr', start: 'top top', end: 'bottom top', scrub: true } })
          .to('#frT', { yPercent: 60, ease: 'none' }, 0)
          .to('#frFig', { yPercent: -8, scale: 1.06, ease: 'none' }, 0);
      });
  });

  /* ---------- 02 · made here: the bowl comes apart, pills stick on ---------- */
  gsap.from('.tw__logo, .tw__t, .tw__sub', { y: 40, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '#made', start: 'top 70%' } });
  gsap.fromTo('#twImg', { scale: .7, yPercent: 20 }, { scale: 1, yPercent: -4, ease: 'none', scrollTrigger: { trigger: '#twStage', start: 'top bottom', end: 'bottom 40%', scrub: .6 } });
  $$('.tw__pill').forEach((p, i) => {
    gsap.from(p, { scale: 0, rotate: (i % 2 ? 1 : -1) * 40, duration: .9, delay: i * .08, ease: 'back.out(2.2)', scrollTrigger: { trigger: '#twStage', start: 'top 55%' } });
    gsap.to(p, { y: (i % 2 ? -1 : 1) * 40, ease: 'none', scrollTrigger: { trigger: '#twStage', start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- 03 · by hand: words drop, crumbs fall, the counter counts ---------- */
  gsap.from('.dp__t span', { yPercent: 100, opacity: 0, duration: 1.1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '#byhand', start: 'top 65%' } });
  gsap.fromTo('#dpFig', { rotate: -10, yPercent: -20 }, { rotate: 6, yPercent: 10, ease: 'none', scrollTrigger: { trigger: '#byhand', start: 'top bottom', end: 'bottom top', scrub: .6 } });
  $$('#dpCrumbs i').forEach((c) => gsap.fromTo(c, { y: -80, opacity: 0 }, { y: B.rand(80, 260), opacity: 1, rotate: B.rand(-180, 180), ease: 'none', scrollTrigger: { trigger: '#byhand', start: 'top bottom', end: 'bottom top', scrub: B.rand(.3, 1.4) } }));
  const target = +dpN.textContent;
  ScrollTrigger.create({ trigger: '#byhand', start: 'top 55%', once: true, onEnter: () => { const o = { n: 0 }; gsap.to(o, { n: target, duration: 2, ease: 'power3.out', onUpdate: () => (dpN.textContent = Math.round(o.n)) }); } });

  /* ---------- 04 · a day: banners slam in from alternating sides ---------- */
  banners.forEach((b, i) => {
    gsap.from(b, { xPercent: (i % 2 ? 1 : -1) * 105, rotate: (i % 2 ? 1 : -1) * 3, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 88%' } });
    gsap.fromTo($('.bn__w', b), { x: (i % 2 ? -1 : 1) * 60 }, { x: (i % 2 ? 1 : -1) * 30, ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- 05 · the crew: cards dealt onto the table ---------- */
  gsap.from('.cc', { y: 120, rotate: (i) => [-8, 5, -4, 7][i], opacity: 0, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '#crewGrid', start: 'top 80%' } });
  if (B.fine) $$('.cc').forEach((c) => {
    c.addEventListener('pointermove', (e) => { if (c.classList.contains('is-flip')) return; const r = c.getBoundingClientRect(); gsap.to(c, { rotateX: ((e.clientY - r.top) / r.height - .5) * -10, rotateY: ((e.clientX - r.left) / r.width - .5) * 12, duration: .5 }); });
    c.addEventListener('pointerleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1, .5)', clearProps: 'transform' }));
    c.addEventListener('click', () => gsap.set(c, { clearProps: 'transform' }));
  });

  /* ---------- 06 · book: the cards float up ---------- */
  gsap.from('.bk__t', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#book', start: 'top 70%' } });
  gsap.from('.bk__card', { y: 140, rotate: (i) => (i ? 6 : -6), opacity: 0, duration: 1.2, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '.bk__cards', start: 'top 85%' } });

  $$('.ft__title .ln').forEach((ln, i) => gsap.from(ln, { yPercent: 105, rotate: 3, duration: 1.1, ease: 'expo.out', delay: i * .12, scrollTrigger: { trigger: ln.parentElement, start: 'top 90%' } }));

  ScrollTrigger.refresh();
})();
