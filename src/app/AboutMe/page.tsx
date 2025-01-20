"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { Typewriter } from "react-simple-typewriter"; // Import Typewriter

export default function AboutMe() {
  const router = useRouter(); // Initialize the router
  const handleButtonClick = () => {
    router.push("/login"); // Redirect to the login page (page.tsx is typically at the root level)
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <div className="relative w-full h-[700px] bg-white flex items-center justify-center px-10">
        {/* png Element */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] z-0">
          <Image
            src="/images/sideimg.png" // Replace with the path to your SVG
            alt="side image"
            fill
            style={{ objectFit: "contain" }}
            className="absolute inset-0 z-0"
          />
        </div>

        {/* Background Image */}
        <Image
          src="/images/background.png" // Updated path
          alt="Background Image"
          fill
          style={{ objectFit: "cover" }}
          className="absolute inset-0 z-0 opacity-50"
        />

        {/* Content Wrapper */}
        <div className="relative flex flex-col items-center text-center z-10 space-y-6 animate-fadeIn">
          <h1 className="text-5xl font-bold tracking-wide mb-3 leading-snug font-Poppins drop-shadow-lg">
            <span className="text-gray-800">
              <Typewriter
                words={["We Help Professionals,"]}
                loop={1} // Show this text only once
                cursor={false} // Disable blinking cursor after typing
                typeSpeed={100} // Speed of typing
                deleteSpeed={50} // Speed of deleting (not applicable here)
                delaySpeed={1000} // Delay after typing
              />
            </span>
            <br />
            <span className="text-purple-700">
              <Typewriter
                words={[
                  "Streamline Their Journey.",
                  "Organizing Their Job Hunt.",
                  "Reach Their Goals.",
                ]}
                loop={Infinity} // Repeat the animation indefinitely
                cursor // Keep cursor for this animation
                cursorStyle="|" // Style of the cursor
                typeSpeed={70} // Speed of typing
                deleteSpeed={50} // Speed of deleting
                delaySpeed={1500} // Delay between words
              />
            </span>
          </h1>
          <p className="pt-2 text-lg font-light max-w-lg drop-shadow-sm">
            At <span className="text-purple-500 font-bold">Trackify</span>, we
            guide your career journey, helping you achieve your goals and build
            the future you deserve.
          </p>
          <button
            onClick={handleButtonClick}
            className="px-8 py-3 bg-gradient-to-r from-purple-900 via-blue-900 to-black text-white text-lg font-medium rounded-full shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Get Started - Its free!
          </button>
        </div>
      </div>

      {/* About Us Section */}
      <div className="relative w-full bg-gray-100 py-16 px-10">
        {/* Swirly Line */}
        <div className="absolute top-0 left-0 w-full h-[50px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              fill="#ffffff" // Adjust the fill color if needed
              d="M0,224C120,160,240,96,360,106.7C480,117,600,203,720,213.3C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 pt-24">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            What <span className="text-purple-500">We Do</span>
          </h2>
          <p className="text-lg text-gray-700 mb-10 leading-relaxed">
            At Trackify, we provide tools and insights to empower you to shape
            your professional path with confidence. Our mission is to create
            seamless career journeys that bring clarity and purpose to your
            goals.
          </p>
        </div>

        {/* Feature Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-8 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow">
            <Image
              src="/images/trackify-logo.png"
              alt="Analytics"
              width={100}
              height={100}
              className="mb-6"
            />
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Career Insights
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Discover tailored insights to help you make informed decisions for
              your career growth.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-8 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow">
            <Image
              src="/images/trackify-logo.png"
              alt="Tools"
              width={100}
              height={100}
              className="mb-6"
            />
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Powerful Tools
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Leverage advanced tools to streamline your job applications and
              networking strategies.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-8 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow">
            <Image
              src="/images/trackify-logo.png"
              alt="Goals"
              width={100}
              height={100}
              className="mb-6"
            />
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Goal Tracking
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Stay on track with personalized goal setting and progress tracking
              features.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-black text-white py-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-purple-400 font-bold">Trackify</span>. All
            rights reserved.
          </p>
          <p className="text-sm mt-2">
            Crafted with ❤️ to empower your professional journey.
          </p>
        </div>
      </footer>
    </>
  );
}
