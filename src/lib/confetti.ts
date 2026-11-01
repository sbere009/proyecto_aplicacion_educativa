// Lightweight confetti burst rendered into a fixed overlay element.

const COLORS = [
  '#ff8f6f', '#fbbf24', '#4fd293', '#a17fff', '#ff6f96',
  '#ffd35a', '#84e6b0', '#c0a3ff', '#ffb094',
];

type Piece = { el: HTMLDivElement; x: number; r: number; d: number; rot: number; dx: number };

let overlay: HTMLDivElement | null = null;
let pieces: Piece[] = [];
let raf: number | null = null;
let startTime = 0;

function ensureOverlay(): HTMLDivElement {
  if (overlay && document.body.contains(overlay)) return overlay;
  overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(overlay);
  return overlay;
}

function loop(now: number) {
  if (!startTime) startTime = now;
  const elapsed = (now - startTime) / 1000;
  let any = false;
  for (const p of pieces) {
    const t = elapsed - p.d;
    if (t < 0 || t > 2.2) {
      if (p.el.parentNode) p.el.remove();
      continue;
    }
    const progress = t / 2.2;
    const y = -10 + progress * 120; // vh
    const drift = Math.sin(t * 3) * 6 + p.dx * t * 40;
    p.el.style.transform = `translate3d(${p.x + drift}vw, ${y}vh, 0) rotate(${p.rot + t * 540}deg)`;
    p.el.style.opacity = String(1 - Math.max(0, (t - 1.6) / 0.6));
    any = true;
  }
  if (any) {
    raf = requestAnimationFrame(loop);
  } else {
    raf = null;
    startTime = 0;
    pieces = [];
    if (overlay) overlay.remove();
    overlay = null;
  }
}

export function burstConfetti(count = 70, originX = 50, originY = 40) {
  if (typeof document === 'undefined') return;
  const root = ensureOverlay();
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 8;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.cssText = `position:absolute;top:0;left:0;width:${size}px;height:${size * (0.6 + Math.random() * 0.8)}px;background:${color};border-radius:${Math.random() > 0.5 ? '999px' : '2px'};will-change:transform,opacity;`;
    root.appendChild(el);
    pieces.push({
      el,
      x: originX + (Math.random() * 30 - 15),
      r: Math.random() * 360,
      d: Math.random() * 0.25,
      rot: Math.random() * 360,
      dx: Math.random() * 2 - 1,
    });
  }
  if (raf == null) raf = requestAnimationFrame(loop);
}
