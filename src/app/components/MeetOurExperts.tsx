"use client";
import React, { useMemo, MouseEvent } from "react";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";

interface Expert {
  name: string;
  role: string;
  photo: string;
  social: {
    linkedin: string;
    email: string;
  };
}

type Props = { experts?: Expert[] };

const MeetOurExperts: React.FC<Props> = ({ experts }) => {
  const list = useMemo<Expert[]>(() => (Array.isArray(experts) ? experts : []), [experts]);

  if (list.length === 0) {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] backdrop-blur-md p-6 h-48"
          />
        ))}
      </div>
    );
  }

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -10;
    const ry = (px - 0.5) * 12;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };

  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8">
      {list.map((expert, index) => (
        <Fade key={index} direction="up" triggerOnce>
          <article
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="relative group rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-md
                       p-6 shadow-sm transition-all duration-300 tilt-card motion-safe:hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* top hairline + conic aura + sheen */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-purple-500 opacity-70" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.22), 0 36px 80px -30px rgba(79,70,229,0.5)" }}
            />
            <span aria-hidden className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <span className="sheen absolute -left-1/3 top-0 h-full w-1/3 opacity-0 group-hover:opacity-[0.12] transition-opacity duration-200" />
            </span>

            <div className="flex flex-col items-center text-center relative">
              {/* Avatar + ring */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-2 ring-indigo-200/60 dark:ring-indigo-300/30 mb-4">
                <Image
                  src={expert.photo}
                  alt={expert.name}
                  fill
                  sizes="128px"
                  className="object-cover object-top"
                />
                <span className="pointer-events-none absolute inset-0 rounded-full ring-0 group-hover:ring-4 ring-indigo-500/15 transition-all duration-300" />
              </div>

              {/* Name / Role */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{expert.name}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">{expert.role}</p>

              {/* Social */}
              <div className="flex items-center gap-3">
                <a
                  href={expert.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/15
                             bg-white/90 dark:bg-white/[0.06] hover:bg-indigo-50 dark:hover:bg-white/[0.12] text-indigo-700 dark:text-indigo-300
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-300 transition"
                  aria-label={`${expert.name} on LinkedIn`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.8v2.1h.05c.53-1 1.82-2.1 3.75-2.1 4.01 0 4.75 2.64 4.75 6.08V24h-4v-7.4c0-1.77-.03-4.04-2.46-4.04-2.46 0-2.84 1.92-2.84 3.9V24h-4V8.5z"/>
                  </svg>
                </a>

                <a
                  href={`mailto:${expert.social.email}`}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/15
                             bg-white/90 dark:bg-white/[0.06] hover:bg-indigo-50 dark:hover:bg-white/[0.12] text-indigo-700 dark:text-indigo-300
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-300 transition"
                  aria-label={`Email ${expert.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 13.065L0 4.5V20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V4.5L12 13.065zM22 4H2l10 7.5L22 4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </article>
        </Fade>
      ))}
    </div>
  );
};

export default MeetOurExperts;
