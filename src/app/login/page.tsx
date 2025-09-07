"use client";
import { useState } from "react";
import Card from "../components/Card";
import LoadingOverlay from "../components/LoadingOverlay";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

export default function Login() {
  const [loading, setLoading] = useState(false);


  return (
    <>
      <LoadingOverlay show={loading} />

      <div className="h-screen bg-gradient-to-br from-purple-800 via-blue-900 to-gray-900 text-black">
        <Navbar transparent />
        <div className="flex justify-center items-center h-full">
          <Card
            title="Hello!"
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
