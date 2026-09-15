"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";

const ABOUT_TEXT =
  "Over the last seven years I have worked between Berlin and Paris, collaborating with production houses that craft cinema, series and short films. Together we have created work that has earned recognition at several international festivals.";

const HERO_NAV_ITEMS = ["Our story", "Collective", "Workshops", "Programs", "Inquiries"];

const NAV_HREFS: Record<string, string> = {
  "Our story": "#story",
  Collective: "#top",
  Workshops: "#programs",
  Programs: "#programs",
  Inquiries: "#inquiries",
};

type FeatureCard =
  | { kind: "video"; caption: string }
  | { kind: "content"; title: string; number: string; items: string[] };

const FEATURE_CARDS: FeatureCard[] = [
  { kind: "video", caption: "Your creative canvas." },
  {
    kind: "content",
    title: "Project Storyboard.",
    number: "01",
    items: [
      "Build shot lists that keep every scene accounted for.",
      "Collect mood boards that hold the tone of the piece.",
      "Track shared timelines across the whole crew.",
      "Send client review links that stay in sync.",
    ],
  },
  {
    kind: "content",
    title: "Smart Critiques.",
    number: "02",
    items: [
      "Run AI-assisted scene analysis on rough cuts.",
      "Capture creative notes directly on the frame.",
      "Connect the tool integrations your team already uses.",
    ],
  },
  {
    kind: "content",
    title: "Immersion Capsule.",
    number: "03",
    items: [
      "Silence notifications while you are in the cut.",
      "Layer ambient soundscapes built for deep focus.",
      "Sync your schedule so the work never slips.",
    ],
  },
];

interface WordsPullUpProps {
  text: string;
  className?: string;
}

function WordsPullUp({ text, className }: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </div>
  );
}

interface WordsPullUpMultiStyleProps {
  segments: { text: string; className?: string }[];
  className?: string;
  style?: import("react").CSSProperties;
}

function WordsPullUpMultiStyle({ segments, className, style }: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words = segments.flatMap((seg) =>
    seg.text.split(" ").filter(Boolean).map((word) => ({ word, className: seg.className }))
  );

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className ?? ""}`} style={style}>
      {words.map(({ word, className: wordClassName }, i) => (
        <motion.span
          key={i}
          className={`inline-block ${wordClassName ?? ""}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </div>
  );
}

interface AnimatedLetterProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function AnimatedLetter({ char, index, total, progress }: AnimatedLetterProps) {
  const charProgress = index / total;
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1]);

  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

export default function StudioFractalApp() {
  const aboutRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: aboutRef, offset: ["start 0.8", "end 0.2"] });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-black px-4 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.4)] sm:gap-6 md:gap-12 md:px-8 md:py-3 lg:gap-14">
        {HERO_NAV_ITEMS.map((item) => (
          <a
            key={item}
            href={NAV_HREFS[item]}
            className="nav-link text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
            style={{ color: "rgba(225,224,204,0.8)" }}
          >
            {item}
          </a>
        ))}
      </nav>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 hover:opacity-80 sm:bottom-8 sm:right-8 ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DEDBC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
      </button>

      <section id="top" className="h-screen p-4 md:p-6">
        <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/studio-fractal/hero.mp4"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ background: "linear-gradient(135deg,#1a1410,#000)" }}
          />
          <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-8">
            <div className="grid grid-cols-12 gap-6 md:gap-8 items-end">
              <div className="col-span-12 md:col-span-8">
                <h1
                  className="relative inline-block text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium leading-[0.85] tracking-[-0.07em]"
                  style={{ color: "#E1E0CC" }}
                >
                  <WordsPullUp text="Fractal" />
                  <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
                </h1>
              </div>
              <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[#DEDBC8]/70 text-xs sm:text-sm md:text-base"
                  style={{ lineHeight: 1.2 }}
                >
                  Studio Fractal is a worldwide network of visual artists, filmmakers and storytellers bound not by place, status or labels but by passion and hunger to unlock potential through light and perspective.
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button className="group inline-flex w-fit items-center gap-2 hover:gap-3 transition-all rounded-full bg-[#DEDBC8] pl-6 pr-1.5 py-1.5 text-black font-medium text-sm sm:text-base">
                    Join the collective
                    <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="story" className="flex scroll-mt-28 items-center justify-center bg-black px-4 py-20 md:py-32">
        <div className="w-full max-w-6xl rounded-2xl md:rounded-[2rem] bg-[#101010] px-6 py-16 text-center md:px-16 md:py-24">
          <p className="mb-6 text-[10px] sm:text-xs text-[#DEDBC8]">Visual arts</p>
          <WordsPullUpMultiStyle
            className="mx-auto max-w-3xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] sm:leading-[0.9]"
            style={{ color: "#E1E0CC" }}
            segments={[
              { text: "I am Mateo Reyes,", className: "font-normal" },
              { text: "a self-taught director.", className: "font-instrument-serif" },
              { text: "I work with color, light and narrative design.", className: "font-normal" },
            ]}
          />
          <p
            ref={aboutRef}
            className="mx-auto mt-8 max-w-3xl whitespace-pre-wrap text-left text-xs sm:text-sm md:text-base text-[#DEDBC8]"
          >
            {ABOUT_TEXT.split("").map((char, i) => (
              <AnimatedLetter key={i} char={char} index={i} total={ABOUT_TEXT.length} progress={scrollYProgress} />
            ))}
          </p>
        </div>
      </section>

      <section id="programs" className="relative min-h-screen scroll-mt-28 bg-black px-4 py-20 md:py-32">
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-1">
            <WordsPullUpMultiStyle
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal"
              style={{ color: "#E1E0CC" }}
              segments={[{ text: "Studio-grade craft for visionary creators.", className: "" }]}
            />
            <WordsPullUpMultiStyle
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal"
              segments={[{ text: "Built for pure vision. Powered by light.", className: "text-gray-500" }]}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
            {FEATURE_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={
                  card.kind === "video"
                    ? "relative h-[320px] overflow-hidden rounded-2xl lg:h-full"
                    : "flex flex-col rounded-2xl bg-[#212121] p-5 lg:h-full"
                }
              >
                {card.kind === "video" ? (
                  <>
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      src="/studio-fractal/feature.mp4"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ background: "linear-gradient(135deg,#1a1410,#000)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                    <p className="absolute bottom-0 left-0 right-0 p-5 text-sm text-[#E1E0CC]">{card.caption}</p>
                  </>
                ) : (
                  <>
                    <div className="mb-4 h-10 w-10 shrink-0 rounded-full bg-[#2a2a2a] sm:h-12 sm:w-12" />
                    <h3 className="text-base font-medium sm:text-lg" style={{ color: "#E1E0CC" }}>
                      {card.title} <span className="text-gray-500">{card.number}</span>
                    </h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {card.items.map((item, j) => (
                        <li key={j} className="flex gap-2">
                          <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#DEDBC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                          <span className="text-xs sm:text-sm text-gray-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#" className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm text-[#DEDBC8]">
                      Learn more
                      <svg className="h-4 w-4 -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </a>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer id="inquiries" className="scroll-mt-28 border-t border-white/10 bg-black px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-2xl font-medium" style={{ color: "#E1E0CC" }}>
              Studio Fractal<span className="align-super text-sm">*</span>
            </p>
            <p className="mt-3 max-w-xs text-xs text-gray-500 sm:text-sm">
              A worldwide network of visual artists, filmmakers and
              storytellers, working in light and perspective.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {HERO_NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={NAV_HREFS[item]}
                className="nav-link text-xs sm:text-sm"
                style={{ color: "rgba(225,224,204,0.8)" }}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="text-xs text-gray-500 sm:text-sm">
            <p>hello@studiofractal.co</p>
            <p className="mt-1">Berlin &middot; Paris</p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-[10px] text-gray-600 sm:text-xs">
          &copy; {new Date().getFullYear()} Studio Fractal. All rights reserved.
        </div>
      </footer>
    </>
  );
}
