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
