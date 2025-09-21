"use client";
import React from "react";
import Link from "next/link";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

interface FooterProps {
  companyName?: string;
  tagline?: string;
}

const Footer: React.FC<FooterProps> = ({
  companyName = "Trackify",
  tagline = "Crafted with ❤️ to empower your professional journey.",
}) => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/Contact" },
  ];

  const socials = [
    { icon: FaLinkedin, link: "https://linkedin.com", label: "LinkedIn" },
    { icon: FaEnvelope, link: "mailto:support@trackify.ink", label: "Email" },
  ];

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Top animated accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-[pulse_6s_ease-in-out_infinite]" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        {/* Header blurb */}
        <div className="mb-6 flex flex-col items-center text-center">
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
            {companyName}
          </h2>
          <p className="mt-1 text-xs text-gray-300">{tagline}</p>
        </div>

        {/* Divider */}
        <div className="relative mx-auto mb-6 h-px w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/70 to-transparent" />
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 text-sm">
          {/* Brand + Socials */}
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {companyName}
              </span>
              <span className="rounded-full border border-purple-400/30 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-purple-200/90">
                Beta
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Your personal job tracker—fast, focused, and friendly.
            </p>
            <div className="flex items-center space-x-3">
              {socials.map(({ icon: Icon, link, label }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-400 transition-all duration-300 hover:text-purple-400 hover:scale-110"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Quick Links
            </h3>
            <ul className="mt-2 space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-xs text-gray-300 transition-all hover:text-purple-400"
                  >
                    <FaArrowRight className="mr-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Motto */}
          <div>
            <h3 className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Our Motto
            </h3>
            <p className="mt-2 text-xs italic text-gray-300">
              “Helping you land your dream job, one application at a time.”
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Contact Us
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-gray-300">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@trackify.com"
                  className="text-purple-300 underline underline-offset-2 hover:text-pink-300"
                >
                  support@trackify.ink
                </a>
              </li>
              <li>Address: Chicago, IL</li>
            </ul>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="relative mx-auto my-6 h-px w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />
        </div>

        {/* Copyright */}
        <div className="text-center text-[11px] text-gray-400">
          © {year}{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {companyName}
          </span>
          . All rights reserved. {tagline}
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-[pulse_8s_ease-in-out_infinite]" />
    </footer>
  );
};

export default Footer;
