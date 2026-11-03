(function () {
  'use strict';
  const pref = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  const journey = document.querySelector('.about-journey');
  const stage = document.querySelector('.stage');
  const intro = document.querySelector('.intro');
  const doorsBox = document.querySelector('.doors');
  const pathsEnd = document.getElementById('paths');
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const smooth = x => x * x * (3 - 2 * x);

  // Coming back from a portfolio lands straight on the choice, without replaying the scroll.
  if (location.hash === '#paths') {
    const root = document.documentElement;
    root.style.scrollBehavior = 'auto';
    addEventListener('load', () => setTimeout(() => { root.style.scrollBehavior = ''; }, 300));
  }
  if (journey) document.body.classList.add('scroll-ready');

  // One timeline for the whole stage. `out` dissolves the About while the two sides arrive.
  const ranges = { head: [.44, .66], door: [.46, .78] };
  const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
  let scrollFrame = 0, doorsOn = false;
  function reveal() {
    scrollFrame = 0;
    if (!journey) return;
    const travel = journey.offsetHeight - innerHeight;
    if (getComputedStyle(stage).position !== 'sticky' || travel <= 0) {
      for (const el of reveals) el.style.setProperty('--reveal', '1');
      doorsOn = true;
      return;
    }
    const p = clamp01(-journey.getBoundingClientRect().top / travel), out = smooth(clamp01((p - .1) / .36));
    stage.style.setProperty('--p', String(p));
    stage.style.setProperty('--out', String(out));
    for (const el of reveals) {
      const range = ranges[el.dataset.reveal];
      el.style.setProperty('--reveal', String(smooth(clamp01((p - range[0]) / (range[1] - range[0])))));
    }
    intro.classList.toggle('gone', out >= 1);
    doorsBox.classList.toggle('live', p > .62);
    doorsOn = p > .3;
  }
  function queueReveal() { if (!scrollFrame) scrollFrame = requestAnimationFrame(reveal); }
  window.addEventListener('scroll', queueReveal, { passive: true });
  window.addEventListener('resize', queueReveal, { passive: true });
  window.addEventListener('pageshow', queueReveal);
  let paused = false, raf = 0, stamp = 0, time = 0;
  reveal();
  const bg = document.getElementById('ambient-canvas');
  let gl = null, program, resolution, clock;
  try { gl = bg.getContext('webgl', {alpha: false, antialias: false, powerPreference: 'low-power'}); } catch (_) {}
  if (gl) {
    const vertex = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
    const fragment = `precision mediump float;
      uniform vec2 resolution; uniform float time;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(4.7,1.2);a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/resolution;
        vec2 p=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);
        float t=time*.22;
        vec2 q=vec2(fbm(p*1.4+vec2(t*.7,-t*.3)),fbm(p*1.4+vec2(-t*.4,t*.6)+3.));
        float f=fbm(p*1.6+q*3.+vec2(t*.5,-t*.3));
        float flow=p.y*.9+p.x*.38+f*1.8+sin(p.x*.8+t)*.25;
        float fold=pow(.5+.5*sin(flow*7.-t*1.8),9.);
        float edge=pow(.5+.5*sin(flow*7.-t*1.8+.35),28.);
        float haze=fbm(p+q+t*.12);
        vec3 color=vec3(.025,.035,.09);
        color+=vec3(.10,.11,.26)*haze;
        color+=mix(vec3(.10,.18,.45),vec3(.31,.24,.56),uv.x)*fold*.8;
        color+=vec3(.27,.34,.60)*edge*.55;
        color*=.8+.2*(1.-length(uv-.5));
        gl_FragColor=vec4(color,1.);
      }`;
    function compile(type, source) {
      const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); throw Error('Shader unavailable'); }
      return shader;
    }
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error('Shader unavailable');
      gl.useProgram(program); const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      const a = gl.getAttribLocation(program, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      resolution = gl.getUniformLocation(program, 'resolution'); clock = gl.getUniformLocation(program, 'time');
      document.querySelector('.ambient').classList.add('has-webgl');
      bg.addEventListener('webglcontextlost', function (event) { event.preventDefault(); gl = null; bg.style.display = 'none'; document.querySelector('.ambient').classList.remove('has-webgl'); });
    } catch (_) { gl = null; bg.style.display = 'none'; }
  }

  // Two drawn forms, the same size and the same amount of movement. Whichever side is pointed at grows and quickens, and the other settles back.
  const TAU = Math.PI * 2;
  const arts = Array.from(document.querySelectorAll('.sculpture'), canvas => ({ canvas, ctx: canvas.getContext('2d'), type: canvas.dataset.art, door: canvas.closest('.door'), width: 0, height: 0, t: 0, boost: 0, aim: 0 }));
  function aim(active) { for (const art of arts) art.aim = active ? (art === active ? 1 : -.4) : 0; }
  for (const art of arts) {
    art.door.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') aim(art); });
    art.door.addEventListener('pointerleave', () => aim(null));
    art.door.addEventListener('focus', () => { aim(art); pathsEnd.scrollIntoView(); });
    art.door.addEventListener('blur', () => aim(null));
  }
  function engineer(ctx, w, h, t, k) {
    const size = Math.min(w * .29, h * .26) * k, turn = t * .32, cy = Math.cos(turn), sy = Math.sin(turn);
    const tilt = .62 + .1 * Math.sin(t * .5), ct = Math.cos(tilt), st = Math.sin(tilt);
    const bins = [[], [], [], [], [], []];
    for (let strand = 0; strand < 30; strand++) {
      const v = strand / 30 * TAU;
      for (let j = 0; j < 150; j++) {
        const u = j / 150 * TAU, lobes = 1 + .1 * Math.sin(u * 3 + t * .85), r = (1 + .35 * Math.cos(v + u * 3 + t * .3)) * lobes;
        const x = r * Math.cos(u), z = r * Math.sin(u), y = .35 * Math.sin(v + u * 3 + t * .3);
        const xx = x * cy + z * sy, zz = -x * sy + z * cy, yy = y * ct - zz * st, depth = y * st + zz * ct;
        const persp = 3.8 / (3.8 + depth);
        bins[Math.min(5, Math.max(0, Math.floor((depth + 1.5) / .5)))].push(w / 2 + xx * size * persp, h / 2 + yy * size * persp, persp);
      }
    }
    bins.forEach((bin, i) => {
      ctx.fillStyle = 'rgba(190,198,255,' + (.74 - i * .11) + ')';
      ctx.beginPath();
      for (let n = 0; n < bin.length; n += 3) { const r = Math.max(.5, 1.02 * bin[n + 2]); ctx.moveTo(bin[n] + r, bin[n + 1]); ctx.arc(bin[n], bin[n + 1], r, 0, TAU); }
      ctx.fill();
    });
  }
  function storyteller(ctx, w, h, t, k) {
    const size = Math.min(w * .29, h * .26) * k, cx = w / 2, cy = h / 2;
    ctx.globalCompositeOperation = 'lighter';
    for (let line = 0; line < 54; line++) {
      const layer = line / 53;
      ctx.beginPath();
      for (let j = 0; j <= 160; j++) {
        const u = j / 160, env = Math.sin(u * Math.PI);
        const y = Math.sin(u * Math.PI * 2.2 - t * .9 + layer * 2.7) * env * .66 + Math.cos(u * Math.PI * 3 + t * .45) * env * .16 + (layer - .5) * .7 * env;
        const px = cx + (u - .5) * 2.9 * size, py = cy + y * size;
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      const grad = ctx.createLinearGradient(cx - size * 1.45, cy, cx + size * 1.45, cy);
      grad.addColorStop(0, '#a6bfff00'); grad.addColorStop(.25, 'rgba(157,179,255,' + (.13 + layer * .27) + ')'); grad.addColorStop(.6, 'rgba(206,178,255,' + (.22 + layer * .3) + ')'); grad.addColorStop(1, '#ceb2ff00');
      ctx.strokeStyle = grad; ctx.lineWidth = line % 9 === 0 ? 1.7 : .8; ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function resize() {
    if (gl) { const d = Math.min(devicePixelRatio || 1, 1); bg.width = Math.round(innerWidth * d); bg.height = Math.round(innerHeight * d); gl.viewport(0, 0, bg.width, bg.height); }
    for (const art of arts) {
      const d = Math.min(devicePixelRatio || 1, 2);
      art.width = art.canvas.clientWidth; art.height = art.canvas.clientHeight;
      art.canvas.width = Math.round(art.width * d); art.canvas.height = Math.round(art.height * d);
      if (art.ctx) art.ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    render();
  }
  function render() {
    if (gl) { gl.uniform2f(resolution, bg.width, bg.height); gl.uniform1f(clock, time); gl.drawArrays(gl.TRIANGLES, 0, 6); }
    if (!doorsOn) return;
    for (const art of arts) {
      if (!art.ctx) continue;
      art.ctx.clearRect(0, 0, art.width, art.height);
      (art.type === 'engineer' ? engineer : storyteller)(art.ctx, art.width, art.height, art.t, 1 + art.boost * .12);
    }
  }
  function frame(now) {
    if (now - stamp >= 1000 / 30) {
      const dt = Math.min((now - stamp) / 1000, .06);
      time += dt; stamp = now;
      for (const art of arts) { art.boost += (art.aim - art.boost) * .14; art.t += dt * (1 + Math.max(art.boost, 0) * 1.4); }
      render();
    }
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(raf); stamp = performance.now();
    document.body.classList.toggle('motion-paused', paused || pref.matches);
    if (!paused && !pref.matches && !document.hidden) raf = requestAnimationFrame(frame); else render();
  }
  toggle.addEventListener('click', function () { paused = !paused; toggle.setAttribute('aria-pressed', String(paused)); toggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation'); toggle.title = paused ? 'Play animation' : 'Pause animation'; toggle.textContent = paused ? '\u25B7' : '\u2161'; sync(); });
  pref.addEventListener('change', sync); document.addEventListener('visibilitychange', sync);
  window.addEventListener('scroll', function () { if (paused || pref.matches) render(); }, { passive: true });
  const choices = document.querySelector('.choices');
  if (choices) new ResizeObserver(resize).observe(choices);
  window.addEventListener('resize', resize, { passive: true });
  resize(); sync();
})();
