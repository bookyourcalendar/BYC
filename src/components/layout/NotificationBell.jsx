"use client";

import { useState, useEffect, useRef } from "react";
import { BellIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  
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
      setOpen(false);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            <ul className="space-y-3 p-3">
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
                        From: {notification.fullName} | {notification.createdAt}
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
            <div className="py-6 text-center text-sm text-gray-500">
              No new notifications
            </div>
          )}
          {notifications.length > 0 && (
            <div className="p-3">
              <Button
                className="w-full bg-[#407BFF] text-white hover:bg-[#8CB0FF] transition"
                onClick={clearNotifications}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 