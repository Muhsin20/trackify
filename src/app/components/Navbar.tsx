"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-20 transition-all duration-300 ${
        isScrolled ? "bg-gray-900 shadow-md" : "bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => router.push("/AboutMe")}>
          <Image src="/images/trackify-cloud-logo.png" alt="Trackify Logo" width={40} height={40} />
          <span className="text-xl font-semibold text-white ml-3 tracking-wide">
            Trackify
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {["Home", "About", "Services", "Contact"].map((link, index) => (
            <a
              key={index}
              href={`#${link.toLowerCase()}`}
              className="text-white text-sm font-medium tracking-wide relative group transition-all duration-300 hover:text-purple-400"
            >
              {link}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2 text-sm font-medium text-white bg-transparent border border-white rounded-full transition-all hover:bg-white hover:text-gray-900"
          >
            Log in
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-full transition-all hover:bg-purple-500"
          >
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}
