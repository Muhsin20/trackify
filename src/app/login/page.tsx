"use client";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/footer"; // Adjust the import path based on your file structure


export default function Login() {
  //make a google login sso
  return (
    <>
      <div className="h-screen bg-gradient-to-br from-purple-800 via-blue-900 to-gray-900 text-black">
        <Navbar transparent />

        <div className="flex justify-center items-center h-full">
          <Card
            title="Hello!"
            title2="Welcome Back!"
            subtitle="Sign into your account"
          />
        </div>
      </div>

      <Footer />

    </>
  );
}
