/* Sprites as character grids. Each sprite gets a 1px dark outline added automatically. */
(function () {
  const PAL = {
    y: '#ffcc33', // helmet
    w: '#fff6d2', // lamp
    h: '#4a2f22', // hair
    s: '#f0c08f', // skin
    e: '#1a1020', // eyes
    b: '#4f5fe0', // hoodie
    d: '#3a47b0', // hoodie shade
    p: '#2b2f4f', // trousers
    k: '#17121f', // boots
    o: '#07060d', // outline
  };
  const GOLD = Object.assign({}, PAL, { b: '#e8a91c', d: '#b9800f', y: '#fff1a8' });

  const FRONT = [
    '...yyyy...',
    '..yywwyy..',
    '.yyyyyyyy.',
    '..hssssh..',
    '..sesses..',
    '..ssssss..',
    '...ssss...',
    '..bbbbbb..',
    '.bbbbbbbb.',
    '.sbbddbbs.',
    '..bbbbbb..',
    '..pp..pp..',
    '..pp..pp..',
    '.kkk..kkk.',
  ];
  const BLINK = FRONT.slice();
  BLINK[4] = '..ssssss..';

  const CLIMB = [
    's..yyyy...',
    'b.yyyyyy..',
    'byyyyyyyy.',
    'b.hhhhhh..',
    '.bhhhhhh..',
    '.bbhhhhbb.',
    '..bbbbbbbb',
    '..bbbbbbbs',
    '..bbbbbb..',
    '..bbbbbb..',
    '..pp..pp..',
    '..pp..pp..',
    '..kk..pp..',
    '......kk..',
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
