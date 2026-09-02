import * as THREE from "three";
import { makeEyeTexture, makeFeatherTexture, makeGrainTexture } from "./textures";

/**
 * Procedural, hand-rigged (in code) peacock — no external 3D asset, no
 * animation clips. Every pose is a transform computed live each frame from
 * a handful of state variables (heading, walk phase, spread amount, hover
 * shake timer), so there is never a crossfade between "poses": the rig is
 * just always at the mathematically correct pose for the current state.
 *
 * PHASE 1 (this build): idle bob, mouse-driven wandering with a coherent
 * root → neck → head turn cascade, walk-cycle leg swing, and a hover-driven
 * tail fan spread/close with a head-shake accent. Scroll-peck, space-jump,
 * feather pluck/retrieval and procedural audio are intentionally deferred
 * to a phase-2 pass (see PROJECT NOTES in App.tsx).
 */

function lerpAngle(a: number, b: number, t: number) {
  let diff = (b - a) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

function expSmooth(current: number, target: number, dt: number, speed: number) {
  const t = 1 - Math.exp(-dt * speed);
  return current + (target - current) * t;
}

const FEATHER_COUNT = 16;

export class PeacockScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;

  private root = new THREE.Group();
  private visual = new THREE.Group();
  private neckPivot = new THREE.Group();
  private headPivot = new THREE.Group();
  private tailPivot = new THREE.Group();
  private legL = new THREE.Group();
  private legR = new THREE.Group();

  private feathers: { hinge: THREE.Group; spreadYaw: number; index: number }[] = [];

  private mouseNDC = new THREE.Vector2(0, 0);
  // (0, 0) NDC is dead-center — exactly where the peacock rests by design
  // — so treating it as a real cursor position before any pointer event
  // has actually fired would read as a permanent hover on load (worst on
  // touch devices, which may never fire pointermove at all: phase 1 has no
  // dedicated touch gesture yet, so without this flag a touch visitor
  // would see the tail stuck open, overlapping the headline, from the
  // first frame).
  private hasPointerInput = false;
  private raycaster = new THREE.Raycaster();
  private hitSphere: THREE.Mesh;

  private baseOffsetX = 0.6;
  private wanderRangeX = 1.6;
  private wanderRangeZNear = 0.9;
  private wanderRangeZFar = -0.6;

  private heading = 0;
  private walkPhase = 0;
  private isWalking = false;
  private homeX = this.baseOffsetX;
  private homeZ = 0.15;

  private hovered = false;
  private spreadAmount = 0;
  private headShakeTimer = 0;
  private readonly headShakeDuration = 0.6;

  private clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;

  constructor(container: HTMLElement) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#ece6da");

    const { clientWidth: w, clientHeight: h } = container;
    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.set(0, 1.15, 4.4);
    this.camera.lookAt(0.5, 0.85, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    container.appendChild(this.renderer.domElement);

    this.setupLights();
    this.hitSphere = this.buildPeacock();
    this.buildGroundShadow();

    window.addEventListener("resize", this.onResize);
    // Track pointer position on `window`, not the canvas container: the
    // typography overlay has a few pointer-events-auto elements (nav
    // links, language toggle, the hint pill) stacked on top of the canvas.
    // Listening on the container alone means the browser's hit-test can
    // route pointermove to one of those DOM elements instead of ever
    // reaching the canvas div underneath — mouseNDC then simply stops
    // updating (stale at wherever the cursor was before it crossed onto
    // that element) and the peacock gets stuck mid-gesture (fan open,
    // heading frozen) whenever the cursor passes over any overlay control.
    window.addEventListener("pointermove", this.onPointerMove);
    document.documentElement.addEventListener("pointerleave", this.onPointerLeave);

    this.onResize();
    this.animate();
  }

  private setupLights() {
    const hemi = new THREE.HemisphereLight("#fbf6ea", "#8a7a5c", 0.95);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight("#fff3dd", 1.15);
    key.position.set(-2.5, 3.5, 3);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight("#cfe0da", 0.35);
    fill.position.set(3, 1.5, -2);
    this.scene.add(fill);
  }

  private buildGroundShadow() {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(30,25,15,0.28)");
    grad.addColorStop(1, "rgba(30,25,15,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    const geo = new THREE.PlaneGeometry(1.6, 0.9);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.002;
    this.root.add(mesh);
    // Keep the shadow following the visual root's own animated position by
    // parenting it to `root` (not `visual`, which bobs) — see update().
  }

  private tealMat() {
    return new THREE.MeshStandardMaterial({
      map: makeGrainTexture("#1f5048", 256, 0.07),
      roughness: 0.72,
      metalness: 0.04,
    });
  }

  private goldMat() {
    return new THREE.MeshStandardMaterial({
      map: makeGrainTexture("#b9975a", 128, 0.09),
      roughness: 0.55,
      metalness: 0.12,
    });
  }

  private buildPeacock(): THREE.Mesh {
    this.scene.add(this.root);
    this.root.add(this.visual);
    this.root.position.set(this.baseOffsetX, 0, 0);

    const teal = this.tealMat();
    const gold = this.goldMat();

    // ---- body -------------------------------------------------------
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.42, 6, 14), teal);
    body.scale.set(1.18, 1, 1.02);
    body.position.y = 0.56;
    this.visual.add(body);

    // ---- legs ---------------------------------------------------------
    const buildLeg = (x: number) => {
      const leg = new THREE.Group();
      leg.position.set(x, 0.32, 0.02);
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.024, 0.3, 8), gold);
      upper.position.y = -0.15;
      leg.add(upper);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.02, 0.16), gold);
      foot.position.set(0, -0.3, 0.04);
      leg.add(foot);
      this.visual.add(leg);
      return leg;
    };
    this.legL = buildLeg(-0.13);
    this.legR = buildLeg(0.13);

    // ---- neck + head ----------------------------------------------
    this.neckPivot.position.set(0, 0.86, 0.16);
    this.visual.add(this.neckPivot);

    const neckHeight = 0.56;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.095, neckHeight, 12), teal);
    neck.position.y = neckHeight / 2;
    this.neckPivot.add(neck);

    this.headPivot.position.set(0, neckHeight, 0);
    this.neckPivot.add(this.headPivot);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 16), teal);
    this.headPivot.add(head);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.13, 10), gold);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, -0.01, 0.15);
    this.headPivot.add(beak);

    const eyeTex = makeEyeTexture();
    const eyeMat = new THREE.SpriteMaterial({ map: eyeTex });
    const eyeScale = 0.05;
    [-1, 1].forEach((side) => {
      const eye = new THREE.Sprite(eyeMat);
      eye.scale.set(eyeScale, eyeScale, eyeScale);
      eye.position.set(side * 0.075, 0.03, 0.09);
      this.headPivot.add(eye);
    });

    // Crest — a small fan of gold-tipped plumes above the head.
    const crestCount = 6;
    for (let i = 0; i < crestCount; i++) {
      const t = i / (crestCount - 1);
      const angle = THREE.MathUtils.lerp(-0.55, 0.55, t);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.009, 0.18, 6), teal);
      stem.position.set(0, 0.12, -0.02);
      stem.rotation.z = angle;
      stem.rotation.x = -0.15;
      stem.geometry.translate(0, 0.09, 0);
      this.headPivot.add(stem);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), gold);
      tip.scale.set(1, 1.6, 0.6);
      tip.position.copy(stem.position).add(new THREE.Vector3(Math.sin(angle) * 0.18, Math.cos(angle) * 0.18 - 0.02, -0.02));
      this.headPivot.add(tip);
    }

    // ---- tail: fan of individually-hinged feather planes -----------
    this.tailPivot.position.set(0, 0.4, -0.26);
    this.visual.add(this.tailPivot);

    const featherTex = makeFeatherTexture();
    const featherMat = new THREE.MeshStandardMaterial({
      map: featherTex,
      transparent: true,
      alphaTest: 0.25,
      side: THREE.DoubleSide,
      roughness: 0.75,
      metalness: 0.02,
    });
    const featherLength = 1.05;
    const featherGeo = new THREE.PlaneGeometry(0.24, featherLength, 1, 6);
    featherGeo.translate(0, featherLength / 2, 0);

    for (let i = 0; i < FEATHER_COUNT; i++) {
      const t = i / (FEATHER_COUNT - 1);
      const spreadYaw = THREE.MathUtils.lerp(-1.25, 1.25, t); // ~±72°
      const hinge = new THREE.Group();
      // ZXY (not the default XYZ/YXZ): the spread angle must be applied as
      // the OUTERMOST rotation, around the forward-facing Z axis — rotating
      // a near-vertical feather around Y (vertical) barely moves it
      // sideways, but rotating it around Z fans it out into the classic
      // dome shape as pitch approaches upright. Cost 45 minutes to spot in
      // a screenshot: the fan looked "stuck standing straight up" instead
      // of splaying open.
      hinge.rotation.order = "ZXY";
      const mesh = new THREE.Mesh(featherGeo, featherMat);
      hinge.add(mesh);
      this.tailPivot.add(hinge);
      this.feathers.push({ hinge, spreadYaw, index: i });
    }

    // Invisible hit target for hover detection — sized to the folded
    // silhouette (body + head + folded tail), not the spread fan.
    const hitGeo = new THREE.SphereGeometry(0.62, 8, 8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.position.set(0, 0.55, -0.05);
    this.visual.add(hit);
    return hit;
  }

  // -------------------------------------------------------------------
  // Input
  // -------------------------------------------------------------------

  private onPointerMove = (e: PointerEvent) => {
    this.hasPointerInput = true;
    const rect = this.container.getBoundingClientRect();
    this.mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseNDC.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  private onPointerLeave = () => {
    // Let the peacock settle back to a neutral heading if the pointer
    // leaves the viewport entirely.
    this.mouseNDC.set(0, 0);
  };

  private onResize = () => {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.camera.aspect = w / h;
    const portrait = w / h < 0.85;
    // Pull the camera back and tighten the wander range on narrow/portrait
    // viewports so the peacock and its spread tail never clip the canvas
    // edges.
    this.camera.position.z = portrait ? 5.6 : 4.4;
    this.camera.fov = portrait ? 42 : 35;
    this.baseOffsetX = portrait ? 0 : 0.6;
    this.homeX = this.baseOffsetX;
    this.wanderRangeX = portrait ? 0.55 : 1.6;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  // -------------------------------------------------------------------
  // Frame loop
  // -------------------------------------------------------------------

  private animate = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  };

  private update(dt: number) {
    const time = this.clock.elapsedTime;

    // --- hover detection -------------------------------------------------
    let nowHovered = false;
    if (this.hasPointerInput) {
      this.raycaster.setFromCamera(this.mouseNDC, this.camera);
      nowHovered = this.raycaster.intersectObject(this.hitSphere, false).length > 0;
    }
    if (nowHovered && !this.hovered) {
      this.headShakeTimer = this.headShakeDuration;
    }
    this.hovered = nowHovered;

    this.spreadAmount = expSmooth(this.spreadAmount, this.hovered ? 1 : 0, dt, 2.2);

    // --- steering-driven wander -------------------------------------------
    // The mouse is a STEERING input (direction + magnitude), not a
    // destination — the peacock never "arrives at" the cursor's mapped
    // position. This is what makes hover a genuinely separate gesture from
    // walking: hovering requires the cursor to be over wherever the
    // peacock's body actually is on screen right now, which this steering
    // model doesn't automatically converge toward. (An earlier "seek an
    // exact target = mouse position" version did — the peacock always
    // ended up parked exactly under the cursor once it caught up, so the
    // fan could open but could never close again without the cursor
    // leaving the window: moving the mouse to a new spot just made the
    // peacock walk there and get re-hovered on arrival.)
    const mag = Math.min(this.mouseNDC.length(), 1);
    const deadzone = 0.1;
    this.isWalking = mag > deadzone && this.spreadAmount < 0.05;

    if (this.isWalking) {
      const vx = this.mouseNDC.x * 1.1;
      const vz = -this.mouseNDC.y * 0.55;
      this.root.position.x = THREE.MathUtils.clamp(
        this.root.position.x + vx * dt,
        this.homeX - this.wanderRangeX,
        this.homeX + this.wanderRangeX,
      );
      this.root.position.z = THREE.MathUtils.clamp(
        this.root.position.z + vz * dt,
        this.wanderRangeZFar,
        this.wanderRangeZNear,
      );
      this.heading = Math.atan2(vx, vz);
      this.walkPhase += dt * 9 * mag;
    } else {
      this.walkPhase = expSmooth(this.walkPhase, Math.round(this.walkPhase / Math.PI) * Math.PI, dt, 6);
    }
    this.root.rotation.y = lerpAngle(this.root.rotation.y, this.heading, Math.min(dt * 3.2, 1));

    // --- idle bob + walk bob ----------------------------------------------
    const idleBob = Math.sin(time * 1.6) * 0.015;
    const walkBob = this.isWalking ? Math.abs(Math.sin(this.walkPhase)) * 0.02 : 0;
    this.visual.position.y = idleBob + walkBob;

    // --- legs ---------------------------------------------------------
    const legSwing = this.isWalking ? Math.sin(this.walkPhase) * 0.45 : 0;
    this.legL.rotation.x = expSmooth(this.legL.rotation.x, legSwing, dt, 10);
    this.legR.rotation.x = expSmooth(this.legR.rotation.x, -legSwing, dt, 10);

    // --- neck / head coherent turn cascade --------------------------------
    const neckExtra = this.mouseNDC.x * 0.35;
    const headExtraYaw = this.mouseNDC.x * 0.5;
    const headExtraPitch = -this.mouseNDC.y * 0.22;
    this.neckPivot.rotation.y = lerpAngle(this.neckPivot.rotation.y, neckExtra, Math.min(dt * 4, 1));
    this.headPivot.rotation.y = lerpAngle(this.headPivot.rotation.y, headExtraYaw - neckExtra, Math.min(dt * 6, 1));
    this.headPivot.rotation.x = lerpAngle(this.headPivot.rotation.x, headExtraPitch, Math.min(dt * 6, 1));

    // --- head shake (hover accent) -----------------------------------
    if (this.headShakeTimer > 0) {
      const p = 1 - this.headShakeTimer / this.headShakeDuration;
      this.headPivot.rotation.z = Math.sin(p * Math.PI * 6) * 0.14 * (this.headShakeTimer / this.headShakeDuration);
      this.headShakeTimer -= dt;
    } else {
      this.headPivot.rotation.z = expSmooth(this.headPivot.rotation.z, 0, dt, 8);
    }

    // --- tail fan --------------------------------------------------------
    for (const f of this.feathers) {
      const stagger = f.index * 0.012;
      const localT = THREE.MathUtils.clamp((this.spreadAmount - stagger) / (1 - stagger || 1), 0, 1);
      const eased = localT * localT * (3 - 2 * localT); // smoothstep
      const pitch = THREE.MathUtils.lerp(2.55, 0.28, eased); // folded (drooping) -> upright
      const yaw = THREE.MathUtils.lerp(f.spreadYaw * 0.12, f.spreadYaw, eased);
      f.hinge.rotation.x = -pitch;
      f.hinge.rotation.z = yaw;
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointerMove);
    document.documentElement.removeEventListener("pointerleave", this.onPointerLeave);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
