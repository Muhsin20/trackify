"use client";
import React, { useMemo, useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";

interface CardProps {
  title: string;
  title2: string;
  subtitle: string;
  setLoading?: (v: boolean) => void;
  onForgot?: () => void;
}

export default function LoginCard({
  title,
  title2,
  subtitle,
  setLoading,
  onForgot,
}: CardProps) {
  interface Form { email: string; password: string }
  const [formData, setFormData] = useState<Form>({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();

  const isReady = useMemo(
    () => formData.email.trim().length > 0 && formData.password.trim().length > 0,
    [formData]
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!isReady) return;
    try {
      setLoading?.(true);
      const request = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await request.json();
      if (!request.ok) return alert(result?.message ?? "Login failed");
      router.replace("/dashboard");
    } finally {
      setLoading?.(false);
    }
  }

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  async function handleGoogleSuccess(cred: CredentialResponse) {
    try {
      setLoading?.(true);
      if (!cred.credential) return alert("No Google credential returned");
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken: cred.credential }),
      });
      if (!res.ok) return alert((await res.text()) || "Google sign-in failed");
      router.replace("/dashboard");
    } finally {
      setLoading?.(false);
    }
  }

  return (
    <div
      className={[
        "relative flex flex-col md:flex-row text-white font-sans",
        "rounded-[36px] overflow-hidden",
        "bg-white/[0.04] backdrop-blur-2xl",
        "ring-1 ring-white/[0.08]",
        "shadow-[0_30px_110px_-40px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]",
      ].join(" ")}
    >
      {/* LEFT: form */}
      <div
        className={[
          "md:w-[58%] w-full p-7 sm:p-8",
          "rounded-[36px] md:rounded-l-[36px] md:rounded-r-none",
          "md:border-r md:border-white/10",
          "bg-white/[0.05]",
        ].join(" ")}
      >
        <h2
          className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2
                     bg-gradient-to-r from-indigo-200 via-fuchsia-200 to-purple-300
                     text-transparent bg-clip-text"
        >
          {title}
        </h2>
        {subtitle && <p className="text-white/70 text-sm mb-6">{subtitle}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* email */}
          <div>
            <label htmlFor="email" className="block text-white/90 text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleForm}
              value={formData.email}
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3
                         text-white placeholder-white/45 outline-none transition
                         focus:border-transparent focus:ring-2 focus:ring-indigo-400/70"
            />
          </div>

          {/* password + toggle */}
          <div>
            <label htmlFor="password" className="block text-white/90 text-sm mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                onChange={handleForm}
                value={formData.password}
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3
                           pr-11 text-white placeholder-white/45 outline-none transition
                           focus:border-transparent focus:ring-2 focus:ring-indigo-400/70"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center
                           rounded-lg text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition"
              >
                {showPw ? (
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor" aria-hidden>
                    <path d="M2.1 12.2a1 1 0 0 1 0-.4C3.6 7.5 7.5 5 12 5c4.5 0 8.3 2.5 9.9 6.8a1 1 0 0 1 0 .4C20.4 16.5 16.5 19 12 19c-4.5 0-8.3-2.5-9.9-6.8Zm9.9-4.2a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4Zm0 2a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor" aria-hidden>
                    <path d="M3.5 2.8a1 1 0 0 0-1.4 1.4l2.2 2.2A11.6 11.6 0 0 0 2.1 12a1 1 0 0 0 0 .4C3.6 16.5 7.5 19 12 19a11 11 0 0 0 5.2-1.3l3.3 3.3a1 1 0 0 0 1.4-1.4L3.5 2.8ZM12 7a4.2 4.2 0 0 1 4.2 4.2 4.1 4.1 0  1-0.5 2l-5.7-5.7c.6-.3 1.3-.5 2-.5Zm0 10c-4.5 0-8.3-2.5-9.9-6.8a1 1 0 0 1 0-.4 9.5 9.5 0 0 1 3-4.1l2.2 2.2A4.2 4.2 0 0 0 12 15.2c.8 0 1.6-.2 2.2-.6l1.8 1.8A10.7 10.7 0  0 1 12 17Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* forgot */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onForgot}
              className="text-sm text-indigo-200 hover:text-indigo-100 underline decoration-indigo-400/40 hover:decoration-indigo-300 transition"
            >
              Forgot password?
            </button>
          </div>

          {/* sign in */}
          <button
            type="submit"
            disabled={!isReady}
            aria-disabled={!isReady}
            className={[
              "w-full rounded-2xl py-3 font-medium transition",
              isReady
                ? "text-white bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 hover:scale-[1.01] active:scale-[.995] shadow-[0_12px_26px_-18px_rgba(168,85,247,0.65)]"
                : "text-white/60 bg-white/[0.05] border border-white/10 cursor-not-allowed",
            ].join(" ")}
          >
            Sign in
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-white/60">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google sign-in with gradient ring + glow */}
        <div className="flex justify-center">
          <div className="group relative inline-flex rounded-full p-[2px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600">
            {/* soft halo */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-3 rounded-full opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-60"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, rgba(99,102,241,.35), rgba(236,72,153,.35), rgba(147,51,234,.35), rgba(99,102,241,.35))",
              }}
            />
            <div className="relative rounded-full overflow-hidden bg-transparent">
              <GoogleLogin
                shape="pill"
                theme="filled_black"
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google sign-in failed")}
              />
            </div>
          </div>
        </div>

        {/* Signup link */}
        <p className="mt-6 text-center text-sm text-white/80">
          Don’t have an account?{" "}
          <button
            onClick={() => { window.location.href = "/register"; }}
            className="font-medium text-indigo-200 hover:text-indigo-100 underline decoration-indigo-400/40 hover:decoration-indigo-300 transition"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* RIGHT: brand gradient panel (indigo → fuchsia → purple) */}
      <div
        className={[
          "relative md:w-[42%] w-full p-8 sm:p-10",
          "rounded-[36px] md:rounded-r-[36px] md:rounded-l-none",
          "bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-purple-700",
        ].join(" ")}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.28), rgba(0,0,0,.35))" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px, 22px 22px",
          }}
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h3
            className="text-2xl sm:text-3xl font-semibold mb-3
                       bg-gradient-to-r from-indigo-200 via-fuchsia-200 to-purple-300
                       text-transparent bg-clip-text"
          >
            {title2}
          </h3>
          <p className="max-w-[30ch] text-sm leading-6 text-white/95">
            Access your account and keep your job hunt organized. You’ve got this.
          </p>
        </div>
      </div>
    </div>
  );
}
