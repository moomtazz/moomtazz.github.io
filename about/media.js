(function () {
  'use strict';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rails = Array.from(document.querySelectorAll('.rail'), rail => ({ rail, view: rail.querySelector('.rail-view'), clip: rail.querySelector('.rail-clip'), track: rail.querySelector('.rail-track'), travel: 0 }));
  let frame = 0, paused = false;

  // Each rail's height covers exactly its sideways distance, so one wheel notch moves the row one wheel notch.
  function measure() {
    if (still) return;
    for (const r of rails) {
      r.rail.classList.add('pinned');
      r.rail.style.height = '';
      r.travel = Math.max(0, r.track.scrollWidth - r.clip.clientWidth);
      r.rail.style.height = r.view.offsetHeight + r.travel + 'px';
    }
    move();
  }
  function move() {
    frame = 0;
    if (still) return;
    for (const r of rails) {
      const p = Math.max(0, Math.min(r.travel, -r.rail.getBoundingClientRect().top));
      r.track.style.transform = 'translate3d(' + -p + 'px,0,0)';
    }
  }
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(move); }, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('load', measure);
  rails.forEach(r => new ResizeObserver(measure).observe(r.track));
  measure();

  // Keyboard users tabbing along a row get carried to the clip they reach.
  for (const r of rails) {
    r.track.querySelectorAll('.clip').forEach(link => link.addEventListener('focus', () => {
      if (still) return;
      r.clip.scrollLeft = 0;
      scrollTo(0, r.rail.offsetTop + Math.min(r.travel, Math.max(0, link.offsetLeft - parseFloat(getComputedStyle(r.track).paddingLeft))));
    }));
  }

  // Opening wall: four rows of small pictures. Each row holds its list twice, so the -50% loop has no seam.
  const wall = document.querySelector('.wall');
  if (wall) {
    const ids = wall.dataset.tiles.split(' ');
    for (let r = 0; r < 4; r++) {
      let list = ids.filter((_, i) => i % 4 === r);
      while (list.length < 12) list = list.concat(list);
      const tiles = list.map(id => '<img src="media/t-' + id + '.webp" alt="" width="480" height="270">').join('');
      wall.insertAdjacentHTML('beforeend', '<div class="wall-row"><div class="wall-track">' + tiles + tiles + '</div></div>');
    }
  }

  document.querySelectorAll('.wall img, .clip img').forEach(i => {
    const ok = () => i.classList.add('ok');
    if (i.complete && i.naturalWidth) ok(); else { i.addEventListener('load', ok); i.addEventListener('error', ok); }
  });

  // Row clips only run while they are near the screen. The last moment is skipped so the name bar never slides out.
  const clips = Array.from(document.querySelectorAll('.clip video'));
  clips.forEach(v => {
    v.addEventListener('timeupdate', () => { if (isFinite(v.duration) && v.currentTime > v.duration - .7) v.currentTime = 0; });
  });
  if (still || !('IntersectionObserver' in window)) clips.forEach(v => { v.preload = 'metadata'; });
  else {
    const near = new IntersectionObserver(entries => entries.forEach(e => {
      const v = e.target;
      v.dataset.near = e.isIntersecting ? '1' : '';
      if (e.isIntersecting && !paused) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
    }), { rootMargin: '0px 25% 0px 25%' });
    clips.forEach(v => near.observe(v));
  }

  // The pause button stops the row clips as well as the background.
  const toggle = document.querySelector('.motion-toggle');
  if (toggle) toggle.addEventListener('click', () => {
    paused = toggle.getAttribute('aria-pressed') === 'true';
    for (const v of clips) { if (paused) v.pause(); else if (v.dataset.near) v.play().catch(() => {}); }
  });

  // Sections arrive as they enter the screen.
  const items = document.querySelectorAll('[data-in]');
  if (still || !('IntersectionObserver' in window)) items.forEach(el => el.classList.add('in'));
  else {
    const seen = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); seen.unobserve(e.target); } }), { threshold: .12 });
    items.forEach(el => seen.observe(el));
  }

  // Live list: the poster follows the row you point at.
  const posters = document.querySelectorAll('.posters img');
  function show(name) { posters.forEach(img => img.classList.toggle('on', img.dataset.p === name)); }
  document.querySelectorAll('.live-list a').forEach(a => {
    a.addEventListener('pointerenter', () => show(a.dataset.poster));
    a.addEventListener('focus', () => show(a.dataset.poster));
  });
})();
