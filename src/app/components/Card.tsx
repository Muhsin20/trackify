"use client";
import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
// optional, if you want to read fields client-side (not required for auth)
import { jwtDecode } from "jwt-decode";

interface CardProps {
  title: string;
  title2: string;
  subtitle: string;
  setLoading?: (v: boolean) => void;
}

export default function LoginCard({ title, title2, subtitle, setLoading }: CardProps) {
  interface Form { email: string; password: string }
  const [formData, setFormData] = useState<Form>({ email: "", password: "" });
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("One of the fields is empty");
      return;
    }
    try {
      setLoading?.(true);
      const request = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await request.json();
      if (!request.ok) {
        alert(result?.message ?? "Login failed");
        return;
      }
      router.replace("/dashboard");
    } finally {
      setLoading?.(false);
    }
  }

  function goToSignUp() { router.push("/register"); }
  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  // Google success handler
  async function handleGoogleSuccess(cred: CredentialResponse) {
    try {
      setLoading?.(true);
      if (!cred.credential) {
        alert("No Google credential returned");
        return;
      }

      // OPTIONAL: read the token client-side (don’t trust this—server must verify)
      // const payload = jwtDecode<{ email?: string; name?: string }>(cred.credential);

      // Send ID token to your backend to verify & create session
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken: cred.credential }),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Google sign-in failed");
        return;
      }

      router.replace("/dashboard");
    } finally {
      setLoading?.(false);
    }
  }

  return (
    <div
      className={[
        "w-[920px] max-w-full rounded-3xl overflow-hidden",
        "shadow-xl shadow-indigo-900/20",
        "bg-white/70 backdrop-blur",
        "ring-1 ring-black/5",
      ].join(" ")}
    >
      <div className="relative flex flex-col md:flex-row">
        {/* Left: form */}
        <div className="md:w-1/2 w-full p-8 md:p-10">
          <h2 className="text-3xl font-extrabold text-center text-purple-950 mb-2 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-center text-gray-600 text-sm mb-8">{subtitle}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-gray-800 font-medium mb-1">
                Email
              </label>
              <input
                type="email" id="email" name="email" placeholder="Email"
                onChange={handleForm} value={formData.email}
                className="w-full rounded-xl border border-gray-300 bg-white/90 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-800 font-medium mb-1">
                Password
              </label>
              <input
                type="password" id="password" name="password" placeholder="Password"
                onChange={handleForm} value={formData.password}
                className="w-full rounded-xl border border-gray-300 bg-white/90 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>

            <button
              type="submit"
              data-testid="submit-button"
              className={[
                "w-full rounded-2xl py-3 font-semibold text-white",
                "bg-gradient-to-r from-fuchsia-500 to-indigo-600",
                "shadow-lg shadow-fuchsia-700/20 hover:opacity-95 active:opacity-90 transition",
              ].join(" ")}
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-xs uppercase tracking-wider text-gray-600">or</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          {/* Google sign-in button */}
          <div className="flex justify-center">
            <GoogleLogin
              shape="pill"
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google sign-in failed")}
              // You can tune size/theme/text if you want:
              // useOneTap // <- optional, enable "One Tap"
              theme="filled_blue"
              // size="large"
              // text="continue_with"
            />
          </div>

          {/* Signup link */}
          <p className="mt-6 text-center font-extrabold text-gray-900 text-sm">
            Don’t have an account?{" "}
            <button
              onClick={goToSignUp}
              className="font-semibold text-fuchsia-600 hover:underline hover:text-fuchsia-700 transition"
            >
              Sign up now!
            </button>
          </p>
        </div>

        {/* Right panel */}
        <div
          className={[
            "relative md:w-1/2 w-full p-10 text-white",
            "bg-gradient-to-b from-fuchsia-500/90 to-indigo-700/90",
            "md:rounded-l-none",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0 rounded-none md:rounded-l-[2.5rem] md:-left-1 bg-black/10 blur-[2px]" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-extrabold mb-4 drop-shadow-sm">{title2}</h3>
            <p className="max-w-[26ch] text-sm leading-6 text-white/90">
              Access your account and explore the features. Welcome back!
            </p>
          </div>
          <div className="pointer-events-none absolute -right-8 top-10 h-40 w-40 rounded-full ring-4 ring-white/40" />
        </div>
      </div>
    </div>
  );
}
