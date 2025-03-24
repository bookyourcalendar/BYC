"use client"

import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react"; // For a hamburger menu icon

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata = {
  title: "BookYourCalendar",
  description: "A calendar booking app",
};

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen">
          {/* Sidebar - Always visible on larger screens, collapsible on mobile */}
          <div
            className={`fixed left-0 top-0 h-screen bg-gray-900 text-white shadow-lg 
            transition-transform duration-300 ease-in-out 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}
          >
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-h-screen md:ml-64">
            {/* Navbar - Stays at the top */}
            <Navbar />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 absolute top-4 left-4 z-50 bg-gray-700 text-white rounded"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Content - Below Sidebar & Navbar */}
            <div className="mt-16 p-4 overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
