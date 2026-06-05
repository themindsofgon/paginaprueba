if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) {

const cursor = document.getElementById('cursor');
const MAX_CLOUDS = 22;
const clouds = [];
let trail = [];
let lastX = 0, lastY = 0;
let velX = 0, velY = 0;
let smoothAngle = 0;

for (let i = 0; i < MAX_CLOUDS; i++) {
  const d = document.createElement('div');
  d.className = 'cloud';
  document.body.appendChild(d);
  clouds.push(d);
}

// Hide default cursor on all interactive elements
const styleTag = document.createElement('style');
styleTag.textContent = 'a, button, input, select, textarea, label, [role="button"], [onclick] { cursor: none !important; }';
document.head.appendChild(styleTag);

let isHovering = false;
let hoverScale = 1;
let glowAmount = 0;

const clickables = 'a, button, input, select, textarea, label, [role="button"], [onclick]';

document.addEventListener('mouseover', e => {
  isHovering = !!e.target.closest(clickables);
});

document.addEventListener('mousemove', e => {
  velX = e.clientX - lastX;
  velY = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;

  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';

  trail.push({ x: e.clientX, y: e.clientY, t: performance.now() });
  if (trail.length > MAX_CLOUDS * 3) trail = trail.slice(-MAX_CLOUDS * 3);
});

function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return a + diff * t;
}

function animate(now) {
  const speed = Math.sqrt(velX * velX + velY * velY);
  const targetAngle = speed > 1 ? Math.atan2(velY, velX) * (180 / Math.PI) : smoothAngle;
  smoothAngle = lerpAngle(smoothAngle, targetAngle, 0.12);

  const t = now * 0.0018;

  const targetScale = isHovering ? 1.05 : 1;
  hoverScale += (targetScale - hoverScale) * 0.12;

  const targetGlow = isHovering ? 1 : 0;
  glowAmount += (targetGlow - glowAmount) * 0.1;

  const baseSize = 36;
  const breathSize = baseSize * hoverScale + Math.sin(t * 1.3) * 1.5;
  cursor.style.width  = breathSize + 'px';
  cursor.style.height = breathSize + 'px';
  cursor.style.transform = `translate(-50%, -50%)`;

  const glowPulse = isHovering ? 1 + Math.sin(now * 0.006) * 0.4 : 1;
  const intensity = isHovering ? glowAmount : 0.7;
  const g1 = Math.round(6  * glowPulse * intensity);
  const g2 = Math.round(14 * glowPulse * intensity);
  const g3 = Math.round(28 * glowPulse * intensity);
  cursor.style.boxShadow = `
    0 0 ${g1}px  2px rgba(255,200,0,${0.7 * glowPulse}),
    0 0 ${g2}px  4px rgba(255,160,0,${0.4 * glowPulse}),
    0 0 ${g3}px  6px rgba(255,120,0,${0.2 * glowPulse}),
    inset 0 0 8px 2px rgba(255,220,80,0.15)
  `;

  cursor.style.filter = '';
  velX *= 0.75;
  velY *= 0.75;

  const recent = trail.filter(p => now - p.t < 700);

  clouds.forEach((cloud, i) => {
    const idx = recent.length - 1 - i * 2;
    if (idx >= 0) {
      const p = recent[idx];
      const age = (now - p.t) / 700;
      const scale = Math.max(0.1, (1 - age) * 0.65);
      const alpha = Math.max(0, 0.8 - age * 1.1);

      const w = 26 * scale;
      const h = 18 * scale;

      cloud.style.left      = (p.x - w / 2) + 'px';
      cloud.style.top       = (p.y - h / 2) + 'px';
      cloud.style.width     = w + 'px';
      cloud.style.height    = h + 'px';
      cloud.style.opacity   = alpha;
      cloud.style.transform = `rotate(${smoothAngle * 0.25}deg)`;
    } else {
      cloud.style.opacity = 0;
    }
  });

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

} // end touch guard
