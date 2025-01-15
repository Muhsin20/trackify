"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Logout() {
  const router = useRouter(); // Initialize the router
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
    }
    logout();
  }, []);
  return (
    <>
      <div>401 Error</div>
    </>
  );
}
