import { useRouter } from "next/navigation";
import { useState } from "react";

interface CardProps {
  title: string;
  title2: string;
  subtitle: string;
}

export default function Card({ title, title2, subtitle }: CardProps) {
  interface Form {
    email: string;
    password: string;
  }
  const [formData, setFormData] = useState<Form>({ email: "", password: "" });

  const router = useRouter();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (formData.email == "" || formData.password == "") {
      alert("One of the fields is empty");
    } else {
      const request = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      console.log("lets see");
      if (!request.ok) {
        console.log("nope");

        const result = await request.json();
        console.log(`result is: ${result}`);
        const message = result.message ? result.message : "";
        console.log(message);

        alert(`${message}`);
      } else {
        const result = await request.json();
        console.log(`result is ${result.message}`);
        router.push("/dashboard");

        console.log("moving");
      }
    }
  }
  function goToSignUp() {
    router.push("/register");
  }

  //function to update the formData object with the values the user is adding to the fields

  function handleForm(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  return (
    <div className="w-[700px] h-auto mx-auto mt-16 bg-white rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
      {/* Flex container to split the card into two sections */}
      <div className="flex">
        {/* Left side - Login Form */}
        <div className="w-1/2 p-8">
          {/* Title */}
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-center text-gray-600 text-sm mb-6">{subtitle}</p>
          )}

          {/* Input fields */}
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Enter Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={handleForm}
                value={formData.email}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Enter Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                onChange={handleForm}
                value={formData.password}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-3 mt-6">
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Continue
            </button>
            <button
              onClick={goToSignUp}
              className="w-full py-3 bg-gray-100 text-blue-500 border border-blue-500 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition duration-300"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Right side - Purple Background */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-purple-500 to-indigo-600 text-white p-8">
          {/* Title2 */}
          <h2 className="text-3xl font-extrabold mb-4">{title2}</h2>
          <p className="text-center text-white text-sm leading-6 opacity-90">
            Access your account and explore the features. Welcome back!
          </p>
        </div>
      </div>
    </div>
  );
}
