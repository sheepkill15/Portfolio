/*
 * The background: a low-resolution canvas scaled up with crisp pixels.
 * Scrolling the page moves the camera down through the ground; each section
 * (data-theme) recolours the cave and changes its particles.
 */
(function () {
  const { SPRITES, drawSprite, PAL, GOLD, GLYPHS, drawGlyph } = window.Pixel;

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const T = (top, bot, rock, rock2, glow, p) => ({ top: hex(top), bot: hex(bot), rock: hex(rock), rock2: hex(rock2), glow: hex(glow), p });

  const THEMES = {
    sky: T('#0e0b22', '#1a1230', '#3a2a2a', '#4d3633', '#ffcc33', 'firefly'),
    soil: T('#120d14', '#1a1219', '#3b2a2a', '#523a34', '#ffb35c', 'firefly'),
    cloud: T('#110c24', '#191132', '#2d2450', '#41357a', '#b794ff', 'spark'),
    desktop: T('#091125', '#0d1832', '#1d2b53', '#2a3e76', '#6fb7ff', 'window'),
    shell: T('#071518', '#0a1d21', '#163b42', '#21565e', '#4ff0cc', 'tile'),
    tool: T('#08130b', '#0b1b0f', '#1b3921', '#275030', '#8dff6e', 'bit'),
    gpu: T('#180a1c', '#210c25', '#461c48', '#66285f', '#ff6ad5', 'blob'),
    metal: T('#190a08', '#220f0a', '#482113', '#69311a', '#ff9147', 'note'),
    bonus: T('#141109', '#1d180b', '#3d3215', '#58481d', '#ffd34d', 'coin'),
    deep: T('#100c1c', '#160f26', '#2c2442', '#3e335e', '#c9a6ff', 'spark'),
    save: T('#0d0a12', '#120d18', '#2a2238', '#3a3050', '#ff9e4a', 'ember'),
  };

  const SKY_TOP = hex('#05040f');
  const SKY_BOT = hex('#2c1d55');
  const FAR = hex('#211943');
  const NEAR = hex('#151030');

  const pack = (c) => ((255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0]) >>> 0;
  const mul = (c, k) => [Math.min(255, c[0] * k) | 0, Math.min(255, c[1] * k) | 0, Math.min(255, c[2] * k) | 0];
  const mix = (a, b, t) => [(a[0] + (b[0] - a[0]) * t) | 0, (a[1] + (b[1] - a[1]) * t) | 0, (a[2] + (b[2] - a[2]) * t) | 0];
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  function hash(x, y) {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function vnoise(x, seed) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    const a = hash(i, seed), b = hash(i + 1, seed);
    return a + (b - a) * u;
  }

  function Scene(canvas, opts) {
    const ctx = canvas.getContext('2d', { alpha: false });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let S, W, H, img, buf, mode, ridgeFar, ridgeNear, groundW;
    let sections = [], tops = [];
    let particles = [];
    let lastCam = 0, lastT = 0, running = false, gold = false, dirty = true;
    let curType = 'firefly';

    // Shaft geometry (low-res px), only used in 'wide' mode.
    const SX0 = 6, SX1 = 24, RX0 = 10, RX1 = 19;

    function resize() {
      const vw = Math.max(1, window.innerWidth), vh = Math.max(1, window.innerHeight);
      S = vw < 760 ? 3 : 4;
      mode = vw >= 1100 ? 'wide' : vw >= 760 ? 'mid' : 'narrow';
      W = Math.ceil(vw / S);
      H = Math.ceil(vh / S);
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = W * S + 'px';
      canvas.style.height = H * S + 'px';
      img = ctx.createImageData(W, H);
      buf = new Uint32Array(img.data.buffer);
      ridgeFar = new Float32Array(W);
      ridgeNear = new Float32Array(W);
      for (let x = 0; x < W; x++) {
        ridgeFar[x] = 30 + 18 * vnoise(x * 0.02, 3) + 7 * vnoise(x * 0.08, 5);
        ridgeNear[x] = 9 + 11 * vnoise(x * 0.035, 11) + 3 * vnoise(x * 0.15, 13);
      }
      measure();
      const count = mode === 'narrow' ? 26 : mode === 'mid' ? 40 : 56;
      particles = [];
      for (let i = 0; i < count; i++) particles.push(spawn({}, true));
      dirty = true;
    }

    function measure() {
      sections = Array.from(document.querySelectorAll('#game [data-theme]'));
      const sy = window.scrollY;
      tops = sections.map((el) => el.getBoundingClientRect().top + sy);
      const hero = sections[0];
      groundW = hero ? Math.floor(hero.offsetHeight / S) - 16 : H;
      dirty = true;
    }

    function themeAt(scrollY) {
      const c = scrollY + window.innerHeight * 0.55;
      let i = 0;
      for (let k = 0; k < tops.length; k++) if (tops[k] <= c) i = k;
      const a = THEMES[sections[i] ? sections[i].dataset.theme : 'sky'] || THEMES.sky;
      const next = sections[i + 1];
      const b = next ? THEMES[next.dataset.theme] || a : a;
      const end = next ? tops[i + 1] : document.documentElement.scrollHeight;
      const frac = (c - tops[i]) / Math.max(1, end - tops[i]);
      const t = a === b ? 0 : smooth((frac - 0.72) / 0.28);
      return {
        top: mix(a.top, b.top, t), bot: mix(a.bot, b.bot, t),
        rock: mix(a.rock, b.rock, t), rock2: mix(a.rock2, b.rock2, t),
        glow: mix(a.glow, b.glow, t), p: t > 0.5 ? b.p : a.p,
      };
    }

    function bounds() {
      if (mode === 'wide') return [36, W - 14];
      if (mode === 'mid') return [10, W - 10];
      return [5, W - 5];
    }

    function spawn(p, anywhere) {
      const [x0, x1] = bounds();
      p.type = gold ? 'coin' : curType;
      p.x = x0 + Math.random() * (x1 - x0);
      p.y = anywhere ? Math.random() * H : Math.random() < 0.5 ? H + 4 : Math.random() * H;
      p.vy = -(2 + Math.random() * 5);
      p.vx = (Math.random() - 0.5) * 2;
      p.seed = Math.random() * 1000;
      p.max = 4 + Math.random() * 6;
      p.life = anywhere ? Math.random() * p.max : 0;
      p.size = 1 + ((Math.random() * 3) | 0);
      if (p.type === 'ember') p.vy = -(6 + Math.random() * 8);
      if (p.type === 'coin') p.vy = 6 + Math.random() * 10;
      if (p.type === 'window' || p.type === 'tile') p.vy = -(1.5 + Math.random() * 2.5);
      return p;
    }

    function drawParticle(p, t, glow, gS) {
      const fade = Math.min(1, p.life / 0.8, (p.max - p.life) / 0.8);
      if (fade <= 0 || p.y < gS + 14) return;
      const x = Math.round(p.x), y = Math.round(p.y);
      ctx.globalAlpha = fade;
      switch (p.type) {
        case 'firefly': {
          const a = 0.5 + 0.5 * Math.sin(t * 3 + p.seed);
          ctx.fillStyle = rgba(glow, 0.25 * a * fade);
          ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 3);
          ctx.fillStyle = rgba(glow, (0.5 + 0.5 * a) * fade);
          ctx.fillRect(x, y, 1, 1);
          break;
        }
        case 'spark':
          ctx.fillStyle = rgba(glow, 0.8);
          drawGlyph(ctx, GLYPHS.spark[((t * 3 + p.seed) | 0) % 2], x, y);
          break;
        case 'window':
          ctx.fillStyle = rgba(glow, 0.55);
          ctx.fillRect(x, y, 7, 2);
          ctx.fillStyle = rgba(glow, 0.3);
          ctx.fillRect(x, y + 2, 1, 4); ctx.fillRect(x + 6, y + 2, 1, 4); ctx.fillRect(x, y + 5, 7, 1);
          break;
        case 'tile': {
          const w = 6 + (p.size * 2), h = 4 + p.size;
          ctx.fillStyle = rgba(glow, 0.4);
          ctx.fillRect(x, y, w, 1); ctx.fillRect(x, y + h, w, 1);
          ctx.fillRect(x, y, 1, h); ctx.fillRect(x + w - 1, y, 1, h + 1);
          ctx.fillRect(x + (w >> 1), y, 1, h);
          break;
        }
        case 'bit':
          ctx.fillStyle = rgba(glow, 0.6);
          drawGlyph(ctx, GLYPHS.bit[(p.seed | 0) % 2], x, y);
          break;
        case 'blob': {
          const r = p.size + 1 + Math.sin(t * 2 + p.seed) * 0.6;
          ctx.fillStyle = rgba(glow, 0.35);
          for (let dy = -r; dy <= r; dy++) {
            const hw = Math.floor(Math.sqrt(r * r - dy * dy));
            ctx.fillRect(x - hw, y + Math.round(dy), hw * 2 + 1, 1);
          }
          break;
        }
        case 'note':
          ctx.fillStyle = rgba(glow, 0.7);
          drawGlyph(ctx, GLYPHS.note[0], x, y);
          break;
        case 'coin': {
          const phase = ((t * 8 + p.seed) | 0) % 6;
          const w = [4, 3, 2, 1, 2, 3][phase];
          const cx = x + ((4 - w) >> 1);
          ctx.fillStyle = gold ? '#ffd34d' : rgba(glow, 0.85);
          ctx.fillRect(cx, y + 1, w, 2); ctx.fillRect(cx + (w > 2 ? 1 : 0), y, Math.max(1, w - 2), 1);
          ctx.fillRect(cx + (w > 2 ? 1 : 0), y + 3, Math.max(1, w - 2), 1);
          break;
        }
        case 'ember': {
          const a = 0.6 + 0.4 * Math.sin(t * 9 + p.seed);
          ctx.fillStyle = rgba(mix(glow, [255, 230, 160], (p.life / p.max) * 0.6), a);
          ctx.fillRect(x, y, 1, 1);
          break;
        }
      }
      ctx.globalAlpha = 1;
    }

    function pixelCircle(cx, cy, r, color) {
      ctx.fillStyle = color;
      for (let dy = -r; dy <= r; dy++) {
        const hw = Math.floor(Math.sqrt(r * r - dy * dy));
        ctx.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1);
      }
    }

    function render(now) {
      const t = now / 1000;
      const dt = Math.min(0.05, lastT ? t - lastT : 0);
      lastT = t;

      const scrollY = window.scrollY;
      const camY = scrollY / S;
      const camI = Math.floor(camY);
      const dCam = camY - lastCam;
      lastCam = camY;

      const th = themeAt(scrollY);
      curType = th.p;

      const cTop = th.top, cBot = th.bot;
      const rock = pack(th.rock), rock2 = pack(th.rock2), rockD = pack(mul(th.rock, 0.7)), rim = pack(mul(th.rock2, 1.25));
      const crystal = pack(th.glow);
      const speck = pack(mix(cBot, th.rock, 0.35));
      const shaftBg = pack(mul(cTop, 0.6)), shaftSpeck = pack(mul(th.rock, 0.55));
      const rail = pack([107, 74, 46]), rung = pack([150, 106, 62]);
      const grass1 = pack([58, 108, 58]), grass2 = pack([80, 146, 70]), grassTop = pack([120, 190, 92]);
      const soil1 = pack([66, 45, 36]), soil2 = pack([84, 58, 44]);
      const farC = pack(FAR), nearC = pack(NEAR);
      const starHi = pack([255, 244, 214]), starLo = pack([150, 140, 190]);

      const wide = mode === 'wide';
      const leftW = wide ? 30 : mode === 'mid' ? 5 : 2;
      const rightW = wide ? 10 : mode === 'mid' ? 5 : 2;
      const gW = groundW;
      const gS = gW - camI;
      const parallax = Math.floor(camY * 0.5);
      const twinkleT = reduced.matches ? 0 : (t * 2) | 0;

      for (let sy = 0; sy < H; sy++) {
        const wy = sy + camI;
        const d = wy - gW;
        const base = sy * W;
        if (d < 0) {
          const k = clamp(sy / Math.max(1, gS), 0, 1);
          const sky = pack(mix(SKY_TOP, SKY_BOT, k * k));
          const above = gW - wy;
          for (let x = 0; x < W; x++) {
            let c;
            if (above < ridgeNear[x]) c = nearC;
            else if (above < ridgeFar[x]) c = farC;
            else {
              const h = hash(x, wy);
              c = h > 0.993 ? (hash(x + twinkleT, wy) > 0.35 ? starHi : starLo) : sky;
            }
            buf[base + x] = c;
          }
          continue;
        }
        const row = pack(mix(cTop, cBot, sy / H));
        const le = leftW + Math.floor(vnoise(wy * 0.09, 21) * (wide ? 6 : 3));
        const re = W - rightW - Math.floor(vnoise(wy * 0.09, 37) * (wide ? 5 : 3));
        const rungRow = wy % 7 === 0;
        for (let x = 0; x < W; x++) {
          let c;
          if (wide && x >= SX0 && x < SX1) {
            if (x === SX0 || x === SX1 - 1) c = rockD;
            else if (x === RX0 || x === RX1) c = rail;
            else if (rungRow && x > RX0 && x < RX1) c = rung;
            else c = hash(x >> 1, wy >> 1) > 0.94 ? shaftSpeck : shaftBg;
          } else if (d < 3) {
            c = d === 0 ? grassTop : hash(x, wy) > 0.5 ? grass1 : grass2;
          } else if (d < 12) {
            c = hash(x >> 1, wy >> 1) > 0.6 ? soil2 : soil1;
          } else if (x < le || x >= re) {
            if (x === le - 1 || x === re) c = rim;
            else {
              const n = hash(x >> 1, wy >> 1);
              c = n < 0.18 ? rock2 : n > 0.86 ? rockD : rock;
              if (hash((x >> 1) + 91, wy >> 1) > 0.985) c = crystal;
            }
          } else {
            c = hash(x >> 1, (sy + parallax) >> 1) > 0.988 ? speck : row;
          }
          buf[base + x] = c;
        }
      }
      ctx.putImageData(img, 0, 0);

      // Moon
      const moonY = gS - Math.floor(H * 0.62);
      if (moonY > -20 && mode !== 'narrow') {
        const mx = Math.floor(W * (mode === 'narrow' ? 0.82 : 0.8));
        pixelCircle(mx, moonY, 14, 'rgba(255,240,200,0.05)');
        pixelCircle(mx, moonY, 11, 'rgba(255,240,200,0.07)');
        pixelCircle(mx, moonY, 8, '#f4ecc8');
        ctx.fillStyle = '#d8cda2';
        ctx.fillRect(mx - 3, moonY - 2, 2, 2); ctx.fillRect(mx + 2, moonY + 2, 3, 2); ctx.fillRect(mx + 1, moonY - 5, 1, 1);
      }

      // Headframe over the shaft
      if (wide && gS > -2 && gS < H + 30) {
        ctx.fillStyle = '#6b4a2e';
        ctx.fillRect(SX0 - 1, gS - 22, 2, 22); ctx.fillRect(SX1 - 1, gS - 22, 2, 22);
        ctx.fillRect(SX0 - 3, gS - 23, SX1 - SX0 + 6, 2);
        ctx.fillStyle = '#4e3520';
        ctx.fillRect(SX0 + 1, gS - 14, SX1 - SX0 - 2, 1);
        pixelCircle((SX0 + SX1) >> 1, gS - 26, 3, '#8a6239');
        pixelCircle((SX0 + SX1) >> 1, gS - 26, 1, '#2a1c10');
      }

      // Particles
      if (!reduced.matches) {
        for (const p of particles) {
          p.life += dt;
          p.y += p.vy * dt - dCam * 0.65;
          p.x += (p.vx + Math.sin(t + p.seed) * 0.8) * dt;
          if (p.life > p.max || p.y < -12 || p.y > H + 12) spawn(p, false);
        }
      }
      for (const p of particles) drawParticle(p, t, th.glow, gS);

      // The miner
      const pal = gold ? GOLD : PAL;
      if (wide) {
        const standY = gW - 15;
        // Stays put on screen while the ground scrolls away, drifting up to mid-screen.
        const y = Math.round(standY - clamp(camY * 0.4, 0, Math.max(0, standY - H * 0.5)));
        const onSurface = camY < 3;
        const lampY = y + 2;
        pixelCircle(14, lampY, 20, rgba([255, 214, 120], 0.035));
        pixelCircle(14, lampY, 12, rgba([255, 214, 120], 0.05));
        let spr;
        if (onSurface) spr = Math.sin(t * 0.9) > 0.97 ? SPRITES.blink : SPRITES.front;
        else spr = Math.floor(camY / 5) % 2 ? SPRITES.climbA : SPRITES.climbB;
        drawSprite(ctx, spr, 8, y, pal);
      } else if (gS > 0 && gS < H + 20) {
        const x = Math.floor(W * 0.12);
        const spr = Math.sin(t * 0.9) > 0.97 ? SPRITES.blink : SPRITES.front;
        drawSprite(ctx, spr, x, gS - 15, pal);
      }
    }

    function loop(now) {
      if (!running) return;
      render(now);
      if (reduced.matches) { running = false; return; }
      requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      requestAnimationFrame(loop);
    }
    function stop() { running = false; }

    resize();
    window.addEventListener('resize', resize);
    if (window.ResizeObserver) new ResizeObserver(measure).observe(document.body);
    window.addEventListener('load', measure);
    window.addEventListener('scroll', () => { if (reduced.matches) requestAnimationFrame(render); }, { passive: true });

    return {
      start, stop, measure,
      gold() { gold = !gold; particles.forEach((p) => spawn(p, true)); return gold; },
      isGold: () => gold,
    };
  }

  window.Scene = Scene;
})();
