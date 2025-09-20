// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/TopBar";
// import { ToastContainer, toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";

// // ---- types ----
// type Interview = {
//   application_id: string;
//   title: string;
//   company: string;
//   interview_at: string; // ISO UTC
//   url?: string;

//   // flags from API
//   isPastLocal: boolean;
//   isTodayLocal: boolean;
//   hasPassedTodayLocal: boolean;
//   isFutureLocal: boolean;
// };

// type DayEvents = { dateKey: string; items: Interview[] };

// // ---- utils ----
// function startOfMonth(d: Date) {
//   return new Date(d.getFullYear(), d.getMonth(), 1);
// }
// function endOfMonth(d: Date) {
//   return new Date(d.getFullYear(), d.getMonth() + 1, 0);
// }
// function toYMD(d: Date) {
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// }
// function sameDay(a: Date, b: Date) {
//   return (
//     a.getFullYear() === b.getFullYear() &&
//     a.getMonth() === b.getMonth() &&
//     a.getDate() === b.getDate()
//   );
// }

// // relative time label (e.g., "in 3h", "2d ago")
// const relTime = (d: Date) => {
//   const now = Date.now();
//   const diff = d.getTime() - now;
//   const abs = Math.abs(diff);
//   const mins = Math.round(abs / 60000);
//   if (mins < 60) return diff >= 0 ? `in ${mins}m` : `${mins}m ago`;
//   const hrs = Math.round(mins / 60);
//   if (hrs < 24) return diff >= 0 ? `in ${hrs}h` : `${hrs}h ago`;
//   const days = Math.round(hrs / 24);
//   return diff >= 0 ? `in ${days}d` : `${days}d ago`;
// };

// // tiny badge
// const Chip = ({
//   className = "",
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => (
//   <span
//     className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${className}`}
//   >
//     {children}
//   </span>
// );

// export default function CalendarPage() {
//   // ---- auth + sidebar info ----
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [profileImage, setProfileImage] = useState("");

//   useEffect(() => {
//     (async () => {
//       const res = await fetch("/api/auth/validate", { credentials: "include" });
//       if (!res.ok) {
//         window.location.href = "/";
//         return;
//       }
//       const data = await res.json();
//       setEmail(data.user.email);
//       setUsername(data.user.username);
//     })();
//     (async () => {
//       const r = await fetch("/api/get-profile-picture", { credentials: "include" });
//       if (r.ok) {
//         const j = await r.json();
//         setProfileImage(j.message);
//       }
//     })();
//   }, []);

//   // ---- fetch interviews ----
//   const [interviews, setInterviews] = useState<Interview[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchInterviews = async () => {
//     setLoading(true);
//     try {
//       const offsetMin = new Date().getTimezoneOffset(); // client's tz offset in minutes
//       const res = await fetch(`/api/get-interviews?offsetMin=${offsetMin}`, {
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.error || "Failed to load interviews");
//       setInterviews(data.interviews || []);
//     } catch (e: any) {
//       toast.error(e.message || "Failed to load interviews");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchInterviews();
//   }, []);

//   // ---- calendar state ----
//   const [cursor, setCursor] = useState<Date>(() => {
//     const now = new Date();
//     return new Date(now.getFullYear(), now.getMonth(), 1);
//   });

//   const today = new Date();
//   const monthStart = startOfMonth(cursor);
//   const monthEnd = endOfMonth(cursor);

//   // Map by local day for the grid
//   const byDay = useMemo(() => {
//     const map = new Map<string, Interview[]>();
//     for (const it of interviews) {
//       const d = new Date(it.interview_at);
//       const key = toYMD(d);
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push(it);
//     }
//     return map;
//   }, [interviews]);

//   // Build visible days (Sun-Sat grid) spanning previous/next month paddings
//   const visibleDays = useMemo(() => {
//     const firstWeekday = new Date(monthStart).getDay(); // 0=Sun..6=Sat
//     const daysInMonth = monthEnd.getDate();
//     const days: Date[] = [];

//     // prepend previous month days
//     for (let i = 0; i < firstWeekday; i++) {
//       const d = new Date(monthStart);
//       d.setDate(d.getDate() - (firstWeekday - i));
//       days.push(d);
//     }
//     // current month days
//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
//     }
//     // append next month days to complete weeks (42 cells = 6 weeks)
//     while (days.length % 7 !== 0) {
//       const next = new Date(days[days.length - 1]);
//       next.setDate(next.getDate() + 1);
//       days.push(next);
//     }
//     // ensure 6 weeks for consistent height
//     while (days.length < 42) {
//       const next = new Date(days[days.length - 1]);
//       next.setDate(next.getDate() + 1);
//       days.push(next);
//     }
//     return days;
//   }, [cursor, monthStart, monthEnd]);

//   // Selected day to show details
//   const [selectedDay, setSelectedDay] = useState<Date | null>(null);
//   const selectedKey = selectedDay ? toYMD(selectedDay) : "";
//   const selectedEvents = selectedKey ? byDay.get(selectedKey) || [] : [];

//   // ---- filtering/search for the list panel ----
//   const [tab, setTab] = useState<"all" | "today" | "upcoming" | "past">("all");
//   const [q, setQ] = useState("");

//   const buckets = useMemo(() => {
//     const todayB = interviews.filter((i) => i.isTodayLocal);
//     const upcomingB = interviews.filter((i) => i.isFutureLocal);
//     const pastB = interviews.filter((i) => i.isPastLocal || i.hasPassedTodayLocal);
//     const allB = interviews;
//     const filterQ = (arr: Interview[]) =>
//       arr.filter((i) =>
//         [i.title, i.company].join(" ").toLowerCase().includes(q.trim().toLowerCase())
//       );
//     return {
//       all: filterQ(allB),
//       today: filterQ(todayB),
//       upcoming: filterQ(upcomingB),
//       past: filterQ(pastB),
//     };
//   }, [interviews, q]);

//   return (
//     <div>
//       <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
//         <Sidebar username={username} email={email} profilePic={profileImage} />
//         <div className="bg-gray-50 rounded-lg pb-4 shadow h-full">
//           <TopBar username={username} />

//           <div className="p-6">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h1 className="text-3xl font-bold tracking-tight">
//                   <span className="text-gray-900">Interview </span>
//                   <span className="text-purple-600">Calendar</span>
//                 </h1>
//                 <p className="text-sm text-stone-500 mt-1">
//                   Stay on top of your interviews with day badges and smart alerts.
//                 </p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() =>
//                     setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
//                   }
//                   className="px-3 py-1 rounded-lg bg-white hover:bg-stone-50 border shadow-sm"
//                   aria-label="Previous month"
//                 >
//                   ◀
//                 </button>

//                 <div className="px-3 py-1 rounded-lg bg-white border shadow-sm font-medium">
//                   {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
//                 </div>

//                 <button
//                   onClick={() =>
//                     setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
//                   }
//                   className="px-3 py-1 rounded-lg bg-white hover:bg-stone-50 border shadow-sm"
//                   aria-label="Next month"
//                 >
//                   ▶
//                 </button>

//                 <button
//                   onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
//                   className="ml-2 px-3 py-1 rounded-lg bg-purple-700 text-white hover:bg-purple-600 shadow-sm"
//                 >
//                   Today
//                 </button>
//               </div>
//             </div>

//             <ToastContainer />

//             {/* Calendar grid */}
//             <div className="grid grid-cols-7 gap-2">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                 <div key={d} className="text-center text-xs font-semibold text-stone-500">
//                   {d}
//                 </div>
//               ))}

//               {visibleDays.map((d, idx) => {
//                 const inMonth = d.getMonth() === cursor.getMonth();
//                 const isToday = sameDay(d, today);
//                 const key = toYMD(d);
//                 const dayEvents = byDay.get(key) || [];
//                 const isSelected = selectedDay ? sameDay(d, selectedDay) : false;

//                 return (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedDay(new Date(d))}
//                     className={`relative min-h-[90px] rounded-lg border p-2 text-left transition
//                       ${inMonth ? "bg-white" : "bg-stone-100"}
//                       ${isSelected ? "ring-2 ring-purple-600" : ""}
//                       ${isToday ? "border-purple-500" : "border-stone-200"}
//                       hover:shadow-sm`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span
//                         className={`text-sm ${
//                           inMonth ? "text-stone-800" : "text-stone-400"
//                         }`}
//                       >
//                         {d.getDate()}
//                       </span>
//                       {isToday && (
//                         <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
//                           today
//                         </span>
//                       )}
//                     </div>

//                     {/* colored chips */}
//                     <div className="mt-2 space-y-1">
//                       {dayEvents.slice(0, 3).map((ev) => {
//                         const dt = new Date(ev.interview_at);
//                         const chipStyle =
//                           ev.isPastLocal || ev.hasPassedTodayLocal
//                             ? "bg-red-50 text-red-700 border border-red-200"
//                             : ev.isTodayLocal
//                             ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
//                             : "bg-emerald-50 text-emerald-700 border border-emerald-200";
//                         return (
//                           <div
//                             key={ev.application_id}
//                             className={`truncate text-xs px-2 py-1 rounded ${chipStyle}`}
//                             title={`${ev.title} @ ${dt.toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}`}
//                           >
//                             {ev.company} •{" "}
//                             {dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                           </div>
//                         );
//                       })}
//                       {dayEvents.length > 3 && (
//                         <div className="text-[10px] text-stone-500">
//                           +{dayEvents.length - 3} more
//                         </div>
//                       )}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Legend */}
//             <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-600">
//               <span className="inline-flex items-center gap-1">
//                 <span className="inline-block h-2 w-2 rounded bg-emerald-400"></span> Upcoming
//               </span>
//               <span className="inline-flex items-center gap-1">
//                 <span className="inline-block h-2 w-2 rounded bg-yellow-400"></span> Today
//               </span>
//               <span className="inline-flex items-center gap-1">
//                 <span className="inline-block h-2 w-2 rounded bg-red-400"></span> Passed
//               </span>
//             </div>

//             {/* Details + List */}
//             <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Left: Selected day details */}
//               <div className="bg-white border rounded-xl p-4 shadow-sm">
//                 <h2 className="text-lg font-semibold mb-2">
//                   {selectedDay ? selectedDay.toDateString() : "Select a date"}
//                 </h2>
//                 {selectedDay && selectedEvents.length === 0 && (
//                   <p className="text-sm text-stone-500">No interviews on this day.</p>
//                 )}
//                 <div className="space-y-3">
//                   {selectedEvents.map((ev) => {
//                     const dt = new Date(ev.interview_at);
//                     const statusChip =
//                       ev.isPastLocal || ev.hasPassedTodayLocal ? (
//                         <Chip className="bg-red-50 text-red-700 border border-red-200">
//                           Passed
//                         </Chip>
//                       ) : ev.isTodayLocal ? (
//                         <Chip className="bg-yellow-50 text-yellow-800 border border-yellow-200">
//                           Today
//                         </Chip>
//                       ) : (
//                         <Chip className="bg-emerald-50 text-emerald-700 border border-emerald-200">
//                           Upcoming
//                         </Chip>
//                       );

//                     return (
//                       <div
//                         key={ev.application_id}
//                         className="border rounded-lg p-3 hover:shadow-sm transition"
//                       >
//                         <div className="text-sm font-semibold">{ev.title}</div>
//                         <div className="text-sm text-stone-600">{ev.company}</div>
//                         <div className="text-sm text-stone-600">
//                           {dt.toLocaleString()}{" "}
//                           <span className="text-stone-400">• {relTime(dt)}</span>
//                         </div>
//                         <div className="mt-1">{statusChip}</div>
//                         {ev.url && (
//                           <a
//                             className="text-sm text-blue-600 hover:underline mt-2 inline-block"
//                             href={ev.url}
//                             target="_blank"
//                             rel="noreferrer"
//                           >
//                             View job link
//                           </a>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Right: List with tabs, search, skeleton, empty states */}
//               <div className="bg-white border rounded-xl p-4 shadow-sm">
//                 <div className="flex items-center justify-between gap-3 mb-3">
//                   <h2 className="text-lg font-semibold">Interviews</h2>
//                   <div className="flex gap-2">
//                     <input
//                       value={q}
//                       onChange={(e) => setQ(e.target.value)}
//                       placeholder="Search title/company…"
//                       className="h-9 w-48 sm:w-60 px-3 rounded-lg border bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
//                     />
//                     <button
//                       onClick={fetchInterviews}
//                       className="h-9 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 border"
//                     >
//                       Refresh
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mb-3 grid grid-cols-4 gap-1 text-sm">
//                   {(["all", "today", "upcoming", "past"] as const).map((t) => {
//                     const active = tab === t;
//                     return (
//                       <button
//                         key={t}
//                         onClick={() => setTab(t)}
//                         className={`py-2 rounded-lg border ${
//                           active
//                             ? "bg-purple-600 text-white border-purple-600"
//                             : "bg-white hover:bg-stone-50"
//                         } transition`}
//                       >
//                         {t[0].toUpperCase() + t.slice(1)}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {loading ? (
//                   <div className="space-y-3">
//                     {[0, 1, 2].map((i) => (
//                       <div key={i} className="border rounded-lg p-3 animate-pulse">
//                         <div className="h-4 w-1/3 bg-stone-200 rounded mb-2"></div>
//                         <div className="h-3 w-1/4 bg-stone-200 rounded mb-2"></div>
//                         <div className="h-3 w-2/5 bg-stone-200 rounded"></div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : buckets[tab].length === 0 ? (
//                   <div className="text-center py-10">
//                     <div className="mx-auto h-14 w-14 rounded-full bg-stone-100 flex items-center justify-center mb-3">
//                       📅
//                     </div>
//                     <p className="text-stone-700 font-medium">
//                       No {tab === "all" ? "" : tab} interviews
//                     </p>
//                     <p className="text-stone-500 text-sm">Try changing the tab or clearing search.</p>
//                   </div>
//                 ) : (
//                   <AnimatePresence mode="popLayout">
//                     <div className="space-y-3">
//                       {buckets[tab].map((ev) => {
//                         const dt = new Date(ev.interview_at);
//                         const showPassed = ev.isPastLocal || ev.hasPassedTodayLocal;
//                         const border = showPassed
//                           ? "border-red-200"
//                           : ev.isTodayLocal
//                           ? "border-yellow-200"
//                           : "border-emerald-200";

//                         return (
//                           <motion.div
//                             key={ev.application_id + ev.interview_at}
//                             layout
//                             initial={{ opacity: 0, y: 6 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -6 }}
//                             className={`border ${border} rounded-lg p-3 hover:shadow-sm transition bg-white`}
//                           >
//                             <div className="flex items-start justify-between gap-2">
//                               <div>
//                                 <div className="text-sm font-semibold">{ev.title}</div>
//                                 <div className="text-sm text-stone-600">{ev.company}</div>
//                                 <div className="text-sm text-stone-600">
//                                   {dt.toLocaleString()}{" "}
//                                   <span className="text-stone-400">• {relTime(dt)}</span>
//                                 </div>
//                               </div>
//                               <div className="flex flex-col items-end gap-1">
//                                 {showPassed && (
//                                   <Chip className="bg-red-50 text-red-700 border border-red-200">
//                                     Passed
//                                   </Chip>
//                                 )}
//                                 {ev.isTodayLocal && !ev.hasPassedTodayLocal && (
//                                   <Chip className="bg-yellow-50 text-yellow-800 border border-yellow-200">
//                                     Today
//                                   </Chip>
//                                 )}
//                                 {ev.isFutureLocal && (
//                                   <Chip className="bg-emerald-50 text-emerald-700 border border-emerald-200">
//                                     Upcoming
//                                   </Chip>
//                                 )}
//                               </div>
//                             </div>

//                             {ev.url && (
//                               <a
//                                 className="block mt-2 text-sm text-blue-600 hover:underline"
//                                 href={ev.url}
//                                 target="_blank"
//                                 rel="noreferrer"
//                               >
//                                 View job link
//                               </a>
//                             )}
//                           </motion.div>
//                         );
//                       })}
//                     </div>
//                   </AnimatePresence>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }








//----------------------- DIFFERWENT UI -------------



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/TopBar";
// import { ToastContainer, toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";

// type Interview = {
//   application_id: string;
//   title: string;
//   company: string;
//   interview_at: string;
//   url?: string;

//   isPastLocal: boolean;
//   isTodayLocal: boolean;
//   hasPassedTodayLocal: boolean;
//   isFutureLocal: boolean;
// };

// function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
// function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
// function toYMD(d: Date) { const pad = (n: number) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
// function sameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }

// const relTime = (d: Date) => {
//   const now = Date.now();
//   const diff = d.getTime() - now;
//   const mins = Math.round(Math.abs(diff) / 60000);
//   if (mins < 60) return diff >= 0 ? `in ${mins}m` : `${mins}m ago`;
//   const hrs = Math.round(mins / 60);
//   if (hrs < 24) return diff >= 0 ? `in ${hrs}h` : `${hrs}h ago`;
//   const days = Math.round(hrs / 24);
//   return diff >= 0 ? `in ${days}d` : `${days}d ago`;
// };

// const Chip = ({ color, text }: { color: string; text: string }) => (
//   <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${color}`}>{text}</span>
// );

// export default function CalendarPage() {
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [profileImage, setProfileImage] = useState("");

//   const [interviews, setInterviews] = useState<Interview[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const res = await fetch("/api/auth/validate", { credentials: "include" });
//       if (!res.ok) { window.location.href = "/"; return; }
//       const data = await res.json();
//       setEmail(data.user.email);
//       setUsername(data.user.username);
//     })();

//     (async () => {
//       const r = await fetch("/api/get-profile-picture", { credentials: "include" });
//       if (r.ok) { const j = await r.json(); setProfileImage(j.message); }
//     })();
//   }, []);

//   const fetchInterviews = async () => {
//     setLoading(true);
//     try {
//       const offsetMin = new Date().getTimezoneOffset();
//       const res = await fetch(`/api/get-interviews?offsetMin=${offsetMin}`, { credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.error || "Failed to load interviews");
//       setInterviews(data.interviews || []);
//     } catch (e: any) {
//       toast.error(e.message || "Failed to load interviews");
//     } finally { setLoading(false); }
//   };

//   useEffect(() => { fetchInterviews(); }, []);

//   const [cursor, setCursor] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
//   const today = new Date();
//   const monthStart = startOfMonth(cursor);
//   const monthEnd = endOfMonth(cursor);

//   const byDay = useMemo(() => {
//     const map = new Map<string, Interview[]>();
//     for (const it of interviews) {
//       const d = new Date(it.interview_at);
//       const key = toYMD(d);
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push(it);
//     }
//     return map;
//   }, [interviews]);

//   const visibleDays = useMemo(() => {
//     const firstWeekday = monthStart.getDay();
//     const daysInMonth = monthEnd.getDate();
//     const days: Date[] = [];
//     for (let i = 0; i < firstWeekday; i++) {
//       const d = new Date(monthStart);
//       d.setDate(d.getDate() - (firstWeekday - i));
//       days.push(d);
//     }
//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
//     }
//     while (days.length % 7 !== 0) {
//       const next = new Date(days[days.length - 1]);
//       next.setDate(next.getDate() + 1);
//       days.push(next);
//     }
//     return days;
//   }, [cursor, monthStart, monthEnd]);

//   const [selectedDay, setSelectedDay] = useState<Date | null>(null);
//   const selectedKey = selectedDay ? toYMD(selectedDay) : "";
//   const selectedEvents = selectedKey ? byDay.get(selectedKey) || [] : [];

//   return (
//     <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
//       <Sidebar username={username} email={email} profilePic={profileImage} />
//       <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
//         <TopBar username={username} />

//         <div className="p-6 flex-1 flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Interview Calendar</h1>
//               <p className="text-sm text-gray-500">Your interviews at a glance</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="px-3 py-1 rounded-lg hover:bg-gray-100">◀</button>
//               <span className="font-medium">{cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}</span>
//               <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="px-3 py-1 rounded-lg hover:bg-gray-100">▶</button>
//               <button onClick={() => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDay(today); }} className="ml-2 px-3 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-500">Today</button>
//             </div>
//           </div>

//           {/* Calendar */}
//           <div className="grid grid-cols-7 gap-2 text-sm font-medium text-gray-600 mb-2">
//             {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="text-center">{d}</div>)}
//           </div>
//           <div className="grid grid-cols-7 gap-2">
//             {visibleDays.map((d, idx) => {
//               const key = toYMD(d);
//               const events = byDay.get(key) || [];
//               const isToday = sameDay(d, today);
//               const isSelected = selectedDay && sameDay(d, selectedDay);

//               return (
//                 <motion.button
//                   key={idx}
//                   onClick={() => setSelectedDay(d)}
//                   whileHover={{ scale: 1.03 }}
//                   className={`min-h-[90px] rounded-xl border p-2 text-left transition 
//                     ${isSelected ? "ring-2 ring-purple-500" : ""}
//                     ${isToday ? "border-purple-400" : "border-gray-200"} 
//                     ${d.getMonth() === cursor.getMonth() ? "bg-white" : "bg-gray-50"}`}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span className={`${d.getMonth() === cursor.getMonth() ? "text-gray-900" : "text-gray-400"}`}>{d.getDate()}</span>
//                     {isToday && <Chip color="bg-purple-100 text-purple-700" text="Today" />}
//                   </div>
//                   <div className="flex flex-wrap gap-1 mt-2">
//                     {events.slice(0,3).map((ev) => {
//                       const dt = new Date(ev.interview_at);
//                       const color = ev.isPastLocal || ev.hasPassedTodayLocal
//                         ? "bg-red-200"
//                         : ev.isTodayLocal
//                         ? "bg-yellow-200"
//                         : "bg-green-200";
//                       return <span key={ev.application_id} className={`h-2 w-2 rounded-full ${color}`}></span>;
//                     })}
//                     {events.length > 3 && <span className="text-xs text-gray-400">+{events.length-3}</span>}
//                   </div>
//                 </motion.button>
//               );
//             })}
//           </div>

//           {/* Selected Day / Upcoming */}
//           <div className="mt-6 flex-1">
//             <h2 className="text-lg font-semibold mb-3">{selectedDay ? selectedDay.toDateString() : "Upcoming Interviews"}</h2>
//             <AnimatePresence>
//               {(selectedEvents.length > 0 ? selectedEvents : interviews.slice(0,5)).map((ev) => {
//                 const dt = new Date(ev.interview_at);
//                 return (
//                   <motion.div
//                     key={ev.application_id + ev.interview_at}
//                     layout
//                     initial={{ opacity: 0, y: 6 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     className="mb-3 p-4 rounded-xl border bg-white hover:shadow transition"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className="font-medium">{ev.title}</div>
//                         <div className="text-sm text-gray-600">{ev.company}</div>
//                         <div className="text-sm text-gray-500">{dt.toLocaleString()} • {relTime(dt)}</div>
//                       </div>
//                       {ev.isPastLocal || ev.hasPassedTodayLocal
//                         ? <Chip color="bg-red-100 text-red-700" text="Passed" />
//                         : ev.isTodayLocal
//                         ? <Chip color="bg-yellow-100 text-yellow-700" text="Today" />
//                         : <Chip color="bg-green-100 text-green-700" text="Upcoming" />}
//                     </div>
//                     {ev.url && <a href={ev.url} target="_blank" className="text-sm text-purple-600 hover:underline mt-2 inline-block">View Job</a>}
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </main>
//   );
// }




//----------------------- DIFFERWENT UI  3 -------------

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/TopBar";
// import { ToastContainer, toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";

// type Interview = {
//   application_id: string;
//   title: string;
//   company: string;
//   interview_at: string;
//   url?: string;

//   isPastLocal: boolean;
//   isTodayLocal: boolean;
//   hasPassedTodayLocal: boolean;
//   isFutureLocal: boolean;
// };

// function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
// function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
// function toYMD(d: Date) { const pad = (n: number) => String(n).padStart(2,"0"); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
// function sameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }

// const relTime = (d: Date) => {
//   const now = Date.now();
//   const diff = d.getTime() - now;
//   const mins = Math.round(Math.abs(diff) / 60000);
//   if (mins < 60) return diff >= 0 ? `in ${mins}m` : `${mins}m ago`;
//   const hrs = Math.round(mins / 60);
//   if (hrs < 24) return diff >= 0 ? `in ${hrs}h` : `${hrs}h ago`;
//   const days = Math.round(hrs / 24);
//   return diff >= 0 ? `in ${days}d` : `${days}d ago`;
// };

// const StatusDot = ({ status }: { status: "past" | "today" | "upcoming" }) => {
//   const color =
//     status === "past" ? "bg-red-500" :
//     status === "today" ? "bg-yellow-500" : "bg-emerald-500";
//   return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;
// };

// export default function CalendarPage() {
//   const [username, setUsername] = useState("");
//   const [profileImage, setProfileImage] = useState("");
//   const [interviews, setInterviews] = useState<Interview[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const res = await fetch("/api/auth/validate", { credentials: "include" });
//       if (res.ok) { const d = await res.json(); setUsername(d.user.username); }
//       else window.location.href = "/";
//     })();
//     (async () => {
//       const r = await fetch("/api/get-profile-picture", { credentials: "include" });
//       if (r.ok) { const j = await r.json(); setProfileImage(j.message); }
//     })();
//   }, []);

//   const fetchInterviews = async () => {
//     setLoading(true);
//     try {
//       const offsetMin = new Date().getTimezoneOffset();
//       const res = await fetch(`/api/get-interviews?offsetMin=${offsetMin}`, { credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.error || "Failed");
//       setInterviews(data.interviews || []);
//     } catch (e: any) { toast.error(e.message); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchInterviews(); }, []);

//   const [cursor, setCursor] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
//   const today = new Date();
//   const monthStart = startOfMonth(cursor);
//   const monthEnd = endOfMonth(cursor);

//   const byDay = useMemo(() => {
//     const m = new Map<string, Interview[]>();
//     for (const it of interviews) {
//       const d = new Date(it.interview_at);
//       const key = toYMD(d);
//       if (!m.has(key)) m.set(key, []);
//       m.get(key)!.push(it);
//     }
//     return m;
//   }, [interviews]);

//   const visibleDays = useMemo(() => {
//     const firstWeekday = monthStart.getDay();
//     const daysInMonth = monthEnd.getDate();
//     const days: Date[] = [];
//     for (let i = 0; i < firstWeekday; i++) {
//       const d = new Date(monthStart);
//       d.setDate(d.getDate() - (firstWeekday - i));
//       days.push(d);
//     }
//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
//     }
//     while (days.length % 7 !== 0) {
//       const next = new Date(days[days.length-1]);
//       next.setDate(next.getDate()+1);
//       days.push(next);
//     }
//     return days;
//   }, [cursor, monthStart, monthEnd]);

//   const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
//   const hoveredKey = hoveredDay ? toYMD(hoveredDay) : "";
//   const hoveredEvents = hoveredKey ? byDay.get(hoveredKey) || [] : [];

//   return (
//     <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
//       <Sidebar username={username} email={""} profilePic={profileImage} />
//       <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
//         <TopBar username={username} />

//         <div className="p-6 flex-1 flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-3xl font-bold text-gray-900">
//               {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
//             </h1>
//             <div className="flex items-center gap-2">
//               <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth()-1, 1))}>◀</button>
//               <button onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))} className="px-3 py-1 rounded-lg bg-purple-600 text-white">Today</button>
//               <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth()+1, 1))}>▶</button>
//             </div>
//           </div>

//           {/* Calendar */}
//           <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-gray-500 mb-2">
//             {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="text-center">{d}</div>)}
//           </div>
//           <div className="grid grid-cols-7 gap-2">
//             {visibleDays.map((d, idx) => {
//               const key = toYMD(d);
//               const events = byDay.get(key) || [];
//               const isToday = sameDay(d,today);

//               return (
//                 <div
//                   key={idx}
//                   onMouseEnter={() => setHoveredDay(d)}
//                   onMouseLeave={() => setHoveredDay(null)}
//                   className={`relative h-20 rounded-lg border text-sm p-1 flex flex-col items-center justify-start
//                     ${d.getMonth()===cursor.getMonth() ? "bg-white" : "bg-gray-50"}
//                     ${isToday ? "border-purple-400" : "border-gray-200"}`}
//                 >
//                   <span className={`${d.getMonth()===cursor.getMonth() ? "text-gray-800" : "text-gray-400"}`}>
//                     {d.getDate()}
//                   </span>
//                   <div className="flex gap-1 mt-auto">
//                     {events.slice(0,3).map((ev) => {
//                       const status = ev.isPastLocal || ev.hasPassedTodayLocal ? "past" : ev.isTodayLocal ? "today" : "upcoming";
//                       return <StatusDot key={ev.application_id} status={status} />;
//                     })}
//                   </div>
//                   <AnimatePresence>
//                     {hoveredDay && sameDay(hoveredDay,d) && events.length > 0 && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0 }}
//                         className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border p-3 w-64 z-10"
//                       >
//                         {events.map((ev) => {
//                           const dt = new Date(ev.interview_at);
//                           return (
//                             <div key={ev.application_id} className="mb-2 last:mb-0">
//                               <div className="font-medium">{ev.title}</div>
//                               <div className="text-sm text-gray-600">{ev.company}</div>
//                               <div className="text-xs text-gray-500">{dt.toLocaleString()} • {relTime(dt)}</div>
//                             </div>
//                           );
//                         })}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Right sidebar: upcoming */}
//           <div className="mt-8">
//             <h2 className="text-lg font-semibold mb-3">Upcoming Interviews</h2>
//             {loading ? (
//               <p className="text-sm text-gray-400">Loading…</p>
//             ) : interviews.filter((i) => i.isFutureLocal || i.isTodayLocal).length === 0 ? (
//               <p className="text-sm text-gray-500">No upcoming interviews 🎉</p>
//             ) : (
//               <div className="space-y-3">
//                 {interviews.filter((i) => i.isFutureLocal || i.isTodayLocal).slice(0,6).map((ev) => {
//                   const dt = new Date(ev.interview_at);
//                   return (
//                     <motion.div
//                       key={ev.application_id+ev.interview_at}
//                       initial={{ opacity: 0, y: 8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="p-3 rounded-lg border bg-white hover:shadow-sm transition"
//                     >
//                       <div className="font-medium">{ev.title}</div>
//                       <div className="text-sm text-gray-600">{ev.company}</div>
//                       <div className="text-xs text-gray-500">{dt.toLocaleString()} • {relTime(dt)}</div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </main>
//   );
// }








//----------------------- DIFFERWENT UI  4 -------------

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/TopBar";
// import { ToastContainer, toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";

// type Interview = {
//   application_id: string;
//   title: string;
//   company: string;
//   interview_at: string;
//   url?: string;

//   isPastLocal: boolean;
//   isTodayLocal: boolean;
//   hasPassedTodayLocal: boolean;
//   isFutureLocal: boolean;
// };

// function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
// function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
// function toYMD(d: Date) { const pad = (n: number) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
// function sameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }

// const relTime = (d: Date) => {
//   const now = Date.now();
//   const diff = d.getTime() - now;
//   const mins = Math.round(Math.abs(diff) / 60000);
//   if (mins < 60) return diff >= 0 ? `in ${mins}m` : `${mins}m ago`;
//   const hrs = Math.round(mins / 60);
//   if (hrs < 24) return diff >= 0 ? `in ${hrs}h` : `${hrs}h ago`;
//   const days = Math.round(hrs / 24);
//   return diff >= 0 ? `in ${days}d` : `${days}d ago`;
// };

// const Chip = ({ color, text }: { color: string; text: string }) => (
//   <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${color}`}>{text}</span>
// );

// export default function CalendarPage() {
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [profileImage, setProfileImage] = useState("");

//   const [interviews, setInterviews] = useState<Interview[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [dark, setDark] = useState(false);

//   // Manage dark mode toggle
//   useEffect(() => {
//     if (dark) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [dark]);

//   useEffect(() => {
//     (async () => {
//       const res = await fetch("/api/auth/validate", { credentials: "include" });
//       if (!res.ok) { window.location.href = "/"; return; }
//       const data = await res.json();
//       setEmail(data.user.email);
//       setUsername(data.user.username);
//     })();

//     (async () => {
//       const r = await fetch("/api/get-profile-picture", { credentials: "include" });
//       if (r.ok) { const j = await r.json(); setProfileImage(j.message); }
//     })();
//   }, []);

//   const fetchInterviews = async () => {
//     setLoading(true);
//     try {
//       const offsetMin = new Date().getTimezoneOffset();
//       const res = await fetch(`/api/get-interviews?offsetMin=${offsetMin}`, { credentials: "include" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.error || "Failed to load interviews");
//       setInterviews(data.interviews || []);
//     } catch (e: any) {
//       toast.error(e.message || "Failed to load interviews");
//     } finally { setLoading(false); }
//   };

//   useEffect(() => { fetchInterviews(); }, []);

//   const [cursor, setCursor] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
//   const today = new Date();
//   const monthStart = startOfMonth(cursor);
//   const monthEnd = endOfMonth(cursor);

//   const byDay = useMemo(() => {
//     const map = new Map<string, Interview[]>();
//     for (const it of interviews) {
//       const d = new Date(it.interview_at);
//       const key = toYMD(d);
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push(it);
//     }
//     return map;
//   }, [interviews]);

//   const visibleDays = useMemo(() => {
//     const firstWeekday = monthStart.getDay();
//     const daysInMonth = monthEnd.getDate();
//     const days: Date[] = [];
//     for (let i = 0; i < firstWeekday; i++) {
//       const d = new Date(monthStart);
//       d.setDate(d.getDate() - (firstWeekday - i));
//       days.push(d);
//     }
//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
//     }
//     while (days.length % 7 !== 0) {
//       const next = new Date(days[days.length - 1]);
//       next.setDate(next.getDate() + 1);
//       days.push(next);
//     }
//     return days;
//   }, [cursor, monthStart, monthEnd]);

//   const [selectedDay, setSelectedDay] = useState<Date | null>(null);
//   const selectedKey = selectedDay ? toYMD(selectedDay) : "";
//   const selectedEvents = selectedKey ? byDay.get(selectedKey) || [] : [];

//   return (
//     <main className="grid gap-4 p-4 grid-cols-[220px,_1fr] bg-gray-50 dark:bg-gray-900 transition-colors">
//       <Sidebar username={username} email={email} profilePic={profileImage} />
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm h-full flex flex-col transition-colors">
//         <TopBar username={username} />

//         <div className="p-6 flex-1 flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Calendar</h1>
//               <p className="text-sm text-gray-500 dark:text-gray-400">Your interviews at a glance</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">◀</button>
//               <span className="font-medium text-gray-900 dark:text-gray-100">
//                 {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
//               </span>
//               <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">▶</button>
//               <button onClick={() => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDay(today); }} className="ml-2 px-3 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-500">Today</button>
//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDark(!dark)}
//                 className="ml-2 px-3 py-1 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition"
//               >
//                 {dark ? "🌙 Dark" : "☀️ Light"}
//               </button>
//             </div>
//           </div>

//           {/* Calendar */}
//           <div className="grid grid-cols-7 gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
//             {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="text-center">{d}</div>)}
//           </div>
//           <div className="grid grid-cols-7 gap-2">
//             {visibleDays.map((d, idx) => {
//               const key = toYMD(d);
//               const events = byDay.get(key) || [];
//               const isToday = sameDay(d, today);
//               const isSelected = selectedDay && sameDay(d, selectedDay);

//               return (
//                 <motion.button
//                   key={idx}
//                   onClick={() => setSelectedDay(d)}
//                   whileHover={{ scale: 1.03 }}
//                   className={`min-h-[90px] rounded-xl border p-2 text-left transition 
//                     ${isSelected ? "ring-2 ring-purple-500" : ""}
//                     ${isToday ? "border-purple-400" : "border-gray-200 dark:border-gray-700"} 
//                     ${d.getMonth() === cursor.getMonth() ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}`}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span className={`${d.getMonth() === cursor.getMonth() ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>{d.getDate()}</span>
//                     {isToday && <Chip color="bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200" text="Today" />}
//                   </div>
//                   <div className="flex flex-wrap gap-1 mt-2">
//                     {events.slice(0,3).map((ev) => {
//                       const dt = new Date(ev.interview_at);
//                       const color = ev.isPastLocal || ev.hasPassedTodayLocal
//                         ? "bg-red-400"
//                         : ev.isTodayLocal
//                         ? "bg-yellow-400"
//                         : "bg-green-400";
//                       return <span key={ev.application_id} className={`h-2 w-2 rounded-full ${color}`}></span>;
//                     })}
//                     {events.length > 3 && <span className="text-xs text-gray-400 dark:text-gray-500">+{events.length-3}</span>}
//                   </div>
//                 </motion.button>
//               );
//             })}
//           </div>

//           {/* Selected Day / Upcoming */}
//           <div className="mt-6 flex-1">
//             <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">{selectedDay ? selectedDay.toDateString() : "Upcoming Interviews"}</h2>
//             <AnimatePresence>
//               {(selectedEvents.length > 0 ? selectedEvents : interviews.slice(0,5)).map((ev) => {
//                 const dt = new Date(ev.interview_at);
//                 return (
//                   <motion.div
//                     key={ev.application_id + ev.interview_at}
//                     layout
//                     initial={{ opacity: 0, y: 6 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     className="mb-3 p-4 rounded-xl border bg-white dark:bg-gray-800 hover:shadow transition"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className="font-medium text-gray-900 dark:text-gray-100">{ev.title}</div>
//                         <div className="text-sm text-gray-600 dark:text-gray-400">{ev.company}</div>
//                         <div className="text-sm text-gray-500 dark:text-gray-400">{dt.toLocaleString()} • {relTime(dt)}</div>
//                       </div>
//                       {ev.isPastLocal || ev.hasPassedTodayLocal
//                         ? <Chip color="bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200" text="Passed" />
//                         : ev.isTodayLocal
//                         ? <Chip color="bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200" text="Today" />
//                         : <Chip color="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200" text="Upcoming" />}
//                     </div>
//                     {ev.url && <a href={ev.url} target="_blank" className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block">View Job</a>}
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </main>
//   );
// }



// -------------------- DIFFERNET UI 5 -------------------//

"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

type Interview = {
  application_id: string;
  title: string;
  company: string;
  interview_at: string;
  url?: string;

  isPastLocal: boolean;
  isTodayLocal: boolean;
  hasPassedTodayLocal: boolean;
  isFutureLocal: boolean;
};

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function toYMD(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function sameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }

const relTime = (d: Date) => {
  const now = Date.now();
  const diff = d.getTime() - now;
  const mins = Math.round(Math.abs(diff) / 60000);
  if (mins < 60) return diff >= 0 ? `in ${mins}m` : `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return diff >= 0 ? `in ${hrs}h` : `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return diff >= 0 ? `in ${days}d` : `${days}d ago`;
};

const Chip = ({ color, text }: { color: string; text: string }) => (
  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${color}`}>{text}</span>
);

export default function CalendarPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/validate", { credentials: "include" });
      if (!res.ok) { window.location.href = "/"; return; }
      const data = await res.json();
      setEmail(data.user.email);
      setUsername(data.user.username);
    })();

    (async () => {
      const r = await fetch("/api/get-profile-picture", { credentials: "include" });
      if (r.ok) { const j = await r.json(); setProfileImage(j.message); }
    })();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const offsetMin = new Date().getTimezoneOffset();
      const res = await fetch(`/api/get-interviews?offsetMin=${offsetMin}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load interviews");
      setInterviews(data.interviews || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load interviews");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchInterviews(); }, []);

  // Calendar state
  const [cursor, setCursor] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const today = new Date();
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);

  const byDay = useMemo(() => {
    const map = new Map<string, Interview[]>();
    for (const it of interviews) {
      const d = new Date(it.interview_at);
      const key = toYMD(d);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    return map;
  }, [interviews]);

  const visibleDays = useMemo(() => {
    const firstWeekday = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();
    const days: Date[] = [];
    for (let i = 0; i < firstWeekday; i++) {
      const d = new Date(monthStart);
      d.setDate(d.getDate() - (firstWeekday - i));
      days.push(d);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
    }
    while (days.length % 7 !== 0) {
      const next = new Date(days[days.length - 1]);
      next.setDate(next.getDate() + 1);
      days.push(next);
    }
    return days;
  }, [cursor, monthStart, monthEnd]);

  // Select today by default & focus on day view
  const [selectedDay, setSelectedDay] = useState<Date | null>(today);
  const selectedKey = selectedDay ? toYMD(selectedDay) : "";
  const selectedEvents = selectedKey ? byDay.get(selectedKey) || [] : [];

  return (
    <main className="grid gap-4 p-4 grid-cols-[220px,_1fr] bg-gray-50">
      <Sidebar username={username} email={email} profilePic={profileImage} />
      <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
        <TopBar username={username} />

        <div className="p-6 flex-1 flex flex-col">
          {/* Hero */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  Interview Calendar
                </span>
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and plan your interviews with ease
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                className="px-3 py-1 rounded-lg hover:bg-gray-100"
                aria-label="Previous month"
              >
                ◀
              </button>
              <span className="px-3 py-1 rounded-lg bg-white border shadow-sm font-medium text-gray-900">
                {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
              </span>
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                className="px-3 py-1 rounded-lg hover:bg-gray-100"
                aria-label="Next month"
              >
                ▶
              </button>
              <button
                onClick={() => {
                  setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSelectedDay(today);
                }}
                className="ml-2 px-3 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-500"
              >
                Today
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-500 mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {visibleDays.map((d, idx) => {
              const key = toYMD(d);
              const events = byDay.get(key) || [];
              const isToday = sameDay(d, today);
              const isSelected = selectedDay && sameDay(d, selectedDay);

              return (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedDay(d)}
                  whileHover={{ scale: 1.02 }}
                  className={`min-h-[96px] rounded-xl border p-2 text-left transition 
                    ${isSelected ? "ring-2 ring-purple-500" : ""}
                    ${isToday ? "border-purple-400" : "border-gray-200"} 
                    ${d.getMonth() === cursor.getMonth() ? "bg-white" : "bg-gray-50"}`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`${d.getMonth() === cursor.getMonth() ? "text-gray-900" : "text-gray-400"}`}>
                      {d.getDate()}
                    </span>
                    {isToday && <Chip color="bg-yellow-200 text-black" text="Today" />}
                  </div>

                  {/* Dot indicators */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {events.slice(0, 4).map((ev) => {
                      const color =
                        ev.isPastLocal || ev.hasPassedTodayLocal
                          ? "bg-red-400"
                          : ev.isTodayLocal
                          ? "bg-yellow-200"
                          : "bg-green-400";
                      return <span key={ev.application_id} className={`h-2 w-2 rounded-full ${color}`}></span>;
                    })}
                    {events.length > 4 && (
                      <span className="text-[10px] text-gray-400">+{events.length - 4}</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Mini legend */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Upcoming
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-200" />
              Today
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              Passed
            </span>
          </div>

          {/* Selected Day */}
          <div className="mt-6 flex-1">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              {selectedDay ? selectedDay.toDateString() : "Your Interviews"}
            </h2>

            <AnimatePresence>
              {loading ? (
                <div className="space-y-3">
                  {[0,1,2].map(i => (
                    <div key={i} className="h-20 rounded-xl border bg-white animate-pulse"></div>
                  ))}
                </div>
              ) : selectedEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden p-6 rounded-xl border border-purple-100 bg-gradient-to-b from-purple-50 to-white"
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-100/50 blur-2xl" />
                  </div>

                  <div className="text-2xl font-semibold mb-1">🎉 You’re up to date</div>
                  <p className="text-gray-600">
                    No interviews scheduled for this day. Keep applying—future you says thanks!
                  </p>

                  {/* CTAs */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="/applications"
                      className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-white 
                                 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600
                                 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition
                                 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition"></span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Log a new application
                      <svg
                        className="ml-0.5 translate-x-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition"
                        width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </a>

                    <a
                      href="/dashboard"
                      className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium 
                                 bg-white/70 backdrop-blur border border-gray-200
                                 text-gray-800 hover:bg-white hover:shadow-sm transition
                                 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 13h4v7H4v-7zm6-6h4v13h-4V7zm6-3h4v16h-4V4z" fill="currentColor" />
                      </svg>
                      Review pipeline
                      <svg
                        className="ml-0.5 translate-x-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition"
                        width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ) : (
                selectedEvents.map((ev) => {
                  const dt = new Date(ev.interview_at);
                  return (
                    <motion.div
                      key={ev.application_id + ev.interview_at}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-3 p-4 rounded-xl border bg-white hover:shadow transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{ev.title}</div>
                          <div className="text-sm text-gray-600">{ev.company}</div>
                          <div className="text-sm text-gray-500">
                            {dt.toLocaleString()} • {relTime(dt)}
                          </div>
                        </div>
                        {ev.isPastLocal || ev.hasPassedTodayLocal
                          ? <Chip color="bg-red-100 text-red-700" text="Passed" />
                          : ev.isTodayLocal
                          ? <Chip color="bg-yellow-100 text-yellow-700" text="Today" />
                          : <Chip color="bg-green-100 text-green-700" text="Upcoming" />}
                      </div>
                      {ev.url && (
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-purple-600 hover:underline mt-2 inline-block"
                        >
                          View Job
                        </a>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
