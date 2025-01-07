// "use client";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useState } from "react";
// import Card from "../components/Card";
// export default function Login() {
//   //create form object to hold email and password
//   interface Form {
//     email: string;
//     password: string;
//   }
//   const [formData, setFormData] = useState<Form>({ email: "", password: "" });
//   const router = useRouter();

//   function goToSignUp() {
//     router.push("/register");
//   }

//   console.log(formData);

//   return (
//     <>
//       <div className="font-bold text-black">
//         <div className="flex justify-center items-center mt-32">
//           <Card
//             title="Hello!"
//             title2="Welcome Back!"
//             subtitle="Sign into your account"
//           />
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import Card from "../components/Card";
import Navbar from "../components/Navbar";

export default function Login() {
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

      <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-black text-white py-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-purple-400 font-bold">Trackify</span>. All
            rights reserved.
          </p>
          <p className="text-sm mt-2">
            Crafted with ❤️ to empower your professional journey.
          </p>
        </div>
      </footer>
    </>
  );
}
