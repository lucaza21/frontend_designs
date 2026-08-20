import { CinematicStage } from "./components/CinematicStage";

/**
 * Desert Ruins — Assembly Reveal pattern demo (7-layer test of the
 * updated landing-fx-bank skill: real alpha layers + staged chapter
 * sequence, see references/11-assembly-reveal-pattern.md).
 * ---------------------------------------------------------------
 * Standalone project: this IS the app (root route), no ?demo= routing.
 * Built on the reusable `CinematicStage` engine (scroll + mouse tracking,
 * chapter enter/exit/active easing exposed as CSS custom properties).
 *
 * Mirrors Mostar's real 7-layer structure 1:1 this time (Aurora Peaks
 * only had 6 — the 7th, closest "corner rocks" layer never came out
 * usable). Staged sequence, one thing clearing at a time:
 *   1. arch            — sandstone arch, visible at rest, clears first
 *   2. side columns     — visible at rest alongside the arch, clear next
 *   3. canyon (reveal)  — fades into focus once the foreground is clear
 *   4. distant mesas    — rises in as the canyon recedes
 *   5. black volcanic rocks (closest layer, corners only) — clears last
 *   6. sunset sky        — final resting shot
 *
 * Asset slots (drop files into /public with these names — see
 * IMAGE_PROMPTS.md for the generation prompts):
 *   /desert-sky.png                     — opaque background, sunset sky
 *   /desert-mesas-far-noback.png        — distant mesa silhouette, transparent sky above
 *   /desert-canyon-reveal-noback.png    — the "prize" wide canyon/dune shot
 *   /desert-column-left-noback.png      — foreground cutout, left ~25-30%
 *   /desert-column-right-noback.png     — foreground cutout, right ~25-30%
 *   /desert-arch-noback.png             — closest layer, real transparent hole
 *   /desert-foreground-rocks-noback.png — black volcanic rocks, corners only
 */

const SCROLL_LENGTH = 4200;

const CHAPTERS = [
  // Visible at rest (scroll 0), clears first.
  { key: "arch", range: [0, 1, 450, 800] as [number, number, number, number] },
  // Visible at rest alongside the arch, clears just after it.
  { key: "columns", range: [0, 1, 650, 1050] as [number, number, number, number] },
  // Fades into focus once the foreground has cleared, then recedes.
  { key: "canyon", range: [500, 950, 2000, 2500] as [number, number, number, number] },
  // Rises in as the canyon recedes, then also clears near the end.
  { key: "mesas", range: [1600, 2050, 2900, 3400] as [number, number, number, number] },
  // Closest layer (corner rocks only) — sweeps past last, right before the open sky.
  { key: "rocks", range: [2500, 2950, 3500, 3900] as [number, number, number, number] },
  // Final resting stage: nothing left but the open sunset sky.
  { key: "sky", range: [3500, 3900, 4201, 4202] as [number, number, number, number] },

  // --- Content chapters (info cards) ---------------------------------
  // Paired with each visual stage, like Mostar's per-scroll info panels.
  // Timed slightly AFTER the title fades and BEFORE the next visual takes
  // over, so copy never fights the background reveal for attention.
  { key: "content-columns", range: [150, 400, 620, 900] as [number, number, number, number] },
  { key: "content-canyon", range: [750, 1150, 1850, 2300] as [number, number, number, number] },
  { key: "content-mesas", range: [1800, 2200, 2750, 3200] as [number, number, number, number] },
  { key: "content-rocks", range: [2700, 3050, 3350, 3700] as [number, number, number, number] },
];

/** Shared "glass card" look for every scroll-synced info panel — a dark
 * scrim + blur behind the text so it stays legible over any part of the
 * photo background (see the landing-fx-bank legibility pass). */
const cardClass =
  "pointer-events-none max-w-sm rounded-2xl border border-white/10 bg-black/35 px-6 py-5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md";
const eyebrowClass = "font-mono text-[11px] uppercase tracking-[0.18em] text-white/60";
const ctaClass =
  "pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-[#3a1a0a] transition hover:bg-white";

function App() {
  return (
    <div>
      <CinematicStage scrollLength={SCROLL_LENGTH} chapters={CHAPTERS} stageClassName="bg-[#1a0f08]">
        {/* 1. Background sky — always visible. Warms/settles slightly once
            the final "sky" stage takes over, as the last open shot. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/desert-sky.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform:
              "translate3d(calc(var(--mx) * -8px), calc(var(--my) * -6px), 0) scale(calc(1.1 - var(--sky-enter) * 0.06))",
            filter:
              "brightness(calc(1 + var(--sky-enter) * 0.1)) saturate(calc(1 + var(--sky-enter) * 0.2))",
          }}
        />

        {/* 2. Distant mesas — stage 4. Transparent sky above. Rises in as the
            canyon recedes, then clears too. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/desert-mesas-far-noback.png")',
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            opacity: "var(--mesas-active)",
            transform:
              "translate3d(calc(var(--mx) * -10px), calc(var(--my) * -8px + (1 - var(--mesas-enter)) * 30px), 0) scale(calc(1.04 + var(--mesas-exit) * 0.08))",
            filter: "blur(calc((1 - var(--mesas-active)) * 8px))",
          }}
        />

        {/* 3. Canyon reveal — stage 3. The "prize". Fades + settles into
            focus, then recedes as the mesas take over. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/desert-canyon-reveal-noback.png")',
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            opacity: "var(--canyon-active)",
            transform:
              "translate3d(calc(var(--mx) * -14px), calc(var(--my) * -10px), 0) scale(calc(1.12 - var(--canyon-enter) * 0.12 + var(--canyon-exit) * 0.08))",
            filter: "blur(calc((1 - var(--canyon-active)) * 6px))",
          }}
        />

        {/* 4. Side columns — left. Stage 2. Visible at rest (real alpha
            cutout, occupies only the left portion), slides + scales away. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/desert-column-left-noback.png")',
            backgroundSize: "auto 42%",
            backgroundPosition: "left bottom",
            backgroundRepeat: "no-repeat",
            opacity: "calc(1 - var(--columns-exit))",
            transform:
              "translate3d(calc(var(--columns-exit) * var(--columns-exit) * -32vw + var(--mx) * 18px), calc(var(--my) * 10px), 0) scale(calc(1 + var(--columns-exit) * 0.15))",
          }}
        />

        {/* 5. Side columns — right. Mirrors the left, same "columns" chapter. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/desert-column-right-noback.png")',
            backgroundSize: "auto 42%",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
            opacity: "calc(1 - var(--columns-exit))",
            transform:
              "translate3d(calc(var(--columns-exit) * var(--columns-exit) * 32vw + var(--mx) * 18px), calc(var(--my) * 10px), 0) scale(calc(1 + var(--columns-exit) * 0.15))",
          }}
        />

        {/* 6. Black volcanic rocks — stage 5, closest layer besides the arch.
            Corners only (real alpha), sweeps through last before the open sky. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/desert-foreground-rocks-noback.png")',
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            opacity: "var(--rocks-active)",
            transform:
              "translate3d(calc(var(--mx) * 12px), calc(var(--my) * 10px + (1 - var(--rocks-enter)) * 40px), 0) scale(calc(1 + var(--rocks-exit) * 0.5))",
          }}
        />

        {/* 7. Sandstone arch — stage 1, closest layer overall, real
            transparent hole in the middle (like Mostar's bridge arch).
            Visible at rest, framing everything; scales up and fades out
            first, like the camera flying through the opening. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/desert-arch-noback.png")',
            backgroundSize: "100% auto",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            opacity: "calc(1 - var(--arch-exit))",
            transform:
              "translate3d(calc(var(--mx) * 10px), calc(var(--my) * 8px), 0) scale(calc(1 + var(--arch-exit) * 1.1))",
          }}
        />

        {/* Shade — reinforces the staging, clears fully once the final sky
            stage settles in. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "rgba(40, 18, 10, 1)",
            opacity: "calc((1 - var(--sky-enter)) * 0.3)",
          }}
        />

        {/* Title — fades out fast as soon as scroll starts */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white"
          style={{ opacity: "calc(1 - var(--scroll-progress) * 8)" }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/80">
            Assembly Reveal — pattern demo (7 layers, staged sequence)
          </span>
          <h1 className="text-4xl font-normal tracking-tight sm:text-5xl">Desert Ruins</h1>
          <p className="max-w-md text-sm text-white/70">
            Arch, then columns, then the canyon, then the distant mesas, then the black
            volcanic rocks, then the open sunset sky — one layer clearing at a time, the same
            staged-cutout technique studied from the Mostar splitframe handoff.
          </p>
        </div>
        {/* Content card 1 — paired with the columns stage. Centered, low on
            the frame (arch overhead has room, columns sit at the edges). */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-24 flex justify-center px-8"
          style={{
            opacity: "var(--content-columns-active)",
            transform:
              "translate3d(0, calc((1 - var(--content-columns-active)) * 20px), 0)",
          }}
        >
          <div className={cardClass}>
            <span className={eyebrowClass}>01 — El umbral</span>
            <h3 className="mt-2 text-lg font-normal tracking-tight">
              Un arco tallado por el viento
            </h3>
            <p className="mt-2 text-sm text-white/75">
              Miles de años de arena y viento dejaron esta puerta de piedra. Las columnas a
              los costados son lo único que queda de una formación mucho más grande.
            </p>
            <button type="button" className={ctaClass}>
              Explorar la ruta
            </button>
          </div>
        </div>

        {/* Content card 2 — paired with the canyon reveal. Bottom-left,
            clear of the canyon's own silhouette which fills the lower half. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-8 flex items-center sm:left-16"
          style={{
            opacity: "var(--content-canyon-active)",
            transform:
              "translate3d(calc((1 - var(--content-canyon-active)) * -24px), 0, 0)",
          }}
        >
          <div className={cardClass}>
            <span className={eyebrowClass}>02 — El cañón</span>
            <h3 className="mt-2 text-lg font-normal tracking-tight">
              Donde el desierto se abre
            </h3>
            <p className="mt-2 text-sm text-white/75">
              Dunas y roca roja se extienden hasta el horizonte. Es el punto más bajo de la
              ruta, y el más fotografiado al atardecer.
            </p>
            <button type="button" className={ctaClass}>
              Ver el mapa
            </button>
          </div>
        </div>

        {/* Content card 3 — paired with the distant mesas. Bottom-right,
            mirrors card 2 so the eye alternates sides down the page. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-8 flex items-center sm:right-16"
          style={{
            opacity: "var(--content-mesas-active)",
            transform:
              "translate3d(calc((1 - var(--content-mesas-active)) * 24px), 0, 0)",
          }}
        >
          <div className={cardClass}>
            <span className={eyebrowClass}>03 — Las mesetas</span>
            <h3 className="mt-2 text-lg font-normal tracking-tight">Guardianas del horizonte</h3>
            <p className="mt-2 text-sm text-white/75">
              Estas formaciones marcan el límite del valle. Se ven mejor desde lejos, cuando
              el sol bajo dibuja su silueta completa.
            </p>
            <button type="button" className={ctaClass}>
              Reservar visita
            </button>
          </div>
        </div>

        {/* Content card 4 — paired with the black volcanic rocks (closest
            layer, corners only). Centered, since the rocks leave the middle
            of the frame clear. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-28 flex justify-center px-8"
          style={{
            opacity: "var(--content-rocks-active)",
            transform:
              "translate3d(0, calc((1 - var(--content-rocks-active)) * 20px), 0)",
          }}
        >
          <div className={cardClass}>
            <span className={eyebrowClass}>04 — Roca volcánica</span>
            <h3 className="mt-2 text-lg font-normal tracking-tight">Lo último antes del cielo</h3>
            <p className="mt-2 text-sm text-white/75">
              Rocas oscuras, mucho más jóvenes que el resto del paisaje, marcan el borde del
              mirador final.
            </p>
            <button type="button" className={ctaClass}>
              Planear el viaje
            </button>
          </div>
        </div>

        {/* Post-reveal caption — only once the final sky stage settles in */}
        <div
          className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-2 text-center text-white"
          style={{
            opacity: "var(--sky-enter)",
            transform: "translate3d(0, calc((1 - var(--sky-enter)) * 24px), 0)",
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/70">
            Revealed
          </span>
          <h2 className="text-2xl font-normal tracking-tight">The open desert sky</h2>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-[#3a1a0a] transition hover:bg-white"
          >
            Ver todas las rutas
          </button>
        </div>
      </CinematicStage>

      <section className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#1a0f08] px-8 text-center text-white">
        <h2 className="text-3xl font-normal tracking-tight">Regular content section</h2>
        <p className="max-w-md text-sm text-white/70">
          Confirms the stage releases cleanly and normal scroll resumes after the reveal.
        </p>
      </section>
    </div>
  );
}

export default App;
