/* =========================================================
   BEZ — main.js (shared engine, every page)
   a vegan kitchen in žižkov, praha. everything comes without.
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const B = (window.BZ = {});
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  B.$ = $; B.$$ = $$;
  B.page = document.body.dataset.page || 'home';
  B.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  B.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  B.hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  B.motion = B.hasGsap && !B.reduced;
  document.documentElement.classList.toggle('motion', B.motion);
  B.rand = (a, b) => a + Math.random() * (b - a);
  B.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  B.pad = (n, l = 2) => String(Math.max(0, Math.floor(n))).padStart(l, '0');
  B.clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // storage that never throws
  B.store = {
    get(k) { try { return localStorage.getItem('bz-' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('bz-' + k, v); } catch (e) {} },
  };

  if (B.hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  if (window.Lenis && !B.reduced) {
    B.lenis = new Lenis({ lerp: .1, smoothWheel: true });
    if (B.hasGsap) {
      B.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => B.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { B.lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  B.scrollTo = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (B.lenis) B.lenis.scrollTo(el ?? 0, { duration: 1.6 });
    else (el || document.body).scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- toast: a ticket from the kitchen pass ---------- */
  const toastEl = $('#toast');
  let toastT;
  B.toast = (msg, ms = 3400) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.remove('is-on'); void toastEl.offsetWidth;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), ms);
  };
  document.addEventListener('click', (e) => { const t = e.target.closest('[data-toast]'); if (t) { e.preventDefault(); B.toast(t.dataset.toast); } });

  /* ---------- image slots: drop a file at data-img and it shows up ---------- */
  // tries .jpg/.png/.webp/… on its own, so the extension never matters
  B.exts = ['jpg', 'png', 'webp', 'jpeg', 'avif'];
  B.slot = (slot) => {
    if (slot.dataset.label && !$('.slot-label', slot)) {
      const [file, ...rest] = slot.dataset.label.split(' · ');
      const lab = document.createElement('span');
      lab.className = 'slot-label';
      lab.innerHTML = `${file}<small>${rest.join(' · ')}</small>`;
      slot.append(lab);
    }
    const src = slot.dataset.img; if (!src || slot.dataset.loaded === src) return;
    slot.dataset.loaded = src;
    const base = src.replace(/\.[a-z0-9]+$/i, '');
    const own = (src.match(/\.([a-z0-9]+)$/i) || [])[1];
    const tries = [own, ...B.exts.filter((x) => x !== own)].filter(Boolean).map((x) => `${base}.${x}`);
    const attempt = (i) => {
      if (i >= tries.length) return;
      const img = new Image();
      img.decoding = 'async'; img.draggable = false;
      img.alt = slot.dataset.alt || '';
      if (slot.dataset.pos) img.style.objectPosition = slot.dataset.pos;
      img.onload = () => {
        if (slot.dataset.img !== src) return;
        $(':scope > img', slot)?.remove();
        slot.prepend(img);
        slot.classList.add('has-img');
        slot.dispatchEvent(new CustomEvent('slot:loaded', { bubbles: true, detail: { img } }));
      };
      img.onerror = () => attempt(i + 1);
      img.src = tries[i];
    };
    attempt(0);
  };
  B.slots = (root = document) => $$('.slot', root).forEach(B.slot);
  B.slots();
  B.missing = () => console.table([...new Set($$('.slot:not(.has-img)').map((s) => s.dataset.img))].map((f) => ({ put_your_photo_here: f })));

  /* ---------- text helpers ---------- */
  B.split = (el) => {
    if (el._split) return el._split;
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    el._split = [...text].map((p) => {
      if (p === ' ') { el.append(' '); return null; }
      const s = document.createElement('span');
      s.className = 'c'; s.setAttribute('aria-hidden', 'true'); s.textContent = p;
      el.append(s);
      return s;
    }).filter(Boolean);
    return el._split;
  };
  // giant type: as wide as its box, but never taller than data-fit-h × the screen
  B.fit = (el) => {
    const p = getComputedStyle(el.parentElement);
    const box = (el.parentElement.clientWidth - parseFloat(p.paddingLeft) - parseFloat(p.paddingRight)) * (+el.dataset.fit || 1);
    el.style.fontSize = '100px';
    const w = el.scrollWidth;
    if (!w) return;
    let size = (100 * box) / w;
    if (el.dataset.fitH) size = Math.min(size, innerHeight * +el.dataset.fitH);
    el.style.fontSize = `${size}px`;
  };
  B.fitAll = () => { $$('[data-fit]').forEach(B.fit); document.dispatchEvent(new Event('bz:fit')); };
  B.fitAll();
  document.fonts?.ready.then(() => { B.fitAll(); if (B.hasGsap) ScrollTrigger.refresh(); });
  let rz, lastW = innerWidth;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { if (Math.abs(innerWidth - lastW) < 2 && !B.fine) return; lastW = innerWidth; B.fitAll(); if (B.hasGsap) ScrollTrigger.refresh(); }, 120);
  });

  // scramble: letters shuffle like a spice rack, then settle
  const GLYPHS = 'bezBEZ—×#%*+=/0123456789';
  B.scramble = (el, text = el.dataset.text || el.textContent, dur = .9) => {
    if (!el.dataset.text) el.dataset.text = el.textContent;
    if (!B.motion) { el.textContent = text; return; }
    const keepHTML = el.innerHTML;
    const hasMarkup = el.children.length && text === el.dataset.text;
    const o = { p: 0 };
    gsap.to(o, {
      p: 1, duration: dur, ease: 'none',
      onUpdate: () => {
        const n = Math.floor(o.p * text.length);
        el.textContent = text.slice(0, n) + [...text.slice(n)].map((c) => (c === ' ' || c === '\n' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('');
      },
      onComplete: () => { if (hasMarkup) el.innerHTML = keepHTML; else el.textContent = text; },
    });
  };
  if (B.motion) {
    $$('[data-scramble]').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => B.scramble(el, el.textContent) });
    });
  }

  /* ---------- cursor: a pea with a label ---------- */
  const cur = $('#cursor');
  if (cur && B.fine && B.hasGsap) {
    document.documentElement.classList.add('has-cursor');
    const label = $('#cursorLabel');
    const xTo = gsap.quickTo(cur, 'x', { duration: .3, ease: 'power3.out' });
    const yTo = gsap.quickTo(cur, 'y', { duration: .3, ease: 'power3.out' });
    addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); cur.classList.add('is-on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], a, button, label');
      const txt = t ? (t.dataset.cursor || '') : '';
      label.textContent = txt;
      cur.classList.toggle('has-label', !!txt);
      cur.classList.toggle('is-hover', !!t);
    });
  }

  /* ---------- magnetic buttons ---------- */
  B.mag = (root = document) => {
    if (!B.fine || !B.hasGsap) return;
    $$('[data-mag]', root).forEach((b) => {
      if (b._mag) return; b._mag = 1;
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .35, y: (e.clientY - r.top - r.height / 2) * .35, duration: .5, ease: 'power3.out' });
      });
      b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .3)' }));
    });
  };
  B.mag();

  /* ---------- praha time + is the kitchen open ---------- */
  B.praha = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
  B.isOpen = (d = B.praha()) => {
    const day = d.getDay(), h = d.getHours();
    if (day === 1) return false;                       // monday comes without us
    if (day === 0 || day === 6) return h >= 10 && h < 23;
    return h >= 12 && h < 23;
  };
  const tick = () => {
    const d = B.praha();
    $$('[data-clock]').forEach((c) => (c.textContent = `praha ${B.pad(d.getHours())}:${B.pad(d.getMinutes())}`));
    const k = $('#kitchenState');
    if (k) {
      const open = B.isOpen(d);
      k.textContent = open ? 'kitchen: open. come in.' : d.getDay() === 1 ? 'kitchen: closed. without mondays.' : 'kitchen: closed. without you, sadly.';
      k.classList.toggle('is-open', open); k.classList.toggle('is-closed', !open);
    }
  };
  tick(); setInterval(tick, 10000);

  /* ---------- the menu changes every week: written on monday (closed), served tuesday to sunday ---------- */
  B.week = (off = 0, d = B.praha()) => {
    const mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7) + off * 7);
    const tue = new Date(mon); tue.setDate(mon.getDate() + 1);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    const th = new Date(mon); th.setDate(mon.getDate() + 3);           // iso week: the thursday decides
    const jan4 = new Date(th.getFullYear(), 0, 4);
    const n = 1 + Math.round(((th - jan4) / 864e5 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
    const dm = (x) => `${x.getDate()}.${x.getMonth() + 1}`;
    return { n, from: tue, to: sun, range: `${dm(tue)} — ${dm(sun)}`, monday: d.getDay() === 1 && off === 0 };
  };
  const wk = B.week();
  $$('[data-week]').forEach((el) => { const w = B.week(+el.dataset.week || 0); el.textContent = el.dataset.fmt === 'range' ? w.range : el.dataset.fmt === 'both' ? `week ${w.n} · ${w.range}` : `${w.n}`; });
  $$('[data-weekday]').forEach((el) => (el.textContent = wk.monday ? 'today we\'re closed, writing it. new menu tomorrow.' : `new menu in ${(9 - B.praha().getDay()) % 7 || 7} day${(9 - B.praha().getDay()) % 7 === 1 ? '' : 's'}.`));

  /* ---------- header hides on the way down ---------- */
  const hdr = $('#hdr');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    hdr?.classList.toggle('is-hidden', y > lastY && y > innerHeight * .6);
    lastY = y;
  }, { passive: true });

  /* ---------- links: jumps + pages still in the oven ---------- */
  const SOON = {};
  document.addEventListener('click', (e) => {
    const soon = e.target.closest('[data-soon]');
    if (soon) { e.preventDefault(); B.toast(SOON[soon.getAttribute('href')] || 'still in the oven. soon.'); return; }
    const jump = e.target.closest('[data-jump]');
    if (jump) { e.preventDefault(); B.scrollTo(jump.getAttribute('href')); }
  });

  /* ---------- loader: meat, milk, eggs, fish, guilt… crossed out. BEZ stays ---------- */
  B.ready = new Promise((resolve) => {
    const loader = $('#loader');
    const done = () => { document.body.classList.remove('is-loading'); loader?.remove(); resolve(); };
    if (!loader || !B.motion) { done(); return; }
    const items = $$('.ld-list s', loader);
    const word = $('#ldWord'), pct = $('#ldPct');
    const letters = B.split(word);
    const o = { p: 0 };
    const tl = gsap.timeline({ onComplete: done });
    tl.to(o, { p: 100, duration: 2.2, ease: 'power1.inOut', onUpdate: () => (pct.textContent = B.pad(o.p, 3)) }, 0);
    items.forEach((it, i) => {
      tl.fromTo(it, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .3, ease: 'power3.out' }, .1 + i * .32)
        .to(it, { '--s': 1, duration: .22, ease: 'power2.in' }, .32 + i * .32)
        .to(it, { opacity: .25, duration: .3 }, .56 + i * .32);
    });
    tl.to(letters, { yPercent: -110, duration: .8, stagger: .08, ease: 'back.out(1.6)' }, 1.5)
      .to('.ld-list', { y: -40, opacity: 0, duration: .5, ease: 'power2.in' }, 1.9)
      .to(loader, { clipPath: 'inset(0 0 100% 0 round 0 0 60px 60px)', duration: .95, ease: 'expo.inOut' }, '+=.2');
  });

  /* ---------- tab title ---------- */
  const baseTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.title = 'come back. nothing is missing. except you.';
    else {
      document.title = 'back without warning ♥';
      setTimeout(() => (document.title = baseTitle), 2400);
    }
  });

  /* ---------- easter eggs ---------- */
  // konami: BEZ, without photos. it still looks hungry
  const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
  B.bare = () => {
    const on = document.documentElement.classList.toggle('bare');
    B.toast(on ? 'now without photos. still delicious, apparently.' : 'photos are back. you missed them. see?', 3800);
  };
  let keys = [], typed = '';
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    keys = [...keys, e.key].slice(-10);
    if (keys.join(',') === KONAMI) B.bare();
    if (e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-12);
    const hit = (w) => typed.endsWith(w);
    if (hit('meat')) B.toast('not here, love. try the king oyster. it\'s been to the gym.');
    if (hit('cheese')) B.toast('cashew. aged 21 days. we don\'t talk about it.');
    if (hit('bacon')) B.toast('rice paper. smoked. you won\'t know. you\'ll know.');
    if (hit('milk')) B.toast('oat, soy or almond. no cows were consulted.');
    if (hit('with')) B.toast('wrong preposition. try without.');
    if (hit('ghostly')) B.toast('concept, design & code by ghostly.grl ♥');
    if (hit('meow')) B.toast('/ᐠ｡ꞈ｡ᐟ\\  a cat sleeps under table 3. she says she\'s vegan. she\'s lying.', 3800);
  });

  /* ---------- console ---------- */
  const css = 'font-family:monospace;color:#cdeee0;background:#e8432a;padding:6px 10px;line-height:1.4';
  console.log(`%c
   *    /\\_/\\      +
       ( o.o )   <3  ghostly.grl
   +    > ^ <   🌱     *

  BEZ — everything comes without.
  type bez.help() for the kitchen notes`, css);
  B.help = () => {
    console.log('%cbez.missing()   — which photos are still missing\nbez.bare()      — konami code: the site, without photos\nbez.toast(msg)  — send a ticket to the pass\ntype "meat", "cheese", "bacon", "milk", "with", "meow"', 'font-family:monospace;color:#2e2b6e;background:#a9dce6;padding:8px');
    return '♥';
  };
  window.bez = B;
})();
