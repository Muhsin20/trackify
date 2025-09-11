"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import * as Yup from "yup";
import dynamic from "next/dynamic";

// client-only so random stars don't break hydration
const LoginBackground = dynamic(() => import("../components/LoginBackground"), { ssr: false });

export default function Register() {
  interface Form {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const [formData, setFormData] = useState<Form>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const schema = Yup.object().shape({
    username: Yup.string().required().min(3, "Username must be at least 3 characters long").max(25, "Username must be at max 25 characters long"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required().min(8, "Password must be at least 8 characters long").max(25, "Password must be at max 25 characters long"),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password")], "Passwords must match"),
  });

  async function registerUser(event: React.FormEvent) {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      const response = await fetch("https://tm89rn3opa.execute-api.us-east-1.amazonaws.com/register", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (data.message === "Success your registered!") router.push("/login");
      else alert("Username or Email is already in use");
    } catch (error) {
      if (error instanceof Yup.ValidationError) alert(error.errors.join("\n"));
      else console.error(error);
    }
  }

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  return (
    <>
      <Navbar />

      {/* Background layer with shapes */}
      <div className="relative min-h-screen bg-gradient-to-br from-fuchsia-900 via-purple-900 to-indigo-800">
        <LoginBackground />

        {/* content */}
        <div className="h-screen flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
          <div className="w-[420px] max-w-full rounded-3xl bg-white/70 backdrop-blur-md ring-1 ring-black/5 shadow-xl shadow-indigo-900/20 p-8">
            <h1 className="text-3xl font-extrabold text-center text-purple-950 mb-2 tracking-tight">
            CREATE AN ACCOUNT
            </h1>


            <p className="text-center text-gray-900 text-xs mb-6">Join us and get started today!</p>

            <form onSubmit={registerUser} className="space-y-4">
              <div>
                <label className="block text-gray-900 font-medium text-sm mb-1">Email</label>
                <input
                  type="email" id="email" name="email" data-testid="email" placeholder="Enter your email"
                  onChange={handleForm} value={formData.email}
                  className="w-full rounded-xl border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium text-sm mb-1">Username</label>
                <input
                  type="text" id="username" name="username" data-testid="username" placeholder="Choose a username"
                  onChange={handleForm} value={formData.username}
                  className="w-full rounded-xl border border-gray-300 bg-white/90 px-3 py-2 text-gray-800 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium text-sm mb-1">Password</label>
                <input
                  type="password" id="password" name="password" data-testid="password" placeholder="Enter your password"
                  onChange={handleForm} value={formData.password}
                  className="w-full rounded-xl border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium text-sm mb-1">Confirm Password</label>
                <input
                  type="password" id="confirmPassword" name="confirmPassword" data-testid="confirmPassword" placeholder="Re-enter password"
                  onChange={handleForm} value={formData.confirmPassword}
                  className="w-full rounded-xl border border-gray-300 bg-white/90 px-3 py-2 text-gray-800 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <button
                type="submit" data-testid="submit-button"
                className="w-full rounded-2xl py-2 font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-indigo-600 shadow-lg shadow-fuchsia-700/20 hover:opacity-95 active:opacity-90 transition"
              >
                Sign Up
              </button>
            </form>

            <div className="text-center font-extrabold mt-6 text-gray-900 text-xs">
              Already have an account?{" "}
              <a href="/login" className="text-fuchsia-700 font-extrabold hover:underline">Log in</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
