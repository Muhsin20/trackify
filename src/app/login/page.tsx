"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Card from "../components/Card";
export default function Login() {
  //create form object to hold email and password
  interface Form {
    email: string;
    password: string;
  }
  const [formData, setFormData] = useState<Form>({ email: "", password: "" });
  const router = useRouter();

  function goToSignUp() {
    router.push("/register");
  }

  console.log(formData);

  return (
    <>
      <div className="font-bold text-black">
        <div className="flex justify-center items-center mt-32">
          <Card
            title="Hello!"
            title2="Welcome Back!"
            subtitle="Sign into your account"
          />
        </div>
      </div>
    </>
  );
}
