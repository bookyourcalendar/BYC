"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Menu } from "lucide-react"; // Notification & Menu icons
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { ManageAccountButton, SignOutButton } from "./ProfileDropdown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="flex items-center gap-4 relative">
          <button
            className="relative text-gray-800 hover:text-gray-600 focus:outline-none"
            aria-label="Notifications"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-full mt-2 w-80 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50 overflow-hidden max-h-[400px] overflow-y-auto scrollbar-hide"
              style={{ maxHeight: "300px" }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Notifications
              </h3>
              {notifications.length > 0 ? (
                <ul className="space-y-3 scrollbar-hide">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="p-3 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition overflow-hidden"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <span className="block text-sm font-semibold text-blue-600">
                            {notification.issueType}
                          </span>
                          <span className="text-gray-800 text-sm break-words whitespace-normal overflow-hidden max-w-full">
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="/user-avatar.png" alt="User Avatar" />
                <AvatarFallback>GB</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <ManageAccountButton />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/Dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
