"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NAV_LINKS = ["Home", "Product", "Case Studies", "Contact"];

const STATS = [
  { glyph: "<", target: 120, suffix: "ms", decimals: 0, label: "Inference Time" },
  { glyph: "%", target: 99.99, suffix: "%", decimals: 2, label: "Platform Uptime" },
  { glyph: "*", target: 24, suffix: "/7", decimals: 0, label: "Autonomous Runtime" },
  { glyph: "#", target: 2.4, suffix: "M", decimals: 1, label: "Context Windows" },
];

const CAPABILITIES = [
  {
    glyph: "{}",
    title: "Modular Reasoning",
    description: "Composable reasoning chains, swap models without rewriting logic.",
  },
  {
    glyph: "->",
    title: "Adaptive Memory",
    description: "Context that persists and compresses itself across long sessions.",
  },
  {
    glyph: "()",
    title: "Secure By Design",
    description: "Every call sandboxed, every credential scoped and revocable.",
  },
  {
    glyph: "::",
    title: "Elastic Scale",
    description: "From one workflow to thousands of concurrent agents, no re-architecture.",
  },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function formatValue(value: number, decimals: number, suffix: string) {
  return value.toFixed(decimals) + suffix;
}

export default function AxiomApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      STATS.forEach((stat, i) => {
        const el = valueRefs.current[i];
        if (el) {
          el.textContent = formatValue(stat.target, stat.decimals, stat.suffix);
        }
      });
      return;
    }

    const statsEl = statsRef.current;
    if (!statsEl) {
      return;
    }

    const timeouts: number[] = [];
    const frames: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          observer.unobserve(entry.target);
          observer.disconnect();

          STATS.forEach((stat, i) => {
            const timeoutId = window.setTimeout(() => {
              const duration = 1500 + i * 80;
              let startTime = -1;

              const step = (now: number) => {
                if (startTime < 0) {
                  startTime = now;
                }
                const elapsed = now - startTime;
                const p = Math.min(elapsed / duration, 1);
                const el = valueRefs.current[i];

                if (el) {
                  if (p >= 1) {
                    el.textContent = formatValue(
                      stat.target,
                      stat.decimals,
                      stat.suffix
                    );
                  } else {
                    el.textContent = formatValue(
                      stat.target * easeOutCubic(p),
                      stat.decimals,
                      stat.suffix
                    );
                  }
                }

                if (p >= 1) {
                  return;
                }
                frames[i] = window.requestAnimationFrame(step);
              };

              frames[i] = window.requestAnimationFrame(step);
            }, 480 + i * 90);

            timeouts.push(timeoutId);
          });
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(statsEl);

    return () => {
      observer.disconnect();
      timeouts.forEach((id) => window.clearTimeout(id));
      frames.forEach((id) => window.cancelAnimationFrame(id));
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
    <section className="hero-viewport">
      <div className="bg-fallback" aria-hidden="true" />

      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/axiom/hero.mp4" type="video/mp4" />
      </video>

      <div className="hero-scrim" aria-hidden="true" />

      <header className="site-header">
        <div className="header-inner">
          <a className="logo-btn" href="#" aria-label="Axiom home">
            <svg
              className="logo-mark"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M12 3.5 20.5 12 12 20.5 3.5 12Z" />
              <path d="M7.5 12h9" />
            </svg>
          </a>
          <nav className="nav-pill" aria-label="Primary">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link}
                className={index === 0 ? "nav-link is-active" : "nav-link"}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
          <a className="signin-pill" href="#">
            Sign In
          </a>
        </div>

        <div className="mobile-bar">
          <a className="logo-btn" href="#" aria-label="Axiom home">
            <svg
              className="logo-mark"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M12 3.5 20.5 12 12 20.5 3.5 12Z" />
              <path d="M7.5 12h9" />
            </svg>
          </a>
          <button
            type="button"
            className={menuOpen ? "burger is-open" : "burger"}
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="axiom-mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuOpen && (
        <>
          <div
            className="menu-overlay"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            className="menu-sheet"
            id="axiom-mobile-menu"
            role="dialog"
            aria-modal="true"
          >
            {NAV_LINKS.map((link, index) => (
              <a
                key={link}
                className="sheet-link"
                href="#"
                onClick={closeMenu}
                style={{ animationDelay: `${(index + 1) * 60}ms` }}
              >
                {link}
              </a>
            ))}
            <a
              className="sheet-signin"
              href="#"
              onClick={closeMenu}
              style={{ animationDelay: `${(NAV_LINKS.length + 1) * 60}ms` }}
            >
              Sign In
            </a>
          </div>
        </>
      )}

      <main className="hero">
        <div className="trust">
          <div className="avatars">
            <span className="avatar avatar-1">
              <span className="avatar-inner">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="7" />
                </svg>
              </span>
            </span>
            <span className="avatar avatar-2">
              <span className="avatar-inner">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 5 19.5 18.5H4.5Z" />
                </svg>
              </span>
            </span>
            <span className="avatar avatar-3">
              <span className="avatar-inner">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="5.5" y="5.5" width="13" height="13" />
                </svg>
              </span>
            </span>
          </div>
          <span className="trust-pill">Trusted by 2000+ builders</span>
        </div>

        <h1 className="headline">
          <span className="line line-1">Intelligence</span>
          <span className="line line-2">Designed To Evolve</span>
        </h1>

        <p className="subhead">
          Build applications that reason, adapt and collaborate using a modular
          AI platform designed for production.
        </p>

        <a className="cta" href="#">
          Get Started
        </a>
      </main>
    </section>

    <section className="section-pad" id="capabilities">
      <div className="capabilities-heading anim" style={{ "--d": "0s" } as React.CSSProperties}>
        <h2>Built for how AI actually ships.</h2>
        <p>Four primitives that compose into anything you need to build.</p>
      </div>
      <div className="capabilities-grid">
        {CAPABILITIES.map((cap, i) => (
          <div
            className="capability-card anim"
            key={cap.title}
            style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
          >
            <span className="capability-glyph">{cap.glyph}</span>
            <h3>{cap.title}</h3>
            <p>{cap.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="section-pad" id="cta-band">
      <div className="cta-band anim" style={{ "--d": "0s" } as React.CSSProperties}>
        <h2>Ready to build with Axiom?</h2>
        <p>Start free. Scale when you&apos;re ready.</p>
        <a className="cta" href="#">
          Get Started
        </a>
      </div>
    </section>

    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <svg
            className="logo-mark"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M12 3.5 20.5 12 12 20.5 3.5 12Z" />
            <path d="M7.5 12h9" />
          </svg>
          axiom
        </div>
        <div className="footer-links">
          <a href="#">Product</a>
          <a href="#">Docs</a>
          <a href="#">Status</a>
        </div>
      </div>

      <div className="stats" ref={statsRef}>
        {STATS.map((stat, i) => (
          <div className="stat" key={stat.label}>
            <span className="stat-glyph">{stat.glyph}</span>
            <span
              className="stat-value"
              ref={(el) => {
                valueRefs.current[i] = el;
              }}
            >
              {formatValue(0, stat.decimals, stat.suffix)}
            </span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Axiom. All rights reserved.
      </div>
    </footer>
    </>
  );
}
