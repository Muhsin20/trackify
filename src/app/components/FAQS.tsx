"use client";
import React, { useState } from "react";
import { Fade, Slide } from "react-awesome-reveal";

const FAQS = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Trackify?",
      answer:
        "Trackify is a platform designed to help professionals streamline their career journey by providing tools and insights to organize job hunts, track progress, and achieve goals.",
    },
    {
      question: "How do I get started with Trackify?",
      answer:
        "Simply sign up for a free account, and you'll gain access to all our tools and features to start organizing your career journey.",
    },
    {
      question: "Is Trackify free to use?",
      answer:
        "Yes, Trackify offers a free plan with essential features. We also have premium plans for advanced tools and insights.",
    },
    // {
    //   question: "Can I cancel my subscription at any time?",
    //   answer:
    //     "Absolutely! You can cancel your subscription anytime, and you'll retain access to premium features until the end of your billing cycle.",
    // },
    {
      question: "How do I contact support?",
      answer:
        "You can reach out to our support team at support@trackify.com, and we'll get back to you within 24 hours.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div id="FAQS" className="relative w-full bg-gray-100 py-12 sm:py-16 md:py-20 px-4 sm:px-8">
      <div className="absolute top-0 left-0 w-full h-[40px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          <path fill="#ffffff" d="M0,224C120,160,240,96,360,106.7C480,117,600,203,720,213.3C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 pt-12">
        <Fade triggerOnce>
          <h2 className="text-4xl font-serif font-extrabold text-gray-900 mb-6 animate-fadeIn px-4">
            Frequently asked <span className="text-purple-500">Questions</span>
          </h2>
        </Fade>

        <Slide direction="up" triggerOnce>
          <p className="text-lg font-serif text-gray-700 mb-10 leading-relaxed animate-slideUp">
            We've heard your questions! Get all the - <span className="text-purple-500">Trackify</span> insights you need right here.
          </p>
        </Slide>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
              <button onClick={() => toggleFAQ(index)} className="w-full text-left p-6 flex justify-between items-center focus:outline-none">
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                <svg className={`w-6 h-6 transition-transform duration-300 ${activeIndex === index ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${activeIndex === index ? "max-h-96" : "max-h-0"}`}>
                <div className="p-6 pt-0 text-gray-700">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQS;