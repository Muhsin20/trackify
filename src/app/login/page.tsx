"use client";
import { useState } from "react";
import Card from "../components/Card";              // your LoginCard
import LoadingOverlay from "../components/LoadingOverlay";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import LoginBackground from "../components/LoginBackground";

export default function Login() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay show={loading} />

      <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        <LoginBackground />            {/* ← shapes layer */}
        <Navbar />

        <div className="h-screen flex items-center justify-center min-h-[calc(100vh-6rem)] px-4">
          <Card
            title="HELLO & WELCOME!"
            title2="Welcome Back!"
            subtitle="Sign into your account"
            setLoading={setLoading}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
