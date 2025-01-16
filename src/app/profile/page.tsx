"use client";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import JobApplication from "../components/JobApplication";
import { ToastContainer, toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function Profile() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [id, setID] = useState();
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
        setID(result.user.id);
        setEmail(result.user.email);
        setUsername(result.user.username);
      }
    }
    authUser();
  }, []);
  return (
    <>
      <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
        <Sidebar username={username} email={email} />
        <div className="bg-white rounded-lg pb-4 shadow h-[200vh]">
          <div className="flex justify-between items-center mb-6 ml-5 mt-5">
            <h1 className="text-4xl font-bold text-gray-900">
              <span className="text-gray-900">Profile </span>
              <span className="text-purple-600">Page</span>
            </h1>
          </div>
          <p className="text-center text-black">
            Hi there! 👋 We're excited to let you know that the Profile Page is
            currently being built! 🎉 Soon, you’ll be able to view and update
            your details, including your username, email, and resume. Stay
            tuned—we’re working hard to bring you a smoother, more personalized
            experience. Thank you for your patience and support! 🙌 If you have
            any questions or feedback, feel free to reach out!
          </p>
        </div>
      </main>
    </>
  );
}
