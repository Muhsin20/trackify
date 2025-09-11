"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (link: string) => {
  setIsMenuOpen(false);

  if (link === "HOME") {
    if (window.location.pathname === "/AboutMe") {
      // Already on AboutMe page → just scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Navigate to AboutMe page → no section hash
      router.push("/AboutMe");
    }
    return; // stop here so it doesn't look for sectionMap
  }

  // Map link names to their corresponding section IDs
  const sectionMap: Record<string, string> = {
    ABOUT: "WHAT-WE-DO",
    "HOW IT WORKS": "HOW-IT-WORKS",
    FAQS: "FAQS",
  };

  const sectionId = sectionMap[link];

  if (sectionId) {
    if (window.location.pathname === "/AboutMe") {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      router.push(`/AboutMe#${sectionId}`);
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }
};


  
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-transparent backdrop-blur-sm shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between h-16 bg-black rounded-xl px-6 shadow-sm border border-purple-400">
          
          {/* Logo Section - Moved to left */}
          <div 
            onClick={() => router.push("/AboutMe")} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/trackify-cloud-logo.png"
                alt="Trackify Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-serif font-semibold bg-gradient-to-r from-indigo-200 to-purple-500 text-transparent bg-clip-text tracking-tight">
              Trackify
            </span>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:text-purple-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {["HOME", "ABOUT", "HOW IT WORKS", "FAQS", "CONTACT"].map((link) => (
              <button
                key={link}
                onClick={() => handleNavigation(link)}
                className="text-white hover:text-white px-1 py-1 text-sm font-serif font-medium tracking-wide transition-all duration-300 relative group"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons - Moved to right */}
          <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-sm font-serif text-gray-900 border border-gray-300 rounded-full bg-white hover:bg-gray-300 transition-all duration-300 hover:border-purple-400 hover:shadow-sm"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 text-sm font-serif text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-full hover:bg-gradient-to-l transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-white rounded-lg p-4 shadow-lg border border-gray-200">
            {["Home", "About", "How it works", "FAQS", "Contact"].map((link) => (
              <button
                key={link}
                onClick={() => handleNavigation(link)}
                className="block w-full text-left px-4 py-2 text-gray-700 font-serif hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                {link}
              </button>
            ))}
            <div className="pt-2 space-y-2 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/login");
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 font-serif hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/register");
                }}
                className="block w-full text-left px-4 py-2 text-white font-serif bg-gradient-to-r from-purple-600 to-purple-500 rounded-full hover:bg-gradient-to-l transition-colors duration-300"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}