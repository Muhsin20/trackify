"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "../components/LoadingOverlay";
import Card from "../components/Card";

export default function Logout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function logout() {
      try {
        const request = await fetch("/api/logout", {
          method: "POST",
          credentials: "include",
        });

        if (!request.ok) {
          console.log("Logout failed:", request.status);
        } else {
          const result = await request.json();
          console.log(result.message, result.user);
        }
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        // redirect back home after logout attempt
        router.push("/");
        setLoading(false);
      }
    }

    logout();
  }, [router]);

  // While logging out
  if (loading) {
    return (
      <>
        <LoadingOverlay show={true} />
        <div className="flex justify-center items-center h-full">
          <Card
            title="Hello!"
            title2="Welcome Back!"
            subtitle="Sign into your account"
            setLoading={setLoading}
          />
        </div>
      </>
    );
  }

  // Once loading is false, you can either show nothing or redirect is already handled
  return null;
}
