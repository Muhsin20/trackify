"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

type NavKey = "HOME" | "ABOUT" | "HOW IT WORKS" | "FAQS" | "CONTACT";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState<Exclude<NavKey, "CONTACT" | "HOME"> | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const tickingRef = useRef(false);

  const navItems = useMemo<NavKey[]>(
    () => ["HOME", "ABOUT", "HOW IT WORKS", "FAQS", "CONTACT"],
    []
  );

  // rAF-throttled header state + progress bar
  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setIsScrolled(y > 10);

        const doc = document.documentElement;
        const h = doc.scrollHeight - doc.clientHeight;
        const p = h > 0 ? Math.min(100, Math.max(0, (y / h) * 100)) : 0;
        setScrollProgress(p);

        tickingRef.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll with offset
  const smoothScrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const navOffset = 88;
    const y = el.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
  }, []);

  // Active link tracking (only on /AboutMe)
  useEffect(() => {
    if (pathname !== "/AboutMe") {
      setActive(null);
      return;
    }
    const map: Record<string, Exclude<NavKey, "CONTACT" | "HOME">> = {
      "what-we-do": "ABOUT",
      "how-it-works": "HOW IT WORKS",
      faqs: "FAQS",
    };

    const ids = Object.keys(map);
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const ratio = e.intersectionRatio;
          const id = (e.target as HTMLElement).id;
          if (!best || ratio > best.ratio) best = { id, ratio };
        }
        if (best) setActive(map[best.id]);
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.05, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );

    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((s) => !s), []);

  // ESC closes drawer
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen, closeMenu]);

  // Body scroll lock for drawer
  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMenuOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Navigate → scroll to section on AboutMe
  const goAboutAndScroll = useCallback(
    (targetId: string, optimisticActive?: Exclude<NavKey, "CONTACT" | "HOME">) => {
      if (pathname === "/AboutMe" && optimisticActive) {
        setActive(optimisticActive);
      }
      if (pathname === "/AboutMe") {
        smoothScrollToId(targetId);
      } else {
        sessionStorage.setItem("scrollTarget", targetId);
        router.push("/AboutMe");
      }
    },
    [pathname, router, smoothScrollToId]
  );

  const handleNavigation = (link: NavKey) => {
    closeMenu();

    if (link === "HOME") {
      if (pathname === "/AboutMe") {
        setActive(null);
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
      } else {
        sessionStorage.removeItem("scrollTarget");
        setActive(null);
        router.push("/AboutMe");
      }
      return;
    }

    if (link === "CONTACT") {
      setActive(null);
      router.push("/Contact");
      return;
    }

    const map: Record<Exclude<NavKey, "CONTACT" | "HOME">, string> = {
      ABOUT: "what-we-do",
      "HOW IT WORKS": "how-it-works",
      FAQS: "faqs",
    };
    const id = map[link];
    if (id) goAboutAndScroll(id, link);
  };

  const showActive = pathname === "/AboutMe";
  const isActive = (link: NavKey) =>
    showActive &&
    ((link === "HOME" && active === null) ||
      (link !== "HOME" && link !== "CONTACT" && link === active));

  // ultra-subtle noise for texture
  const noise =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><filter id='n'><feTurbulence baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0 0 0 0 0 0.03'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className={[
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 font-sans", // ← unify font
        isScrolled ? "bg-neutral-950/70 backdrop-blur-md border-b border-white/10" : "bg-neutral-950/40 backdrop-blur-[6px]",
      ].join(" ")}
      style={{ WebkitBackdropFilter: "saturate(150%) blur(10px)" }}
    >
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[9999] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900"
      >
        Skip to content
      </a>

      {/* Upgraded Scroll progress */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-[3px]">
        <div
          className="h-full relative overflow-hidden"
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-purple-500 rounded-r" />
          <div className="absolute inset-0 blur-sm opacity-70 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-purple-500 rounded-r" />
          <div className="absolute inset-0 mix-blend-screen opacity-40 bg-[linear-gradient(110deg,rgba(255,255,255,0.0)_0%,rgba(255,255,255,0.5)_15%,rgba(255,255,255,0.0)_30%)] bg-[length:160px_100%] animate-[barMove_2.6s_linear_infinite] rounded-r" />
        </div>
      </div>

      {/* Minimal accents (transparent, no spin) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-10 -left-28 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -bottom-12 -right-32 h-48 w-48 rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Liquid glass container */}
        <div
          className={[
            "glass-nav relative flex items-center justify-between h-14 sm:h-16 px-3 sm:px-5",
            "rounded-2xl border border-white/10 text-white",
            "bg-[rgba(10,10,12,0.38)] sm:bg-[rgba(10,10,12,0.42)]",
            "backdrop-blur-2xl backdrop-saturate-150",
            "shadow-[0_12px_40px_-24px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden",
          ].join(" ")}
          style={{ backgroundImage: `${noise}`, backgroundBlendMode: "overlay" }}
        >
          {/* top glossy ridge */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-0.5 h-12"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.22), rgba(255,255,255,0.06), transparent)",
            }}
          />
          {/* inner soft vignette */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 140% at 50% -20%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0) 60%)",
            }}
          />

          {/* Brand */}
          <button
            onClick={() => handleNavigation("HOME")}
            className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded-lg"
            aria-label="Go to home"
          >
            <span className="relative block w-8 h-8 sm:w-9 sm:h-9">
              <Image
                src="/images/trackify-cloud-logo.png"
                alt="Trackify Logo"
                fill
                priority
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </span>
            <span className="text-base sm:text-lg font-semibold tracking-tight bg-gradient-to-r from-indigo-200 via-fuchsia-200 to-purple-300 text-transparent bg-clip-text">
              Trackify
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((link) => {
              const activeNow = isActive(link);
              return (
                <button
                  key={link}
                  onClick={() => handleNavigation(link)}
                  aria-current={activeNow ? "page" : undefined}
                  className={[
                    "relative inline-flex items-center px-2.5 py-2 rounded-md text-sm font-medium tracking-wide transition",
                    "text-white/85 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300",
                  ].join(" ")}
                >
                  {link}
                  {/* clean underline */}
                  <span
                    aria-hidden
                    className={[
                      "pointer-events-none absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300",
                      activeNow
                        ? "w-3/4 bg-white/95 shadow-[0_0_12px_2px_rgba(255,255,255,0.25)]"
                        : "w-0 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-2/3",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>

          {/* Desktop Auth — unified palette & font */}
          <div className="hidden md:flex items-center gap-2">
            {/* Glassy, subtle */}
            <button
              onClick={() => router.push("/login")}
              className="px-3.5 py-1.5 text-sm font-medium text-white/90 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              Log in
            </button>
            {/* Vibrant, matches accent gradient */}
            <button
              onClick={() => router.push("/register")}
              className="px-3.5 py-1.5 text-sm font-medium text-white rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-500 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_8px_20px_-12px_rgba(168,85,247,0.8)] hover:opacity-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
            >
              Sign up
            </button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setIsMenuOpen((s) => !s)}
            className="md:hidden p-2 text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded-md"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile overlay */}
        <div
          ref={overlayRef}
          onClick={(e) => {
            if (e.target === overlayRef.current) setIsMenuOpen(false);
          }}
          className={[
            "md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity",
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
          aria-hidden={!isMenuOpen}
        />

        {/* Mobile drawer */}
        <div
          id="mobile-menu"
          className={[
            "md:hidden fixed right-4 left-4 top-[76px] z-50 origin-top rounded-xl",
            "border border-white/10 bg-black/70 text-white backdrop-blur-2xl",
            "shadow-2xl transition-[opacity,transform] duration-300",
            isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          style={{ backgroundImage: noise, backgroundBlendMode: "overlay" }}
        >
          {/* top hairline */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
          <div className="p-2.5">
            {navItems.map((link) => (
              <button
                key={link}
                onClick={() => handleNavigation(link)}
                className="group flex w-full items-center justify-between rounded-lg px-3.5 py-3 text-white/90 hover:bg-white/10 transition-colors"
              >
                <span className="text-sm font-medium">{link}</span>
                <svg className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ))}
            <div className="mt-2 border-t border-white/15 pt-2 grid grid-cols-2 gap-2">
              {/* Mobile: glass login */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/login");
                }}
                className="rounded-lg px-3.5 py-3 text-sm font-medium text-white/90 border border-white/15 bg-white/5 hover:bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors"
              >
                Log in
              </button>
              {/* Mobile: gradient signup */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/register");
                }}
                className="rounded-lg px-3.5 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-500 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_8px_20px_-12px_rgba(168,85,247,0.8)] hover:opacity-95 transition"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* tiny styles — ring moved to CSS (no inline mask), progress sweep */}
      <style>{`
        /* Gradient ring without inline mask properties (prevents React mask warnings) */
        .glass-nav {
          position: relative;
        }
        .glass-nav::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 16px;
          padding: 1px;
          pointer-events: none;
          background: conic-gradient(
            from 180deg at 50% 50%,
            rgba(99,102,241,0.18),
            rgba(236,72,153,0.18),
            rgba(147,51,234,0.18),
            transparent 60%
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: .7;
        }

        @keyframes barMove {
          0%   { background-position: 160px 0; }
          100% { background-position: -160px 0; }
        }

        @supports not ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))) {
          .glass-nav { background: rgba(10,10,12,0.6); }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-[barMove_2.6s_linear_infinite] { animation: none !important; }
        }
      `}</style>
    </nav>
  );
}
