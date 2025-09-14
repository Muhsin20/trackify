"use client";

import React from "react";

type Props = {
  resumeUrl: string;                      // current signed URL or blob URL ("" if none)
  uploading: boolean;                     // spinner state
  onUpload: (file: File) => Promise<void>; // parent-provided upload/replace action
};

export default function ResumeCard({ resumeUrl, uploading, onUpload }: Props) {
  // --- helpers (self-contained) ---
  const fileNameFromUrl = (url: string) => {
    try {
      const u = new URL(url);
      const qpName = u.searchParams.get("filename");
      if (qpName) return decodeURIComponent(qpName);
      const last = u.pathname.split("/").filter(Boolean).pop();
      return last ? decodeURIComponent(last) : "resume.pdf";
    } catch {
      return "resume.pdf";
    }
  };

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) await onUpload(f);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) await onUpload(f); // treat drop as upload or replace
  };

  const hasResume = !!resumeUrl;

  return (
    <div className="mt-8">
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Resume</h3>
            <p className="text-sm text-slate-600 mt-1">
              {hasResume
                ? "You have a resume on file. You can open or replace it."
                : "Upload a PDF. You can view it inline or open it in a new tab."}
            </p>
          </div>

          {/* Toolbar */}
          
          <div className="flex items-center gap-2">
            {hasResume && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                title="Open in new tab"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h6m0 0v6m0-6L10 16" />
                </svg>
                Open
              </a>
            )}

            

            {/* Upload button:
                - Visible and enabled ONLY when no resume exists
                - When a resume exists, it's visually greyed & disabled (pointer-events-none)
             */}
            <label
              htmlFor="resume-file-input"
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white shadow transition ${
                uploading
                  ? "bg-purple-400"
                  : hasResume
                  ? "bg-slate-300 pointer-events-none cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
              }`}
              aria-disabled={hasResume}
              title={hasResume ? "Upload disabled (use Replace)" : "Upload PDF"}
            >
              {uploading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Uploading…
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 12l-3-3m3 3l3-3M6 20h12" />
                  </svg>
                  Upload PDF
                </>
              )}
            </label>
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleInput}
              disabled={uploading || hasResume} // hard-disable when a resume exists
            />

            {/* Replace button: ONLY shown/enabled when a resume exists */}
            {hasResume && (
              <label
                htmlFor="resume-replace-input"
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white shadow transition ${
                  uploading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                }`}
                title="Replace existing resume"
              >
                {uploading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Replacing…
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h8m-8 5h16" />
                    </svg>
                    Replace
                  </>
                )}
              </label>
            )}
            <input
              id="resume-replace-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleInput}
              disabled={uploading || !hasResume} // only active when a resume exists
            />
          </div>
        </div>

        {/* Content area (dropzone works for both upload & replace) */}
        <div
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`mt-6 rounded-xl border-2 border-dashed ${
            hasResume ? "border-slate-200" : "border-slate-300"
          } bg-slate-50/60 p-4`}
        >
          {!hasResume ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="h-12 w-12 rounded-xl bg-white shadow ring-1 ring-slate-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 12l-3-3m3 3l3-3M6 20h12" />
                </svg>
              </div>
              <p className="mt-3 text-slate-700 font-medium">Drag & drop your resume here</p>
              <p className="text-sm text-slate-500">or click “Upload PDF”</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
              {/* Inline PDF preview (with graceful fallback) */}
              <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white">
                <object data={resumeUrl} type="application/pdf" className="w-full h-[480px]">
                  <div className="p-6 text-center">
                    <p className="text-slate-700">
                      Preview unavailable.{" "}
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">
                        Open your resume in a new tab
                      </a>
                      .
                    </p>
                  </div>
                </object>
              </div>

              {/* Meta / quick actions */}
              <div className="rounded-xl bg-white ring-1 ring-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a2 2 0 012 2v3H5V5a2 2 0 012-2zm12 7H5v9a2 2 0 002 2h10a2 2 0 002-2v-9z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-slate-500">Current file</div>
                    <div className="truncate font-medium text-slate-900">{fileNameFromUrl(resumeUrl)}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href={resumeUrl}
                    download
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Download
                  </a>
                  {/* Replace is in toolbar; keep this for convenience as well */}
                  
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Tip: keep it under 2&nbsp;MB for faster uploads.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
