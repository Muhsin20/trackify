"use client";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";
interface UserProps {
  username: string;
  email: string;
  profilePic: string;
}
const AccountToggle: React.FC<UserProps> = ({
  username,
  email,
  profilePic,
}) => {
  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <button className="flex items-center gap-2 p-0.5 hover:bg-stone-200 rounded transition-colors w-full relative">
        <img
          src={profilePic || "https://api.dicebear.com/9.x/notionists/svg"}
          alt="avatar"
          className="w-8 h-8 rounded shrink-0 bg-violet-500 shadow"
        />

        <div className="text-start">
          <span className="text-sm font-bold block">{username}</span>
          <span className="text-xs block text-stone-500">{email}</span>
        </div>
        <FiChevronDown className="absolute right-2  top-1/2 translate-y-[calc(-50%+4px)] text-xs" />
        <FiChevronUp className="absolute right-2  top-1/2 translate-y-[calc(-50%-4px)] text-xs" />
      </button>
    </div>
  );
};
export default AccountToggle;
