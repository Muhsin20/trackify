"use client";

import { IconType } from "react-icons";
import { FiBriefcase, FiHome, FiLogOut, FiUser } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export const RouteSelect = () => {
  const router = useRouter(); // Next.js router for navigation
  const pathname = usePathname(); // To get the current path

  const routes = [
    { title: "Dashboard", icon: FiHome, path: "/dashboard" },
    { title: "My Applications", icon: FiBriefcase, path: "/applications" },
    { title: "Profile", icon: FiUser, path: "/profile" },
    { title: "Sign Out", icon: FiLogOut, path: "/logout" },
  ];
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true); // Ensures the client-side path is correct after hydration
  }, []);

  if (!isHydrated) return null;

  return (
    <div className="space-y-1">
      {routes.map((route) => (
        <Route
          key={route.path}
          Icon={route.icon}
          title={route.title}
          selected={pathname === route.path} // Compare with pathname for active route
          onClick={() => router.push(route.path)} // Navigate to new path
        />
      ))}
    </div>
  );
};

const Route = ({
  selected,
  Icon,
  title,
  onClick,
}: {
  selected: boolean;
  Icon: IconType;
  title: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
        selected
          ? "bg-white text-stone-950 shadow"
          : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
      }`}
    >
      <Icon className={selected ? "text-violet-500" : ""} />
      <span>{title}</span>
    </button>
  );
};
export default RouteSelect;
