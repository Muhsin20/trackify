"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function Logout() {
  const router = useRouter(); // Initialize the router
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function logout() {
      const request = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (
        request.status == 500 ||
        request.status == 400 ||
        request.status == 500
      ) {
        console.log(request.status);
        router.push("/");
      } else {
        const result = await request.json();
        console.log(result.message);
        console.log(result.user);
        router.push("/");
      }
      setLoading(false);
    }
    logout();
  }, []);
  // Display loading indicator while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }
  return <></>;
}
