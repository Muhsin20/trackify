"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { ToastContainer, toast } from "react-toastify";

type RemotiveJob = {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string | null;
  category?: string;
  job_type?: string;
  candidate_required_location?: string;
  salary?: string | null;
  publication_date?: string; // ISO
  tags?: string[];
  description?: string; // HTML
};

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export default function RemoteJobsPageWrapper() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <RemoteJobsPage />
    </Suspense>
  );
}

function RemoteJobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auth/profile (unchanged)
  const [userID, setUserID] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    (async () => {
      const request = await fetch("/api/auth/validate", { method: "GET", credentials: "include" });
      if ([500, 401, 400].includes(request.status)) { router.push("/"); return; }
      const result = await request.json();
      setUserID(result.user.id);
      setEmail(result.user.email);
      setUsername(result.user.username);
    })();
  }, [router]);

  useEffect(() => {
    (async () => {
      const request = await fetch("/api/get-profile-picture", { method: "GET", credentials: "include" });
      if ([500, 401, 400, 404].includes(request.status)) setProfileImage("");
      else setProfileImage((await request.json()).message);
    })();
  }, []);

  // ------- URL <-> state sync -------
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlQuery = searchParams.get("q") || "";

  const [page, setPage] = useState<number>(urlPage);
  const [query, setQuery] = useState<string>(urlQuery);
  const [input, setInput] = useState<string>(urlQuery);

  // whenever the URL changes, resync internal state
  useEffect(() => {
    setPage(urlPage);
    setQuery(urlQuery);
    setInput(urlQuery);
  }, [urlPage, urlQuery]);

  // ------- Fetch from Remotive once per query, large limit; then client-side paginate -------
  const API_LIMIT = 200;        // how many we pull per search
  const UI_PAGE_SIZE = 12;      // how many we show per screen

  const [allJobs, setAllJobs] = useState<RemotiveJob[]>([]);
  const [loading, setLoading] = useState(false);

  const remotiveUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    params.set("limit", String(API_LIMIT)); // no 'page' support in API
    return `https://remotive.com/api/remote-jobs?${params.toString()}`;
  }, [query]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(remotiveUrl, { cache: "no-store" });
        const data = await res.json();
        setAllJobs(data.jobs || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load jobs from Remotive");
      } finally {
        setLoading(false);
      }
    })();
  }, [remotiveUrl]);

  // client-side pagination
  const totalPages = Math.max(1, Math.ceil(allJobs.length / UI_PAGE_SIZE));
  const start = (page - 1) * UI_PAGE_SIZE;
  const pagedJobs = allJobs.slice(start, start + UI_PAGE_SIZE);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const updateUrl = (p: number, q: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(p));
    router.replace(`/remote-jobs?${params.toString()}`);
  };

  const goNext = () => { if (canGoNext) updateUrl(page + 1, query); };
  const goPrev = () => { if (canGoPrev) updateUrl(page - 1, query); };
  const doSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(1, input.trim());
  };

  // Add to tracker
  async function handleAdd(job: RemotiveJob) {
    if (!userID) { toast.error("Please sign in first."); return; }
    try {
      const preview = stripHtml(job.description)?.slice(0, 400) || "See job link for full description.";
      const resp = await fetch("/api/add-application", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userID,
          title: job.title,
          company: job.company_name,
          url: job.url,
          description: preview,
          status: "Saved",
        }),
      });
      const data = await resp.json();
      if (resp.ok && data.statusCode === 200) toast.success("Saved to your tracker!");
      else toast.error(data.message || "Could not save job.");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while saving the job.");
    }
  }

  return (
    <div>
      <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
        <Sidebar username={username} email={email} profilePic={profileImage} />
        <div className="bg-gray-50 rounded-lg pb-4 shadow h-full">
          <TopBar username={username} />

          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  Remote Job Listings{" "}
                  <a
                    href="https://remotive.com/remote-jobs/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm align-middle font-medium text-purple-700 hover:underline"
                    aria-label="Powered by Remotive"
                  >
                    (Powered by Remotive)
                  </a>
                </h1>
                <p className="text-gray-600 mt-1">
                  Discover remote roles and save them straight into your tracker.
                </p>
              </div>

              {/* Search */}
              <form onSubmit={doSearch} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Search title, company, tag…"
                  className="w-[260px] md:w-[340px] rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-purple-700 px-4 py-2 font-semibold text-white hover:bg-purple-500 transition"
                >
                  Search
                </button>
              </form>
            </div>

            <hr className="border-gray-200" />
            <ToastContainer />

            {/* Results */}
            <div className="mt-8">
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: UI_PAGE_SIZE }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
                      <div className="h-6 w-2/3 bg-gray-200 rounded mb-3" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
                      <div className="h-24 w-full bg-gray-100 rounded mb-4" />
                      <div className="h-9 w-full bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : pagedJobs.length === 0 ? (
                <p className="text-gray-600 text-lg text-center mt-8">No results. Try a different search.</p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pagedJobs.map((job) => (
                    <article key={job.id} className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                      {/* Top row: logo + company */}
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                          {job.company_logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={job.company_logo} alt={job.company_name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">No Logo</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 truncate">{job.company_name}</h3>
                          <p className="text-xs text-gray-500">
                            {job.job_type || "Remote"} • {job.candidate_required_location || "Anywhere"}
                          </p>
                        </div>
                      </div>

                      {/* Title */}
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="mt-4 block text-lg font-bold text-purple-700 leading-snug hover:underline">
                        {job.title}
                      </a>

                      {/* Meta */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        {job.category && <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-medium">{job.category}</span>}
                        {job.salary && <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 font-medium">{job.salary}</span>}
                        {job.publication_date && <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-medium">{new Date(job.publication_date).toLocaleDateString()}</span>}
                      </div>

                      {/* Preview */}
                      <p className="mt-3 line-clamp-3 text-sm text-gray-700">{stripHtml(job.description).slice(0, 220)}</p>

                      {/* Actions */}
                      <div className="mt-5 flex gap-2">
                        <button onClick={() => handleAdd(job)} className="flex-1 rounded-xl bg-purple-600 py-2.5 text-white font-semibold hover:bg-indigo-500 transition">
                          Add to Tracker
                        </button>
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50 transition">
                          View
                        </a>
                      </div>

                      {/* Corner badge on hover */}
                      <div className="pointer-events-none absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition">
                        <span className="rounded-full bg-purple-100 text-purple-700 text-[10px] px-2 py-1 font-semibold">Remotive</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button onClick={goPrev} disabled={!canGoPrev} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition">
                Previous
              </button>
              <span className="text-gray-700">Page {page} of {totalPages}</span>
              <button onClick={goNext} disabled={!canGoNext} className="px-4 py-2 rounded-lg bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
