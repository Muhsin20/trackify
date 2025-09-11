"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { Typewriter } from "react-simple-typewriter";
import { useEffect, useState } from "react";
import { Fade, Slide } from "react-awesome-reveal"; // Added for animations
import Footer from "../components/footer"; // Adjust the import path based on your file structure
import FAQS from "../components/FAQS"; // Adjust the import path based on your file structure
import MeetOurExperts from "../components/MeetOurExperts"; // Adjust path if needed


export default function AboutMe() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Scroll to the top of the page on reload
    window.scrollTo({ top: 0, behavior: "auto" });

    // Handle hash-based scrolling (e.g., #what-we-do)
    if (window.location.hash === "#what-we-do") {
      setTimeout(() => {
        document.getElementById("what-we-do")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 500); // Short delay to allow page animations to complete
    }

    setMounted(true);
  }, []);

  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/login");
  };

  const experts = [
    {
      name: "Muhsin",
      role: "Co-Founder & CEO",
      photo: "/images/madan.png", // Replace with actual image path
      social: {
        linkedin: "https://www.linkedin.com/in/muhsin-adan-916026227/",
        email: "muhsinadan588@gmail.com"
      },
    },
    {
      name: "Ammaar",
      role: "Co-Founder & CEO",
      photo: "/images/akhan362.png", // Replace with actual image path
      social: {
        linkedin: "https://www.linkedin.com/in/ammaar-khan/",
        email: "ammaark76@gmail.com"
      },
    }
  ];


  return (
    <>
      <Navbar />
{/* Hero Section */}
<div className="relative w-full h-[400px] md:h-[600px] pt-24 flex items-center justify-center px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-white via-purple-50 to-white">
  {/* --- Decorative layer (fun + professional) --- */}
  <div aria-hidden className="pointer-events-none absolute inset-0">
    {/* faint grid */}
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="#1f2937" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* blurred orbs (subtle movement) */}
    <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-fuchsia-300/40 blur-[90px] motion-safe:animate-[float1_16s_ease-in-out_infinite]" />
    <div className="absolute -bottom-16 -right-20 h-80 w-80 rounded-full bg-indigo-300/40 blur-[100px] motion-safe:animate-[float2_18s_ease-in-out_infinite]" />

    {/* rotating ring halo */}
    <div className="absolute right-16 top-20 h-64 w-64 rounded-full ring-8 ring-purple-200/50 motion-safe:animate-[slowspin_36s_linear_infinite]" />
  </div>


        <div className="relative flex flex-col items-center text-center z-10 space-y-4 md:space-y-6">
          <Fade triggerOnce>
            <h1 className="text-3xl font-serif sm:text-4xl md:text-5xl font-bold tracking-wide leading-snug md:leading-tight font-Poppins">
              <span className="text-gray-800">
                <Typewriter
                  words={["We Help Professionals,"]}
                  loop={1}
                  cursor={false}
                  typeSpeed={90}
                />
              </span>
              <br />
              <span className="text-purple-700">
                <Typewriter
                  words={[
                    "Streamline Their Journey.",
                    "Organize Their Job Hunt.",
                    "Reach Their Goals.",
                  ]}
                  loop={Infinity}
                  cursor
                  cursorStyle="|"
                  typeSpeed={60}
                  deleteSpeed={45}
                  delaySpeed={1200}
                />
              </span>
            </h1>
          </Fade>
          <Slide direction="up" triggerOnce>
            <p className="pt-2 text-base sm:text-lg font-serif font-light max-w-xs sm:max-w-sm md:max-w-2xl text-gray-800 drop-shadow-md leading-relaxed">
              Welcome to{" "}
              <span className="text-purple-500 font-bold">Trackify —</span> your
              partner in career success. Get the guidance and support you need to
              achieve your goals.
            </p>
          </Slide>

          <Fade delay={300} triggerOnce>
            <button
              onClick={handleButtonClick}
              className="px-8 py-3 bg-black text-white text-lg font-semibold rounded-full shadow-lg backdrop-blur-md hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Get Started - Its Free!
            </button>
          </Fade>
        </div>

        
      </div>

      {/* About Us Section */}
      <div
        id="WHAT-WE-DO"
        className="relative w-full bg-gray-100 py-12 sm:py-16 md:py-20 px-4 sm:px-8"
      >
        <div className="absolute top-0 left-0 w-full h-[40px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              fill="#ffffff"
              d="M0,224C120,160,240,96,360,106.7C480,117,600,203,720,213.3C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative p-10 z-10 px-4">
          <Fade triggerOnce>
            <h2 className="text-4xl font-serif font-extrabold text-gray-900 mb-6 animate-fadeIn">
              What <span className="text-purple-500">We Do</span>
            </h2>
          </Fade>

          <Slide direction="up" triggerOnce>
            <p className="text-lg font-serif text-gray-700 mb-10 leading-relaxed animate-slideUp">
              At <span className="text-purple-500">Trackify,</span> we provide
              tools and insights to empower you to shape your professional path
              with confidence. Our mission is to create seamless career journeys
              that bring clarity and purpose to your goals.
            </p>
          </Slide>
        </div>

        {/* Feature Section */}
        {mounted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto px-4 sm:px-0">
            {[
              {
                title: "Career Insights",
                desc: "Discover tailored insights to help you make informed decisions for your career growth.",
                bgColor: "bg-purple-300",
                textColor: "text-black",
                cornerStyle: "rounded-tl-[40px]",
                icon: "/images/vision.png",
              },
              {
                title: "Powerful Tools",
                desc: "Leverage advanced tools to streamline your job applications and networking strategies.",
                bgColor: "bg-pink-300",
                textColor: "text-black",
                cornerStyle: "rounded-t-[40px]",
                icon: "/images/tool-box.png",
              },
              {
                title: "Goal Tracking",
                desc: "Stay on track with personalized goal setting and progress tracking features and many more!",
                bgColor: "bg-blue-300",
                textColor: "text-black",
                cornerStyle: "rounded-tr-[40px]",
                icon: "/images/target.png",
              },
            ].map((feature, index) => (
              <Fade key={index} delay={index * 150} triggerOnce>
                <div
                  className={`
                    flex flex-col 
                    p-8 
                    border border-black
                    shadow-md 
                    transition-all 
                    ease-in-out 
                    transform 
                    duration-500 
                    hover:scale-105 
                    hover:-translate-y-3 
                    hover:translate-x-2 
                    hover:rotate-2 
                    hover:shadow-lg 
                    ${feature.bgColor} 
                    ${feature.cornerStyle}
                    ${feature.textColor}
                  `}
                >
                  {/* Icon */}
                  {feature.icon && (
                    <div className="mb-4">
                      <Image
                        src={feature.icon}
                        alt={`${feature.title} Icon`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>

                  {/* Description */}
                  <p className="leading-relaxed text-sm mb-20">{feature.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        )}
      </div>

      {/* How it works Section */}
      <div
        id="HOW-IT-WORKS"
        className="relative w-full bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-8"
      >
        <div className="absolute top-0 left-0 w-full h-[40px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              fill="#ffffff"
              d="M0,224 L1440,224 L1440,200 L0,200 Z"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative p-10 z-10 px-4">
          <Fade triggerOnce>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 animate-fadeIn">
              How <span className="text-purple-500">It Works!</span>
            </h2>
          </Fade>

          <Slide direction="up" triggerOnce>
            <p className="text-lg font-serif text-gray-700 mb-10 leading-relaxed animate-slideUp">
              <span className="text-purple-500">Trackify</span> unites
              professionals in smarter job searching - compare application
              trends, optimize approaches, and boost interview rates through
              shared insights.
            </p>

            {/* Video container */}
            <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <video
                controls
                className="w-full aspect-video"
                poster="/path-to-poster-image.jpg" // Optional preview image
              >
                <source src="/path-to-your-video.mp4" type="video/mp4" />
                <track kind="captions" srcLang="en" label="English" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Slide>
        </div>
      </div>

      {/* FAQ Section */}
      
        <FAQS />
      {/* FAQ Section end */}



   {/* Meet Our Team Section */}
 <div
        id="meet-our-experts"
        className="relative w-full bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-8"
      >
        <div className="absolute top-0 left-0 w-full h-[40px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              fill="#ffffff"
              d="M0,224 L1440,224 L1440,200 L0,200 Z"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Fade triggerOnce>
            <h2 className="text-4xl font-serif font-extrabold text-gray-900 mb-6 animate-fadeIn">
              Meet Our Team of{" "}
              <span className="text-purple-500">Experts</span>
            </h2>
          </Fade>

          <Slide direction="up" triggerOnce>
            <p className="text-lg font-serif text-gray-700 mb-10 leading-relaxed animate-slideUp">
              The brilliant minds behind{" "}
              <span className="text-purple-500">Trackify</span>
            </p>
          </Slide>

          <MeetOurExperts experts={experts} />
        </div>
      </div>

    {/* MeetOurExperts component end */}
    

    {/* Footer Section */}
      <Footer />
    {/* Footer end */}


    </>
  );
}