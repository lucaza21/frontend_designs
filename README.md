# Frontend Creations

A small collection of experimental landing pages built to explore different
front-end techniques: scroll-driven cinematic reveals, masked-image mosaic
grids, and procedural real-time 3D on the web. Built with Next.js (App
Router) + TypeScript + Tailwind CSS.

- `/desert-ruins` — a scroll-driven "assembly reveal" landing page. A sticky
  cinematic stage choreographs seven staged image layers (arch, columns,
  canyon, mesas, volcanic rock, sky) as the user scrolls, with mouse
  parallax throughout, followed by a routes grid, an about section, and a
  footer.
- `/dental-clinic` — a clinic landing page built around a "masked card
  mosaic" technique: several cards in a section share one continuous
  background photo, each card acting as a window into a different part of
  the same image, so a grid of small cards reads as one photograph.
- `/peacock-threejs` — an interactive Three.js hero: a fully procedural
  peacock (no external 3D model), with hand-painted canvas textures,
  mouse-steered wandering, and a hover-triggered tail fan, followed by a
  story section, a process/craft breakdown, and a contact section.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the home page,
which links to each project.

## Deploy

Deploys as a standard Next.js app — e.g. on
[Vercel](https://vercel.com/new), no extra configuration needed.
