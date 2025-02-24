"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import * as Yup from "yup";

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
    username: Yup.string()
      .required()
      .min(3, "Username must be at least 3 characters long")
      .max(25, "Username must be at max 25 characters long"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required()
      .min(8, "Password must be at least 8 characters long")
      .max(25, "Password must be at max 25 characters long"),
    confirmPassword: Yup.string()
      .required()
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  async function registerUser(event: React.FormEvent) {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

      const response = await fetch(
        "https://tm89rn3opa.execute-api.us-east-1.amazonaws.com/register",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (data.message === "Success your registered!") {
        router.push("/login");
      } else {
        alert("Username or Email is already in use");
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        alert(error.errors.join("\n"));
      } else {
        console.error("Error:", error);
      }
    }
  }

  function handleForm(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  return (
    <>
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="h-full flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-800 via-blue-900 to-gray-900 text-white pt-16">
        <div className="w-[400px] bg-white rounded-2xl shadow-xl p-8 border border-gray-200 relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-200 to-purple-300 opacity-20 pointer-events-none"></div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4 z-10">
            Sign Up
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-600 text-xs mb-6 z-10">
            Join us and get started today!
          </p>

          {/* Form */}
          <form onSubmit={registerUser} className="space-y-4 z-10 relative">
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                data-testid="email"
                placeholder="Enter your email"
                onChange={handleForm}
                value={formData.email}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                data-testid="username"
                placeholder="Choose a username"
                onChange={handleForm}
                value={formData.username}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                data-testid="password"
                placeholder="Enter your password"
                onChange={handleForm}
                value={formData.password}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                data-testid="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter password"
                onChange={handleForm}
                value={formData.confirmPassword}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
              />
            </div>
            <button
              type="submit"
              data-testid="submit-button"
              className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:scale-105 transition-transform shadow-md text-sm"
            >
              Sign Up
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-gray-600 text-xs z-10">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 font-medium hover:underline">
              Log in
            </a>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-black text-white py-6">
        <div className="max-w-screen-xl mx-auto text-center text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-purple-400 font-bold">Trackify</span>. All
            rights reserved.
          </p>
          <p className="mt-1">
            Crafted with ❤️ to empower your professional journey.
          </p>
        </div>
      </footer>
    </>
  );
}
