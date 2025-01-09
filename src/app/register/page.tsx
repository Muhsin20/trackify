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
      console.log(formData);

      if (data.message === "Success your registered!") {
        router.push("/login");
      } else {
        console.log("being used");
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
      <Navbar transparent />

      {/* Main Section */}
      <div className="h-full flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-800 via-blue-900 to-gray-900 text-white pt-16">
        <div className="w-[500px] bg-white rounded-3xl shadow-2xl p-10 border border-gray-200 relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-200 to-purple-300 opacity-30 pointer-events-none"></div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6 z-10">
            Create Your Account
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-600 text-sm mb-8 z-10">
            Join us and get started today!
          </p>

          {/* Form */}
          <form onSubmit={registerUser} className="space-y-6 z-10 relative">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                data-testid="email"
                placeholder="Email"
                onChange={handleForm}
                value={formData.email}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                data-testid="username"
                placeholder="Username"
                onChange={handleForm}
                value={formData.username}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                data-testid="password"
                placeholder="Password"
                onChange={handleForm}
                value={formData.password}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                data-testid="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleForm}
                value={formData.confirmPassword}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <button
              type="submit"
              data-testid="submit-button"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Sign Up
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-600 text-sm z-10">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Log in
            </a>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-black text-white py-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-purple-400 font-bold">Trackify</span>. All
            rights reserved.
          </p>
          <p className="text-sm mt-2">
            Crafted with ❤️ to empower your professional journey.
          </p>
        </div>
      </footer>
    </>
  );
}
