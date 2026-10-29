/* =========================================================
   BEZ — weeks.js (the menu is never the same)
   this week · plate carousel of past weeks + votes · next week · the drop
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const B = window.BZ;
  const { $, $$ } = B;
  const M = B.motion;
  B.fitAll();

  /* ---------- last weeks: one plate per week, newest first ---------- */
  const PAST = [
    { t: 'skewer week', d: [['Seitan skewers', 'lamb'], ['Charred pepper dip', 'yoghurt'], ['Smoky kulajda', 'the egg']] },
    { t: 'dumpling week', d: [['Mushroom knedlíčky', 'pork'], ['Cabbage gyoza', 'shrimp'], ['Plum buchty', 'butter']] },
    { t: 'roast week', d: [['Sunday seitan roast', 'turkey'], ['Paprika potatoes', 'lard'], ['Cranberry sauce', 'nothing, it was always vegan']] },
    { t: 'green week', d: [['Spinach halušky', 'bryndza'], ['Split pea soup', 'ham hock'], ['Matcha buchty', 'milk']] },
    { t: 'noodle week', d: [['Dan dan', 'pork'], ['Phở chay', 'beef bones'], ['Cold sesame noodles', 'egg']] },
    { t: 'potato week', d: [['Loaded baked potato', 'bacon'], ['Bramboráky', 'eggs'], ['Potato guláš', 'sausage']] },
  ];
  const INK = ['#2f8f6a', '#d9431c', '#e2a21c'];
  const plates = $('#plPlates'), cards = $('#plCards'), dots = $('#plDots');
  plates.innerHTML = PAST.map((w, i) => `
    <div class="pl__plate" data-i="${i}" data-cursor="week ${B.week(-(i + 1)).n}">
      <div class="slot slot--cut" data-img="img/WEEKS/past-${i + 1}.png" data-label="past-${i + 1}.png · ${w.t}: one plate from above, cutout. 1:1" style="--tone:${INK[i % 3]}; --shape: 50%"></div>
    </div>`).join('');
  B.slots(plates);
  dots.innerHTML = PAST.map((w, i) => `<button aria-label="week ${B.week(-(i + 1)).n}"></button>`).join('');
  const votes = (() => { try { return JSON.parse(B.store.get('votes') || '{}'); } catch (e) { return {}; } })();
  const base = (k) => [...k].reduce((a, c) => a + c.charCodeAt(0), 0) % 140 + 12;   // a stable fake crowd
  let cur = 0;
  const show = (i, dir = 0) => {
    cur = (i + PAST.length) % PAST.length;
    const w = PAST[cur], wk = B.week(-(cur + 1));
    $$('.pl__plate', plates).forEach((p) => {
      const d = (+p.dataset.i - cur + PAST.length) % PAST.length;
      p.className = 'pl__plate ' + (d === 0 ? 'is-c' : d === 1 ? 'is-r' : d === PAST.length - 1 ? 'is-l' : 'is-off');
    });
    if (M && dir) gsap.fromTo('.pl__plate.is-c .slot', { rotate: dir * -90 }, { rotate: 0, duration: 1, ease: 'expo.out' });
    $('#plWk').textContent = `week ${wk.n} · ${w.t} · ${wk.range}`;
    cards.innerHTML = w.d.map(([n, wo], j) => {
      const k = `${wk.n}-${j}`, on = !!votes[k];
      return `<article class="pc" style="--c:${INK[j]}">
        <div class="pc__ph"><b>${String(wk.n)}</b></div>
        <p class="pc__tag mono">without ${wo}</p>
        <h3 class="pc__n">${n}</h3>
        <div class="pc__row"><button class="pc__btn" data-k="${k}" aria-pressed="${on}" data-cursor="vote">${on ? 'voted ♥' : 'bring it back'}</button><span class="pc__v mono">${base(n) + (on ? 1 : 0)} votes</span></div>
      </article>`;
    }).join('');
    $$('button', dots).forEach((b, j) => b.setAttribute('aria-current', j === cur ? 'true' : 'false'));
    if (M && dir) gsap.from($$('.pc', cards), { y: 30, opacity: 0, duration: .7, stagger: .07, ease: 'expo.out' });
  };
  show(0);
  $('#plPrev').addEventListener('click', () => show(cur + 1, -1));   // older
  $('#plNext').addEventListener('click', () => show(cur - 1, 1));    // newer
  plates.addEventListener('click', (e) => { const p = e.target.closest('.pl__plate'); if (p && !p.classList.contains('is-c')) show(+p.dataset.i, p.classList.contains('is-r') ? -1 : 1); });
  dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show($$('button', dots).indexOf(b), 1); });
  cards.addEventListener('click', (e) => {
    const b = e.target.closest('.pc__btn'); if (!b) return;
    const k = b.dataset.k;
    votes[k] = !votes[k]; if (!votes[k]) delete votes[k];
    B.store.set('votes', JSON.stringify(votes));
    show(cur);
    B.toast(votes[k] ? 'vote counted. the kitchen reads them on monday.' : 'vote taken back. without you, then.');
  });

  /* ---------- the drop: nothing is sent, it's a concept ---------- */
  const note = $('#dropNote');
  if (B.store.get('drop')) { note.textContent = 'you\'re on the list. see you monday night.'; note.classList.add('is-on'); }
  $('#dropForm').addEventListener('submit', (e) => {
    e.preventDefault();
    B.store.set('drop', '1');
    note.textContent = `you're on the list for week ${B.week(1).n}. (it's a concept: nothing was sent.)`;
    note.classList.add('is-on');
    B.toast('see you monday night.');
    e.target.reset();
  });

  if (!M) return;

  /* ================= motion ================= */

  /* ---------- 01 · this week: the page opens up like a browser window ---------- */
  gsap.set('#nwPage', { scale: .82, rotate: -2, y: 80, opacity: 0 });
  B.ready.then(() => {
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('#nwPage', { scale: 1, rotate: 0, y: 0, opacity: 1, duration: 1.4 })
      .from('.nw__t', { yPercent: 60, opacity: 0, duration: 1 }, .3)
      .from('.nw__sub, .nw__p', { y: 20, opacity: 0, duration: .8, stagger: .1 }, .6)
      .from('.nw__hero', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.inOut' }, .5);
  });
  gsap.fromTo('.nw__hero .slot', { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.nw__hero', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.nw__th', { y: 60, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.nw__thumbs', start: 'top 90%' } });

  /* ---------- 02 · last weeks: title drops, plates roll in ---------- */
  gsap.from(B.split($('.pl__t')), { yPercent: 100, opacity: 0, duration: 1, stagger: .04, ease: 'back.out(1.6)', scrollTrigger: { trigger: '#lastweeks', start: 'top 65%' } });
  gsap.from('.pl__plate .slot', { scale: 0, rotate: 180, duration: 1.3, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '#plStage', start: 'top 75%' } });
  gsap.from('.pc', { y: 50, opacity: 0, duration: .9, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '#plCards', start: 'top 90%' } });

  /* ---------- 03 · next week: sugar rush, everything wobbles in ---------- */
  gsap.timeline({ scrollTrigger: { trigger: '#nextweek', start: 'top 60%' } })
    .from('.sr__t span', { scale: .3, rotate: 30, opacity: 0, duration: 1.2, stagger: .12, ease: 'elastic.out(1, .5)' })
    .from('.sr__badge', { scale: 0, duration: .8, stagger: .1, ease: 'back.out(2.4)' }, .4)
    .from('.sr__star', { scale: 0, rotate: -180, duration: 1, stagger: .1, ease: 'back.out(2)' }, .5)
    .from('.sr__brand, .sr__kick, .sr__src, .sr__low, .sr__foot', { y: 30, opacity: 0, duration: .8, stagger: .06, ease: 'expo.out' }, .3);
  gsap.fromTo('#srA', { rotate: -14, yPercent: 20 }, { rotate: 6, yPercent: -10, ease: 'none', scrollTrigger: { trigger: '#nextweek', start: 'top bottom', end: 'bottom top', scrub: .6 } });
  gsap.fromTo('#srB', { rotate: 18, yPercent: 30 }, { rotate: -8, yPercent: -20, ease: 'none', scrollTrigger: { trigger: '#nextweek', start: 'top bottom', end: 'bottom top', scrub: .8 } });
  gsap.to('.sr__star', { rotate: 360, duration: 12, repeat: -1, ease: 'none' });

  /* ---------- 04 · the drop ---------- */
  gsap.from('.bm__ph', { clipPath: 'inset(0% 50% 0% 50% round 26px)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: '#drop', start: 'top 70%' } });
  gsap.from(B.split($('#bmT')), { yPercent: 100, duration: 1, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: '#drop', start: 'top 55%' } });
  gsap.fromTo('#bmFig', { yPercent: 20, rotate: -6 }, { yPercent: -6, rotate: 3, ease: 'none', scrollTrigger: { trigger: '.bm__mid', start: 'top bottom', end: 'bottom top', scrub: .6 } });
  gsap.from('.bm__h, .bm__p, .bm__col', { y: 30, opacity: 0, duration: .9, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.bm__h', start: 'top 85%' } });

  $$('.ft__title .ln').forEach((ln, i) => gsap.from(ln, { yPercent: 105, rotate: 3, duration: 1.1, ease: 'expo.out', delay: i * .12, scrollTrigger: { trigger: ln.parentElement, start: 'top 90%' } }));

  ScrollTrigger.refresh();
})();
