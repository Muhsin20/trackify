"use client";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import LoadingOverlay from "../components/LoadingOverlay";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import LoginBackground from "../components/LoginBackground";

/* ---------------------------
   Forgot Password (same API, tidied)
---------------------------- */
function ForgotPasswordDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void> | void;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmail("");
      setSending(false);
      setSent(false);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    setError(null);
    const ok = /^\S+@\S+\.\S+$/.test(email);
    if (!ok) return setError("Please enter a valid email.");
    try {
      setSending(true);
      await onSubmit(email);
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-3xl border border-white/10 text-white
                   bg-[rgba(16,16,20,0.52)] backdrop-blur-2xl backdrop-saturate-150
                   shadow-[0_24px_80px_-28px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <div className="px-5 sm:px-6 py-5">
          <h3 className="text-lg font-medium">Forgot your password?</h3>
          <p className="text-sm text-white/70 mt-1">
            Enter the email linked to your account and we’ll send you a reset link.
          </p>

          {sent ? (
            <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <p className="text-emerald-200 text-sm">
                If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
              </p>
            </div>
          ) : (
            <>
              <label htmlFor="reset-email" className="block text-sm mt-4 mb-2">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl px-3.5 py-2.5 text-[15px]
                           bg-white/[0.06] border border-white/10 text-white placeholder-white/45
                           focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-sm text-white/90 border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="px-3.5 py-2 rounded-xl text-sm text-white
                             bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600
                             shadow-[0_10px_24px_-16px_rgba(168,85,247,0.55)]
                             hover:opacity-95 transition disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send reset link"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Login Page — ambient glow (no outline stroke)
---------------------------- */
export default function Login() {
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const sendReset = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <Navbar />

      {/* on-brand liquid glass backdrop */}
      <div className="relative min-h-screen font-sans bg-[linear-gradient(180deg,#0a0a0c_0%,#0b0b11_50%,#0a0a0c_100%)] overflow-hidden">
        <LoginBackground />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-32 h-80 w-80 rounded-full bg-white/[0.03] blur-[110px]" />
          <div className="absolute -bottom-28 -right-36 h-96 w-96 rounded-full bg-white/[0.03] blur-[120px]" />
        </div>

        <main id="main" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          {/* Ambient glow container (no outline) */}
          <div className="login-frame mx-auto w-full max-w-[980px] rounded-[36px] animate-[fadeIn_.45s_ease]">
            {/* Inner glass — single subtle inset hairline only */}
            <div
              className="rounded-[36px] bg-[rgba(16,16,22,0.50)] backdrop-blur-2xl backdrop-saturate-150
                         shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_24px_80px_-48px_rgba(0,0,0,0.90)]"
            >
              <div className="px-3 sm:px-4 pt-4 pb-3">
                <Card
                  title="Welcome Back!"
                  title2="Sign in to Trackify"
                  subtitle="Your job search, organized."
                  setLoading={setLoading}
                  onForgot={() => setForgotOpen(true)}
                />
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-white/55 mt-6">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-indigo-200 hover:text-indigo-100 underline decoration-indigo-400/40 hover:decoration-indigo-300">
              Terms
            </a>{" "}
            &{" "}
            <a href="/privacy" className="text-indigo-200 hover:text-indigo-100 underline decoration-indigo-400/40 hover:decoration-indigo-300">
              Privacy Policy
            </a>
            .
          </p>
        </main>
      </div>

      <Footer />

      <ForgotPasswordDialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onSubmit={sendReset}
      />

      {/* Soft ambient edge glow only (no stroke/outline) */}
      <style>{`
        .login-frame {
          position: relative;
          isolation: isolate;
        }
        .login-frame::after {
          content: "";
          position: absolute;
          inset: -14px;                 /* extends beyond edges for halo */
          border-radius: 44px;
          pointer-events: none;
          /* four soft edge glows (left, right, top, bottom) */
          background:
            radial-gradient(120px 80px at 0% 50%,   rgba(99,102,241,0.25),  transparent 70%),
            radial-gradient(120px 80px at 100% 50%, rgba(236,72,153,0.25), transparent 70%),
            radial-gradient(80px 120px at 50% 0%,   rgba(147,51,234,0.22),  transparent 70%),
            radial-gradient(80px 120px at 50% 100%, rgba(99,102,241,0.22),  transparent 70%);
          filter: blur(18px);
          opacity: .25;                 /* faint by default */
          transition: opacity .25s ease, filter .25s ease;
          z-index: -1;
        }
        .login-frame:hover::after,
        .login-frame:focus-within::after {
          opacity: .62;                 /* brighter on hover/focus */
          filter: blur(20px);
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) {
          .login-frame { animation: none; }
        }
      `}</style>
    </>
  );
}
