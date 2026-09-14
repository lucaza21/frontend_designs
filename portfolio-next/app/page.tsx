import Image from "next/image";
import Link from "next/link";

type Project = {
  href: string;
  title: string;
  description: string;
  accent: string;
  image: string;
};

const projects: Project[] = [
  {
    href: "/desert-ruins",
    title: "Desert Ruins",
    description:
      "Scroll-driven \"assembly reveal\" landing page: a sticky cinematic stage choreographs seven staged image layers as you scroll, with mouse parallax throughout.",
    accent: "from-orange-500/20 to-red-900/20",
    image: "/home-cards/desert-ruins-header.png",
  },
  {
    href: "/dental-clinic",
    title: "Dental Health",
    description:
      "A clinic landing page built around a \"masked card mosaic\" technique — several cards share one continuous background photo, each acting as a window into the same image.",
    accent: "from-zinc-300/30 to-zinc-600/20",
    image: "/home-cards/dental-clinic-header.png",
  },
  {
    href: "/peacock-threejs",
    title: "羽间 — Peacock",
    description:
      "An interactive Three.js hero: a fully procedural peacock with hand-painted canvas textures, mouse-steered wandering, and a hover-triggered tail fan.",
    accent: "from-emerald-700/20 to-emerald-900/20",
    image: "/home-cards/peacock-header.png",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <section className="px-6 md:px-12 pt-24 pb-12 md:pt-32 md:pb-16 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
          Luis Carrasquilla — Frontend Creations
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          A small collection of experimental landing pages
        </h1>
        <p className="mt-4 text-neutral-400 max-w-2xl">
          Explorations in scroll-driven cinematic reveals, masked-image mosaic
          grids, and procedural real-time 3D on the web. Each piece is a
          self-contained interactive experience — pick one below.
        </p>
      </section>

      <section className="px-6 md:px-12 pb-24 grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <Link
            key={p.href}
            href={p.href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col justify-between min-h-[220px] transition-colors hover:border-white/30"
          >
            <Image
              src={p.image}
              alt=""
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="pointer-events-none object-cover opacity-70 transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.accent} opacity-80 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <div className="pointer-events-none absolute inset-0 bg-neutral-950/60 transition-opacity duration-500 group-hover:bg-neutral-950/80" />
            <div className="relative">
              <h2 className="text-xl md:text-2xl font-medium">{p.title}</h2>
              <p className="mt-3 text-sm text-neutral-300">{p.description}</p>
            </div>
            <span className="relative mt-6 inline-flex items-center gap-1 text-sm text-neutral-200">
              View
              <span className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
