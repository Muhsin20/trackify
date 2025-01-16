"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";

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
      <div className="relative w-full h-[700px] bg-gradient-to-b from-black via-transparent to-gray-900">
        {/* Background Image */}
        <Image
          src="/images/jobss2.jpg" // Adjust the path if necessary
          alt="Empowering Professionals with Trackify"
          layout="fill"
          objectFit="cover"
          className="z-0 filter blur-sm brightness-75"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center text-white space-y-6 animate-fadeIn">
          <h1 className="text-5xl font-extrabold tracking-wide mb-3 leading-snug font-Poppins drop-shadow-lg">
            Empowering Professionals <br /> to Take Control of Their Careers.
          </h1>
          <p className="text-lg font-light max-w-2xl drop-shadow-sm">
            At <span className="text-purple-500 font-bold">Trackify</span>, we
            guide your career journey, helping you achieve your goals and build
            the future you deserve.
          </p>
          <button
            onClick={handleButtonClick}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-400 text-white text-lg font-medium rounded-full shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Get Started - Its free!
          </button>
        </div>
      </div>

      {/* About Us Section */}
      <div className="w-full bg-gray-100 py-16 px-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            About <span className="text-purple-500">Trackify</span>
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
