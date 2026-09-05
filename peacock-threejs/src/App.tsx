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
  processEyebrow: string;
  processTitle: string;
  steps: { title: string; body: string }[];
  contactEyebrow: string;
  contactTitle: string;
  contactBody: string;
  contactCta: string;
  footerNote: string;
};

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
  },
};

function App() {
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
    <div className="w-full bg-[#ece6da]">
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
              <span className="font-zh text-lg font-semibold tracking-[0.15em] text-[#2c2a22] md:text-xl">羽间</span>
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
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[0.7fr_1fr] md:gap-16">
          <div>
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
          <p className="text-[15px] leading-relaxed text-[#2c2a22]/70 md:text-base">{copy.storyBody}</p>
        </div>
      </section>
    </div>
  );
}

export default App;
