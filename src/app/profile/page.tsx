"use client";

import Sidebar from "../components/Sidebar";
import LoadingOverlay from "../components/LoadingOverlay";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ResumeCard from "../components/ResumeCard"; 




export default function Profile() {
  const router = useRouter();

  // Core state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [id, setID] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [resume, setResume] = useState<string>("");
  const [showSecurity, setShowSecurity] = useState(false);


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
await Promise.all([ fetchResume(result.user.id), fetchProfilePicture() ]);
      } catch (e) {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    authUser();
  }, [router]);
  




const uploadResumeFile = async (file: File) => {
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

    // show optimistic preview first
    const tempUrl = URL.createObjectURL(file);
    setResume(tempUrl);
    toast.success("Resume Added!", { position: "top-center", autoClose: 5000 });

    // then swap in a persisted URL from your storage
    await fetchResume(id);
  } catch {
    toast.error("Failed to upload resume!", { position: "top-center", autoClose: 5000 });
  } finally {
    setUploadingResume(false);
  }
};



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
      <main className="min-h-screen grid gap-4 p-4 grid-cols-[220px,_1fr] bg-gradient-to-b from-slate-50 to-white">
        <Sidebar username={username} email={email} profilePic={profileImage} />
        <div className="bg-white rounded-lg pb-8 shadow h-full">

          {/* HEADER -  Profile Overview Card
// Displays the heading and description section for managing profile details and account settings.
// Uses responsive flex layout (stacked on mobile, side-by-side on larger screens) 
// with padding, rounded corners, shadow, and subtle ring styling. */}
<div className="mb-6 px-5 mt-5">
  <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Profile <span className="text-purple-600">Overview</span>
        </h1>
        <p className="mt-1 text-slate-600">
          Manage your profile details and account settings.
        </p>
      </div>

      {/* // Profile Actions
// Provides UI-only buttons for profile-related actions (Edit Profile, Security).
// Each button triggers a toast notification instead of performing actual logic.
// Styled with Tailwind for spacing, rounded corners, hover states, and transitions.*/}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => toast.info("Edit profile coming soon")}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-white text-sm font-medium hover:bg-slate-800 transition"
        >
          Edit Profile
        </button>
        <button
  type="button"
  onClick={() => setShowSecurity(true)}
  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
>
  Security
</button>
      </div>
    </div>
  </div>
</div>

          <ToastContainer />

          {/* User Info Card
// Displays the user’s avatar (profile image or fallback initial) inside a styled circular frame.
// Centered layout with shadow, ring highlight, and text fallback when no profile image is available.*/}
          <div className="px-5">
  <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6 flex flex-col items-center text-center">
    <div className="relative">
      <div className="w-32 h-32 rounded-full bg-gray-100 ring-4 ring-purple-500/20 shadow-md overflow-hidden">
              {/* Avatar */}
              {profileImage ? (
          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-semibold text-slate-500">
              {username[0]?.toUpperCase() || "U"}
            </span>
          </div>
        )}
      </div>

              {/* Upload Button */}
      <label
        htmlFor="upload-image"
        className={`absolute -bottom-2 -right-2 rounded-full p-2 shadow-lg text-white cursor-pointer transition
        ${uploadingPic ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"}`}
        title="Upload profile picture"
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

    <h2 className="text-xl font-semibold text-slate-900 mt-4">{username}</h2>
    <p className="text-slate-600">{email}</p>
  </div>
</div>

          {/* Details */}
          <div className="mt-8 px-5">
  <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
    <h3 className="text-lg font-semibold text-slate-900">Account Details</h3>
    <p className="text-sm text-slate-600 mt-1">
      Your core identity information.
    </p>

    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Email */}
      <div className="group rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition">
        <div className="text-xs uppercase tracking-wide text-slate-500">Email</div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="truncate text-slate-900 font-medium">{email}</div>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(email).then(
              () => toast.success("Email copied", { autoClose: 1200 }),
              () => toast.error("Copy failed")
            )}
            className="opacity-70 group-hover:opacity-100 p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label="Copy email"
            title="Copy"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth={2}
                className="h-5 w-5 text-slate-600">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Username */}
      <div className="group rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition">
        <div className="text-xs uppercase tracking-wide text-slate-500">Username</div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="truncate text-slate-900 font-medium">{username}</div>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(username).then(
              () => toast.success("Username copied", { autoClose: 1200 }),
              () => toast.error("Copy failed")
            )}
            className="opacity-70 group-hover:opacity-100 p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label="Copy username"
            title="Copy"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth={2}
                 className="h-5 w-5 text-slate-600">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* User ID (spans full width on md) */}
      <div className="group rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition md:col-span-2">
        <div className="text-xs uppercase tracking-wide text-slate-500">User ID</div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="truncate text-slate-900 font-medium">{id}</div>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(id).then(
              () => toast.success("User ID copied", { autoClose: 1200 }),
              () => toast.error("Copy failed")
            )}
            className="opacity-70 group-hover:opacity-100 p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label="Copy user id"
            title="Copy"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth={2}
                 className="h-5 w-5 text-slate-600">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
    </div>
  </div>
</div>

 {/* Resume */}

<div className="mt-8 px-5">
  <ResumeCard
    resumeUrl={resume}
    uploading={uploadingResume}
    onUpload={uploadResumeFile}
  />
</div>
            </div>
          </div>
          {/* Render the Security modal */}
        <ChangePasswordModal
          open={showSecurity}
          onClose={() => setShowSecurity(false)}
          userEmail={email}   // <-- pass it down

        />

      </main>
    </>
  );
}
