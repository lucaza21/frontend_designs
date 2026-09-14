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

## Next.js App Router wrapper (2026-09-09/10, moved to repo root 2026-09-13)

Goal: ship all three demos from one deployable app (Vercel), each on its
own route. Built with `create-next-app` (Next 16, App Router, Tailwind v4,
TypeScript). **Status: shipped.** The three original standalone Vite
projects (`dental-clinic/`, `desert-ruins/`, `peacock-threejs/`) have been
deleted from the repo — this Next.js app (originally scaffolded under
`portfolio-next/`, now living at the repo root so Vercel can deploy it
with zero config) is the only surviving copy of all three. Home page
(`app/page.tsx`) cards use real header screenshots (headless Chrome,
`public/home-cards/*.png`) as backgrounds with a hover zoom effect.

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
- Pushed to `github.com/lucaza21/frontend_designs` (`main` branch), repo
  root is now the Next.js app itself — ready to import into Vercel as-is,
  no root-directory override needed.
- Two cosmetic, non-blocking items surfaced during evaluation, never
  fixed (design calls, not bugs): desert-ruins mixes a few English
  strings ("The open desert sky", "REVEALED") into otherwise-Spanish
  copy; dental-clinic's frosted-glass service cards
  (`bg-white/20 backdrop-blur-xl` over the shared mosaic photo) render a
  blurry dark blob where the photo has hair/shadow — technically correct
  per the masked-card technique, just visually rough.
- The delegate tool is now `deepseek_execute`/`qwen_research` (an
  MCP server routing to DeepSeek/Qwen), replacing the earlier
  `kimi_execute` setup mentioned in older notes. Bulk/boilerplate work on
  this repo should go through it per the user's standing CLAUDE.md rules.
