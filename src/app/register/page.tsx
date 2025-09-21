"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import * as Yup from "yup";
import dynamic from "next/dynamic";

// client-only background so effects don't break hydration
const LoginBackground = dynamic(() => import("../components/LoginBackground"), { ssr: false });

export default function Register() {
  interface Form {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  type Field = keyof Form;

  const [formData, setFormData] = useState<Form>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const router = useRouter();

  const schema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(25, "Username must be at max 25 characters long"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(25, "Password must be at max 25 characters long"),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  // Live hint for mismatch (shows under the field even before submit)
  const pwMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password.length > 0 &&
    formData.confirmPassword !== formData.password;
    const pwTooShort = formData.password.length > 0 && formData.password.length < 8;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const emailInvalid = formData.email.length > 0 && !emailRegex.test(formData.email);


  // Enable button once fields are filled properly (even if mismatch — submit will show inline error)
  const isReady = useMemo(() => {
    const u = formData.username.trim();
    const e = formData.email.trim();
    const p = formData.password.trim();
    const c = formData.confirmPassword.trim();
    const emailOk = /\S+@\S+\.\S+/.test(e);
    return u.length >= 3 && emailOk && p.length >= 8 && c.length >= 8;
  }, [formData]);

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    // Clear field error as user types
    if (errors[name as Field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as Field];
        return next;
      });
    }
  }

  async function registerUser(event: React.FormEvent) {
    event.preventDefault();
    try {
      // Validate first — if it fails, we DO NOT call the API
      await schema.validate(formData, { abortEarly: false });

      const response = await fetch("https://tm89rn3opa.execute-api.us-east-1.amazonaws.com/register", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (data.message === "Success your registered!") {
        router.push("/login");
      } else {
        setErrors((e) => ({ ...e, email: "Username or Email is already in use" }));
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const fieldErrors: Partial<Record<Field, string>> = {};
        err.inner.forEach((e) => {
          if (e.path) fieldErrors[e.path as Field] = e.message;
        });
        // If only the mismatch happened, ensure it's visible on confirmPassword
        if (!fieldErrors.confirmPassword && pwMismatch) {
          fieldErrors.confirmPassword = "Passwords must match";
        }
        setErrors(fieldErrors);
      } else {
        console.error(err);
      }
    }
  }

  return (
    <>
      <Navbar />

      {/* On-brand liquid glass backdrop */}
      <div className="relative min-h-screen font-sans bg-[linear-gradient(180deg,#0a0a0c_0%,#0b0b11_50%,#0a0a0c_100%)] overflow-hidden">
        <LoginBackground />
        {/* soft white glows behind content */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-32 h-80 w-80 rounded-full bg-white/[0.03] blur-[110px]" />
          <div className="absolute -bottom-28 -right-36 h-96 w-96 rounded-full bg-white/[0.03] blur-[120px]" />
        </div>

        <main id="main" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          {/* Ambient glow wrapper (no outline stroke) */}
          <div className="reg-frame mx-auto w-full max-w-[980px] rounded-[36px] animate-[fadeIn_.45s_ease]">
            {/* Inner two-panel glass card */}
            <div className="relative flex flex-col md:flex-row text-white rounded-[36px] overflow-hidden bg-white/[0.04] backdrop-blur-2xl ring-1 ring-white/[0.08] shadow-[0_30px_110px_-40px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]">
              {/* LEFT — Form */}
              <div className="md:w-[58%] w-full p-7 sm:p-8 rounded-[36px] md:rounded-l-[36px] md:rounded-r-none md:border-r md:border-white/10 bg-white/[0.05]">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2 bg-gradient-to-r from-indigo-200 via-fuchsia-200 to-purple-300 text-transparent bg-clip-text">
                  CREATE AN ACCOUNT
                </h1>
                <p className="text-white/70 text-sm mb-6">Join us and get started today!</p>

                <form onSubmit={registerUser} className="space-y-5">
                  <div>
              <label className="block text-white/90 text-sm mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                data-testid="email"
                placeholder="you@example.com"
                onChange={handleForm}
                value={formData.email}
                autoComplete="email"
                aria-invalid={!!errors.email || emailInvalid}
                className={[
                  "w-full rounded-2xl border px-4 py-3 text-white placeholder-white/45 outline-none transition",
                  "bg-white/[0.07]",
                  (errors.email || emailInvalid)
                    ? "border-rose-400/70 focus:ring-2 focus:ring-rose-400/60"
                    : "border-white/10 focus:border-transparent focus:ring-2 focus:ring-indigo-400/70",
                ].join(" ")}
              />
              {(errors.email || emailInvalid) && (
                <p className="mt-1.5 text-sm text-rose-300">
                  {errors.email ?? "Enter a valid email address"}
                </p>
              )}
            </div>


                  {/* Username */}
                  <div>
                    <label className="block text-white/90 text-sm mb-1">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      data-testid="username"
                      placeholder="Choose a username"
                      onChange={handleForm}
                      value={formData.username}
                      autoComplete="username"
                      aria-invalid={!!errors.username}
                      className={[
                        "w-full rounded-2xl border px-4 py-3 text-white placeholder-white/45 outline-none transition",
                        "bg-white/[0.07]",
                        errors.username
                          ? "border-rose-400/70 focus:ring-2 focus:ring-rose-400/60"
                          : "border-white/10 focus:border-transparent focus:ring-2 focus:ring-indigo-400/70",
                      ].join(" ")}
                    />
                    {errors.username && <p className="mt-1.5 text-sm text-rose-300">{errors.username}</p>}
                  </div>

                  {/* Password */}
                <div>
                  <label className="block text-white/90 text-sm mb-1">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    data-testid="password"
                    placeholder="••••••••"
                    onChange={handleForm}
                    value={formData.password}
                    autoComplete="new-password"
                    aria-invalid={!!errors.password || pwTooShort}
                    className={[
                      "w-full rounded-2xl border px-4 py-3 text-white placeholder-white/45 outline-none transition",
                      "bg-white/[0.07]",
                      (errors.password || pwTooShort)
                        ? "border-rose-400/70 focus:ring-2 focus:ring-rose-400/60"
                        : "border-white/10 focus:border-transparent focus:ring-2 focus:ring-indigo-400/70",
                    ].join(" ")}
                  />
                  {(errors.password || pwTooShort) && (
                    <p className="mt-1.5 text-sm text-rose-300">
                      {errors.password ?? "Password must be at least 8 characters long"}
                    </p>
                  )}
                </div>


                  {/* Confirm Password */}
                  <div>
                    <label className="block text-white/90 text-sm mb-1">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      data-testid="confirmPassword"
                      placeholder="Re-enter password"
                      onChange={handleForm}
                      value={formData.confirmPassword}
                      autoComplete="new-password"
                      aria-invalid={!!errors.confirmPassword || pwMismatch}
                      className={[
                        "w-full rounded-2xl border px-4 py-3 text-white placeholder-white/45 outline-none transition",
                        "bg-white/[0.07]",
                        errors.confirmPassword || pwMismatch
                          ? "border-rose-400/70 focus:ring-2 focus:ring-rose-400/60"
                          : "border-white/10 focus:border-transparent focus:ring-2 focus:ring-indigo-400/70",
                      ].join(" ")}
                    />
                    {(errors.confirmPassword || pwMismatch) && (
                      <p className="mt-1.5 text-sm text-rose-300">
                        {errors.confirmPassword ?? "Passwords must match"}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    data-testid="submit-button"
                    disabled={!isReady}
                    aria-disabled={!isReady}
                    className={[
                      "w-full rounded-2xl py-3 font-medium transition",
                      isReady
                        ? "text-white bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 hover:scale-[1.01] active:scale-[.995] shadow-[0_12px_26px_-18px_rgba(168,85,247,0.65)]"
                        : "text-white/60 bg-white/[0.05] border border-white/10 cursor-not-allowed",
                    ].join(" ")}
                  >
                    Sign Up
                  </button>
                </form>

                <div className="text-center mt-6 text-sm text-white/80">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-indigo-200 hover:text-indigo-100 underline decoration-indigo-400/40 hover:decoration-indigo-300"
                  >
                    Log in
                  </a>
                </div>
              </div>

              {/* RIGHT — Brand gradient panel (matches login) */}
              <div className="relative md:w-[42%] w-full p-8 sm:p-10 rounded-[36px] md:rounded-r-[36px] md:rounded-l-none bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-purple-700">
                {/* readability veils */}
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
                  <h3 className="text-2xl sm:text-3xl font-semibold mb-3 bg-gradient-to-r from-indigo-200 via-fuchsia-200 to-purple-300 text-transparent bg-clip-text">
                    Join Trackify
                  </h3>
                  <p className="max-w-[30ch] text-sm leading-6 text-white/95">
                    Create your account and keep your job hunt organized in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-white/55 mt-6">
            By signing up, you agree to our{" "}
            <a
              href="/terms"
              className="text-indigo-200 hover:text-indigo-100 underline decoration-indigo-400/40 hover:decoration-indigo-300"
            >
              Terms
            </a>{" "}
            &{" "}
            <a
              href="/privacy"
              className="text-indigo-200 hover:text-indigo-100 underline decoration-indigo-400/40 hover:decoration-indigo-300"
            >
              Privacy Policy
            </a>
            .
          </p>
        </main>
      </div>

      <Footer />

      {/* Ambient edge glow only (no visible outline stroke) */}
      <style>{`
        .reg-frame { position: relative; isolation: isolate; }
        .reg-frame::after {
          content: "";
          position: absolute;
          inset: -14px;
          border-radius: 44px;
          pointer-events: none;
          background:
            radial-gradient(120px 80px at 0% 50%,   rgba(99,102,241,0.25),  transparent 70%),
            radial-gradient(120px 80px at 100% 50%, rgba(236,72,153,0.25), transparent 70%),
            radial-gradient(80px 120px at 50% 0%,   rgba(147,51,234,0.22),  transparent 70%),
            radial-gradient(80px 120px at 50% 100%, rgba(99,102,241,0.22),  transparent 70%);
          filter: blur(18px);
          opacity: .25;
          transition: opacity .25s ease, filter .25s ease;
          z-index: -1;
        }
        .reg-frame:hover::after,
        .reg-frame:focus-within::after { opacity: .62; filter: blur(20px); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) { .reg-frame { animation: none; } }
      `}</style>
    </>
  );
}
