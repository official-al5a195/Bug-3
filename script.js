// script.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.right-panel');
  if (!container) {
    console.error('No .right-panel found. Make sure your index.html has <div class="right-panel">');
    return;
  }

  // Create canvas and append to right-panel
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.zIndex = '0'; // keep behind svg which has higher z-index
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // set actual pixel size for crispness
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));

    // set the CSS size (keeps layout correct)
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    // scale drawing operations to CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // Heart parametric function (classic heart curve)
  function buildHeartPath(scaleFactor) {
    const path = new Path2D();
    for (let t = 0; t <= Math.PI * 2 + 0.001; t += 0.01) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const px = x * scaleFactor;
      const py = y * scaleFactor;
      if (t === 0) path.moveTo(px, py);
      else path.lineTo(px, py);
    }
    path.closePath();
    return path;
  }

  // draw loop
  let last = performance.now();
  function draw(now) {
    const elapsed = (now - last) / 1000; // seconds
    last = now;

    // Clear
    ctx.clearRect(0, 0, container.clientWidth, container.clientHeight);

    // Center transform
    const cx = container.clientWidth / 2;
    const cy = container.clientHeight / 2 + 10;

    // scale depends on available size
    const baseSize = Math.min(container.clientWidth, container.clientHeight);
    // scaleFactor controls heart size
    const scaleFactor = baseSize / 40;

    // heartbeat: smoother with sin
    const t = performance.now() / 1000;
    const beat = 1 + 0.08 * Math.max(0, Math.sin(t * Math.PI * 2 * 1.2)); // ~1.2 beats/sec

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(beat, beat);

    // build path and fill
    const path = buildHeartPath(scaleFactor);

    // nice vertical gradient
    const g = ctx.createLinearGradient(-60 * scaleFactor, -120 * scaleFactor, 60 * scaleFactor, 120 * scaleFactor);
    g.addColorStop(0, '#ff9bbf');
    g.addColorStop(0.6, '#ff6f9a');
    g.addColorStop(1, '#ee5282');

    ctx.fillStyle = g;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 20;
    ctx.fill(path);

    // subtle glow
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#ff6f9a';
    ctx.fill(path);
    ctx.globalAlpha = 1;

    ctx.restore();

    requestAnimationFrame(draw);
  }

  // start loop
  requestAnimationFrame(draw);

  // Helpful debug hint
  console.log('Heart canvas initialized inside .right-panel — size:', container.clientWidth, 'x', container.clientHeight);
});
