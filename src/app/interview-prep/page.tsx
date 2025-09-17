"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

type StarGuide = { question: string; how_to_answer: string; example_bullets: string[] };
type PrepPack = {
  role_specific_questions?: string[];
  behavioral_questions?: string[];
  technical_topics?: string[];
  star_guides?: StarGuide[];
  follow_up_questions?: string[];
};

// Bouncing dots loader (Tailwind)
function LoadingDots() {
  return (
    <span className="inline-flex items-end gap-1 h-4 align-middle" aria-label="Loading">
      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

export default function InterviewPrepPage() {
  const [role, setRole] = useState("Software Engineer");
  const [seniority, setSeniority] = useState("Entry-Level");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [prep, setPrep] = useState<PrepPack | null>(null);

  const [userID, setUserID] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [reminderAt, setReminderAt] = useState<string>("");

  useEffect(() => {
    (async () => {
      const request = await fetch("/api/auth/validate", { credentials: "include" });
      if (!request.ok) return;
      const result = await request.json();
      setUserID(result.user.id);
      setEmail(result.user.email);
      setUsername(result.user.username);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const request = await fetch("/api/get-profile-picture", {
        method: "GET",
        credentials: "include",
      });
      if ([500, 401, 400, 404].includes(request.status)) {
        setProfileImage("");
      } else {
        const result = await request.json();
        setProfileImage(result.message);
      }
    })();
  }, []);

  async function generatePrep(e: React.FormEvent) {
    e.preventDefault();
    if (!jobDescription.trim() && !company.trim()) {
      toast.error("Paste a job description or at least fill company/role.");
      return;
    }
    setLoading(true);
    setPrep(null);
    try {
      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, seniority, jobDescription, company }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to generate.");
      setPrep(data.prep);
      toast.success("Interview Prep is ready!");
    } catch (e: any) {
      toast.error(e.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  async function savePrep() {
    if (!userID) {
      toast.error("Please sign in to save.");
      return;
    }
    if (!prep) return;
    try {
      const res = await fetch("/api/interview/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userID, role, seniority, company, prep }),
      });
      const data = await res.json();
      if (!res.ok || data.statusCode !== 200) throw new Error(data.message || "Save failed");
      toast.success("Saved to your prep library!");
    } catch (e: any) {
      toast.error(e.message || "Could not save");
    }
  }

  function downloadICS(dateISO: string) {
    const dt = new Date(dateISO);
    if (isNaN(dt.getTime())) {
      toast.error("Pick a valid date/time");
      return;
    }
    const pad = (n: number) => String(n).padStart(2, "0");
    const dtstamp = `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(
      dt.getUTCDate()
    )}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Trackify//Interview Reminder//EN",
      "BEGIN:VEVENT",
      `UID:${Math.random().toString(36).slice(2) + Date.now()}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstamp}`,
      `SUMMARY:Interview Prep: ${role}${company ? " @ " + company : ""}`,
      `DESCRIPTION:Open Trackify prep and review your notes.`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview-prep.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  // defensive slicer
  const cut = <T,>(arr: T[] | undefined, n: number) =>
    Array.isArray(arr) ? arr.slice(0, n) : [];

  const totalItems =
    (prep?.role_specific_questions?.length ?? 0) +
    (prep?.behavioral_questions?.length ?? 0) +
    (prep?.technical_topics?.length ?? 0) +
    (prep?.follow_up_questions?.length ?? 0) +
    (prep?.star_guides?.length ?? 0);

  return (
    <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
      <Sidebar username={username} email={email} profilePic={profileImage} />
      <div className="bg-gray-50 rounded-lg pb-4 shadow h-full">
        <TopBar username={username} />
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 pt-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Interview Prep Hub</h1>
            <p className="text-gray-600 mt-2">
              Paste a job description or summary, choose your role/seniority, and get a personalized prep pack.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={generatePrep} className="grid md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Seniority</label>
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
              >
                <option>Entry-Level</option>
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Staff</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Company (optional)</label>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Job Description / Posting</label>
              <textarea
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 min-h-[160px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or key responsibilities/requirements…"
              />
            </div>
            <div className="md:col-span-3 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-purple-700 px-5 py-2.5 font-semibold text-white hover:bg-purple-600 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    Generating <LoadingDots />
                  </span>
                ) : (
                  "Generate Prep"
                )}
              </button>

              {prep && (
                <>
                  {/* <button
                    type="button"
                    onClick={savePrep}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
                  >
                    Save Prep
                  </button> */}

                  <div className="flex items-center gap-2">
                    <input
                      type="datetime-local"
                      value={reminderAt}
                      onChange={(e) => setReminderAt(e.target.value)}
                      className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Pick reminder date and time"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        reminderAt ? downloadICS(reminderAt) : toast.error("Pick a date/time first")
                      }
                      className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-purple-700 hover:bg-indigo-100"
                    >
                      Add Prep Reminder (.ics)
                    </button>
                  </div>
                </>
              )}

              <Link href="/remote-jobs" className="ml-auto text-sm text-gray-600 hover:underline">
                Back to listings
              </Link>
            </div>
          </form>

          <ToastContainer />

          {/* Results */}
          {loading && !prep && (
            <p className="mt-8 text-gray-600">Crafting a response…</p>
          )}

          {prep && (
            <div className="mt-10 space-y-8">
              {totalItems === 0 ? (
                <p className="text-gray-600">
                  Couldn’t generate details from this JD. Try adding more specifics or regenerate.
                </p>
              ) : (
                <>
                  <Section title="Role-Specific Questions" items={cut(prep.role_specific_questions, 4)} />

                  <Section title="Behavioral Questions" items={cut(prep.behavioral_questions, 3)} />

                  {/* Technical as gray pill tags */}
                  <TagSection title="Technical Topics to Review" items={cut(prep.technical_topics, 2)} />

                  <StarGuides guides={cut(prep.star_guides, 2)} />

                  <Section title="Follow-Up Questions to Ask" items={cut(prep.follow_up_questions, 3)} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Replace your Section with this (adds real bullets + spacing)
function Section({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-900">
        {items.map((x, i) => (
          <li key={i} className="leading-relaxed">{x}</li>
        ))}
      </ul>
    </div>
  );
}

// Darker, higher-contrast tags for Tech Topics
function TagSection({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((x, i) => (
          <li key={i}>
            <span className="inline-flex items-center rounded-full bg-purple-700 text-white px-3 py-1 text-sm font-medium ring-1 ring-gray-700">
              {x}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Optional: nudge STAR bullets to be bullets too (you already do this, just ensure list-disc)
function StarGuides({ guides }: { guides?: { question: string; how_to_answer: string; example_bullets: string[] }[] }) {
  if (!guides || guides.length === 0) return null;
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">Behavioral (STAR) Guides</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {guides.map((g, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4 bg-white">
            <p className="font-semibold text-gray-900">Q: {g.question}</p>
            <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{g.how_to_answer}</p>
            {g.example_bullets?.length ? (
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-800 space-y-1">
                {g.example_bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

