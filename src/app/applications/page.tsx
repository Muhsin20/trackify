"use client";
import { useState, useEffect, Suspense } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import JobApplication from "../components/JobApplication";
import { ToastContainer, toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
//make a google login sso
interface Application {
  application_id: number;
  title: string;
  company: string;
  url: string;
  description: string;
  status: string;
}

export default function JobApplicationPage() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <ApplicationComponent />
      </Suspense>
    </>
  );
}
const ApplicationComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    async function authUser() {
      const request = await fetch("/api/auth/validate", {
        method: "GET",
        credentials: "include",
      });
      if (
        request.status == 500 ||
        request.status == 401 ||
        request.status == 400
      ) {
        console.log(request.status);
        router.push("/");
      } else {
        const result = await request.json();
        console.log(result.message);
        console.log(result.user);
        setUserID(result.user.id);
        setEmail(result.user.email);
        setUsername(result.user.username);
      }
    }
    authUser();
  }, []);

  const [isMounted, setIsMounted] = useState(false);

  const currentPageFromURL = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // When component mounts, set the correct currentPage from the URL
  useEffect(() => {
    setCurrentPage(currentPageFromURL); // Set page after mount to avoid SSR issues
    setIsMounted(true);
  }, [currentPageFromURL]);

  useEffect(() => {
    if (isMounted) {
      async function getApplicationsForPage() {
        const request = await fetch(
          `/api/get-applications?page=${currentPage}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await request.json();
        if (request.ok) {
          console.log(
            `Fetched applications for page ${currentPage}`,
            result.applications
          );
          setApplications(result.applications || []);
          setJobLength(result.applications_length || 0);
        }
      }

      getApplicationsForPage();
    }
  }, [currentPage, isMounted]);

  const [applications, setApplications] = useState<Application[]>([]);
  const [userID, setUserID] = useState();
  const [jobLength, setJobLength] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [showModalForm, setShowModalForm] = useState(false); // Add Application Modal
  const [viewApplication, setViewApplication] = useState<Application | null>(
    null
  ); // View Application Modal
  const [newApplication, setNewApplication] = useState<
    Omit<Application, "application_id">
  >({
    title: "",
    company: "",
    url: "",
    description: "",
    status: "Applied",
  });

  const applicationsPerPage = 10;
  console.log(`length is ${jobLength}`);
  console.log(`applications length is: ${applicationsPerPage}`);
  const totalPages = Math.ceil(jobLength / applicationsPerPage);

  const handleOpenModalForm = () => setShowModalForm(true); // Open Add Application Modal
  const handleCloseModalForm = () => {
    setShowModalForm(false); // Close Add Application Modal
    setNewApplication({
      title: "",
      company: "",
      url: "",
      description: "",
      status: "",
    });
  };

  const handleOpenViewModal = (application: Application) => {
    setViewApplication(application); // Open View Application Modal
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      router.replace(`?page=${nextPage}`);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      router.replace(`?page=${prevPage}`);
    }
  };

  const handleCloseViewModal = () => {
    setViewApplication(null); // Close View Application Modal
  };

  let tempIdCounter = 0;
  const handleSaveApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulating API call - can be replaced with actual API logic - muhsin
    console.log("Simulating API call:", newApplication);

    //check if they are empty return an alert message
    // Check if any required field is missing
    if (
      !newApplication.title.trim() ||
      !newApplication.company.trim() ||
      !newApplication.url.trim() ||
      !newApplication.description.trim()
    ) {
      toast.error("Please fill out all required fields!", {
        position: "top-center",
        autoClose: 5000,
      });
      return; // Prevent the request if any field is empty
    }

    const response = await fetch("/api/add-application", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userID,
        title: newApplication.title.trim(),
        company: newApplication.company.trim(),
        url: newApplication.url.trim(),
        description: newApplication.description.trim(),
        status: newApplication.status,
      }),
    });

    const data = await response.json();

    if (data.statusCode === 200) {
      //put a snackbar or notification at the top
      console.log("Added");
      toast.success("Job Added!", {
        position: "top-center",
        autoClose: 5000,
      });
      const tempId = --tempIdCounter;
      const applicationWithId: Application = {
        ...newApplication,
        application_id: tempId,
      };
      setApplications((prevApplications) => [
        ...prevApplications,
        applicationWithId,
      ]);
    } else {
      console.log("error");
      alert(data.message);
    }

    handleCloseModalForm(); // Close Add Application Modal
  };

  const handleEditStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch("/api/edit-application", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userID,
          newStatus: newStatus,
          application_id: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit application");
      }

      const data = await response.json();

      if (data.statusCode === 200) {
        toast.success("Job Edited!", {
          position: "top-center",
          autoClose: 5000,
        });
        setApplications((prev) =>
          prev.map((app) =>
            app.application_id === id ? { ...app, status: newStatus } : app
          )
        );
      } else {
        console.log("error");
        alert(data.message);
      }
    } catch (error) {
      console.error("Error editing status:", error);
      toast.error("Failed to edit job application. Please try again.");
    }
  };

  return (
    <div>
      <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
        <Sidebar username={username} email={email} />
        <div className="bg-gray-50 rounded-lg pb-4 shadow h-full">
          <TopBar username={username} />
          <div className="p-8">
            {/* Title and Add Button */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900">
                <span className="text-gray-900">Your </span>
                <span className="text-purple-600">Job Tracker</span>
              </h1>
              {/* Add Application Button */}
              <button
                onClick={handleOpenModalForm}
                className="flex items-center gap-2 px-6 py-3 bg-purple-800 text-white font-medium rounded-lg shadow hover:bg-purple-700 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Application
              </button>
            </div>

            {/* Divider Line */}
            <hr className="mt-4 border-gray-300" />
            <ToastContainer />

            {/* Applications List */}
            {applications.length > 0 ? (
              <div className="mt-10 flex flex-col space-y-4">
                {applications.map((app) => (
                  <JobApplication
                    key={app.application_id}
                    jobTitle={app.title}
                    companyName={app.company}
                    url={app.url}
                    description={app.description}
                    status={app.status}
                    onEditStatus={(newStatus) =>
                      handleEditStatus(app.application_id, newStatus)
                    } // Pass edit callback
                    onViewDetails={() => handleOpenViewModal(app)} // Pass view callback
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-lg text-center mt-10">
                No applications added yet. Start by adding one using the{" "}
                <span className="text-blue-500 font-bold">Add Application</span>{" "}
                button above.
              </p>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* View Application Modal */}
            {viewApplication && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-md relative">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {viewApplication.title}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Company:</strong> {viewApplication.company}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Status:</strong> {viewApplication.status}
                  </p>
                  <p className="text-gray-600 mt-2">
                    {viewApplication.description}
                  </p>
                  <a
                    href={viewApplication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline mt-4 block"
                  >
                    View Application URL
                  </a>
                  <button
                    onClick={handleCloseViewModal}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Add Application Modal */}
            {showModalForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-md relative">
                  <form onSubmit={handleSaveApplication}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Add New Application
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={newApplication.title}
                        onChange={(e) =>
                          setNewApplication((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter job title"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={newApplication.company}
                        onChange={(e) =>
                          setNewApplication((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder="Enter company name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        URL
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={newApplication.url}
                        onChange={(e) =>
                          setNewApplication((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        placeholder="https://example.com"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newApplication.description}
                        onChange={(e) =>
                          setNewApplication((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe the role"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        name="status"
                        value={newApplication.status}
                        onChange={(e) =>
                          setNewApplication((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview Scheduled">
                          Interview Scheduled
                        </option>
                        <option value="Pending">Pending</option>
                        <option value="Offer Received">Offer Received</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={handleCloseModalForm}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
