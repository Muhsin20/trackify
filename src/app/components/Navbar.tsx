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
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/95 backdrop-blur-sm shadow-xl" : "bg-black/95 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-9 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between h-8">

          {/* Logo Section */}
          <div 
            onClick={() => router.push("/AboutMe")} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/trackify-cloud-logo.png"
                alt="Trackify Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
              Trackify
            </span>
          </div>

          {/* Navigation Links */}
          <div className=" font-serif hidden md:flex items-center space-x-7 lg:space-x-14">
            {["Home", "About", "How it works", "Contact"].map((link) => (
              <button
                key={link}
                onClick={() => {
                  if (link === "Home") {
                    if (window.location.pathname === "/AboutMe") {
                      // Smooth scroll to top
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                      });
                    } else {
                      router.push("/AboutMe");
                      // Scroll to top after navigation
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }, 500);
                    }
                  }
                  else if (link === "About") {
                    if (window.location.pathname === "/AboutMe") {
                      document.getElementById("what-we-do")?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      router.push("/AboutMe#what-we-do");
                    }
                  } else if (link === "How it works") {
                    if (window.location.pathname === "/AboutMe") {
                      document.getElementById("how-it-works")?.scrollIntoView({ 
                        behavior: "smooth",
                        block: "start" // Add this for consistent positioning
                      });
                    } else {
                      router.push("/AboutMe#how-it-works");
                      // Add timeout to ensure page load before scrolling
                      setTimeout(() => {
                        document.getElementById("how-it-works")?.scrollIntoView({
                          behavior: "smooth"
                        });
                      }, 500); // Adjust timing if needed
                    }
                  }
                }}
                className="text-gray-300 hover:text-white px-1 py-2 text-sm font-medium tracking-wide transition-all duration-300 relative group"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-sm font-medium text-white border border-gray-300/30 rounded-full bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 hover:border-purple-400/50 hover:shadow-purple-sm"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-full hover:bg-gradient-to-l transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}