"use client";

import { useEffect, useRef, useState } from "react";
import { PeacockScene } from "./three/PeacockScene";

/**
 * 羽间 (Yǔ Jiān) — "Among Feathers" — interactive peacock hero.
 *
 * PROJECT NOTES (phase 1 of 2, by explicit agreement with the user):
 * Shipped now — idle bob, mouse-driven wandering with a coherent
 * root→neck→head turn cascade, walk-cycle legs, hover-triggered head-shake
 * + gradual tail-fan spread/close, bilingual copy, responsive framing.
 *
 * Deferred to phase 2 — scroll-driven approach/peck, Space-bar jump
 * physics, click-to-detach-and-retrieve individual feathers, procedural
 * Web Audio sounds with a mute toggle, and dedicated mobile touch gestures
 * (today's build already resizes/reframes for mobile, but doesn't yet
 * translate touch-drag into the same directional cues that mouse-move
 * gives on desktop).
 */

type Lang = "en" | "zh";

type Copy = {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  sub: string;
  nav: string[];
  storyEyebrow: string;
  storyTitle: string;
  storyBody: string;
  storyStatValue: string;
  storyStatLabel: string;
  processEyebrow: string;
  processTitle: string;
  steps: { title: string; body: string }[];
  contactEyebrow: string;
  contactTitle: string;
  contactBody: string;
  contactCta: string;
  footerNote: string;
  footerNavLabel: string;
  footerConnectLabel: string;
};

/** Concentric-ring motif echoing a peacock tail ocellus — built from primitives, matching the procedural-rig theme of the piece itself. */
function EyeMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="58" stroke="currentColor" strokeOpacity="0.15" />
      <circle cx="60" cy="60" r="42" stroke="currentColor" strokeOpacity="0.25" />
      <circle cx="60" cy="60" r="26" stroke="currentColor" strokeOpacity="0.4" />
      <circle cx="60" cy="60" r="10" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

function StepIcon({ index }: { index: number }) {
  const marks = [
    // 01 — procedural rig: a small hierarchy of joined nodes
    <svg key="rig" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-6 w-6">
      <circle cx="16" cy="7" r="3" stroke="currentColor" strokeOpacity="0.7" />
      <path d="M16 10v6M16 16l-8 8M16 16l8 8" stroke="currentColor" strokeOpacity="0.4" />
      <circle cx="8" cy="26" r="2.5" stroke="currentColor" strokeOpacity="0.7" />
      <circle cx="24" cy="26" r="2.5" stroke="currentColor" strokeOpacity="0.7" />
    </svg>,
    // 02 — painted textures: a brushed grain swatch
    <svg key="paint" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-6 w-6">
      <rect x="5" y="5" width="22" height="22" rx="4" stroke="currentColor" strokeOpacity="0.5" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" fillOpacity="0.6" />
      <circle cx="19" cy="10" r="1" fill="currentColor" fillOpacity="0.5" />
      <circle cx="22" cy="18" r="1.3" fill="currentColor" fillOpacity="0.6" />
      <circle cx="14" cy="21" r="1" fill="currentColor" fillOpacity="0.5" />
      <circle cx="17" cy="16" r="0.9" fill="currentColor" fillOpacity="0.5" />
    </svg>,
    // 03 — steering: a directional arrow with a wandering arc
    <svg key="steer" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-6 w-6">
      <path d="M6 22c4-8 12-12 20-10" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M22 9l4 3-4 3" stroke="currentColor" strokeOpacity="0.7" />
    </svg>,
  ];
  return <div className="text-[#2c2a22]">{marks[index]}</div>;
}

const COPY: Record<Lang, Copy> = {
  en: {
    line1: "Some beauty",
    line2: "stays for you.",
    line3: "A moment",
    line4: "of wonder.",
    sub: "Every feather remembers where it belongs.",
    nav: ["Index", "Story", "Process", "Contact"],
    storyEyebrow: "The story",
    storyTitle: "A bird made of light and patience",
    storyBody:
      "羽间 — \"among feathers\" — began as a study of how stillness and motion coexist in a single creature. The peacock in front of you isn't a recording or a pre-baked animation: every turn of the head, every spread of the tail is calculated in real time, driven by wherever your cursor happens to be. It is a small, quiet collaboration between you and something that only exists because you're here to watch it.",
    storyStatValue: "16",
    storyStatLabel: "individually rigged tail feathers, no imported model",
    processEyebrow: "The process",
    processTitle: "Built from geometry, light, and grain",
    steps: [
      {
        title: "Procedural rig",
        body: "No 3D model was imported. Body, neck, legs, and all sixteen tail feathers are primitive geometry, assembled into a hierarchy that lets a single turn of the head cascade naturally down through the neck and shoulders.",
      },
      {
        title: "Painted textures",
        body: "Every surface — plumage, eyes, feather rings — is painted at runtime on a canvas, then layered with fine per-pixel noise so the render reads as brushed and grainy rather than flat and synthetic.",
      },
      {
        title: "Steering, not scripting",
        body: "Movement is modeled as steering: your cursor supplies a direction and a magnitude, not a destination. The peacock never simply arrives and waits on top of your pointer — it keeps wandering within its own space.",
      },
    ],
    contactEyebrow: "Get in touch",
    contactTitle: "Interested in something like this?",
    contactBody:
      "This piece is a demonstration of procedural motion design and real-time 3D built for the web — no external model, no baked animation. If you're building something that needs this kind of craft, let's talk.",
    contactCta: "Start a conversation",
    footerNote: "Designed and built as a study in procedural motion.",
    footerNavLabel: "Explore",
    footerConnectLabel: "Connect",
  },
  zh: {
    line1: "有些美丽",
    line2: "为你停留。",
    line3: "一刻",
    line4: "惊叹。",
    sub: "每一片羽毛，都记得自己的位置。",
    nav: ["首页", "故事", "工艺", "联系"],
    storyEyebrow: "故事",
    storyTitle: "一只由光与耐心构成的鸟",
    storyBody:
      "「羽间」——探讨静与动如何在同一个生命中共存。眼前的孔雀并非录像，也没有预先烘焙的动画：每一次转头、每一次开屏，都是实时计算的结果，由你的光标所在之处驱动。这是你与一个只因你在场才存在的事物之间，一场安静的合作。",
    storyStatValue: "16",
    storyStatLabel: "片独立驱动的尾羽，没有导入任何模型",
    processEyebrow: "工艺",
    processTitle: "由几何、光线与颗粒构成",
    steps: [
      {
        title: "程序化骨架",
        body: "没有导入任何三维模型。身体、颈部、双腿以及全部十六片尾羽都由基本几何体组成，并搭建成层级结构，使头部的一次转动能自然地沿颈部与肩部传递下去。",
      },
      {
        title: "手绘质感",
        body: "每一个表面——羽毛、眼睛、羽眼纹理——都在运行时于画布上绘制，再叠加细腻的逐像素噪点，使渲染呈现出笔触感与颗粒感，而非平滑的合成质感。",
      },
      {
        title: "引导而非脚本",
        body: "运动被建模为「引导」：光标提供的是方向与强度，而非目的地。孔雀不会简单地走到光标位置停下等待——它始终在自己的空间里游走。",
      },
    ],
    contactEyebrow: "联系我们",
    contactTitle: "对这样的作品感兴趣？",
    contactBody:
      "这件作品展示了面向网页的程序化动效设计与实时三维技术——没有外部模型，没有预烘焙动画。如果你正在构建需要这种工艺的项目，欢迎联系。",
    contactCta: "开始对话",
    footerNote: "作为程序化动效的研究而设计与制作。",
    footerNavLabel: "浏览",
    footerConnectLabel: "联系",
  },
};

function PeacockApp() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const copy = COPY[lang];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const scene = new PeacockScene(el);
    return () => scene.dispose();
  }, []);

  return (
    <div
      className="w-full bg-[#ece6da]"
      style={{ background: "#ece6da", fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
    >
      {/* -------------------------------------------------------------- */}
      {/* HERO — the interactive Three.js peacock                        */}
      {/* -------------------------------------------------------------- */}
      <section id="index" className="relative h-screen w-full overflow-hidden bg-[#ece6da]">
        <div ref={containerRef} className="absolute inset-0" />

        {/* Foreground typography layer — pointer-events off so the canvas
            underneath still receives mouse/hover for the peacock. */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-6 py-6 md:px-10 md:py-8">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
              <span
                className="text-lg font-semibold tracking-[0.15em] text-[#2c2a22] md:text-xl"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                羽间
              </span>
              <span className="hidden h-px w-16 bg-[#2c2a22]/30 md:block" />
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              {copy.nav.map((item, i) => (
                <a
                  key={item}
                  href={`#${["index", "story", "process", "contact"][i]}`}
                  className="pointer-events-auto cursor-pointer text-[13px] font-medium tracking-wide text-[#2c2a22]/70 transition-colors hover:text-[#2c2a22]"
                >
                  {item}
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setLang((l) => (l === "en" ? "zh" : "en"))}
              className="pointer-events-auto rounded-full border border-[#2c2a22]/25 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#2c2a22]/80 transition-colors hover:border-[#2c2a22]/60 hover:text-[#2c2a22]"
            >
              {lang === "en" ? "中文" : "EN"}
            </button>
          </div>

          {/* Middle-left headline */}
          <div className="max-w-md">
            <h1
              className="text-[2.6rem] font-medium leading-[1.05] text-[#2c2a22] md:text-[3.4rem]"
              style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
            >
              {copy.line1}
              <br />
              <span className="italic text-[#4a5a45]">{copy.line2}</span>
              <br />
              {copy.line3}
              <br />
              <span className="italic text-[#4a5a45]">{copy.line4}</span>
            </h1>
            <p className="mt-4 max-w-[280px] text-sm text-[#2c2a22]/60">{copy.sub}</p>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div className="pointer-events-auto rounded-full border border-[#2c2a22]/25 bg-[#ece6da]/60 px-5 py-2 text-[11px] tracking-wide text-[#2c2a22]/70 backdrop-blur-sm">
              {lang === "en" ? "Move your cursor — the peacock will follow" : "移动光标，孔雀将随之而动"}
            </div>

            <div className="hidden flex-col items-end gap-1 text-right text-[11px] text-[#2c2a22]/50 md:flex">
              <span>Composition ratio</span>
              <div className="h-px w-28 bg-[#2c2a22]/20">
                <div className="h-px w-2/3 bg-[#2c2a22]/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- */}
      {/* STORY                                                          */}
      {/* -------------------------------------------------------------- */}
      <section id="story" className="border-t border-[#2c2a22]/10 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-[0.7fr_1fr] md:gap-6">
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2c2a22]/10 bg-[#e4ddce]/60 p-8 md:p-10">
            <EyeMotif className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 text-[#4a5a45] md:h-48 md:w-48" />
            <div className="relative">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4a5a45]">
                {copy.storyEyebrow}
              </span>
              <h2
                className="mt-4 text-3xl leading-[1.1] text-[#2c2a22] md:text-4xl"
                style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
              >
                {copy.storyTitle}
              </h2>
            </div>
            <div className="relative mt-10">
              <span
                className="text-4xl text-[#2c2a22] md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
              >
                {copy.storyStatValue}
              </span>
              <p className="mt-1 max-w-55 text-[13px] leading-snug text-[#2c2a22]/60">{copy.storyStatLabel}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#2c2a22]/10 p-8 md:p-10">
            <p className="text-[15px] leading-relaxed text-[#2c2a22]/70 md:text-base">{copy.storyBody}</p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- */}
      {/* PROCESS                                                        */}
      {/* -------------------------------------------------------------- */}
      <section id="process" className="border-t border-[#2c2a22]/10 bg-[#e4ddce] px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4a5a45]">
            {copy.processEyebrow}
          </span>
          <h2
            className="mt-4 max-w-md text-3xl leading-[1.1] text-[#2c2a22] md:text-4xl"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
          >
            {copy.processTitle}
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {copy.steps.map((step, i) => (
              <div
                key={step.title}
                className="flex flex-col gap-4 rounded-2xl border border-[#2c2a22]/12 bg-[#ece6da] p-7 shadow-[0_1px_0_rgba(44,42,34,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(44,42,34,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#2c2a22]/40">{`0${i + 1}`}</span>
                  <StepIcon index={i} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#2c2a22]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#2c2a22]/65">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- */}
      {/* CONTACT                                                        */}
      {/* -------------------------------------------------------------- */}
      <section id="contact" className="border-t border-[#2c2a22]/10 px-6 py-24 text-center md:px-10 md:py-32">
        <div className="mx-auto max-w-xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4a5a45]">
            {copy.contactEyebrow}
          </span>
          <h2
            className="mt-4 text-3xl leading-[1.1] text-[#2c2a22] md:text-4xl"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
          >
            {copy.contactTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#2c2a22]/65">{copy.contactBody}</p>
          <button
            type="button"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#2c2a22]/30 px-6 py-3 text-[13px] font-medium tracking-wide text-[#2c2a22] transition-colors hover:border-[#2c2a22]/60"
          >
            {copy.contactCta}
          </button>
        </div>
      </section>

      {/* -------------------------------------------------------------- */}
      {/* FOOTER                                                         */}
      {/* -------------------------------------------------------------- */}
      <footer className="border-t border-[#2c2a22]/15 bg-[#e4ddce]/50 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
          <div>
            <span
              className="text-lg tracking-[0.1em] text-[#2c2a22]"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              羽间 · Yǔ Jiān
            </span>
            <p className="mt-3 max-w-55 text-[13px] leading-relaxed text-[#2c2a22]/55">{copy.footerNote}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2c2a22]/45">
              {copy.footerNavLabel}
            </span>
            <ul className="mt-3 space-y-2 text-[13px] text-[#2c2a22]/65">
              {copy.nav.map((item, i) => (
                <li key={item}>
                  <a
                    href={`#${["index", "story", "process", "contact"][i]}`}
                    className="transition-colors hover:text-[#2c2a22]"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2c2a22]/45">
              {copy.footerConnectLabel}
            </span>
            <ul className="mt-3 space-y-2 text-[13px] text-[#2c2a22]/65">
              <li>
                <a href="#contact" className="transition-colors hover:text-[#2c2a22]">
                  {copy.contactCta}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-5xl border-t border-[#2c2a22]/10 pt-6 text-[11px] text-[#2c2a22]/45">
          © 2026
        </div>
      </footer>
    </div>
  );
}

export default PeacockApp;
