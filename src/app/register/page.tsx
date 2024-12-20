"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as Yup from "yup";
const Register: React.FC = () => {
  interface Form {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const [formData, setFormData] = useState<Form>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  //schema used to enforce good passwords and usernames and to enforce users to enter fields
  const schema = Yup.object().shape({
    username: Yup.string()
      .required()
      .min(3, "Username must be at least 3 characters long")
      .max(25, "Username must be at max 25 characters long"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required()
      .min(8, "Password must be at least 8 characters long")
      .max(25, "Password must be at max 25 characters long"),
    confirmPassword: Yup.string()
      .required()
      .min(8, "Password must be at least 8 characters long")
      .max(25, "Password must be at max 25 characters long"),
  });

  //function to check if one of the fields is empty and credentials are valid for user to register

  async function registerUser(event: React.FormEvent) {
    event.preventDefault();
    if (formData.password != formData.confirmPassword) {
      alert("Passwords must match");
    } else {
      try {
        // Validate formData
        await schema.validate(formData, { abortEarly: false }); // Validate all fields

        // Validation passed, proceed with registration
        const request = await fetch(
          "https://tm89rn3opa.execute-api.us-east-1.amazonaws.com/register",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: formData.username,
              email: formData.email,
              password: formData.password,
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "Success your registered!") {
              console.log("Success:", data.message); // Success
              router.push("/login");
            } else {
              alert(`Username or password is in use`);
            }
            //   if (data.message === "Server Error") {
            //     console.error("Error:", data.error); // Server-side error
            //   } else if (data.message === "Username is already in use") {
            //     console.error("Error:", data.message); // Specific error
            //   } else if (data.message == "Internal Server Error") {
            //     alert("Server Error");
            //   } else {
            //     console.log("Success:", data.message); // Success
            //     router.push("/login");
            //   }
          })
          .catch((error) => {
            console.error("Network Error:", error.message);
          });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          // Collect and display all error messages
          const errorMessages = error.errors.join("\n");
          alert(errorMessages);
        }
      }
    }
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
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-100 to-gray-300">
      <div className="w-[500px] bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Create Your Account
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-500 text-sm mb-8">
          Join us and get started today!
        </p>

        {/* Form */}
        <form onSubmit={registerUser} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleForm}
              value={formData.email}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              onChange={handleForm}
              value={formData.username}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleForm}
              value={formData.password}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleForm}
              value={formData.confirmPassword}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-lg"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};
export default Register;
