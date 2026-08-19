import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Cinematic Stage — engine
 * ---------------------------------------------------------------
 * Generalized from a "cinematic scroll story" reference build (a
 * single-page sticky hero where scroll drives a multi-chapter visual
 * choreography: layers zoom/drift/blur into and out of "chapters",
 * combined with continuous mouse parallax, ending in an element that
 * flies in from off-screen). The reference build hard-coded every
 * layer's math directly in one big per-frame function — this engine
 * extracts the REUSABLE part (scroll tracking, mouse tracking, chapter
 * enter/exit/active easing) and exposes it as CSS custom properties on
 * the stage element, so any layer composition can consume it with
 * plain `style={{ transform: '...var(--mx)...' }}` — the motor never
 * needs to know what the layers look like.
 *
 * Structure it creates (mirrors the reference build's DOM):
 *   <div class="cinematic-scroll" style="height: 100vh + scrollLength">
 *     <div class="cinematic-stage" style="position: sticky; top:0; height:100vh; overflow:hidden">
 *       {children}   <-- your layers, reading the CSS vars below
 *     </div>
 *   </div>
 *
 * CSS variables written on the STICKY STAGE element every frame:
 *   --scroll             smoothed scroll distance through this section, in px
 *                         (0 at the top of the section, capped at `scrollLength`)
 *   --scroll-progress    the same, normalized 0..1
 *   --mx, --my           smoothed mouse position, normalized -0.5..0.5
 *                         (0,0 = viewport center) — 0 under prefers-reduced-motion
 *   --<chapterKey>-enter   0→1 easing across [a,b] of that chapter's range
 *   --<chapterKey>-exit    0→1 easing across [c,d] of that chapter's range
 *   --<chapterKey>-active  enter * (1 - exit) — 1 while "inside" the chapter,
 *                           ramping down as the NEXT chapter takes over
 *
 * Chapter ranges use the same 4-point shape as the reference build:
 * `[a, b, c, d]` in px of `--scroll` → enters over [a,b], stays fully
 * active until c, then exits over [c,d]. This is what lets you build a
 * "blur ramps up during the handoff, then settles" transition: read
 * `--<key>-active` for the blur/shade intensity, and combine
 * `--<key>-enter` / `--<key>-exit` for element-specific in/out motion
 * that differs between arriving and leaving.
 *
 * Verified working (Aug 2026) on: 2-chapter placeholder scene (title →
 * chapter A story panel with blur/shade handoff → chapter B story panel
 * → infinite card slider flying in), confirmed via computed CSS custom
 * property values read back at multiple scroll positions (not just
 * screenshots) — see references/10-cinematic-stage.md.
 */

export type CinematicChapter = {
  key: string;
  /** [enterStart, enterEnd, exitStart, exitEnd] in px of --scroll */
  range: [number, number, number, number];
};

export type CinematicStageProps = {
  /** Extra scrollable px beyond one viewport height — total scroll "runway" for the choreography. */
  scrollLength: number;
  chapters?: CinematicChapter[];
  className?: string;
  stageClassName?: string;
  children?: ReactNode;
  /** Scroll smoothing factor (default 0.14, matches the reference build). */
  scrollEase?: number;
  /** Mouse smoothing factor (default 0.12, matches the reference build). */
  mouseEase?: number;
};

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

function smoothstep(e0: number, e1: number, v: number) {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Exported for consumers who want custom per-layer math beyond CSS vars. */
export function segmentInOut(scroll: number, a: number, b: number, c: number, d: number) {
  const enter = smoothstep(a, b, scroll);
  const exit = smoothstep(c, d, scroll);
  return { enter, exit, active: enter * (1 - exit) };
}

export { clamp, smoothstep, lerp };

export function CinematicStage({
  scrollLength,
  chapters = [],
  className = "",
  stageClassName = "",
  children,
  scrollEase = 0.14,
  mouseEase = 0.12,
}: CinematicStageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const targetScrollRef = useRef(0);
  const smoothScrollRef = useRef(0);
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const initializedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const getScrollDistance = () => {
      const section = sectionRef.current;
      if (!section) return 0;
      const rect = section.getBoundingClientRect();
      return clamp(-rect.top, 0, section.offsetHeight - window.innerHeight);
    };

    const onPointerMove = (e: PointerEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const tick = () => {
      const stage = stageRef.current;
      const targetScroll = getScrollDistance();
      targetScrollRef.current = targetScroll;

      if (!initializedRef.current || reduceMotion.matches) {
        smoothScrollRef.current = targetScroll;
        initializedRef.current = true;
      } else {
        smoothScrollRef.current = lerp(smoothScrollRef.current, targetScroll, scrollEase);
        if (Math.abs(smoothScrollRef.current - targetScroll) < 0.08) {
          smoothScrollRef.current = targetScroll;
        }
      }

      const tmx = reduceMotion.matches ? 0 : targetMouseRef.current.x;
      const tmy = reduceMotion.matches ? 0 : targetMouseRef.current.y;
      mouseRef.current = {
        x: lerp(mouseRef.current.x, tmx, mouseEase),
        y: lerp(mouseRef.current.y, tmy, mouseEase),
      };

      if (stage) {
        const scroll = smoothScrollRef.current;
        stage.style.setProperty("--scroll", `${scroll}px`);
        stage.style.setProperty(
          "--scroll-progress",
          String(scrollLength > 0 ? clamp(scroll / scrollLength) : 0),
        );
        stage.style.setProperty("--mx", mouseRef.current.x.toFixed(4));
        stage.style.setProperty("--my", mouseRef.current.y.toFixed(4));

        for (const ch of chapters) {
          const { enter, exit, active } = segmentInOut(scroll, ...ch.range);
          stage.style.setProperty(`--${ch.key}-enter`, enter.toFixed(4));
          stage.style.setProperty(`--${ch.key}-exit`, exit.toFixed(4));
          stage.style.setProperty(`--${ch.key}-active`, active.toFixed(4));
        }
      }

      const scrollSettled = Math.abs(smoothScrollRef.current - targetScrollRef.current) < 0.08;
      const mouseSettled =
        Math.abs(mouseRef.current.x - (reduceMotion.matches ? 0 : targetMouseRef.current.x)) <
          0.001 &&
        Math.abs(mouseRef.current.y - (reduceMotion.matches ? 0 : targetMouseRef.current.y)) <
          0.001;

      // Keep animating continuously — cheap enough, and avoids edge cases
      // around re-arming rAF only on scroll/pointer events (the reference
      // build did on-demand rAF; this engine trades a hair of idle CPU for
      // simplicity and guarantees fresh chapter vars on resize too).
      void scrollSettled;
      void mouseSettled;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollLength, chapters, scrollEase, mouseEase]);

  return (
    <div
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ height: `calc(100vh + ${scrollLength}px)` }}
    >
      <div
        ref={stageRef}
        className={`sticky top-0 h-screen overflow-hidden ${stageClassName}`}
        style={{ isolation: "isolate" }}
      >
        {children}
      </div>
    </div>
  );
}
