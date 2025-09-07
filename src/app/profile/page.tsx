"use client";

import Sidebar from "../components/Sidebar";
import LoadingOverlay from "../components/LoadingOverlay";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Profile() {
  const router = useRouter();

  // Core state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [id, setID] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [resume, setResume] = useState("");

  // UX states
  const [loading, setLoading] = useState(true);          // full page load
  const [uploadingPic, setUploadingPic] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Fetch user
  useEffect(() => {
    async function authUser() {
      try {
        const request = await fetch("/api/auth/validate", {
          method: "GET",
          credentials: "include",
        });

        if (!request.ok) {
          router.push("/");
          return;
        }

        const result = await request.json();
        setEmail(result.user.email);
        setUsername(result.user.username);
        setID(result.user.id);

        // Resume + profile pic in parallel
        await Promise.all([fetchResume(result.user.id), fetchProfilePicture()]);
      } catch (e) {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    authUser();
  }, [router]);

  // Resume
  const fetchResume = async (_userID: string) => {
    try {
      const request = await fetch(`/api/get-resume`, {
        method: "GET",
        credentials: "include",
      });
      if (request.ok) {
        const { signedUrl } = await request.json();
        setResume(signedUrl ?? "");
      } else {
        setResume("");
      }
    } catch {
      setResume("");
      toast.error("Failed to fetch resume.");
    }
  };

  // Profile picture
  const fetchProfilePicture = async () => {
    try {
      const request = await fetch("/api/get-profile-picture", {
        method: "GET",
        credentials: "include",
      });
      if (!request.ok) {
        setProfileImage("");
        return;
      }
      const result = await request.json();
      setProfileImage(result.message ?? "");
    } catch {
      setProfileImage("");
    }
  };

  // Upload profile pic (with inline spinner)
  const uploadProfilePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      alert("No file selected!");
      return;
    }
    const file = files[0];
    const formData = new FormData();
    formData.append("userID", id);
    formData.append("file", file);

    setUploadingPic(true);
    try {
      const request = await fetch("/api/add-profile-picture", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!request.ok) throw new Error();
      // optimistic preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      toast.success("Profile Picture Added!", { position: "top-center", autoClose: 5000 });
    } catch {
      toast.error("Failed to upload profile picture!", { position: "top-center", autoClose: 5000 });
    } finally {
      setUploadingPic(false);
    }
  };

  // Upload resume (with inline spinner)
  const uploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    const file = files[0];

    const formData = new FormData();
    formData.append("userID", id);
    formData.append("file", file);

    setUploadingResume(true);
    try {
      const request = await fetch("/api/add-resume", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!request.ok) throw new Error();
      toast.success("Resume Added!", { position: "top-center", autoClose: 5000 });

      // show a temp URL; your API might also return a signed URL you can set instead
      const tempUrl = URL.createObjectURL(file);
      setResume(tempUrl);
    } catch {
      toast.error("Failed to upload resume!", { position: "top-center", autoClose: 5000 });
    } finally {
      setUploadingResume(false);
    }
  };

  // Full-page loading overlay
  if (loading) {
    return (
      <>
        <LoadingOverlay show={true} />
        {/* Optional: a simple Tailwind fallback in case JS is slow */}
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-medium text-white">Loading…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingOverlay show={false} />
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

          {/* User Info */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-purple-500 shadow-md flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 text-2xl">{username[0]?.toUpperCase() || "U"}</span>
                )}
              </div>

              {/* Upload Button */}
              <label
                htmlFor="upload-image"
                className={`absolute bottom-0 right-0 text-white p-2 rounded-full shadow transition cursor-pointer
                ${uploadingPic ? "bg-purple-400" : "bg-purple-500 hover:bg-purple-600"}`}
              >
                {uploadingPic ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                  </svg>
                )}
              </label>
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadProfilePicture}
                disabled={uploadingPic}
              />
            </div>

            <h2 className="text-2xl font-semibold mt-4">{username}</h2>
            <p className="text-gray-600">{email}</p>
          </div>

          {/* Details */}
          <div className="mt-8 px-10 text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-lg font-semibold text-gray-800">{email}</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="mt-1 text-lg font-semibold text-gray-800">{username}</p>
              </div>
            </div>

            {/* Resume */}
            <div className="mt-10 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-500">Resume</h3>
              <div className="w-72 h-80 bg-gray-100 border-4 border-purple-500 shadow-lg flex items-center justify-center mt-4 rounded-lg overflow-hidden">
                {resume ? (
                  <a href={resume} target="_blank" rel="noopener noreferrer"
                     className="text-purple-600 underline text-center px-4">
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
                className={`mt-4 text-white py-2 px-4 rounded-lg shadow transition cursor-pointer
                ${uploadingResume ? "bg-purple-400" : "bg-purple-500 hover:bg-purple-600"}`}
              >
                {uploadingResume ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent align-middle" />
                ) : (
                  "Upload Resume"
                )}
              </label>
              <input
                id="upload-resume"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={uploadResume}
                disabled={uploadingResume}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
