import { useEffect, useRef, useState } from "react";
import { PeacockScene } from "./three/PeacockScene";

/**
 * 羽间 (Yǔ Jiān) — "Among Feathers" — interactive peacock hero.
 */

type Lang = "en" | "zh";

const COPY: Record<Lang, { line1: string; line2: string; line3: string; line4: string; sub: string; nav: string[] }> = {
  en: {
    line1: "Some beauty",
    line2: "stays for you.",
    line3: "A moment",
    line4: "of wonder.",
    sub: "Every feather remembers where it belongs.",
    nav: ["Index", "Story", "Process", "Contact"],
  },
  zh: {
    line1: "有些美丽",
    line2: "为你停留。",
    line3: "一刻",
    line4: "惊叹。",
    sub: "每一片羽毛，都记得自己的位置。",
    nav: ["首页", "故事", "工艺", "联系"],
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
    <div className="relative h-screen w-full overflow-hidden bg-[#ece6da]">
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
            {copy.nav.map((item) => (
              <span
                key={item}
                className="pointer-events-auto cursor-pointer text-[13px] font-medium tracking-wide text-[#2c2a22]/70 transition-colors hover:text-[#2c2a22]"
              >
                {item}
              </span>
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
    </div>
  );
}

export default App;
