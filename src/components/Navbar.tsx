"use client";
//Test

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react"; // Notification icon
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // ShadCN Avatar component
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown
  const dropdownRef = useRef(null); // Reference for dropdown to handle outside click

  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications"); // Replace with actual API endpoint
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-2">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Image
            src="/navlogo.png"
            width={200}
            height={200}
            alt="Book Your Calendar"
          />
        </Link>

        {/* Notification Icon and Avatar */}
        <div className="flex items-center gap-6 relative">
          {/* Notification Icon */}
          <button
            className="relative text-gray-800 hover:text-gray-600 focus:outline-none"
            aria-label="Notifications"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell className="w-6 h-6" />
            {/* Notification Badge */}
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-2 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Notifications</h3>
              {notifications.length > 0 ? (
                <ul className="space-y-3">
                  {notifications.map((notification, index) => (
                    <li
                      key={index}
                      className="p-2 bg-gray-100 rounded-lg text-sm text-gray-800 border border-gray-200"
                    >
                      {notification.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm text-center">No new notifications</p>
              )}

              {/* Clear Notifications Button */}
              {notifications.length > 0 && (
                <Button
                  className="w-full mt-3 bg-[#407BFF] text-white hover:bg-[#8CB0FF]"
                  onClick={() => setNotifications([])}
                >
                  Clear All
                </Button>
              )}
            </div>
          )}

          {/* Avatar */}
          <Link href={"/Profile"}>
            <Avatar>
              <AvatarImage src="/user-avatar.png" alt="User Avatar" />
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
