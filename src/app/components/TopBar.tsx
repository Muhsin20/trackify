"use client";
import { useState, useEffect } from "react";
interface UserProps {
  username: string;
}
const TopBar: React.FC<UserProps> = ({ username }) => {
  const today = new Date(); // Get the current date

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const today = new Date(); // Get the current date
    setFormattedDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">
            🚀 Welcome back, {username != null ? username: "user"}!
          </span>
          <span className="text-xs block text-stone-500">
            {" "}
            {formattedDate || "Loading date..."}
          </span>
        </div>
      </div>
    </div>
  );
};
export default TopBar;
