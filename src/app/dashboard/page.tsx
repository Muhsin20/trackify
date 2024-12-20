"use client";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
// import { useState } from "react";
export default function Dashboard() {
  // const [user, setUser] = useState();
  useEffect(() => {
    async function authUser() {
      const request = await fetch("/api/auth/validate", {
        method: "GET",
        credentials: "include",
      });
      if (
        request.status == 500 ||
        request.status == 401 ||
        request.status == 400
      ) {
        console.log(request.status);
        router.push("/");
      } else {
        const result = await request.json();
        console.log(result.message);
        console.log(result.user);
      }
    }
    authUser();
  }, []);

  const router = useRouter(); // Initialize the router
  const handleButtonClick = () => {
    router.push("/"); // Redirect to the login page (page.tsx is typically at the root level)
  };

  return (
    <>
      <Navbar />
      <div className="font-bold text-black flex flex-col items-center justify-start h-screen pt-24">
        <h1 className="text-4xl mb-5">Welcome back Ammaar!</h1>

        <button //function for using log out button below
          onClick={handleButtonClick} // Attach the click handler
          className="px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {" "}
          Back
        </button>
      </div>
    </>
  );
}
