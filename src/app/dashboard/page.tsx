"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";
import TopBar from "../components/TopBar";
import Grid from "../components/Grid";
// import { useState } from "react";
export default function Dashboard() {
  // const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [id, setID] = useState();
  const [applicationsByStatus, setApplicationsByStatus] = useState([]);
  const router = useRouter(); // Initialize the router
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

  useEffect(() => {
    const fetchApplicationsByStatus = async () => {
      const response = await fetch("/api/get-dashboard-data", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setApplicationsByStatus(data.applications);
      }
    };

    fetchApplicationsByStatus();
  }, []);
  if (id) {
    console.log("");
  }
  return (
    <>
      <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
        <Sidebar username={username} email={email} />
        <div className="bg-white rounded-lg pb-4 shadow h-[200vh]">
          <TopBar username={username} />
          <Grid stats={applicationsByStatus} />
        </div>
      </main>
    </>
  );
}
