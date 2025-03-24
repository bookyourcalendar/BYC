"use client";
//Test

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
// import Image from "next/image";
import { Bell, Menu } from "lucide-react"; // Notification & Menu icons
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Sidebar Toggle
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/admin/ticketNotifiation"
        );
        if (!res.ok) throw new Error("Failed to fetch notifications");

        const data = await res.json();

        const formattedData = data.map((ticket) => ({
          id: ticket.id,
          ticketId: ticket.ticketId,
          fullName: ticket.fullName,
          issueType: ticket.issueType,
          description: ticket.description,
          createdAt: new Date(ticket.createdAt).toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        }));

        setNotifications(formattedData);
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

  // Mark all notifications as read
  const clearNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/admin/markAsReadTicket",
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error("Failed to mark notifications as read");
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 w-full md:left-[250px] md:w-[calc(100%-250px)] z-50">
      <div className="flex items-center justify-end px-4 py-3">
        {/* Sidebar Toggle Button (Mobile) */}
        <button
          className="md:hidden text-gray-800 focus:outline-none mr-auto"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {/* <Menu className="w-6 h-6" /> */}
        </button>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-4 relative">
          {/* Notification Icon */}
          <button
            className="relative text-gray-800 hover:text-gray-600 focus:outline-none"
            aria-label="Notifications"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell className="w-6 h-6" />
            {/* Notification Badge */}
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Notifications
              </h3>
              {notifications.length > 0 ? (
                <ul className="space-y-3 overflow-hidden">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="p-3 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="block text-sm font-semibold text-blue-600">
                            {notification.issueType}
                          </span>
                          <span className="block text-gray-800">
                            {notification.description}
                          </span>
                          <span className="block text-xs text-gray-500">
                            From: {notification.fullName} |{" "}
                            {notification.createdAt}
                          </span>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          #{notification.ticketId}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  No new notifications
                </p>
              )}

              {/* Clear Notifications Button */}
              {notifications.length > 0 && (
                <Button
                  className="w-full mt-3 bg-[#407BFF] text-white hover:bg-[#8CB0FF] transition"
                  onClick={clearNotifications}
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

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
