import React, { useEffect, useState } from "react";

// ProgressBar Component
interface ProgressBarProps {
  status: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ status }) => {
  const statuses = ["Applied", "Interview Scheduled", "Pending", "Final"]; // 4 statuses now
  const currentIndex =
    status === "Offer Received"
      ? 3
      : status === "Rejected"
      ? 3
      : statuses.indexOf(status);

  return (
    <div className="flex items-center space-x-1 mt-4">
      {statuses.map((item, index) => (
        <div
          key={item}
          className={`flex-1 h-3 rounded-full ${
            index < currentIndex
              ? ["bg-blue-500", "bg-purple-500", "bg-yellow-500"][index] // First 3 statuses colors
              : index === 3 // For the 4th bar (Final)
              ? status === "Offer Received"
                ? "bg-green-500" // Green for Offer Received
                : status === "Rejected"
                ? "bg-red-500" // Red for Rejected
                : "bg-gray-200" // Gray for incomplete statuses
              : "bg-gray-200" // Gray for all bars after the current status
          }`}
          title={item} // Tooltip for better UX
        />
      ))}
    </div>
  );
};

// Utils
const toLocalInputValue = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  // to "YYYY-MM-DDTHH:MM" local time
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
};
const toISO = (local: string) => (local ? new Date(local).toISOString() : undefined);



// JobApplication Component
interface JobApplicationProps {
  jobTitle: string;
  companyName: string;
  url: string;
  description: string;
  status: string;
  interviewAtISO?: string; // <-- optional: current scheduled time from DB if any
  onEditStatus: (payload: { newStatus: string; interviewAtISO?: string }) => void; // <-- changed // Callback for updating status
  onViewDetails: () => void; // Callback for opening the modal with general info
  onDelete: () => void;
}

const JobApplication: React.FC<JobApplicationProps> = ({
  jobTitle,
  companyName,
  url,
  description,
  status,
  interviewAtISO,
  onEditStatus,
  onViewDetails,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(status);

  // local datetime input value "YYYY-MM-DDTHH:mm"
  const [interviewLocal, setInterviewLocal] = useState<string>(() => {
  if (!interviewAtISO) return "";
  const d = new Date(interviewAtISO);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
});


  // const handleSave = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // Prevent modal from opening
  //   onEditStatus(newStatus); // Call parent callback to save changes
  //   setIsEditing(false); // Exit edit mode
  // };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditStatus({
      newStatus,
      interviewAtISO:
        newStatus === "Interview Scheduled" && interviewLocal
          ? new Date(interviewLocal).toISOString()
          : undefined,
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`p-6 border border-gray-200 rounded-lg shadow relative ${
        isEditing ? "cursor-default" : "cursor-pointer"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!isEditing) {
          onViewDetails(); // Open modal with general info if not editing
        }
      }}
    >
      <h3 className="text-xl font-semibold text-gray-800">{jobTitle}</h3>
      <p className="text-gray-600 font-medium">{companyName}</p>
      <p className="text-gray-700 mt-2">{description}</p>

       {!isEditing ? (
        <>
          <p className="text-sm text-gray-500 mt-1">
            Status: <span className="font-semibold">{status}</span>
            {interviewAtISO && (
              <span className="ml-2 text-xs text-gray-500">
                • Interview: {new Date(interviewAtISO).toLocaleString()}
              </span>
            )}
          </p>
          <ProgressBar status={status} />
        </>
      ) : (
         <div className="mt-2">
          <label className="block text-sm text-gray-700 font-medium mb-1">Edit Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Applied">Applied</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Pending">Pending</option>
            <option value="Offer Received">Offer Received</option>
            <option value="Rejected">Rejected</option>
          </select>

          {newStatus === "Interview Scheduled" && (
  <div className="mt-3">
    <label className="block text-sm text-gray-700 font-medium mb-1">
      Interview date & time
    </label>
    <input
      type="datetime-local"
      value={interviewLocal}                      // <- was interviewAtLocal
      onChange={(e) => setInterviewLocal(e.target.value)}  // <- was setInterviewAtLocal
      onClick={(e) => e.stopPropagation()}
      className="block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p className="text-xs text-gray-500 mt-1">
      This will be saved with the status.
    </p>
  </div>
)}


           <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}

     <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-4 block"
        onClick={(e) => e.stopPropagation()}
      >
        View Application
      </a>

      {isHovered && !isEditing && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded shadow"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="px-3 py-1 text-sm text-red-600 hover:text-white hover:bg-red-600 rounded shadow"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};
export default JobApplication;