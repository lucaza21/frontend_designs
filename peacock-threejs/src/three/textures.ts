import * as THREE from "three";

/**
 * Small procedural-texture helpers. Everything here is generated on a
 * <canvas> at runtime — no external image assets — so the "painterly,
 * grainy" material look is achieved with per-pixel noise instead of a
 * hand-painted texture map.
 */

function withNoise(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * strength * 255;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
  }
  ctx.putImageData(imageData, 0, 0);
}

/** A flat base-color swatch with fine painterly grain — used on body/neck/head/legs. */
export function makeGrainTexture(baseColor: string, size = 256, grainStrength = 0.08): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // A few soft mottled blotches before the fine grain, for a brushed feel.
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    const r = 8 + Math.random() * 24;
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
    ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }

  withNoise(ctx, size, size, grainStrength);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/**
 * A single tail-feather "plume": a pointed oval blade painted with a
 * concentric peacock eye near the tip, alpha-cut to the blade silhouette
 * so the plane geometry it's mapped onto reads as a real feather shape
 * rather than a rectangle.
 */
export function makeFeatherTexture(size = 256): THREE.CanvasTexture {
  const w = size;
  const h = size * 2;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;

  // Blade silhouette: a long pointed oval (fatter near the eye, tapering
  // to a thin stem at the base).
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.02);
  ctx.bezierCurveTo(w * 0.98, h * 0.22, w * 0.82, h * 0.62, cx + w * 0.06, h * 0.86);
  ctx.lineTo(cx + w * 0.015, h);
  ctx.lineTo(cx - w * 0.015, h);
  ctx.lineTo(cx - w * 0.06, h * 0.86);
  ctx.bezierCurveTo(w * 0.18, h * 0.62, w * 0.02, h * 0.22, cx, h * 0.02);
  ctx.closePath();
  ctx.clip();

  // Blade fill: soft vertical gradient, muted sage → deep teal.
  const bodyGrad = ctx.createLinearGradient(0, 0, 0, h);
  bodyGrad.addColorStop(0, "#7f9a6a");
  bodyGrad.addColorStop(0.35, "#6f8f63");
  bodyGrad.addColorStop(1, "#3f5f4a");
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(0, 0, w, h);

  // Central rib / shaft.
  ctx.strokeStyle = "rgba(40,55,35,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.05);
  ctx.lineTo(cx, h * 0.98);
  ctx.stroke();

  // Barb strokes fanning off the rib.
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  for (let y = h * 0.15; y < h * 0.95; y += 6) {
    const spread = (1 - y / h) * w * 0.32;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(cx - spread, y - 10);
    ctx.moveTo(cx, y);
    ctx.lineTo(cx + spread, y - 10);
    ctx.stroke();
  }

  // The eye — concentric rings near the top third.
  const eyeCy = h * 0.24;
  const rings: [number, string][] = [
    [w * 0.42, "#26140c"],
    [w * 0.33, "#0f3b3a"],
    [w * 0.24, "#1c5c52"],
    [w * 0.14, "#0a2a28"],
    [w * 0.065, "#d8b463"],
  ];
  for (const [r, color] of rings) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.ellipse(cx, eyeCy, r, r * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // Fine grain over the whole canvas (including alpha=0 areas is fine —
  // premultiplied compositing keeps them transparent).
  withNoise(ctx, w, h, 0.05);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/** Small round eye-dot texture used for the peacock's own eyes (white + pupil). */
export function makeEyeTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.fillStyle = "#f5f0e6";
  ctx.arc(size / 2, size / 2, size * 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#1a1712";
  ctx.arc(size / 2, size / 2, size * 0.26, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.arc(size * 0.42, size * 0.4, size * 0.07, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
