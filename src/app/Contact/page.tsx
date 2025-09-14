"use client";
import { HiOutlineUser, HiOutlineMail, HiArrowRight } from "react-icons/hi";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

export default function Contact() {
  const [message, setMessage] = useState("");
  const maxChars = 300;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-tr from-indigo-700 from-[0%] via-[#0c0f25] via-[60%] to-black to-[100%] text-white">
        <Navbar transparent />

        {/* Flex container just below navbar */}
        <div className="px-8 pt-40">
          <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
            {/* Left column */}
            <div className="flex flex-col items-start text-left max-w-lg">
              <span className="inline-block rounded-full bg-gray-500 px-3 py-1 text-sm font-medium text-gray-100 mb-6">
                Contact Us
              </span>
              <h1 className="text-4xl font-bold">Let’s Get in Touch.</h1>
              <h4 className="mt-6">
                Or just reach out manually to{" "}
                <span className="text-indigo-500">support@trackify.com</span>.
              </h4>
            </div>

            {/* Right column (form) */}
            <form className="ml-8">
              <div className="w-full md:w-auto flex flex-col justify-center space-y-6">
                {/* Full Name */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="full_name" className="text-sm font-medium text-gray-200">
                    Full Name
                  </label>
                  <div className="relative w-[700px] max-w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/90">
                      <HiOutlineUser className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      id="full_name"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="rounded-full bg-gray-700 pl-10 pr-3 py-2 w-full text-white placeholder:text-gray-400 
                                 border border-gray-400/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-200">
                    Email Address
                  </label>
                  <div className="relative w-[700px] max-w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/90">
                      <HiOutlineMail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="rounded-full bg-gray-700 pl-10 pr-3 py-2 w-full text-white placeholder:text-gray-400 
                                 border border-gray-400/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-200">
                    Message
                  </label>
                  <div className="relative w-[700px] max-w-full">
                    <textarea
                      id="message"
                      maxLength={maxChars}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="rounded-xl bg-gray-700 px-3 py-2 w-full h-48 text-white placeholder:text-gray-400 
                                 border border-gray-400/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    {/* Counter */}
                    <span className="absolute bottom-2 left-3 text-xs text-gray-400">
                      {message.length}/{maxChars}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-500 
                             w-[700px] max-w-full py-3 text-lg font-semibold text-white transition-colors"
                >
                  Send Message
                  <HiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
