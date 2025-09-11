// components/LoginBackground.tsx
"use client";
import { useEffect, useState } from "react";


const STAR_COUNT = 28;

export default function LoginBackground() {
  const [dots, setDots] = useState<{ left: string; top: string }[]>([]);

  useEffect(() => {
    // runs only on client, AFTER hydration — no SSR mismatch
    const d = Array.from({ length: STAR_COUNT }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setDots(d);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* blobs / bands / rings ... (static, not random) */}

      {/* stars / dots */}
      <div className="absolute inset-0">
        {dots.map((pos, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/70"
            style={pos} // only {left, top}; opacity handled by class
          />
        ))}
      </div>

      {/* optional vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
    </div>
  );
}
