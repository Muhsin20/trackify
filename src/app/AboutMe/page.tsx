"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { Typewriter } from "react-simple-typewriter";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { useEffect, useState } from "react";




export default function AboutMe() {

  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/login");
  };

  // Data for Pie Chart (Career Insights)
  const pieData = [
    { name: "Networking", value: 30 },
    { name: "Resume Building", value: 20 },
    { name: "Interview Prep", value: 25 },
    { name: "Skill Development", value: 25 }
  ];
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

  // Data for Bar Chart (Powerful Tools)
  const barData = [
    { name: "Job Apps", value: 65 },
    { name: "Referrals", value: 80 },
    { name: "Follow-Ups", value: 50 }
  ];

  // Data for Line Chart (Goal Tracking)
  const lineData = [
    { month: "Jan", progress: 10 },
    { month: "Feb", progress: 30 },
    { month: "Mar", progress: 50 },
    { month: "Apr", progress: 70 },
    { month: "May", progress: 90 }
  ];

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[600px] bg-gradient-to-b from-purple-200 via-white to-white flex items-center justify-center px-8">
        {/* Side Image */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/3 w-[350px] h-[350px] z-0 opacity-70">
          <Image
            src="/images/sideimg.png"
            alt="Side Image"
            fill
            className="absolute inset-0 z-0 opacity-30"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Background Overlay */}
        <Image
          src="/images/background.png"
          alt="Background"
          fill
          className="absolute inset-0 z-0 opacity-30"
          style={{ objectFit: "cover" }}
        />

        {/* Hero Content */}
        <div className="relative flex flex-col items-center text-center z-10 space-y-6">
          <h1 className="text-5xl font-bold tracking-wide leading-tight font-Poppins drop-shadow-lg animate-fadeIn">
            <span className="text-gray-800">
              <Typewriter words={["We Help Professionals,"]} loop={1} cursor={false} typeSpeed={90} />
            </span>
            <br />
            <span className="text-purple-700">
              <Typewriter
                words={["Streamline Their Journey.", "Organize Their Job Hunt.", "Reach Their Goals."]}
                loop={Infinity}
                cursor
                cursorStyle="|"
                typeSpeed={60}
                deleteSpeed={45}
                delaySpeed={1200}
              />
            </span>
          </h1>
          <p className="pt-2 text-lg font-light max-w-2xl text-gray-800 drop-shadow-md leading-relaxed animate-slideUp">
            Welcome to <span className="text-purple-500 font-bold">Trackify— </span>, your partner in career success. Get the guidance and support you need to achieve your goals and build your future.
          </p>
          <button
            onClick={handleButtonClick}
            className="px-8 py-3 bg-black text-white text-lg font-semibold rounded-full shadow-lg backdrop-blur-md hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Get Started - Its Free!
          </button>
        </div>
      </div>

      {/* About Us Section */}
      <div className="relative w-full bg-gray-100 py-20 px-8">
        {/* Decorative Swirly Line */}
        <div className="absolute top-0 left-0 w-full h-[40px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
            <path fill="#ffffff" d="M0,224C120,160,240,96,360,106.7C480,117,600,203,720,213.3C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 animate-fadeIn">
            What <span className="text-purple-500">We Do</span>
          </h2>
          <p className="text-lg text-gray-700 mb-10 leading-relaxed animate-slideUp">
            At Trackify, we provide tools and insights to empower you to shape your professional path with confidence.
            Our mission is to create seamless career journeys that bring clarity and purpose to your goals.
          </p>
        </div>

        {/* Feature Section */}
        {mounted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                title: "Career Insights", 
                desc: "Discover tailored insights to help you make informed decisions for your career growth.",
                chart: (
                  <PieChart width={200} height={200}>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )
              },
              { 
                title: "Powerful Tools", 
                desc: "Leverage advanced tools to streamline your job applications and networking strategies.",
                chart: (
                  <BarChart width={200} height={200} data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                )
              },
              { 
                title: "Goal Tracking", 
                desc: "Stay on track with personalized goal setting and progress tracking features.",
                chart: (
                  <LineChart width={200} height={200} data={lineData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="progress" stroke="#ff7f50" />
                  </LineChart>
                )
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-8 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow transform hover:scale-105 duration-300">
                {feature.chart}
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Section */}
      <footer className=" bg-black text-white py-6">
        <div className="max-w-screen-xl mx-auto text-center text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-purple-400 font-bold">Trackify</span>. All
            rights reserved.
          </p>
          <p className="mt-1">
            Crafted with ❤️ to empower your professional journey.
          </p>
    </div>
    </footer>
  </>
  );
}
