"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavbarProps {
  transparent?: boolean; // Optional prop to control initial transparency
}

export default function Navbar({ transparent = true }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/login");
  };
  const handleButtonClick2 = () => {
    router.push("/register");
  };

  const navigateToAboutMe = () => {
    router.push("/AboutMe");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Change transparency on scroll
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-20 transition-colors duration-300 ${
        isScrolled || !transparent ? "bg-gray-900 shadow-md" : "bg-transparent"
      }`}
    >
      <div
        className="max-w-screen-xl flex items-center justify-between mx-auto px-4"
        style={{ height: "64px" }}
      >
        {/* Logo and Brand Name */}
        <div
          className="flex items-center cursor-pointer"
          onClick={navigateToAboutMe}
        >
          <Image
            src="/images/logoimg.png"
            alt="Trackify Logo"
            width={40}
            height={40}
            className="h-auto max-h-[40px]"
          />
          <span className="text-2xl font-semibold whitespace-nowrap text-white ml-2">
            Trackify
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-12 ml-10">
          <a href="#" className="text-white hover:text-blue-400 font-medium">
            Home
          </a>
          <a
            href="#about"
            className="text-white hover:text-blue-400 font-medium"
          >
            About
          </a>
          <a
            href="#services"
            className="text-white hover:text-blue-400 font-medium"
          >
            Services
          </a>
          <a
            href="#contact"
            className="text-white hover:text-blue-400 font-medium"
          >
            Contact
          </a>
        </div>

        {/* Auth Links */}
        <div className="ml-auto flex space-x-6">
          <button
            onClick={handleButtonClick}
            className="w-24 h-8 bg-gradient-to-r from-blue-500 to-green-400 text-white text-sm font-medium rounded-full shadow-sm"
          >
            Log in
          </button>
          <button
            onClick={handleButtonClick2}
            className="w-24 h-8 bg-gradient-to-r from-blue-500 to-green-400 text-white text-sm font-medium rounded-full shadow-sm"
          >
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}
