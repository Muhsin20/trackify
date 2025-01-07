"use client";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TopBar from "../components/TopBar";
import Grid from "../components/Grid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function JobApplication() {
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
      <div>
        <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
          <Sidebar />
          <div className="bg-white rounded-lg pb-4 shadow h-[200vh]">
            <TopBar />
          </div>
        </main>
      </div>
    </>
  );
}
