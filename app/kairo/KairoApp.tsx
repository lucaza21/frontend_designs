"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "./icons";

const NAV_LINKS = ["Workflows", "Clients", "Solutions", "Pricing"];

const WORKFLOWS = [
  {
    title: "Inbox Triage",
    description:
      "Kairo reads, tags, and routes incoming requests before your team even opens the inbox.",
  },
  {
    title: "Reporting",
    description:
      "Daily and weekly summaries assembled automatically from every workflow Kairo touches.",
  },
  {
    title: "Scheduling",
    description:
      "Meetings, hand-offs and reminders synced across every calendar your team uses.",
  },
];

export default function KairoApp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const ctaGradient = {
    background: "linear-gradient(to bottom, #2B2B2B, #101010)",
  };

  return (
    <>
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #1a1a1a 0%, #000 60%)" }}
      />

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/kairo/hero.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 flex h-full flex-col">
        <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
          <div className="flex items-center gap-2">
            <svg
              className="h-6 w-6 fill-[#010101] lg:fill-white"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
            </svg>
            <span className="text-lg font-semibold text-[#010101] lg:text-white">
              kairo
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg">
              {NAV_LINKS.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {label}
                  {label === "Solutions" && (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </a>
              ))}
            </div>
            <a
              href="#"
              className="flex items-center self-stretch rounded-full px-5 text-sm font-medium text-white hover:opacity-90"
              style={ctaGradient}
            >
              Get started
            </a>
          </div>

          <button
            className="md:hidden relative z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-lg text-[#010101] lg:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <Menu
              className={`absolute h-5 w-5 transition-all duration-300 ${
                open
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute h-5 w-5 transition-all duration-300 ${
                open
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </button>
        </nav>

        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <div
          className={`fixed right-0 top-0 z-40 h-full w-72 bg-black/90 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex flex-col gap-2 px-6 pt-24">
              {NAV_LINKS.map((label, i) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                  style={{
                    transitionDelay: open ? `${(i + 1) * 60}ms` : "0ms",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateX(0)" : "translateX(24px)",
                  }}
                >
                  {label}
                  {label === "Solutions" && (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </a>
              ))}
            </div>

            <div className="mt-auto px-6 pb-10">
              <button
                className="w-full rounded-full py-3 text-sm font-medium text-white text-center hover:opacity-90 transition-all duration-[400ms]"
                style={{
                  ...ctaGradient,
                  transitionDelay: open ? "300ms" : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(16px)",
                }}
              >
                Get started
              </button>
            </div>
          </div>
        </div>

        <main className="mt-auto flex flex-col gap-6 px-5 pb-8 sm:gap-8 sm:px-8 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-16">
          <div className="max-w-xl">
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-[#010101] sm:text-4xl lg:text-[3.5rem] lg:text-white">
              Ship AI workers that grind while you rest
            </h1>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 sm:mt-8 flex flex-col gap-3 sm:inline-flex sm:flex-row sm:items-center sm:rounded-full sm:bg-white sm:p-1.5"
            >
              <input
                type="email"
                placeholder="Type your email"
                className="rounded-full bg-white px-5 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none sm:w-64 sm:rounded-none sm:bg-transparent sm:px-4 sm:py-2"
              />
              <button
                type="submit"
                className="rounded-full px-6 py-3 text-sm font-medium text-white sm:py-2.5 hover:opacity-90"
                style={ctaGradient}
              >
                Get started
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:w-auto lg:gap-5">
            <div className="flex flex-col justify-between rounded-2xl bg-white/10 backdrop-blur-lg p-5 sm:w-64 sm:p-6">
              <div
                className="text-3xl font-normal tracking-tight text-[#010101] sm:text-4xl lg:text-white"
                style={{ fontFamily: "var(--font-silkscreen)" }}
              >
                42,500+
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#010101]/70 sm:mt-4 lg:text-white/70">
                Teams run Kairo to handle recurring ops daily.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-5 sm:w-64 sm:p-6">
              <div className="mb-3 flex items-center gap-2 sm:mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-black text-xs font-bold text-white">
                  V
                </div>
                <span className="text-sm font-semibold text-[#010101] lg:text-white">
                  Vantra
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#010101]/80 lg:text-white/80">
                With Kairo we went from managing tedious operational work to
                having AI agents that handle everything.
              </p>
              <div className="mt-4 flex items-center gap-3 sm:mt-5">
                <div className="h-9 w-9 shrink-0 rounded-full bg-white/20" />
                <div>
                  <div className="text-sm font-semibold text-[#010101] lg:text-white">
                    Sara Klein
                  </div>
                  <div className="text-xs text-[#010101]/60 lg:text-white/60">
                    Dir of Operations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>

    <section className="bg-black px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
          Automations that run themselves
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/60 sm:text-base">
          Three workflows Kairo handles quietly in the background, every day.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3 sm:gap-5">
        {WORKFLOWS.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white/10 p-6 backdrop-blur-lg"
          >
            <h3 className="text-base font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-black px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl bg-white/5 p-10 text-center sm:p-16">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Ready to hand off the busywork?
        </h2>
        <p className="max-w-md text-sm text-white/60 sm:text-base">
          Start free. Bring Kairo into the workflows that eat your week.
        </p>
        <a
          href="#"
          className="rounded-full px-6 py-3 text-sm font-medium text-white hover:opacity-90"
          style={ctaGradient}
        >
          Get started
        </a>
      </div>
    </section>

    <footer className="border-t border-white/10 bg-black px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-6 w-6 fill-white"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
          </svg>
          <span className="text-lg font-semibold text-white">kairo</span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl border-t border-white/10 pt-6 text-xs text-white/40">
        &copy; {new Date().getFullYear()} Kairo. All rights reserved.
      </div>
    </footer>
    </>
  );
}
