/*
 * HTML templates for every data-driven part of the page. Pure string functions, so the same code
 * runs in the browser (app.js) and in Node (scripts/prerender.mjs, which bakes the output into index.html).
 */
(function (root) {
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

  function media(p) {
    if (p.shot) {
      const src = 'assets/shots/' + p.shot;
      if (/\.(mp4|webm)$/i.test(p.shot))
        return `<video src="${esc(src)}" autoplay muted loop playsinline preload="metadata" aria-label="${esc(p.name)} demo"></video>`;
      return `<img src="${esc(src)}" alt="${esc(p.name)} screenshot" loading="lazy" decoding="async">`;
    }
    return `<div class="shot-ph" aria-hidden="true"><b>${esc(p.name)}</b><span>${esc(p.tags.slice(0, 3).join(' · '))}</span></div>`;
  }

  /* ---------- Full page ---------- */

  const unlocks = (D) => D.highlights
    .map(
      (h, i) => `<li class="unlock px">${TROPHY}
        <span class="unlock-tag">${esc(h.tag)}</span>
        <span class="unlock-big">${esc(h.big)}</span>
        <p>${esc(h.text)}</p></li>`
    )
    .join('');

  const quests = (D) => D.experience
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

  const worlds = (D) => D.worlds
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

  function sheet(D) {
    const P = D.person;
    return `
    <aside class="card px avatar-card">
      <canvas class="avatar" width="12" height="19" aria-hidden="true"></canvas>
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
  }

  function direct(D) {
    const P = D.person;
    return `<li><button type="button" id="copy-email"><span><small>EMAIL · CLICK TO COPY</small><span class="val">${esc(P.email)}</span></span><span class="arrow" id="copy-label">COPY</span></button></li>` +
      P.links.map((l) => `<li><a href="${esc(l.url)}"${ext(l.url)}><span><small>${esc(l.label.toUpperCase())}</small><span class="val">${esc(l.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').replace(/%C3%A1/g, 'á'))}</span></span><span class="arrow">↗</span></a></li>`).join('') +
      `<li><a href="${esc(P.resume)}" download><span><small>RÉSUMÉ</small><span class="val">Download PDF</span></span><span class="arrow">↓</span></a></li>`;
  }

  /* ---------- Quick look ---------- */

  function quick(D) {
    const P = D.person;
    return `
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
  }

  /* ---------- Structured data (schema.org Person, for search engines) ---------- */

  function jsonLd(D, url) {
    const P = D.person;
    const [city, country] = P.location.split(',').map((s) => s.trim());
    const job = D.experience.find((j) => j.active);
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: P.name,
      jobTitle: P.role,
      description: P.summary,
      url,
      email: 'mailto:' + P.email,
      address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: country },
      ...(job && { worksFor: { '@type': 'Organization', name: job.company } }),
      alumniOf: D.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.where })),
      knowsAbout: D.skills.primary.concat(D.skills.ai),
      knowsLanguage: P.languages.map((l) => l[0]),
      sameAs: P.links.map((l) => l.url),
    };
    // Escape "<" so nothing in the data can close the <script> tag early.
    return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
  }

  root.PortfolioRender = { unlocks, quests, worlds, sheet, direct, quick, jsonLd };
})(typeof window !== 'undefined' ? window : globalThis);
