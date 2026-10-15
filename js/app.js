(function () {
  const D = window.PORTFOLIO;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const R = window.PortfolioRender;
  const P = D.person;

  /* ---------- Render ---------- */

  // index.html already holds this markup (baked in by scripts/prerender.mjs, for crawlers and first paint).
  // Rendering again from data.js keeps the page correct even if the prerender wasn't re-run after an edit.
  $('#unlocks').innerHTML = R.unlocks(D);
  $('#quests').innerHTML = R.quests(D);
  $('#worlds').innerHTML = R.worlds(D);
  $('#sheet').innerHTML = R.sheet(D);
  $('#direct').innerHTML = R.direct(D);
  $('#quick').innerHTML = R.quick(D);
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Pixel sprites in the DOM ---------- */

  const { SPRITES, drawSprite, PAL, GOLD } = window.Pixel;
  function paint(canvas, spr, gold) {
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawSprite(c, spr, 0, 0, gold ? GOLD : PAL);
  }
  const avatar = $('.avatar');
  const brandMark = $('.brand-mark');
  const hudMiner = $('#hud-miner');
  paint(avatar, SPRITES.front);
  paint(brandMark, SPRITES.front);
  paint(hudMiner, SPRITES.climbA);

  /* ---------- Scene ---------- */

  const scene = window.Scene($('#scene'));

  /* ---------- Quick look routing ---------- */

  const quickBtn = $('#quick-toggle');
  let savedScroll = 0;
  function route() {
    const quick = location.hash === '#quick';
    const was = document.body.classList.contains('is-quick');
    if (quick === was) return;
    if (quick) savedScroll = window.scrollY;
    document.body.classList.toggle('is-quick', quick);
    $('#quick').hidden = !quick;
    quickBtn.textContent = quick ? '← Full version' : 'Quick look';
    quickBtn.setAttribute('href', quick ? '#top' : '#quick');
    if (quick) {
      scene.stop();
      window.scrollTo(0, 0);
      $('#quick h1').setAttribute('tabindex', '-1');
      $('#quick h1').focus({ preventScroll: true });
    } else {
      scene.start();
      scene.measure();
      if (location.hash === '#top' || !location.hash) window.scrollTo(0, 0);
    }
  }
  window.addEventListener('hashchange', route);
  route();
  if (!document.body.classList.contains('is-quick')) scene.start();

  // Worlds are rendered by script, so the browser can't jump to e.g. #world-shell on its own.
  const target = location.hash.length > 1 && location.hash !== '#quick' && document.getElementById(location.hash.slice(1));
  if (target) {
    const jump = () => target.scrollIntoView({ behavior: 'instant' });
    jump();
    // Fonts and images can shift the layout until load; land on the section again once they're in.
    window.addEventListener('load', jump, { once: true });
  }

  /* ---------- HUD: depth, progress, active link ---------- */

  const DAYS_CODING = Math.round((Date.now() - new Date(D.person.startedCoding)) / 864e5);
  const depthM = $('#depth-m'), depthName = $('#depth-name'), bar = $('#hud-bar'), hud = $('#hud');
  const navLinks = $$('.hud-nav a');
  let ticking = false, minerFrame = 0, lastY = 0;
  function updateHud() {
    ticking = false;
    if (document.body.classList.contains('is-quick')) return;
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, y / max);
    // Depth is measured in days of programming: the bottom of the page is today.
    depthM.textContent = String(Math.round(p * DAYS_CODING)).padStart(4, '0');
    const probe = y + window.innerHeight * 0.4;
    let cur = null;
    for (const s of $$('#game [data-theme]')) if (s.getBoundingClientRect().top + y <= probe) cur = s;
    if (cur) {
      depthName.textContent = cur.dataset.name;
      hud.style.setProperty('--w', getComputedStyle(cur).getPropertyValue('--w'));
    }
    bar.style.transform = `scaleX(${p})`;
    hudMiner.style.transform = `translateX(${p * (window.innerWidth - 18)}px)`;
    if (Math.abs(y - lastY) > 24) {
      minerFrame ^= 1;
      lastY = y;
      paint(hudMiner, minerFrame ? SPRITES.climbB : SPRITES.climbA, scene.isGold());
    }
    const sec = ['experience', 'projects', 'profile', 'contact'].filter((id) => {
      const el = document.getElementById(id);
      return el && el.getBoundingClientRect().top <= window.innerHeight * 0.4;
    }).pop();
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + sec));
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateHud); } }, { passive: true });
  window.addEventListener('resize', updateHud);
  updateHud();

  /* ---------- Mobile menu ---------- */

  const menuBtn = $('#menu-btn'), mnav = $('#mnav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.hidden = !open;
  }
  menuBtn.addEventListener('click', () => setMenu(mnav.hidden));
  mnav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); menuBtn.focus(); } });
  document.addEventListener('click', (e) => { if (!mnav.hidden && !e.target.closest('#hud')) setMenu(false); });

  /* ---------- Title menu: arrow keys like a game menu ---------- */

  const items = $$('.menu-item');
  items.forEach((el, i) =>
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
    })
  );

  /* ---------- Contact ---------- */

  const copyBtn = $('#copy-email'), copyLabel = $('#copy-label');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(P.email);
      copyLabel.textContent = 'COPIED ✓';
    } catch {
      location.href = 'mailto:' + P.email;
    }
    setTimeout(() => (copyLabel.textContent = 'COPY'), 2000);
  });

  const form = $('#contact-form'), status = $('#form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    status.className = 'form-status err';
    if (!name || !message) return (status.textContent = 'Please fill in your name and a message.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return (status.textContent = 'Please enter a valid email address.');
    if (data.get('_gotcha')) return;

    if (!D.formEndpoint) {
      const body = `${message}\n\n— ${name} (${email})`;
      location.href = `mailto:${P.email}?subject=${encodeURIComponent('Hello from your portfolio — ' + name)}&body=${encodeURIComponent(body)}`;
      status.className = 'form-status ok';
      status.textContent = 'Opening your email app…';
      return;
    }
    const btn = form.querySelector('button');
    btn.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Saving…';
    try {
      const res = await fetch(D.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.className = 'form-status ok';
      status.textContent = 'Game saved! Your message was sent. I’ll get back to you soon.';
    } catch {
      status.className = 'form-status err';
      status.textContent = `Couldn’t send. Please email me at ${P.email}.`;
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- ↑↑↓↓←→←→BA ---------- */

  // Each correct next key pops up as a little keycap at the bottom of the screen, so the code can be
  // stumbled upon (a stray ↑ while scrolling) without the page ever announcing it.
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const LABELS = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', b: 'B', a: 'A' };
  const combo = document.createElement('div');
  combo.className = 'combo';
  combo.setAttribute('aria-hidden', 'true');
  document.body.appendChild(combo);
  let pos = 0, hideTimer = 0;

  function showCombo(n, done) {
    combo.innerHTML = code.slice(0, n).map((k, i) => `<span class="cap${i === n - 1 ? ' new' : ''}">${LABELS[k]}</span>`).join('');
    combo.classList.toggle('done', done);
    combo.classList.add('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => combo.classList.remove('show'), done ? 1600 : 900);
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea')) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === code[pos]) pos++;
    else if (k === 'ArrowUp' && pos === 2) return; // ↑↑↑ still counts as the start
    else pos = k === code[0] ? 1 : 0;
    if (!pos) return;
    const done = pos === code.length;
    showCombo(pos, done);
    if (done) {
      pos = 0;
      const g = scene.gold();
      paint(avatar, SPRITES.front, g);
      paint(brandMark, SPRITES.front, g);
    }
  });
})();
