(function () {
  const D = window.PORTFOLIO;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const ext = (url) => /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : '';

  const TROPHY =
    '<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><g fill="currentColor">' +
    '<rect x="4" y="2" width="8" height="6"/><rect x="2" y="3" width="2" height="1"/><rect x="12" y="3" width="2" height="1"/>' +
    '<rect x="1" y="3" width="1" height="3"/><rect x="14" y="3" width="1" height="3"/><rect x="2" y="6" width="2" height="1"/><rect x="12" y="6" width="2" height="1"/>' +
    '<rect x="5" y="8" width="6" height="1"/><rect x="7" y="9" width="2" height="3"/><rect x="5" y="12" width="6" height="2"/></g>' +
    '<rect x="5" y="3" width="2" height="3" fill="#fff" opacity=".45"/></svg>';

  const tags = (list) => '<ul class="tags" aria-label="Technologies">' + list.map((t) => `<li>${esc(t)}</li>`).join('') + '</ul>';
  const links = (list, name) =>
    '<div class="links">' +
    list.map((l) => `<a href="${esc(l.url)}"${ext(l.url)} aria-label="${esc(name + ': ' + l.label)}">${esc(l.label)} ↗</a>`).join('') +
    '</div>';

  /* ---------- Render: full page ---------- */

  $('#unlocks').innerHTML = D.highlights
    .map(
      (h, i) => `<li class="unlock px">${TROPHY}
        <span class="unlock-tag">${esc(h.tag)}</span>
        <span class="unlock-big">${esc(h.big)}</span>
        <p>${esc(h.text)}</p></li>`
    )
    .join('');

  $('#quests').innerHTML = D.experience
    .map(
      (j) => `<li class="quest px${j.active ? ' is-active' : ''}">
        <p class="status">${j.active ? 'MAIN QUEST · IN PROGRESS' : 'QUEST COMPLETE'}</p>
        <div class="quest-top">
          <h3>${esc(j.role)} <span class="at">@ ${esc(j.company)}</span></h3>
          <span class="quest-dates">${esc(j.dates)}</span>
        </div>
        <ul class="loot">${j.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      </li>`
    )
    .join('');


  function media(p) {
    if (p.shot) {
      const src = 'assets/shots/' + p.shot;
      if (/\.(mp4|webm)$/i.test(p.shot))
        return `<video src="${esc(src)}" autoplay muted loop playsinline preload="metadata" aria-label="${esc(p.name)} demo"></video>`;
      return `<img src="${esc(src)}" alt="${esc(p.name)} screenshot" loading="lazy" decoding="async">`;
    }
    return `<div class="shot-ph" aria-hidden="true"><b>${esc(p.name)}</b><span>${esc(p.tags.slice(0, 3).join(' · '))}</span></div>`;
  }

  $('#worlds').innerHTML = D.worlds
    .map((w) => {
      const bosses = w.projects.filter((p) => p.boss);
      const minis = w.projects.filter((p) => !p.boss);
      return `<section class="world" id="world-${w.id}" data-theme="${w.id}" data-name="${esc(w.name)}" style="--w:${w.color}">
        <div class="wrap">
          <header class="sec-head">
            <h2>${esc(w.name)}</h2>
            <p class="plain">${esc(w.plain)}</p>
          </header>
          ${bosses.length ? `<div class="bosses">${bosses
            .map(
              (p) => `<article class="boss px">
                <figure class="shot">${media(p)}</figure>
                <div class="boss-body">
                  <div class="boss-meta"><span class="badge">◆ BOSS</span></div>
                  <h3>${esc(p.name)}</h3>
                  <p class="pitch">${esc(p.pitch)}</p>
                  <ul class="loot">${p.loot.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
                  ${tags(p.tags)}
                  ${links(p.links, p.name)}
                </div>
              </article>`
            )
            .join('')}</div>` : ''}
          ${minis.length ? `<ul class="minis">${minis
            .map(
              (p) => `<li class="mini px">
                <h3>${esc(p.name)}</h3>
                <p>${esc(p.pitch)}</p>
                ${tags(p.tags)}
                ${links(p.links, p.name)}
              </li>`
            )
            .join('')}</ul>` : ''}
        </div>
      </section>`;
    })
    .join('');

  const P = D.person;
  $('#sheet').innerHTML = `
    <aside class="card px avatar-card">
      <canvas class="avatar" width="12" height="16" aria-hidden="true"></canvas>
      <h3>${esc(P.name)}</h3>
      <dl class="stats">
        <div><dt>CLASS</dt><dd>${esc(P.role)}</dd></div>
        <div><dt>SPEC</dt><dd>${esc(P.spec)}</dd></div>
        <div><dt>BASE</dt><dd>${esc(P.location)}</dd></div>
        <div><dt>LANGUAGES</dt><dd>${P.languages.map((l) => esc(l[0]) + ' ' + esc(l[1])).join('<br>')}</dd></div>
      </dl>
    </aside>
    <div class="sheet-main">
      <p>${esc(P.summary)}</p>
      <div class="slot-group"><h4>EQUIPPED <span>· primary stack</span></h4>
        <ul class="slots primary">${D.skills.primary.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
      <div class="slot-group"><h4>ABILITIES <span>· AI &amp; systems</span></h4>
        <ul class="slots">${D.skills.ai.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
      <div class="slot-group"><h4>INVENTORY <span>· also used</span></h4>
        <ul class="slots">${D.skills.additional.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
      <div class="two">
        <div class="slot-group"><h4>TRAINING <span>· education</span></h4>
          <ul class="entries">${D.education.map((e) => `<li><b>${esc(e.title)}</b><span>${esc(e.where)} · ${esc(e.dates)}</span></li>`).join('')}</ul></div>
        <div class="slot-group"><h4>TROPHIES <span>· competitions</span></h4>
          <ul class="entries">${D.achievements.map((e) => `<li><b>${esc(e.title)}</b><span>${esc(e.where)} · ${esc(e.dates)}</span></li>`).join('')}</ul></div>
      </div>
    </div>`;

  $('#direct').innerHTML =
    `<li><button type="button" id="copy-email"><span><small>EMAIL · CLICK TO COPY</small><span class="val">${esc(P.email)}</span></span><span class="arrow" id="copy-label">COPY</span></button></li>` +
    P.links.map((l) => `<li><a href="${esc(l.url)}"${ext(l.url)}><span><small>${esc(l.label.toUpperCase())}</small><span class="val">${esc(l.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').replace(/%C3%A1/g, 'á'))}</span></span><span class="arrow">↗</span></a></li>`).join('') +
    `<li><a href="${esc(P.resume)}" download><span><small>RÉSUMÉ</small><span class="val">Download PDF</span></span><span class="arrow">↓</span></a></li>`;

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Render: quick look ---------- */

  $('#quick').innerHTML = `
    <header>
      <p class="kicker">QUICK LOOK · EVERYTHING ON ONE PAGE</p>
      <h1>${esc(P.name)}</h1>
      <p class="q-role">${esc(P.role)} · ${esc(P.spec)}</p>
      <p class="q-meta"><span>${esc(P.location)}</span><a href="mailto:${esc(P.email)}">${esc(P.email)}</a>${P.links.map((l) => `<a href="${esc(l.url)}"${ext(l.url)}>${esc(l.label)}</a>`).join('')}</p>
      <div class="q-actions">
        <a class="btn" href="${esc(P.resume)}" download>Download résumé (PDF)</a>
        <a class="btn btn-ghost" href="#top" data-exit-quick>Full version</a>
      </div>
      <p class="q-summary">${esc(P.summary)}</p>
    </header>
    <section class="q-sec"><h2>EXPERIENCE</h2>
      ${D.experience.map((j) => `<div class="q-job">
        <div class="q-job-top"><h3>${esc(j.role)} <span>· ${esc(j.company)}</span></h3><span class="q-dates">${esc(j.dates)}</span></div>
        <ul>${j.quick.map((i) => `<li>${esc(j.bullets[i])}</li>`).join('')}</ul>
      </div>`).join('')}
    </section>
    <section class="q-sec"><h2>PROJECTS</h2>
      ${D.worlds.map((w) => `<div class="q-world" style="--w:${w.color}">
        <h3>${esc(w.plain)}</h3>
        ${w.projects.map((p) => `<div class="q-proj">
          <span class="q-proj-name">${esc(p.name)}${p.boss ? '<span class="b" title="Major project">◆</span>' : ''}</span>
          <p>${esc(p.pitch)}<small>${esc(p.tags.join(' · '))}</small></p>
          <a href="${esc(p.links[0].url)}"${ext(p.links[0].url)} aria-label="${esc(p.name + ': ' + p.links[0].label)}">${esc(p.links[0].label)} ↗</a>
        </div>`).join('')}
      </div>`).join('')}
    </section>
    <section class="q-sec"><h2>SKILLS</h2>
      <div class="q-grid">
        <div><h3>Primary stack</h3><p>${D.skills.primary.map(esc).join(', ')}</p></div>
        <div><h3>AI &amp; systems</h3><p>${D.skills.ai.map(esc).join(', ')}</p></div>
        <div><h3>Also used</h3><p>${D.skills.additional.map(esc).join(', ')}</p></div>
        <div><h3>Languages</h3><p>${P.languages.map((l) => esc(l[0]) + ' ' + esc(l[1])).join(', ')}</p></div>
      </div>
    </section>
    <section class="q-sec"><h2>EDUCATION &amp; ACHIEVEMENTS</h2>
      <div class="q-grid">
        <ul>${D.education.map((e) => `<li><b>${esc(e.title)}</b><br><span>${esc(e.where)} · ${esc(e.dates)}</span></li>`).join('')}</ul>
        <ul>${D.achievements.map((e) => `<li><b>${esc(e.title)}</b><br><span>${esc(e.where)} · ${esc(e.dates)}</span></li>`).join('')}</ul>
      </div>
    </section>`;

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
    hudMiner.style.transform = `translateX(${p * (window.innerWidth - 15)}px)`;
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
