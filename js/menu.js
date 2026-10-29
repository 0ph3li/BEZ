/* =========================================================
   BEZ — menu.js (the menu, without)
   miso lab · menu cards + leave-out chips · tofu packaging · shoyu · curry club · sesame noodles
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const B = window.BZ;
  const { $, $$ } = B;
  const M = B.motion;

  /* ---------- the cards: nine dishes, named after what they're missing ---------- */
  const DISHES = [
    { n: 'Svíčková', w: 'without the cow', tags: ['gluten'], p: 289, tone: '#c98a4a' },
    { n: 'Guláš', w: 'without beef', tags: ['gluten'], p: 259, tone: '#b4451c' },
    { n: 'Smažák', w: 'without cheese', tags: ['gluten', 'nuts'], p: 219, tone: '#d6a24c' },
    { n: 'Poke', w: 'without tuna', tags: ['soy'], p: 249, tone: '#c23b2a' },
    { n: 'Kulajda', w: 'without the egg', tags: ['soy'], p: 149, tone: '#e1c98a' },
    { n: 'Smash', w: 'without beef', tags: ['gluten', 'soy'], p: 269, tone: '#c6873a' },
    { n: 'Pad thai', w: 'without fish sauce', tags: ['nuts', 'soy', 'spicy'], p: 239, tone: '#d58a3a' },
    { n: 'Tacos', w: 'without carne', tags: ['spicy'], p: 199, tone: '#7a4a8a' },
    { n: 'Buchty', w: 'without butter', tags: ['gluten', 'nuts'], p: 129, tone: '#e0a85a' },
  ];
  const SKINS = ['mcard--sun', '', 'mcard--wine', 'mcard--red'];
  const grid = $('#cardsGrid');
  grid.innerHTML = DISHES.map((d, i) => `
    <article class="mcard ${SKINS[i % SKINS.length]}" data-tags="${d.tags.join(' ')}" data-cursor="${d.p} Kč">
      <h3 class="mcard__name">${d.n}</h3>
      <p class="mcard__br">[${d.w}]</p>
      <div class="mcard__img"><div class="slot slot--cut" data-img="img/MENU/card-${i + 1}.png" data-label="card-${i + 1}.png · ${d.n.toLowerCase()}, cutout. 1:1" style="--tone:${d.tone}"></div></div>
      <div class="mcard__foot">
        <span class="mcard__logo">Bez.</span>
        <span class="mcard__house">Vegan<br />kitchen<br />Žižkov</span>
        <p class="mcard__fine"><span>praha 3 · bořivojova 57</span><b>${d.p} Kč</b></p>
      </div>
      <span class="mcard__no">contains ${d.tags[0]}</span>
    </article>`).join('');
  B.slots(grid);

  /* ---------- leave-out chips (remembered in bz-leaveout) ---------- */
  const cards = $$('.mcard', grid);
  let out = (() => { try { return JSON.parse(B.store.get('leaveout') || '[]'); } catch (e) { return []; } })();
  const apply = () => {
    let left = 0;
    cards.forEach((c) => {
      const hit = c.dataset.tags.split(' ').find((t) => out.includes(t));
      c.classList.toggle('is-out', !!hit);
      if (hit) $('.mcard__no', c).textContent = `contains ${hit}`;
      else left++;
    });
    $$('.chip').forEach((ch) => ch.setAttribute('aria-pressed', out.includes(ch.dataset.tag)));
    $('#cardsCount').textContent = out.length
      ? `${left} of ${DISHES.length} dishes left without ${out.join(', ')}. the animals were already gone.`
      : `${DISHES.length} of ${DISHES.length} dishes left. the animals were already gone.`;
  };
  $('#chips').addEventListener('click', (e) => {
    const ch = e.target.closest('.chip'); if (!ch) return;
    const t = ch.dataset.tag;
    out = out.includes(t) ? out.filter((x) => x !== t) : [...out, t];
    B.store.set('leaveout', JSON.stringify(out));
    apply();
    if (out.length === 4) B.toast('without gluten, nuts, soy and spice. you get the kulajda. it\'s lovely.');
    if (M) gsap.fromTo(cards.filter((c) => !c.classList.contains('is-out')), { y: -10 }, { y: 0, duration: .6, stagger: .03, ease: 'bounce.out' });
  });
  apply();

  /* ---------- barcode (and what it says) ---------- */
  const bar = $('#barcode');
  let x = 4, html = '';
  while (x < 116) { const w = B.pick([1, 1, 2, 3]); html += `<rect x="${x}" y="2" width="${w}" height="56" />`; x += w + B.pick([1, 2, 2, 3]); }
  bar.innerHTML = html;
  $('#tofuBar').addEventListener('click', () => B.toast('beep. 0g meat, 0g milk, 0g eggs, 100% tofu. price: 249 Kč. thank you for scanning a website.'));

  /* ---------- miso lab: the upside-down line turns over ---------- */
  const flip = $('#labFlip');
  flip.addEventListener('click', () => flip.classList.toggle('is-flip'));
  if (B.fine) {
    flip.addEventListener('pointerenter', () => flip.classList.add('is-flip'));
    flip.addEventListener('pointerleave', () => flip.classList.remove('is-flip'));
  }

  if (!M) return;

  /* ================= motion ================= */

  /* ---------- 01 · miso lab ---------- */
  gsap.set('#labBlock', { clipPath: 'inset(50% 0% 50% 0%)' });
  gsap.set('#labOval', { scale: .2, opacity: 0 });
  const labC = B.split($('#labT'));
  gsap.set(labC, { yPercent: 110 });
  B.ready.then(() => {
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('#labBlock', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }, 0)
      .to('#labOval', { scale: 1, opacity: 1, duration: 1.4 }, .5)
      .to(labC, { yPercent: 0, duration: 1, stagger: .045 }, .7)
      .from('.lab__sub, .lab__flip, .lab__k', { opacity: 0, y: 20, duration: .8, stagger: .1 }, 1.1)
      .call(() => { flip.classList.add('is-flip'); setTimeout(() => flip.classList.remove('is-flip'), 1600); }, null, 2)
      .call(() => {
        gsap.timeline({ scrollTrigger: { trigger: '#lab', start: 'top top', end: 'bottom top', scrub: true } })
          .to('#labBlock', { scale: .9, rotate: -3, ease: 'none' }, 0)
          .to('#labOval .slot', { yPercent: 10, ease: 'none' }, 0);
      });
  });

  /* ---------- 02 · the cards get dealt, then tilt under the pea ---------- */
  gsap.from('.cards__t, .cards__chips .chip', { y: 50, opacity: 0, rotate: -3, duration: .9, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '#cards', start: 'top 75%' } });
  cards.forEach((c, i) => {
    gsap.from(c, { y: 160, rotate: B.rand(-12, 12), opacity: 0, duration: 1.2, delay: (i % 3) * .1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 95%' } });
    if (!B.fine) return;
    const rx = gsap.quickTo(c, 'rotateX', { duration: .6, ease: 'power3.out' });
    const ry = gsap.quickTo(c, 'rotateY', { duration: .6, ease: 'power3.out' });
    c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 14); rx(((e.clientY - r.top) / r.height - .5) * -14); });
    c.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
  gsap.set(cards, { transformPerspective: 900 });

  /* ---------- 03 · tofu: the TOFU rows slide, the facts count down to nothing ---------- */
  $$('.tofu__row').forEach((row) => {
    const dir = +row.dataset.dir;
    gsap.fromTo($('span', row), { xPercent: dir > 0 ? -30 : 0 }, { xPercent: dir > 0 ? 0 : -30, ease: 'none', scrollTrigger: { trigger: '#tofu', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.fromTo('#tofuBowl', { rotate: -60, scale: .7 }, { rotate: 20, scale: 1, ease: 'none', scrollTrigger: { trigger: '#tofu', start: 'top bottom', end: 'center center', scrub: .6 } });
  gsap.from('.tofu__blob, .tofu__cert', { scale: 0, rotate: -60, duration: 1, stagger: .15, ease: 'back.out(2)', scrollTrigger: { trigger: '#tofu', start: 'top 55%' } });
  gsap.from('.tofu__label > *', { y: 40, opacity: 0, duration: .8, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.tofu__label', start: 'top 92%' } });
  ScrollTrigger.create({
    trigger: '#facts', start: 'top 90%', once: true,
    onEnter: () => $$('#facts td[data-n]').forEach((td, i) => {
      const unit = td.textContent.replace(/[0-9]/g, '');
      const o = { v: +td.dataset.n };
      gsap.to(o, { v: 0, duration: 1.6, delay: .3 + i * .05, ease: 'power2.inOut', onUpdate: () => (td.textContent = `${Math.round(o.v)}${unit}`) });
    }),
  });

  /* ---------- 04 · shoyu: the title steams ---------- */
  gsap.fromTo('#zukPhoto', { yPercent: -5, scale: 1.1 }, { yPercent: 5, scale: 1, ease: 'none', scrollTrigger: { trigger: '#shoyu', start: 'top bottom', end: 'bottom top', scrub: true } });
  const turb = $('#wavyT');
  const steam = { t: 0 };
  gsap.to(steam, { t: Math.PI * 2, duration: 6, repeat: -1, ease: 'none', onUpdate: () => turb.setAttribute('baseFrequency', `${(0.012 + Math.sin(steam.t) * .004).toFixed(4)} ${(0.04 + Math.cos(steam.t) * .012).toFixed(4)}`) });
  gsap.from(B.split($('#zukT')), { yPercent: 80, opacity: 0, duration: 1.1, stagger: .06, ease: 'back.out(1.6)', scrollTrigger: { trigger: '#shoyu', start: 'top 55%' } });
  gsap.from('.zuk__line i', { scaleX: 0, duration: 1, ease: 'expo.inOut', scrollTrigger: { trigger: '#shoyu', start: 'top 45%' } });

  /* ---------- 05 · curry club ---------- */
  gsap.fromTo('#clubPhoto', { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '#club', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.timeline({ scrollTrigger: { trigger: '#club', start: 'top 55%' } })
    .from('.club__pre, .club__presents', { y: -30, opacity: 0, duration: .7, stagger: .1 })
    .from('.club__l--1, .club__l--3', { yPercent: 60, opacity: 0, duration: .9, stagger: .15, ease: 'expo.out' }, .2)
    .from('.club__l--2', { scale: 0, rotate: -40, duration: 1.2, ease: 'elastic.out(1, .5)' }, .5)
    .from('.club__at', { y: 30, opacity: 0, duration: .7 }, .9);

  /* ---------- 06 · ramen: the blob breathes, the noodles come up ---------- */
  gsap.fromTo('#ramenBowl', { yPercent: 50, rotate: 6 }, { yPercent: 0, rotate: -2, ease: 'none', scrollTrigger: { trigger: '#ramen', start: 'top bottom', end: 'center center', scrub: .6 } });
  gsap.from('.ramen__dot', { scale: 0, duration: .6, stagger: .06, ease: 'back.out(3)', scrollTrigger: { trigger: '#ramen', start: 'top 60%' } });
  gsap.from('#ramenBlob', { scale: .6, rotate: -20, opacity: 0, duration: 1.2, ease: 'elastic.out(1, .6)', scrollTrigger: { trigger: '#ramen', start: 'top 65%' } });

  /* ---------- strikes + footer ---------- */
  $$('main s').forEach((s) => gsap.fromTo(s, { '--s': 0 }, { '--s': 1, duration: .35, delay: .5, ease: 'power2.in', scrollTrigger: { trigger: s, start: 'top 90%' } }));
  $$('.ft__title .ln').forEach((ln, i) => gsap.from(ln, { yPercent: 105, rotate: 3, duration: 1.1, ease: 'expo.out', delay: i * .12, scrollTrigger: { trigger: ln.parentElement, start: 'top 90%' } }));

  ScrollTrigger.refresh();
})();
