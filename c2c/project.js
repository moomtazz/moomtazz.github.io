// Chat to Core: built for the PIDI Digdaya Hackathon 2026.
// The chat screens are stills rendered from HTML at 3x (c2c/images/ctc-*.webp) and the replies use the prototype's own wording.
// The ledger is drawn here with sample data, and the cover is an illustration drawn in canvas.
window.C2CProject = {
  work: { a: 'c2c', name: 'Chat to Core', cat: 'Multimodal AI, Fintech', yr: '2026', hex: '#00a884', award: 'Team entry, PIDI Digdaya Hackathon 2026',
    short: 'A WhatsApp assistant that turns a small shop\'s chats, voice notes and transfer receipts into bookkeeping.',
    p: 'A WhatsApp assistant for small businesses: it reads typed notes, voice notes and transfer receipts, records them in a ledger and sends a weekly report.',
    stats: [['3', 'message types it reads'], ['< 10 min', 'daily bookkeeping target']], tags: ['FastAPI', 'Groq', 'Whisper', 'SQLite'],
    pal: [[.004, .02, .015], [.05, .6, .35], [.6, .95, .75]], sc: .8 },

  case: {
    tones: [[1, 1, 'tint'], [2, 2, 'paper']],
    type: 'Multimodal AI, financial software', deliv: 'Working prototype, WhatsApp webhook, transaction ledger, weekly report',
    cover: { src: 'ctc-warung', f: 'bleed' }, slide: { src: 'ctc-warung', k: 'Small shops at dusk, drawn for this page' },
    intro: 'A small frozen food shop takes orders on WhatsApp and gets paid in cash or by transfer, so its records end up [[scattered across chats.]] Chat to Core is a WhatsApp assistant that turns those messages into [[a ledger and a weekly report.]]',
    aside: ['Our team built it for the PIDI Digdaya Hackathon 2026. The proposal describes the full product, and the prototype covers the core loop: read a message, record it, confirm it in the chat.',
      'Every name, amount and receipt on this page is sample data.'],
    blocks: [
      { t: 'vision', lab: 'The idea', h: 'Bookkeeping for small shops, through the WhatsApp chat they already use.', p: 'No new app to install. Owners keep chatting the way they do now, and the records are kept for them.' },
      { t: 'facts', lab: 'The problem', h: 'Most small businesses in Indonesia have no financial statements, so banks cannot assess them.', p: 'The proposal starts from three numbers.',
        cards: [['77.5%', 'of MSMEs have no financial statements', 'Cited by the Ministry of Finance (DJPb) in 2024. Without statements, a loan application stalls.'],
          ['90%', 'of businesses use chat apps at every step of a sale', 'From Meta and BCG, WhatsApp Business Summit 2024.'],
          ['15–30%', 'of revenue leaks when records are inconsistent', 'Reported for 67% of MSMEs by LPPI in 2022.']] },
      { t: 'ctcCards', lab: 'How it works', h: 'Type it, say it, or forward the receipt.', p: 'Each message is read, recorded and confirmed in the same chat, usually within a few seconds.',
        items: [['ctc-c-text', 'A typed note', 'Llama 3.1 8B on Groq reads the amount, whether it is income or an expense, and the category.'],
          ['ctc-c-voice', 'A voice note', 'Whisper large v3 turbo transcribes the Indonesian audio. The transcript then goes through the same step as a typed note.'],
          ['ctc-c-receipt', 'A transfer receipt', 'Llama 4 Scout reads the amount, sender and status. Only a successful transfer is recorded as income.']],
        note: 'Chat screens recreated with sample data. The replies use the exact wording from the prototype code.' },
      { t: 'ctcLedger', lab: 'The ledger', h: 'Every recorded message ends up in one table.', p: 'Income and expenses from all three kinds of message land in the same table with a category, the totals stay up to date, and the weekly report is built from it.',
        rows: [['Sen 08.12', 'receipt', 'Nugget dan sosis dari distributor', 'Stok', -320000], ['Sen 10.41', 'text', 'Nugget ayam 2 bungkus, tunai', 'Penjualan', 55000],
          ['Sen 13.05', 'voice', 'Es batu dan plastik kemasan', 'Bahan', -18000], ['Sel 09.30', 'receipt', 'Transfer Bu Rina, sosis dan nugget', 'Penjualan', 110000],
          ['Sel 16.22', 'text', 'Dimsum 3 pak, tunai', 'Penjualan', 75000], ['Rab 11.10', 'voice', 'Token listrik freezer', 'Operasional', -100000],
          ['Rab 15.48', 'receipt', 'Pesanan risol frozen, Pak Dodi', 'Penjualan', 150000], ['Kam 19.40', 'receipt', 'Pesanan arisan, transfer', 'Penjualan', 210000]] },
      { t: 'ctcPlans', lab: 'Business model', h: 'Free to start, paid once the shop grows.', p: 'The three plans from the proposal.',
        plans: [['Free', 'Rp0', 'Up to 100 transactions a month. The way most shops would start.'],
          ['Pro', 'Rp49.000 a month', 'Full financial reports and a monthly credit score based on real transactions.'],
          ['Business', 'Rp149.000 a month', 'Business advice from a RAG assistant, and several users on one shop.']],
        note: 'Target in the proposal: 10,000 Pro users by month 12, about Rp588 million in yearly recurring revenue.' }
    ],
    impact: { h: 'What the prototype does today, and what comes next.', p: 'Today the prototype reads typed notes, voice notes and receipts, keeps the ledger and builds the weekly report. The credit score, the RAG assistant and the checks for edited receipts are planned in the proposal.',
      rows: [['3', 'message types', 'Typed notes, Indonesian voice notes and transfer receipts.'], ['< 3 s', 'reply target', 'For the confirmation message, as set in the proposal.'],
        ['< 10 min', 'daily bookkeeping', 'Down from about 4 hours a day, the time saving the proposal aims for.'], ['10,000', 'Pro users by month 12', 'The proposal\'s target, about Rp588 million a year in recurring revenue.']] },
    tags: ['FastAPI', 'WhatsApp Cloud API', 'Groq', 'Llama 3.1 8B', 'Whisper', 'Llama 4 Scout', 'SQLite', 'ReportLab']
  },

  // Home and hero: three small shops at dusk, a warung, a frozen food stall and a food cart, under a string of lights.
  // Every sale drops a coin into the cash tin, and the tin ticks it off: the bookkeeping happens by itself.
  // On the home page the drawing stays in the free area: right of the project list, above the title, left of the text column.
  scene: function (W, H, o) {
    var Z;
    if (!o || !o.home) Z = { x0: W * .05, x1: W * .95, y0: H * .1, y1: H * .9 };
    else if (W < 760) {
      var ti = document.getElementById('title'), pl = document.getElementById('pills'), ra = ti && ti.getBoundingClientRect(), rb = pl && pl.getBoundingClientRect();
      var zy0 = ra && ra.height ? ra.bottom + 14 : H * .45, zy1 = rb && rb.height ? rb.top - 14 : H * .64; if (zy1 - zy0 < 90) { zy0 = H * .45; zy1 = H * .64; }
      Z = { x0: 16, x1: W - 16, y0: zy0, y1: zy1 };
    } else { var ts = Math.min(94, Math.max(54, W * .06)); Z = { x0: Math.max(230, W * .16), x1: W - Math.min(340, W * .26) - 72, y0: 78, y1: H * .89 - 2.05 * ts - 14 }; }
    var zw = Z.x1 - Z.x0, zh = Z.y1 - Z.y0, u = Math.min(zw / 110, zh / 45), cx = (Z.x0 + Z.x1) / 2, gy = Z.y1 - u * 2.5;
    var AX = cx - u * 36, BX = cx - u * 2, CX = cx + u * 38, TIN = [cx + u * 15.5, gy];
    var TEAL = '#00a884', CREAM = '#efe6cf', AMBER = '#f2b34c', RED = '#e0553f', BLUE = '#3d7cc9', BG = '#071713';
    var FONT = '"Hanken Grotesk", "Helvetica Neue", Arial, sans-serif';
    var SRC = [[AX + u * 8, gy - u * 17.5], [BX - u * 4, gy - u * 13.5], [CX - u * 5, gy - u * 21]];
    var coins = [], ticks = [], squash = 0, last = 0, nextAt = 1, who = 0;
    function ink(a) { return 'rgba(222,244,235,' + a + ')'; }
    function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
    function line(c, pts, a, w) { c.strokeStyle = ink(a); c.lineWidth = w || 1.4; c.beginPath(); pts.forEach(function (p, i) { i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.stroke(); }
    function box(c, x, y, w, h, fill, r) { rr(c, x, y, w, h, r || u * .3); if (fill) { c.fillStyle = fill; c.fill(); } c.strokeStyle = ink(.88); c.lineWidth = 1.4; c.stroke(); }
    function awning(c, x0, x1, y, h, n, a, b) {
      var w = (x1 - x0) / n;
      for (var i = 0; i < n; i++) { c.fillStyle = i % 2 ? b : a; c.beginPath(); c.moveTo(x0 + i * w, y); c.lineTo(x0 + (i + 1) * w, y); c.lineTo(x0 + (i + 1) * w, y + h); c.arc(x0 + (i + .5) * w, y + h, w / 2, 0, Math.PI); c.closePath(); c.fill(); }
      c.strokeStyle = ink(.9); c.lineWidth = 1.3; c.beginPath(); c.moveTo(x0, y + h); c.lineTo(x0, y); c.lineTo(x1, y); c.lineTo(x1, y + h);
      for (var j = n - 1; j >= 0; j--) c.arc(x0 + (j + .5) * w, y + h, w / 2, 0, Math.PI);
      c.stroke();
    }
    function sign(c, x, y, w, h, txt, size) {
      box(c, x - w / 2, y, w, h, BG, u * .5);
      c.fillStyle = ink(.92); c.font = '600 ' + (size * u).toFixed(1) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x, y + h / 2 + u * .1);
    }
    function snow(c, x, y, r) { c.strokeStyle = ink(.85); c.lineWidth = 1.2; c.beginPath(); for (var i = 0; i < 3; i++) { var a = i * Math.PI / 3; c.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.stroke(); }
    function coin(c, x, y, r) { c.fillStyle = AMBER; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); c.strokeStyle = 'rgba(90,55,0,.55)'; c.lineWidth = 1; c.beginPath(); c.arc(x, y, r * .62, 0, 6.283); c.stroke(); }
    function quad(a, b, k, lift) { var mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - lift, v = 1 - k; return [v * v * a[0] + 2 * v * k * mx + k * k * b[0], v * v * a[1] + 2 * v * k * my + k * k * b[1]]; }

    function warung(c, t) {
      var x0 = AX - u * 13, x1 = AX + u * 13;
      line(c, [[x0, gy], [x0, gy - u * 24]], .85); line(c, [[x1, gy], [x1, gy - u * 24]], .85);
      sign(c, AX, gy - u * 31.4, u * 18, u * 4.6, 'Warung', 2.5);
      awning(c, AX - u * 15, AX + u * 15, gy - u * 26.6, u * 3.4, 8, TEAL, CREAM);
      // sachet strips swaying under the awning
      [AX - u * 10.5, AX - u * 8].forEach(function (sx, k) {
        var sw = Math.sin(t * 1.6 + k * 1.3) * .07; c.save(); c.translate(sx, gy - u * 22.4); c.rotate(sw);
        for (var q = 0; q < 3; q++) box(c, -u * .9, q * u * 2.2, u * 1.8, u * 2, [AMBER, CREAM, RED][(q + k) % 3], u * .2);
        c.restore();
      });
      // the counter, three jars, and the cracker tin with its blue lid
      box(c, AX - u * 12, gy - u * 9, u * 24, u * 9, BG, u * .4); box(c, AX - u * 13, gy - u * 10.2, u * 26, u * 1.2, CREAM, u * .3);
      [-6, 0, 6].forEach(function (k) { line(c, [[AX + k * u, gy - u * 8.3], [AX + k * u, gy - u * .7]], .25, 1); });
      [[AX - u * 4.5, TEAL], [AX + u * .2, AMBER], [AX + u * 4.9, RED]].forEach(function (j) {
        box(c, j[0] - u * 1.9, gy - u * 15.4, u * 3.8, u * 5.2, BG, u * .8); box(c, j[0] - u * 2.1, gy - u * 16.4, u * 4.2, u * 1.1, j[1], u * .3);
        for (var q = 0; q < 3; q++) { c.fillStyle = [AMBER, CREAM, RED][(q + 1) % 3]; c.beginPath(); c.arc(j[0] - u * .9 + q * u * .9, gy - u * 11.6 - (q % 2) * u * .8, u * .45, 0, 6.283); c.fill(); }
      });
      var kx = AX + u * 9.5; box(c, kx - u * 2.4, gy - u * 16.8, u * 4.8, u * 6.6, BG, u * .4);
      c.fillStyle = BLUE; c.beginPath(); c.ellipse(kx, gy - u * 16.8, u * 2.5, u * .9, 0, 0, 6.283); c.fill(); c.strokeStyle = ink(.88); c.stroke();
      c.strokeStyle = ink(.7); c.lineWidth = 1.2; c.beginPath(); c.arc(kx, gy - u * 13.3, u * 1.5, 0, 6.283); c.stroke();
      c.strokeStyle = CREAM; c.beginPath(); for (var a = 0; a <= 6.3; a += .35) { var rr2 = u * (.8 + .15 * Math.sin(a * 6)); a ? c.lineTo(kx + Math.cos(a) * rr2, gy - u * 13.3 + Math.sin(a) * rr2) : c.moveTo(kx + rr2, gy - u * 13.3); } c.stroke();
    }
    function freezer(c, t) {
      var x0 = BX - u * 13, x1 = BX + u * 13;
      line(c, [[x0, gy], [x0, gy - u * 24]], .85); line(c, [[x1, gy], [x1, gy - u * 24]], .85);
      box(c, BX - u * 14.5, gy - u * 26.4, u * 29, u * 2.4, 'rgba(0,168,132,.35)', u * .3);
      box(c, BX - u * 10.5, gy - u * 32, u * 21, u * 4.6, BG, u * .5);
      snow(c, BX - u * 7.6, gy - u * 29.7, u * 1.2);
      c.fillStyle = ink(.92); c.font = '600 ' + (2.3 * u).toFixed(1) + 'px ' + FONT; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('Frozen food', BX - u * 5.4, gy - u * 29.6);
      // the chest freezer with packs behind its glass, and two boxes on the lid
      box(c, BX - u * 11, gy - u * 10, u * 22, u * 10, BG, u);
      line(c, [[BX - u * 11, gy - u * 8.2], [BX + u * 11, gy - u * 8.2]], .7);
      box(c, BX - u * 9, gy - u * 7, u * 18, u * 4.6, 'rgba(120,200,190,.08)', u * .6);
      [AMBER, CREAM, TEAL, RED, AMBER, TEAL].forEach(function (col, k) { rr(c, BX - u * 8.2 + k * u * 2.85, gy - u * 6.2, u * 2.3, u * 3.2, u * .3); c.fillStyle = col; c.globalAlpha = .85; c.fill(); c.globalAlpha = 1; });
      line(c, [[BX + u * 6, gy - u * 9.1], [BX + u * 9, gy - u * 9.1]], .9, 2);
      box(c, BX - u * 7, gy - u * 13.2, u * 6, u * 3.1, CREAM, u * .3); box(c, BX + u * .4, gy - u * 12.8, u * 5, u * 2.7, AMBER, u * .3);
      // two shelves of packs against the back wall, and a QRIS standee on the lid
      [[gy - u * 21, [AMBER, CREAM, RED, TEAL, CREAM, AMBER]], [gy - u * 16.6, [TEAL, AMBER, CREAM, RED]]].forEach(function (sh, r) {
        line(c, [[BX - u * 12, sh[0]], [BX + u * 12, sh[0]]], .55, 1.2);
        sh[1].forEach(function (col, k) { var w = u * (r ? 3.4 : 2.8), x = BX - u * 11 + k * (r ? u * 4.2 : u * 3.6); rr(c, x, sh[0] - u * 2.4, w, u * 2.4, u * .25); c.fillStyle = col; c.globalAlpha = .85; c.fill(); c.globalAlpha = 1; });
      });
      box(c, BX + u * 6.2, gy - u * 15.8, u * 3.4, u * 5.6, CREAM, u * .3);
      for (var qy = 0; qy < 4; qy++) for (var qx = 0; qx < 4; qx++) if ((qx === 0 && qy === 0) || (qx === 3 && qy === 0) || (qx === 0 && qy === 3) || (qx * 5 + qy * 7 + qx * qy) % 3 === 1) { c.fillStyle = '#10241f'; c.fillRect(BX + u * 6.75 + qx * u * .58, gy - u * 15.1 + qy * u * .58, u * .5, u * .5); }
      line(c, [[BX - u * 6, gy - u * 11.7], [BX - u * 2.2, gy - u * 11.7]], .5);
      // a little frost drifting off the lid
      for (var q = 0; q < 5; q++) { var ph = (t * .25 + q * .2) % 1; c.fillStyle = ink(.5 * (1 - ph)); c.beginPath(); c.arc(BX - u * 6 + q * u * 3 + Math.sin(t + q) * u * .6, gy - u * 10.5 - ph * u * 5, u * .25, 0, 6.283); c.fill(); }
    }
    function cart(c, t) {
      // canopy on two thin poles
      line(c, [[CX - u * 11, gy - u * 12.4], [CX - u * 11, gy - u * 25]], .7, 1.2); line(c, [[CX + u * 11, gy - u * 12.4], [CX + u * 11, gy - u * 25]], .7, 1.2);
      awning(c, CX - u * 13.5, CX + u * 13.5, gy - u * 27.6, u * 2.6, 9, AMBER, CREAM);
      // glass case with meatballs and noodles, the pot with steam
      box(c, CX - u * 11, gy - u * 20.6, u * 12, u * 8.2, 'rgba(120,200,190,.06)', u * .4);
      line(c, [[CX - u * 9.5, gy - u * 19.4], [CX - u * 7.5, gy - u * 14]], .35, 1);
      for (var q = 0; q < 4; q++) { c.fillStyle = CREAM; c.beginPath(); c.arc(CX - u * 8.2 + q * u * 1.9, gy - u * 13.6, u * .75, 0, 6.283); c.fill(); }
      [0, 1].forEach(function (k) { c.strokeStyle = ink(.85); c.lineWidth = 1.3; c.beginPath(); c.ellipse(CX - u * 4.6, gy - u * 16.8 - k * u * 1.3, u * 2.2, u * .9, 0, 0, Math.PI); c.stroke(); line(c, [[CX - u * 6.8, gy - u * 16.8 - k * u * 1.3], [CX - u * 2.4, gy - u * 16.8 - k * u * 1.3]], .85, 1.3); });
      box(c, CX + u * 3.2, gy - u * 17.8, u * 6.6, u * 5.4, BG, u);
      c.strokeStyle = ink(.88); c.lineWidth = 1.4; c.beginPath(); c.ellipse(CX + u * 6.5, gy - u * 17.8, u * 3.5, u * .9, 0, Math.PI, 0); c.stroke();
      for (var s = 0; s < 3; s++) {
        var sx = CX + u * 5 + s * u * 1.6, ph = (t * .45 + s * .33) % 1; c.strokeStyle = ink(.6 * (1 - ph)); c.lineWidth = 1.3; c.beginPath();
        for (var k = 0; k <= 10; k++) { var yy = gy - u * 19 - k * u * .7 - ph * u * 2, xx = sx + Math.sin(k * .8 + t * 2 + s) * u * .5; k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
        c.stroke();
      }
      // the cart body, its handle and wheels
      box(c, CX - u * 12, gy - u * 12.4, u * 24, u * 6.6, BG, u * .8);
      rr(c, CX - u * 12, gy - u * 9.9, u * 24, u * 1.3, 0); c.fillStyle = TEAL; c.fill();
      line(c, [[CX - u * 12, gy - u * 11], [CX - u * 16.5, gy - u * 13.6]], .85);
      [CX - u * 7, CX + u * 6.5].forEach(function (wx) {
        c.strokeStyle = ink(.88); c.lineWidth = 1.4; c.beginPath(); c.arc(wx, gy - u * 3.1, u * 3.1, 0, 6.283); c.stroke();
        c.beginPath(); for (var q = 0; q < 4; q++) { var a = q * Math.PI / 4; c.moveTo(wx - Math.cos(a) * u * 2.6, gy - u * 3.1 - Math.sin(a) * u * 2.6); c.lineTo(wx + Math.cos(a) * u * 2.6, gy - u * 3.1 + Math.sin(a) * u * 2.6); } c.lineWidth = 1; c.stroke();
      });
    }
    function tin(c, t) {
      var sq = 1 - .14 * squash, sx = 1 + .1 * squash, x = TIN[0], w = u * 8.4 * sx, h = u * 8.2 * sq, top = gy - h;
      rr(c, x - w / 2, top, w, h, u * 1.1); c.fillStyle = '#0d3b32'; c.fill(); c.strokeStyle = ink(.92); c.lineWidth = 1.5; c.stroke();
      rr(c, x - w / 2 - u * .4, top - u * 1.2, w + u * .8, u * 1.6, u * .5); c.fillStyle = TEAL; c.fill(); c.stroke();
      line(c, [[x - u * 1.6, top - u * .4], [x + u * 1.6, top - u * .4]], .9, 2);
      var ey = top + h * .45; c.strokeStyle = ink(.95); c.lineWidth = 1.6; c.lineCap = 'round';
      c.beginPath(); c.arc(x - u * 1.7, ey, u * .75, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
      c.beginPath(); c.arc(x + u * 1.7, ey, u * .75, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
      c.beginPath(); c.arc(x, ey + u * 1.1, u * 1.2, Math.PI * .2, Math.PI * .8); c.stroke();
      c.fillStyle = 'rgba(255,150,150,.32)'; c.beginPath(); c.arc(x - u * 2.7, ey + u * 1.3, u * .65, 0, 6.283); c.arc(x + u * 2.7, ey + u * 1.3, u * .65, 0, 6.283); c.fill();
    }

    return function (c, t) {
      var dt = Math.max(0, Math.min(.05, t - last)); last = t;
      var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#04100d'); g.addColorStop(1, '#0a201a'); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.lineCap = 'round'; c.lineJoin = 'round';
      // pavement
      line(c, [[Z.x0 - u * 2, gy], [Z.x1 + u * 2, gy]], .5, 1.3);
      c.strokeStyle = ink(.12); c.lineWidth = 1; c.beginPath(); for (var d = Z.x0; d < Z.x1; d += u * 6) { c.moveTo(d, gy + u * 2.2); c.lineTo(d + u * 3, gy + u * 2.2); } c.stroke();
      // a string of lights sagging between two poles
      var L0 = cx - u * 53, L1 = cx + u * 53, LY = gy - u * 40, SAG = u * 4;
      line(c, [[L0, gy], [L0, LY - u]], .6, 1.3); line(c, [[L1, gy], [L1, LY - u]], .6, 1.3);
      c.strokeStyle = ink(.45); c.lineWidth = 1.1; c.beginPath(); for (var s = 0; s <= 1.0001; s += .02) { var lx = L0 + (L1 - L0) * s, ly = LY + Math.sin(s * Math.PI) * SAG; s ? c.lineTo(lx, ly) : c.moveTo(lx, ly); } c.stroke();
      for (var b = 1; b < 18; b++) { var bs = b / 18, bx = L0 + (L1 - L0) * bs, by = LY + Math.sin(bs * Math.PI) * SAG, fl = .55 + .45 * Math.pow(Math.sin(t * 1.7 + b * 1.9), 2); c.fillStyle = 'rgba(242,190,96,' + fl + ')'; c.beginPath(); c.arc(bx, by + u * 1.1, u * .55, 0, 6.283); c.fill(); line(c, [[bx, by], [bx, by + u * .5]], .5, 1); }
      warung(c, t); freezer(c, t); cart(c, t);
      // sales: a coin flies from one of the shops into the tin
      if (t >= nextAt) { coins.push({ a: SRC[who % 3], t0: t }); who += 1 + (Math.random() < .3 ? 1 : 0); nextAt = t + 1.5 + Math.random() * .9; }
      if (coins.length > 8) coins = [];
      squash = Math.max(0, squash - dt * 4);
      tin(c, t);
      var mouth = [TIN[0], gy - u * 9.4];
      coins = coins.filter(function (k) {
        var p = (t - k.t0) / .95; if (p >= 1) { squash = 1; ticks.push(t); return false; }
        var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, q = quad(k.a, mouth, e, u * 9); coin(c, q[0], q[1], u * 1.15); return true;
      });
      ticks = ticks.filter(function (t0) {
        var p = (t - t0) / 1.1; if (p >= 1) return false;
        var x = TIN[0], y = gy - u * 13.5 - p * u * 3; c.strokeStyle = 'rgba(63,214,170,' + (1 - p) + ')'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(x - u * 1.3, y); c.lineTo(x - u * .3, y + u * 1); c.lineTo(x + u * 1.6, y - u * 1.4); c.stroke(); return true;
      });
    };
  },

  install: function (api) {
    ['c-text', 'c-voice', 'c-receipt', 'warung'].forEach(function (k) { api.IMGS['ctc-' + k] = 'c2c/images/ctc-' + k + '.webp'; });
    function rp(n) { return 'Rp' + Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    var ICON = { text: 'M8 9h8M8 13h6M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3h-2a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z',
      voice: 'M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5 10a7 7 0 0 0 14 0M8 21h8M12 17v4',
      receipt: 'M5 21v-16a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2M9 8h6M9 12h6M9 16h4' };
    var NAME = { text: 'Pesan', voice: 'Voice note', receipt: 'Bukti transfer' };
    // three WhatsApp screens in a row, each with a short note on how that message is read
    api.BLK.ctcCards = function (b) {
      return '<section class="blk">' + api.secHead(b) + '<div class="g"><div class="ctc-cards rv">' + b.items.map(function (it, i) {
        return '<figure style="--i:' + i + '"><img src="' + api.IMGS[it[0]] + '" alt="' + api.esc(it[1]) + ' in a WhatsApp chat with Chat to Core" loading="lazy" decoding="async"><figcaption><b>' + api.esc(it[1]) + '</b><span>' + api.esc(it[2]) + '</span></figcaption></figure>';
      }).join('') + '</div><p class="ctc-note rv">' + api.esc(b.note) + '</p></div></section>';
    };
    // the ledger fills in row by row when it comes into view, then the totals appear
    api.BLK.ctcLedger = function (b) {
      var inc = 0, out = 0;
      var rows = b.rows.map(function (r, i) {
        if (r[4] > 0) inc += r[4]; else out -= r[4];
        return '<div class="lg-r" style="--i:' + i + '"><span class="lg-t">' + api.esc(r[0]) + '</span><span class="lg-s"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[r[1]] + '"/></svg><em>' + NAME[r[1]] + '</em></span><span class="lg-d">' + api.esc(r[2]) + '</span><span class="lg-c">' + api.esc(r[3]) + '</span><b class="' + (r[4] > 0 ? 'in' : 'out') + '">' + (r[4] > 0 ? '+' : '−') + rp(r[4]) + '</b></div>';
      }).join('');
      var tot = '<div class="lg-tot" style="--i:' + b.rows.length + '"><span>Pemasukan <b class="in">' + rp(inc) + '</b></span><span>Pengeluaran <b class="out">' + rp(out) + '</b></span><span>Saldo <b>' + rp(inc - out) + '</b></span></div>';
      return '<section class="blk">' + api.secHead(b) + '<div class="g"><div class="ctc-ledger rv"><div class="lg-h"><span>Waktu</span><span>Dari</span><span>Keterangan</span><span>Kategori</span><span>Jumlah</span></div>' + rows + tot + '</div></div></section>';
    };
    api.BLK.ctcPlans = function (b) {
      return '<section class="blk">' + api.secHead(b) + '<div class="g"><div class="ctc-plans rv">' + b.plans.map(function (p, i) {
        return '<div style="--i:' + i + '"><span class="pl-n">' + api.esc(p[0]) + '</span><b>' + api.esc(p[1]) + '</b><p>' + api.esc(p[2]) + '</p></div>';
      }).join('') + '</div><p class="ctc-note rv">' + api.esc(b.note) + '</p></div></section>';
    };
  }
};
