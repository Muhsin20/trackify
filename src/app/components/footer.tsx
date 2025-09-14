"use client";
import React from "react";
import Link from "next/link";
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaArrowRight } from "react-icons/fa";

// Define the props interface
interface FooterProps {
  companyName?: string;
  tagline?: string;
}

const Footer: React.FC<FooterProps> = ({
  companyName = "Trackify",
  tagline = "Crafted with ❤️ to empower your professional journey.",
}) => {
  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {companyName}
            </h1>
            <p className="text-sm text-gray-300">{tagline}</p>
            <div className="flex space-x-4">
              {[
                { icon: FaTwitter, link: "https://twitter.com" },
                { icon: FaLinkedin, link: "https://linkedin.com" },
                { icon: FaGithub, link: "https://github.com" },
                { icon: FaEnvelope, link: "mailto:support@trackify.com" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Features", href: "/features" },
                { label: "Pricing", href: "/pricing" },
                { label: "Contact", href: "/Contact" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center text-sm text-gray-300 hover:text-purple-400 transition-all duration-300 hover:translate-x-2"
                  >
                    <FaArrowRight className="w-3 h-3 mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Newsletter
            </h3>
            <p className="text-sm text-gray-300">
              Subscribe to get the latest updates and insights.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>Email: support@trackify.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 123 Career Lane, Suite 456, Success City</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-500 my-8"></div>

        {/* Copyright Section */}
        <div className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">
              {companyName}
            </span>
            . All rights reserved.
          </p>
          <p className="mt-1 text-xs sm:text-sm text-gray-400">{tagline}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;