"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Check, ChevronDown, Menu, X } from "./icons";

const NAV_LINKS = ["Workflows", "Clients", "Solutions", "Pricing"];

const CLIENTS = ["Vantra", "Loopwell", "Northstar Ops", "Fenwick & Co", "Greymark"];

const TESTIMONIALS = [
  {
    initial: "V",
    company: "Vantra",
    quote:
      "With Kairo we went from managing tedious operational work to having AI agents that handle everything.",
    name: "Sara Klein",
    role: "Dir of Operations",
  },
  {
    initial: "L",
    company: "Loopwell",
    quote: "Our support backlog dropped by half in the first month.",
    name: "Marcus Chen",
    role: "Head of Support",
  },
  {
    initial: "N",
    company: "Northstar Ops",
    quote:
      "It just runs. We forget it's even there until the reports show up.",
    name: "Elena Vos",
    role: "COO",
  },
];

const SOLUTIONS = [
  {
    title: "For Operations",
    points: [
      "Automated intake and routing",
      "Zero manual reporting",
      "Always-on scheduling",
    ],
  },
  {
    title: "For Founders",
    points: [
      "One dashboard, every workflow",
      "No new headcount needed",
      "Scales with the team",
    ],
  },
  {
    title: "For Support Teams",
    points: [
      "Faster first response",
      "Consistent tagging and routing",
      "Escalations that don't fall through",
    ],
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "For small teams testing their first workflow.",
    features: ["1 active workflow", "Email support", "Up to 500 tasks/mo"],
    popular: false,
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    description: "For teams running Kairo across daily operations.",
    features: [
      "Unlimited workflows",
      "Priority support",
      "Up to 10,000 tasks/mo",
      "Shared team dashboard",
    ],
    popular: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    description: "For orgs running Kairo across every department.",
    features: [
      "Unlimited everything",
      "Dedicated success manager",
      "Custom integrations",
    ],
    popular: false,
  },
];

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
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ctaGradient = {
    background: "linear-gradient(to bottom, #2B2B2B, #101010)",
  };

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
        <div className="flex items-center gap-2">
          <svg
            className="h-6 w-6 fill-white"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
          </svg>
          <span className="text-lg font-semibold text-white">
            kairo
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
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
            href="#pricing"
            className="flex items-center self-stretch rounded-full px-5 text-sm font-medium text-white hover:opacity-90"
            style={ctaGradient}
          >
            Get started
          </a>
        </div>

        <button
          className="md:hidden relative z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-lg text-white"
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
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setOpen(false)}
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
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="block w-full rounded-full py-3 text-sm font-medium text-white text-center hover:opacity-90 transition-all duration-[400ms]"
                style={{
                  ...ctaGradient,
                  transitionDelay: open ? "300ms" : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(16px)",
                }}
              >
                Get started
              </a>
            </div>
          </div>
        </div>
    </header>

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

    <section id="workflows" className="relative scroll-mt-24 overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(640px circle at 15% -10%, rgba(245,158,11,0.10), transparent 60%), radial-gradient(640px circle at 85% 110%, rgba(245,158,11,0.07), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <span
          className="text-xs uppercase tracking-[0.25em] text-amber-400/80"
          style={{ fontFamily: "var(--font-silkscreen)" }}
        >
          Workflows
        </span>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
          Automations that run themselves
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/60 sm:text-base">
          Three workflows Kairo handles quietly in the background, every day.
        </p>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3 sm:gap-5">
        {WORKFLOWS.map((item, i) => (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:from-white/[0.12]"
          >
            <div
              className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 text-sm text-amber-400 transition-colors duration-300 group-hover:bg-amber-400/20"
              style={{ fontFamily: "var(--font-silkscreen)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
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

    <section id="clients" className="relative scroll-mt-24 overflow-hidden bg-[#100d09] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="relative mx-auto max-w-5xl">
        <span
          className="text-xs uppercase tracking-[0.25em] text-amber-400/80"
          style={{ fontFamily: "var(--font-silkscreen)" }}
        >
          Clients
        </span>
        <h2 className="mt-3 max-w-md text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
          Trusted by teams like yours
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-7">
            <span
              className="block text-6xl leading-none text-amber-400/40 sm:text-7xl"
              style={{ fontFamily: "var(--font-silkscreen)" }}
            >
              &ldquo;
            </span>
            <p className="-mt-6 text-xl leading-snug text-white sm:text-2xl lg:text-3xl">
              {TESTIMONIALS[0].quote}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-white/20" />
              <div>
                <div className="text-sm font-semibold text-white">
                  {TESTIMONIALS[0].name}
                </div>
                <div className="text-xs text-white/50">
                  {TESTIMONIALS[0].role} &middot; {TESTIMONIALS[0].company}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5">
            {TESTIMONIALS.slice(1).map((item) => (
              <div
                key={item.company}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-black text-xs font-bold text-white">
                    {item.initial}
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {item.company}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/70">
                  {item.quote}
                </p>
                <div className="mt-3 text-xs text-white/50">
                  {item.name}, {item.role}
                </div>
              </div>
            ))}

            <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6">
              {CLIENTS.map((client) => (
                <span
                  key={client}
                  className="text-xs font-semibold uppercase tracking-widest text-white/30 transition-colors hover:text-white/60"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="solutions" className="relative scroll-mt-24 overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(640px circle at 85% -10%, rgba(245,158,11,0.10), transparent 60%), radial-gradient(640px circle at 15% 110%, rgba(245,158,11,0.07), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <span
          className="text-xs uppercase tracking-[0.25em] text-amber-400/80"
          style={{ fontFamily: "var(--font-silkscreen)" }}
        >
          Solutions
        </span>
        <h2 className="mt-3 max-w-lg text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
          Built for how your team already works
        </h2>
        <p className="mt-3 max-w-md text-sm text-white/60 sm:text-base">
          Kairo adapts to the role, not the other way around.
        </p>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-5xl gap-4 sm:gap-5">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-lg sm:flex sm:items-center sm:gap-10 sm:p-8">
          <h3 className="text-base font-semibold text-white sm:w-48 sm:shrink-0 sm:text-lg">
            {SOLUTIONS[0].title}
          </h3>
          <ul className="mt-4 flex flex-col gap-3 sm:mt-0 sm:flex-1 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {SOLUTIONS[0].points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span className="text-sm leading-relaxed text-white/70">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {SOLUTIONS.slice(1).map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-lg"
            >
              <h3 className="text-base font-semibold text-white">
                {item.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span className="text-sm leading-relaxed text-white/70">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="pricing" className="relative scroll-mt-24 overflow-hidden bg-[#100d09] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="relative mx-auto max-w-5xl text-center">
        <span
          className="text-xs uppercase tracking-[0.25em] text-amber-400/80"
          style={{ fontFamily: "var(--font-silkscreen)" }}
        >
          Pricing
        </span>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
          Simple pricing, no surprises
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/60 sm:text-base">
          Start free. Upgrade when Kairo is running workflows you don&apos;t
          want to live without.
        </p>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-5xl items-center gap-5 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-7 backdrop-blur-lg ${
              plan.popular
                ? "border-amber-400/40 bg-gradient-to-b from-white/[0.12] to-white/[0.03] shadow-[0_0_40px_rgba(245,158,11,0.12)] sm:scale-[1.06]"
                : "border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02]"
            }`}
          >
            {plan.popular && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black"
                style={{ fontFamily: "var(--font-silkscreen)" }}
              >
                Most popular
              </span>
            )}
            <h3 className="text-base font-semibold text-white">
              {plan.name}
            </h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-white">
                {plan.price}
              </span>
              <span className="text-sm text-white/50">{plan.period}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {plan.description}
            </p>
            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <span className="text-sm leading-relaxed text-white/70">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className={`mt-8 rounded-full py-3 text-center text-sm font-medium transition-opacity hover:opacity-90 ${
                plan.popular ? "text-white" : "border border-white/15 text-white/80"
              }`}
              style={plan.popular ? ctaGradient : undefined}
            >
              Get started
            </a>
          </div>
        ))}
      </div>
    </section>

    <section className="relative overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="relative mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.01] p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/20 blur-[100px]" />

          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Ready to hand off the busywork?
            </h2>
            <p className="max-w-md text-sm text-white/60 sm:text-base">
              Start free. Bring Kairo into the workflows that eat your week.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <a
                href="#pricing"
                className="rounded-full px-6 py-3 text-sm font-medium text-white shadow-[0_0_30px_rgba(245,158,11,0.18)] hover:opacity-90"
                style={ctaGradient}
              >
                Get started
              </a>
              <a
                href="#"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer className="relative border-t border-white/10 bg-black px-5 py-12 sm:px-8 lg:px-12">
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
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
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

    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-amber-400/40 hover:text-amber-400 sm:bottom-8 sm:right-8 ${
        showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
    </>
  );
}
