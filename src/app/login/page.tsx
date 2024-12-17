"use client";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    router.push("/dashboard");
  }
  return (
    <>
      <div className="font-bold text-black">
        <h1 className="fixed left-0 top-5 ml-5 text-4xl">
          Welcome to Trackify!
        </h1>
        <form onSubmit={handleLogin}>
          <button className="mt-32 ml-5 w-72 h-10 bg-blue-500 rounded-sm font-bold text-white">
            Continue
          </button>
        </form>
      </div>
    </>
  );
}
