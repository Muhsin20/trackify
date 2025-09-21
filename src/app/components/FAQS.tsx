"use client";
import React, { useEffect, useRef, useState } from "react";
import { Fade, Slide } from "react-awesome-reveal";

type FAQ = { question: string; answer: string };

function AccordionItem({
  faq,
  index,
  open,
  onToggle,
}: {
  faq: FAQ;
  index: number;
  open: boolean;
  onToggle: (i: number) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    el.style.overflow = "hidden";
    el.style.transition = "max-height 300ms ease";

    let cancelled = false;

    if (open) {
      // expand
      const full = el.scrollHeight;
      el.style.maxHeight = `${full}px`;

      const onEnd = () => {
        if (!cancelled && open) {
          // let it grow naturally once fully open
          el.style.maxHeight = "none";
        }
      };
      el.addEventListener("transitionend", onEnd, { once: true });
      return () => {
        cancelled = true;
      };
    } else {
      // collapse
      if (el.style.maxHeight === "" || el.style.maxHeight === "none") {
        el.style.maxHeight = `${el.scrollHeight}px`;
        void el.getBoundingClientRect(); // force reflow
      }
      el.style.maxHeight = "0px";
    }
  }, [open]);

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-md shadow-sm hover:shadow-lg transition-all">
      <button
        id={`faq-button-${index}`}
        onClick={() => onToggle(index)}
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        className="w-full text-left p-5 sm:p-6 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-300 rounded-xl"
      >
        <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          {faq.question}
        </span>
        <svg
          className={`h-5 w-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-button-${index}`}
        ref={panelRef}
        style={{ maxHeight: open ? undefined : "0px", overflow: "hidden" }}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

const FAQS = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
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
    {
      question: "How do I contact support?",
      answer:
        "You can reach out to our support team at support@trackify.com, and we'll get back to you within 24 hours.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex((curr) => (curr === index ? null : index));
  };

  return (
    <div id="faqs" className="relative w-full px-4 sm:px-8">
      {/* decorative wave */}
      <div className="absolute top-0 left-0 w-full h-[40px]" aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          <path
            className="fill-white dark:fill-[#0e0f14]"
            d="M0,224C120,160,240,96,360,106.7C480,117,600,203,720,213.3C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 pt-12">
        <Fade triggerOnce>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Frequently asked <span className="text-indigo-700 dark:text-indigo-300">Questions</span>
          </h2>
        </Fade>

        <Slide direction="up" triggerOnce>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            We’ve heard your questions! Get all the{" "}
            <span className="text-indigo-700 dark:text-indigo-300 font-semibold">Trackify</span> insights you need here.
          </p>
        </Slide>

        <div className="space-y-4 text-left">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} faq={faq} index={i} open={activeIndex === i} onToggle={toggleFAQ} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQS;
