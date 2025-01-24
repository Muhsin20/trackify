// "use client";

// import Sidebar from "../components/Sidebar";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// export default function Profile() {
//   const router = useRouter();

//   // State for user data
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [id, setID] = useState("");
//   const [profileImage, setProfileImage] = useState(""); // State for profile image

//   // Fetch user data
//   useEffect(() => {
//     async function authUser() {
//       const request = await fetch("/api/auth/validate", {
//         method: "GET",
//         credentials: "include",
//       });
//       if (
//         request.status === 500 ||
//         request.status === 401 ||
//         request.status === 400
//       ) {
//         router.push("/");
//       } else {
//         const result = await request.json();
//         setEmail(result.user.email);
//         setUsername(result.user.username);
//         setID(result.user.id);
//       }
//       setLoading(false);
//     }
//     authUser();
//   }, [router]);

//   // Handle image upload future call to databse - muhsins part
//   const uploadProfilePicture = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const files = event.target.files; // Get the FileList from the input
//     if (files && files.length > 0) {
//       const file = files[0]; // Get the first file
//       const formData = new FormData();
//       formData.append("userID", id);
//       formData.append("file", file);
//       const request = await fetch("/api/add-profile-picture", {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       });
//       if (!request.ok) {
//         try {
//           const result = await request.json();
//           toast.error("Failed to upload profile picture!", {
//             position: "top-center",
//             autoClose: 5000,
//           });
//         } catch {
//           toast.error("Failed to upload profile picture!", {
//             position: "top-center",
//             autoClose: 5000,
//           });
//         }
//         return;
//       } else {
//         const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the image
//         toast.success("Profile Picture Added!", {
//           position: "top-center",
//           autoClose: 5000,
//         });
//         setProfileImage(imageUrl); // Set the state with the image URL
//       }
//     } else {
//       alert("No file selected!");
//       return;
//     }
//   };

//   useEffect(() => {
//     async function fetchProfilePicture() {
//       const request = await fetch("/api/get-profile-picture", {
//         method: "GET",
//         credentials: "include",
//       });
//       if (
//         request.status === 500 ||
//         request.status === 401 ||
//         request.status === 400 ||
//         request.status === 404
//       ) {
//         setProfileImage("");
//       } else {
//         const result = await request.json();
//         setProfileImage(result.message);
//       }
//     }
//     fetchProfilePicture();
//   }, []);

//   // Display loading indicator while fetching data
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-lg font-medium">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
//         <Sidebar username={username} email={email} profilePic={profileImage} />
//         <div className="bg-white rounded-lg pb-8 shadow h-full">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6 ml-5 mt-5">
//             <h1 className="text-4xl font-bold text-gray-900">
//               <span className="text-gray-900">Profile </span>
//               <span className="text-purple-600">Page</span>
//             </h1>
//           </div>
//           <ToastContainer />
//           {/* User Info Section */}
//           <div className="flex flex-col items-center">
//             <div className="relative">
//               {/* Profile Picture */}
//               <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-purple-500 shadow-md flex items-center justify-center overflow-hidden">
//                 {profileImage ? (
//                   <img
//                     src={profileImage}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-gray-500 text-2xl">
//                     {username[0]?.toUpperCase() || "U"}
//                   </span>
//                 )}
//               </div>

//               {/* Upload Button */}
//               <label
//                 htmlFor="upload-image"
//                 className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full shadow hover:bg-purple-600 transition cursor-pointer"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="h-5 w-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M12 5v14m7-7H5"
//                   />
//                 </svg>
//               </label>
//               <input
//                 id="upload-image"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={uploadProfilePicture}
//               />
//             </div>

//             <h2 className="text-2xl font-semibold mt-4">{username}</h2>
//             <p className="text-gray-600">{email}</p>
//           </div>

//           {/* Profile Details Section */}
//           <div className="mt-8 px-10 text-center">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
//               {/* Email */}
//               <div className="flex flex-col items-center">
//                 <h3 className="text-sm font-medium text-gray-500">Email</h3>
//                 <p className="mt-1 text-lg font-semibold text-gray-800">
//                   {email}
//                 </p>
//               </div>

//               {/* Username */}
//               <div className="flex flex-col items-center">
//                 <h3 className="text-sm font-medium text-gray-500">Username</h3>
//                 <p className="mt-1 text-lg font-semibold text-gray-800">
//                   {username}
//                 </p>
//               </div>
//             </div>

//             {/* Additional Info */}
//             <div className="mt-6 flex flex-col items-center justify-center">
//               <h3 className="text-sm font-medium text-gray-500">
//                 Additional Info
//               </h3>
//               <p className="mt-1 text-lg font-semibold text-gray-600">
//                 Coming Soon...
//               </p>
//             </div>
//           </div>

//           {/* Edit Profile Button */}
//           <div className="mt-12 flex justify-center">
//             <button
//               onClick={() => router.push("/edit-profile")}
//               className="px-6 py-3 bg-purple-500 text-white font-medium rounded-lg shadow hover:bg-purple-600 transition"
//             >
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
"use client";

import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Profile() {
  const router = useRouter();

  // State for user data
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [id, setID] = useState("");
  const [profileImage, setProfileImage] = useState(""); // State for profile image
  const [resume, setResume] = useState(""); // State for resume

  // Fetch user data
  useEffect(() => {
    async function authUser() {
      const request = await fetch("/api/auth/validate", {
        method: "GET",
        credentials: "include",
      });
      if (
        request.status === 500 ||
        request.status === 401 ||
        request.status === 400
      ) {
        router.push("/");
      } else {
        const result = await request.json();
        setEmail(result.user.email);
        setUsername(result.user.username);
        setID(result.user.id);
        fetchResume(result.user.id); // Fetch resume when user is authenticated
      }
      setLoading(false);
    }
    authUser();
  }, [router]);

  // Fetch the resume from the server
  const fetchResume = async (userID: string) => {
    try {
      const request = await fetch(`/api/get-resume`, {
        method: "GET",
        credentials: "include",
      });
      if (request.ok) {
        const { signedUrl } = await request.json();
        setResume(signedUrl); // Set the signed URL to view the resume
      } else {
        setResume(""); // If no resume, clear the state
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      toast.error("Failed to fetch resume.");
    }
  };

  // Handle profile picture upload
  const uploadProfilePicture = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files; // Get the FileList from the input
    if (files && files.length > 0) {
      const file = files[0]; // Get the first file
      const formData = new FormData();
      formData.append("userID", id);
      formData.append("file", file);
      const request = await fetch("/api/add-profile-picture", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!request.ok) {
        try {
          const result = await request.json();
          toast.error("Failed to upload profile picture!", {
            position: "top-center",
            autoClose: 5000,
          });
        } catch {
          toast.error("Failed to upload profile picture!", {
            position: "top-center",
            autoClose: 5000,
          });
        }
        return;
      } else {
        const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the image
        toast.success("Profile Picture Added!", {
          position: "top-center",
          autoClose: 5000,
        });
        setProfileImage(imageUrl); // Set the state with the image URL
      }
    } else {
      alert("No file selected!");
      return;
    }
  };

  // Handle resume upload
  const uploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append("userID", id);
      formData.append("file", file);

      const request = await fetch("/api/add-resume", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!request.ok) {
        toast.error("Failed to upload resume!", {
          position: "top-center",
          autoClose: 5000,
        });
      } else {
        const { message } = await request.json();
        toast.success("Resume Added!", {
          position: "top-center",
          autoClose: 5000,
        });
        const imageUrl = URL.createObjectURL(file);
        setResume(imageUrl);
        // fetchResume(id); // Refresh the resume link after upload
      }
    }
  };
  useEffect(() => {
    async function fetchProfilePicture() {
      const request = await fetch("/api/get-profile-picture", {
        method: "GET",
        credentials: "include",
      });
      if (
        request.status === 500 ||
        request.status === 401 ||
        request.status === 400 ||
        request.status === 404
      ) {
        setProfileImage("");
      } else {
        const result = await request.json();
        setProfileImage(result.message);
      }
    }
    fetchProfilePicture();
  }, []);

  // Display loading indicator while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
        <Sidebar username={username} email={email} profilePic={profileImage} />
        <div className="bg-white rounded-lg pb-8 shadow h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 ml-5 mt-5">
            <h1 className="text-4xl font-bold text-gray-900">
              <span className="text-gray-900">Profile </span>
              <span className="text-purple-600">Page</span>
            </h1>
          </div>
          <ToastContainer />

          {/* User Info Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Profile Picture */}
              <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-purple-500 shadow-md flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-2xl">
                    {username[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              {/* Upload Button */}
              <label
                htmlFor="upload-image"
                className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full shadow hover:bg-purple-600 transition cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m7-7H5"
                  />
                </svg>
              </label>
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadProfilePicture}
              />
            </div>

            <h2 className="text-2xl font-semibold mt-4">{username}</h2>
            <p className="text-gray-600">{email}</p>
          </div>

          {/* Profile Details Section */}
          <div className="mt-8 px-10 text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {email}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {username}
                </p>
              </div>
            </div>

            {/* Resume Section */}
            <div className="mt-10 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-500">Resume</h3>
              <div className="w-72 h-80 bg-gray-100 border-4 border-purple-500 shadow-lg flex items-center justify-center mt-4 rounded-lg overflow-hidden">
                {resume ? (
                  <a
                    href={resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline text-center px-4"
                  >
                    View Resume
                  </a>
                ) : (
                  <span className="text-gray-500 text-lg text-center">
                    No Resume Uploaded
                  </span>
                )}
              </div>
              <label
                htmlFor="upload-resume"
                className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-lg shadow hover:bg-purple-600 transition cursor-pointer"
              >
                Upload Resume
              </label>
              <input
                id="upload-resume"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={uploadResume}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
