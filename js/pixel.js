/* Sprites as character grids. Each sprite gets a 1px dark outline added automatically. */
(function () {
  // Drawn after Simon: dark brown swept-up hair, blue-grey eyes, stubble,
  // navy blazer over a burgundy shirt with a striped tie.
  const PAL = {
    h: '#3a281d', // hair
    H: '#5c4130', // hair highlight
    s: '#f2c9ad', // skin
    S: '#dba98d', // skin shade (nose)
    e: '#3b5878', // eyes
    m: '#c98a86', // lips
    b: '#9a7560', // stubble
    n: '#24305a', // navy blazer
    r: '#8e2238', // burgundy shirt
    t: '#c63a52', // tie stripe
    T: '#2a0f18', // tie stripe, dark
    p: '#1b1b22', // trousers
    k: '#0f0f14', // shoes
    o: '#07060d', // outline
  };
  const GOLD = Object.assign({}, PAL, { n: '#d99a12', r: '#fff1a8', t: '#fff6d2', T: '#b9800f' });

  const FRONT = [
    '...hHhh...',
    '..hhhHhhh.',
    '.hhhhhhhh.',
    '.hssssssh.',
    '.ssessess.',
    '..sssSss..',
    '..bsmmsb..',
    '...bbbb...',
    '.nnrTTrnn.',
    'nnnrtTrnnn',
    'nnnrTtrnnn',
    'nnnntTnnnn',
    'nnnnTtnnnn',
    's.nnnnnn.s',
    '..pp..pp..',
    '..pp..pp..',
    '.kkk..kkk.',
  ];
  const BLINK = FRONT.slice();
  BLINK[4] = '.ssssssss.';

  // Seen from behind with the same head, torso and height as the front view. One hand grips the rail
  // beside his ear, the other hangs at hip height; columns 1 and 10 line up with the ladder rails.
  const CLIMB = [
    '....hHhh....',
    '...hhhHhhh..',
    '..hhhhhhhh..',
    '..hhhhhhhh..',
    '.shhhhhhhh..',
    '.nshhhhhhs..',
    '.n.hhhhhh...',
    '.n..ssss....',
    '.nnnnnnnnn..',
    '..nnnnnnnnn.',
    '..nnnnnnnnn.',
    '..nnnnnnnnn.',
    '..nnnnnnnnn.',
    '...nnnnnn.s.',
    '...pp..pp...',
    '...kk..pp...',
    '.......kkk..',
  ];

  function prep(rows) {
    const w = rows[0].length + 2;
    const h = rows.length + 2;
    const g = [];
    for (let y = 0; y < h; y++) {
      const row = [];
      for (let x = 0; x < w; x++) {
        const ch = rows[y - 1] && rows[y - 1][x - 1];
        row.push(ch && ch !== '.' ? ch : null);
      }
      g.push(row);
    }
    const px = g.map((row, y) =>
      row.map((c, x) => {
        if (c) return c;
        const n = (yy, xx) => g[yy] && g[yy][xx];
        return n(y - 1, x) || n(y + 1, x) || n(y, x - 1) || n(y, x + 1) ? 'o' : null;
      })
    );
    return { w, h, px };
  }

  function flip(s) {
    return { w: s.w, h: s.h, px: s.px.map((r) => r.slice().reverse()) };
  }

  const SPRITES = {
    front: prep(FRONT),
    blink: prep(BLINK),
    climbA: prep(CLIMB),
  };
  SPRITES.climbB = flip(SPRITES.climbA);

  function drawSprite(ctx, spr, x, y, pal) {
    pal = pal || PAL;
    for (let r = 0; r < spr.h; r++) {
      const row = spr.px[r];
      for (let c = 0; c < spr.w; c++) {
        const ch = row[c];
        if (!ch) continue;
        ctx.fillStyle = pal[ch];
        ctx.fillRect(x + c, y + r, 1, 1);
      }
    }
  }

  // Small glyphs for particles.
  const GLYPHS = {
    spark: [['.1.', '111', '.1.'], ['1.1', '.1.', '1.1']],
    bit: [['111', '1.1', '1.1', '1.1', '111'], ['.1.', '11.', '.1.', '.1.', '111']],
    note: [['..11', '..1.', '..1.', '111.', '11..']],
  };

  function drawGlyph(ctx, rows, x, y) {
    for (let r = 0; r < rows.length; r++)
      for (let c = 0; c < rows[r].length; c++)
        if (rows[r][c] === '1') ctx.fillRect(x + c, y + r, 1, 1);
  }

  window.Pixel = { PAL, GOLD, SPRITES, drawSprite, GLYPHS, drawGlyph };
})();
