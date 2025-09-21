"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { Typewriter } from "react-simple-typewriter";
import { useEffect, useState, ReactNode, ElementType, MouseEvent } from "react";
import { Fade, Slide } from "react-awesome-reveal";
import Footer from "../components/footer";
import FAQS from "../components/FAQS";
import MeetOurExperts from "../components/MeetOurExperts";

/* -----------------------------------------------------------
   Reusable gradient-framed wrapper for all cards — upgraded
   - Optional 3D tilt on hover (interactive)
   - Conic-gradient hover aura
   - Top hairline + soft sheen
   ----------------------------------------------------------- */
function ColorFrame({
  as,
  children,
  className = "",
  rounded = "rounded-2xl",
  withSheen = true,
  interactive = false,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  rounded?: string;
  withSheen?: boolean;
  interactive?: boolean;
}) {
  const Tag: any = as || "div";

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;  // 0 → 1
    const py = (e.clientY - r.top) / r.height;  // 0 → 1
    const rx = (py - 0.5) * -10; // rotateX
    const ry = (px - 0.5) * 12;  // rotateY
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--px", `${px}`);
    el.style.setProperty("--py", `${py}`);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const el = e.currentTarget;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <Tag
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={[
        "relative group will-change-transform transform-gpu",
        rounded,
        interactive ? "tilt-card" : "",
        className,
        // conic aura on hover (super subtle)
        "before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none",
        "before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300",
        'before:bg-[conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.12)_0%,rgba(168,85,247,0.10)_40%,rgba(236,72,153,0.10)_70%,rgba(99,102,241,0.12)_100%)]',
        "before:blur-[18px]",
      ].join(" ")}
    >
      {/* unified top hairline */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-purple-500 opacity-70" />

      {/* hover glow (non-interactive) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow:
            "0 0 0 1px rgba(99,102,241,0.22), 0 28px 60px -28px rgba(79,70,229,0.45)",
          borderRadius: "inherit",
        }}
      />

      {/* moving sheen */}
      {withSheen && (
        <span
          aria-hidden
          className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none"
        >
          <span className="sheen absolute -left-1/3 top-0 h-full w-1/3 opacity-0 group-hover:opacity-[0.12] transition-opacity duration-200" />
        </span>
      )}

      {children}
    </Tag>
  );
}

export default function AboutMe() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Smooth scroll helper with offset for fixed navbar
  const smoothScrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navOffset = 88;
    const y = el.getBoundingClientRect().top + window.scrollY - navOffset;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
  };

  // disable browser restore
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
  }, []);

  // force top & handle session scroll target
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
    const target = sessionStorage.getItem("scrollTarget");
    if (target) {
      setTimeout(() => smoothScrollToId(target), 150);
      sessionStorage.removeItem("scrollTarget");
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // data
  const experts = [
    {
      name: "Muhsin",
      role: "Co-Founder & CEO",
      photo: "/images/madan.png",
      social: { linkedin: "https://www.linkedin.com/in/muhsin-adan-916026227/", email: "muhsinadan588@gmail.com" },
    },
    {
      name: "Ammaar",
      role: "Co-Founder & CEO",
      photo: "/images/akhan362.png",
      social: { linkedin: "https://www.linkedin.com/in/ammaar-khan/", email: "ammaark76@gmail.com" },
    },
  ];

  const features = [
    { title: "Career Insights", desc: "Signal over noise—see what actually moves your job search forward.", icon: "/images/vision.png" },
    { title: "Power Tools", desc: "Applications, contacts, reminders—organized and lightning-fast.", icon: "/images/tool-box.png" },
    { title: "Goal Tracking", desc: "Set targets, measure progress, and celebrate wins that compound.", icon: "/images/target.png" },
  ];

  const steps = [
    { k: "01", t: "Create your account", d: "Start free—no card needed." },
    { k: "02", t: "Log your applications", d: "Import or add in seconds." },
    { k: "03", t: "Optimize & win", d: "See patterns; boost interviews." },
  ];

  const goLogin = () => router.push("/login");

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        aria-label="Hero"
        className="relative w-full min-h-[76vh] md:min-h-[84vh] pt-24 flex items-center justify-center px-4 sm:px-8 overflow-hidden
                   bg-gradient-to-b from-white via-indigo-50 to-white dark:from-[#0b0b10] dark:via-[#0f1117] dark:to-[#0b0b10]"
      >
        {/* soft grain & shapes */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full opacity-[0.05] dark:opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M36 0H0V36" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-800 dark:text-gray-200" />
          </svg>
          <div className="grain absolute inset-0" />
          <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-indigo-400/18 blur-[110px]" />
          <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-purple-500/18 blur-[120px]" />
          <div className="absolute right-10 top-10 h-56 w-56 rounded-full ring-8 ring-indigo-200/35 dark:ring-indigo-500/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl flex flex-col items-center text-center gap-5 md:gap-7">
          <Fade triggerOnce>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 dark:border-indigo-500/30 bg-white/75 dark:bg-white/5 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-sm backdrop-blur-sm">
              ✨ Built by students, for students & professionals
            </span>
          </Fade>

          <Fade triggerOnce>
            <h1 className="font-Poppins text-3xl sm:text-4xl md:text-6xl font-extrabold leading-snug md:leading-tight tracking-tight text-gray-900 dark:text-white">
              <span className="block">
                <Typewriter words={["We Help Professionals,"]} loop={1} cursor={false} typeSpeed={90} />
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-300 dark:to-purple-300">
                <Typewriter
                  words={["Streamline Their Journey.", "Organize Their Job Hunt.", "Reach Their Goals."]}
                  loop={Infinity}
                  cursor
                  cursorStyle="|"
                  typeSpeed={60}
                  deleteSpeed={45}
                  delaySpeed={1200}
                />
              </span>
            </h1>
          </Fade>

          <Slide direction="up" triggerOnce>
            <p className="pt-2 text-base sm:text-lg md:text-xl font-serif font-light max-w-3xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to <span className="text-indigo-700 dark:text-indigo-300 font-semibold">Trackify</span> — your partner in career success.
              Plan with clarity, apply with confidence, and keep your momentum.
            </p>
          </Slide>

          <Fade delay={100} triggerOnce>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <button
                onClick={goLogin}
                className="px-7 sm:px-8 py-3 rounded-full bg-black text-white text-base sm:text-lg font-semibold shadow-lg
                           hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200
                           hover:bg-indigo-700 dark:bg-white dark:text-black dark:hover:bg-indigo-200"
                aria-label="Get Started for Free"
              >
                Get Started — It’s Free
              </button>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollToId("how-it-works");
                }}
                className="px-7 sm:px-8 py-3 rounded-full bg-white text-gray-900 dark:bg-white/10 dark:text-white text-base sm:text-lg font-semibold
                           shadow hover:shadow-md border border-gray-200 dark:border-white/15
                           hover:border-indigo-300 dark:hover:border-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                See how it works
              </a>
            </div>
          </Fade>

          {/* scroll cue */}
          <Fade delay={300} triggerOnce>
            <button
              onClick={() => smoothScrollToId("what-we-do")}
              aria-label="Scroll to content"
              className="group mt-4 inline-flex flex-col items-center text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 transition"
            >
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <svg className="mt-1 h-5 w-5 group-hover:animate-bounce" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 16a1 1 0 0 1-.707-.293l-5-5a1 1 0 1 1 1.414-1.414L12 13.586l4.293-4.293a1 1 0 0 1 1.414 1.414l-5 5A1 1 0 0 1 12 16z" />
              </svg>
            </button>
          </Fade>
        </div>
      </section>

      {/* WHAT WE DO — feature cards */}
      <section
        id="what-we-do"
        className="scroll-mt-24 md:scroll-mt-28 relative w-full bg-gray-100 dark:bg-[#0e0f14] pt-16 md:pt-20 pb-24 md:pb-28 px-4 sm:px-8"
      >
        <div className="absolute top-0 left-0 w-full h-[40px]" aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
            <path className="fill-white dark:fill-[#0b0b10]" d="M0,224C120,160,240,96,360,106.7C480,117,600,203,720,213.3C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Fade triggerOnce>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 inline-block relative">
              What <span className="text-indigo-700 dark:text-indigo-300">We Do</span>
              <span className="block absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </h2>
          </Fade>

          <Slide direction="up" triggerOnce>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              <span className="text-indigo-700 dark:text-indigo-300 font-semibold">Trackify</span> gives you clarity and control—streamlined tools,
              motivating visuals, and insights that actually move the needle.
            </p>
          </Slide>

          {mounted && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 md:mb-24 lg:mb-28">
              {features.map((f, i) => (
                <Fade key={i} delay={i * 120} triggerOnce>
                  <ColorFrame
                    interactive
                    className="border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-md shadow-sm hover:shadow-2xl"
                  >
                    <div className="relative p-6 sm:p-7">
                      <div className="flex items-center gap-3">
                        {f.icon && (
                          <Image
                            src={f.icon}
                            alt={`${f.title} icon`}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
                          />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                      </div>
                      <p className="mt-3 text-sm sm:text-base text-gray-800 dark:text-gray-300 leading-relaxed">{f.desc}</p>
                    </div>
                  </ColorFrame>
                </Fade>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS — step cards + video */}
      <section id="how-it-works" className="scroll-mt-24 md:scroll-mt-28 relative w-full bg-white dark:bg-[#0b0b10] py-16 md:py-20 px-4 sm:px-8">
        <div className="absolute top-0 left-0 w-full h-[40px]" aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
            <path className="fill-white dark:fill-[#0e0f14]" d="M0,224 L1440,224 L1440,200 L0,200 Z" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Fade triggerOnce>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 inline-block relative">
              How <span className="text-indigo-700 dark:text-indigo-300">It Works</span>
              <span className="block absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </h2>
          </Fade>

          <Slide direction="up" triggerOnce>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Collaborate with your future self: compare application trends, refine outreach, and unlock more interviews.
            </p>
          </Slide>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {steps.map((s, idx) => (
              <Fade key={s.k} delay={idx * 120} triggerOnce>
                <ColorFrame
                  interactive
                  className="border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-md shadow-sm hover:shadow-xl"
                >
                  <div className="p-6">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-xs font-bold ring-4 ring-indigo-600/10">
                      {s.k}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{s.t}</h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">{s.d}</p>
                  </div>
                </ColorFrame>
              </Fade>
            ))}
          </div>

          {/* Video card */}
          <ColorFrame
            interactive
            rounded="rounded-xl"
            className="mt-10 w-full max-w-4xl mx-auto overflow-hidden border border-black/5 dark:border-white/10 shadow-xl hover:shadow-2xl"
          >
            <video
              controls
              className="w-full aspect-video transition-transform duration-300 group-hover:scale-[1.01]"
              poster="/images/trackify-poster.jpg"
            >
              <source src="/videos/trackify-demo.mp4" type="video/mp4" />
              <track kind="captions" srcLang="en" label="English" />
              Your browser does not support the video tag.
            </video>

            {/* play overlay on hover (non-interactive) */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-white/95 text-indigo-700 grid place-items-center shadow-xl animate-[pulse_2s_ease-in-out_infinite]">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </ColorFrame>
        </div>
      </section>

      {/* CTA strip */}
      <section aria-label="Join Trackify" className="relative w-full py-12 sm:py-14 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div className="grain absolute inset-0 opacity-[0.06] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">Ready to remove the chaos from your job hunt?</h3>
            <p className="opacity-90 text-sm sm:text-base">Join free and keep everything organized in one place.</p>
          </div>
          <button
            onClick={goLogin}
            className="px-6 py-3 rounded-full bg-white text-indigo-700 font-semibold hover:opacity-95 transition
                       hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-indigo-900/20"
            aria-label="Create your free account"
          >
            Create your free account
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" className="scroll-mt-24 md:scroll-mt-28 bg-gray-50 dark:bg-[#0e0f14]" aria-label="Frequently Asked Questions">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 md:py-16">
          <FAQS />
        </div>
      </section>

      {/* TEAM — hairline + region glow, no heavy card */}
      <section
        id="meet-our-experts"
        className="scroll-mt-24 md:scroll-mt-28 relative w-full bg-white dark:bg-[#0b0b10] py-16 md:py-20 px-4 sm:px-8"
      >
        <div className="absolute top-0 left-0 w-full h-[40px]" aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
            <path className="fill-white dark:fill-[#0e0f14]" d="M0,224 L1440,224 L1440,200 L0,200 Z" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Fade triggerOnce>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 inline-block relative">
              Meet Our <span className="text-indigo-700 dark:text-indigo-300">Team</span>
              <span className="block absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </h2>
          </Fade>
          <Slide direction="up" triggerOnce>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              The minds crafting Trackify with heart, code, and coffee.
            </p>
          </Slide>

          {/* hairline + hover glow across the region */}
          <div className="relative mt-10">
            <div className="absolute inset-x-0 -top-1 h-[2px] bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-purple-500 opacity-70" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.18), 0 24px 48px -28px rgba(79,70,229,0.35)" }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/0 via-white/0 to-white/0 dark:from-white/0 dark:via-white/0 dark:to-white/0 hover:via-white/3 transition-colors duration-300" />
            <MeetOurExperts experts={experts} />
          </div>
        </div>
      </section>

      <Footer />

      {/* tiny CSS for the moving sheen + tilt + grain */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .sheen {
            background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.8) 50%, rgba(255,255,255,0) 100%);
            filter: blur(8px);
            transform: skewX(-18deg);
            animation: sheen-slide 1.1s ease-in-out forwards;
          }
          .group:hover .sheen { animation: sheen-slide 1.1s ease-in-out; }
          @keyframes sheen-slide {
            0%   { transform: translateX(-120%) skewX(-18deg); }
            100% { transform: translateX(220%)  skewX(-18deg); }
          }

          .tilt-card {
            transform: perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0.001px);
            transition: transform 180ms ease, box-shadow 180ms ease;
          }
        }

        .grain {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0),
            radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0);
          background-size: 6px 6px, 8px 8px;
          mix-blend-mode: multiply;
        }
        @media (prefers-color-scheme: dark) {
          .grain { mix-blend-mode: overlay; opacity: .08; }
        }
      `}</style>
    </>
  );
}
