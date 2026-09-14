# Portfolio context (for AI-assisted development)

Notes for whoever (human or AI assistant) picks up further work on these
three projects — written so a planner/executor pair (e.g. Claude Code as
planner, a delegated executor model for bulk code writing) can get up to
speed without re-deriving the design decisions below.

## desert-ruins/
Scroll-driven "assembly reveal" landing. A reusable `CinematicStage` engine
(`src/components/CinematicStage.tsx`) tracks scroll distance and mouse
position and exposes them as CSS custom properties (`--scroll`, `--mx`,
`--my`, and per-chapter `--<key>-enter/exit/active`). Layers are plain
absolutely-positioned divs that read those CSS vars in inline `style`
objects — the engine has zero knowledge of what the layers look like.
Chapters are defined as `[enterStart, enterEnd, exitStart, exitEnd]` ranges
in px of scroll distance. The 6 visual layers (arch, columns, canyon,
mesas, rocks, sky) use real alpha-cutout PNGs, not CSS masks.

## dental-clinic/
"Masked card mosaic" technique: several cards in a section all read from
ONE shared background image. `useMaskPositions` measures each card's
on-screen offset relative to its parent SECTION (not the card itself), and
`MaskedCard` uses `sw`/`sh` = the section's own width/height (critical —
using the card's own dimensions breaks the illusion) to compute
`background-position` per card, so neighboring cards look like windows into
one continuous photograph.

## peacock-threejs/
Fully procedural Three.js peacock — no imported 3D model. Body/neck/legs/16
tail feathers are primitive geometry in a hierarchy (root → visual → body +
legs + neckPivot → headPivot + tailPivot → feather hinges). Textures are
painted on canvas at runtime (`src/three/textures.ts`) with per-pixel noise
for a grainy look. Movement is modeled as STEERING (cursor supplies
direction + magnitude, applied as velocity within a bounded home range) —
never as "seek to cursor position", which would make the peacock
permanently arrive under the pointer and break the hover-fan interaction.
Feather fan spread rotates around the Z axis (`rotation.order = "ZXY"`),
not Y — rotating a near-vertical vector around Y barely spreads it
sideways.

## Working conventions across all three
- Vite + React + TypeScript + Tailwind, no external UI/icon libraries.
- No component library — every visual effect (masking, reveal staging,
  procedural 3D) is built from scratch as a reusable pattern.
- All three are single-page apps: hero/interactive centerpiece first,
  followed by supporting content sections and a footer.

## portfolio-next/ — Next.js App Router wrapper (2026-09-09/10)

Goal: ship all three demos from one deployable app (Vercel), each on its
own route, to attach to the user's personal developer portfolio repo
later. Built with `create-next-app` (Next 16, App Router, Tailwind v4,
TypeScript). **Status: scaffolded and each project migrated in; build +
type-check clean; visually verified with Playwright screenshots against
the three original Vite apps (pixel-equivalent, no console errors).**

Routes:
- `/` — landing page (`app/page.tsx`, authored fresh) linking to the
  three demos.
- `/desert-ruins` — `DesertRuinsApp.tsx` + `CinematicStage.tsx`, both
  `"use client"`. Image paths rewritten from `/desert-*.png` to
  `/desert-ruins/desert-*.png` (assets copied into
  `public/desert-ruins/`). Root wrapper gets `style={{ background:
  "#050914" }}` inline instead of the old global `body` background.
- `/dental-clinic` — `DentalClinicApp.tsx` (`"use client"`, all images
  are remote `https://images.higgs.ai/...` URLs, untouched). Route-local
  `layout.tsx` loads the Open Sauce One webfont (not on Google Fonts,
  plain `<link>` tags) since it's not shared with other routes. Root
  wrapper gets the font-family as an inline style instead of a global
  `body` rule.
- `/peacock-threejs` — `PeacockApp.tsx` (`"use client"`) plus
  `three/PeacockScene.ts` and `three/textures.ts` copied verbatim (pure
  Three.js modules, no path dependencies). Route-local `layout.tsx` uses
  `next/font/google` for Cormorant Garamond + Noto Serif SC. The
  `.font-zh` global class became an inline
  `style={{ fontFamily: "'Noto Serif SC', serif" }}` on the one span that
  needs it. **Important App Router gotcha hit here:** `next/dynamic`
  with `ssr: false` is NOT allowed inside a Server Component (`page.tsx`)
  in this Next version — had to add a small `"use client"` wrapper
  (`PeacockClientLoader.tsx`) that does the dynamic import, with
  `page.tsx` (server component, keeps the `metadata` export) rendering
  that wrapper instead of calling `dynamic()` directly.

Shared setup: `app/globals.css` only has the Tailwind import + a minimal
`html,body` reset + a global `canvas { display:block; touch-action:none }`
(safe since only one route uses canvas). No shared `tailwind.config.js`
theme customization exists in any of the three original projects, so no
theme merge was needed — Tailwind v4 auto-scans the whole app.

**Not done yet / next steps:**
- Not deployed to Vercel, not pushed to the user's personal portfolio
  repo, no git init inside `portfolio-next/` yet — waiting on the user
  to say which repo/account this goes to.
- Two cosmetic, non-blocking items surfaced during evaluation, never
  fixed (design calls, not bugs): desert-ruins mixes a few English
  strings ("The open desert sky", "REVEALED") into otherwise-Spanish
  copy; dental-clinic's frosted-glass service cards
  (`bg-white/20 backdrop-blur-xl` over the shared mosaic photo) render a
  blurry dark blob where the photo has hair/shadow — technically correct
  per the masked-card technique, just visually rough.
- `kimi_execute` (the DeepSeek/Kimi delegate tool this user's global
  CLAUDE.md expects to be used for bulk/boilerplate work) was failing
  with a 401 invalid-API-key error the whole time this was built, so ALL
  of the actual migration code above was written directly by Claude, not
  delegated. If the user has since fixed the key, future bulk/boilerplate
  work on this repo should go back through `kimi_execute` per their
  standing instructions.
