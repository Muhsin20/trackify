"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface CardProps {
  title: string;
  title2: string;
  subtitle: string;
  setLoading?: (v: boolean) => void;          // NEW
}

export default function Card({ title, title2, subtitle, setLoading }: CardProps) {
  interface Form { email: string; password: string; }
  const [formData, setFormData] = useState<Form>({ email: "", password: "" });
  const router = useRouter();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      alert("One of the fields is empty");
      return;
    }

    try {
      setLoading?.(true);                                // show overlay
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
      router.push("/dashboard");
    } finally {
      setLoading?.(false);                               // hide overlay
    }
  }

  function goToSignUp() { router.push("/register"); }

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  }

  return (
    <div className="w-[700px] h-auto mx-auto mt-16 bg-white rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
      <div className="flex">
        {/* Left - Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">{title}</h2>
          {subtitle && <p className="text-center text-gray-600 text-sm mb-6">{subtitle}</p>}

          <div className="space-y-4">
            <form onSubmit={handleLogin}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Enter Email</label>
                <input
                  type="email" id="email" name="email" placeholder="Email"
                  onChange={handleForm} value={formData.email}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Enter Password</label>
                <input
                  type="password" id="password" name="password" placeholder="Password"
                  onChange={handleForm} value={formData.password}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex flex-col space-y-3 mt-6">
                <button type="submit" data-testid="submit-button"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-600 transition">
                  Continue
                </button>
              </div>
            </form>


            {/* Sign up */}
            <button
              onClick={goToSignUp}
              className="w-full py-3 bg-gray-100 text-blue-500 border border-blue-500 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Right - Gradient */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-purple-500 to-indigo-600 text-white p-8">
          <h2 className="text-3xl font-extrabold mb-4">{title2}</h2>
          <p className="text-center text-white text-sm leading-6 opacity-90">
            Access your account and explore the features. Welcome back!
          </p>
        </div>
      </div>
    </div>
  );
}
