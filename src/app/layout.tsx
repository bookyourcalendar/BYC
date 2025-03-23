"use client"

import type { Metadata } from "next";
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

const metadata: Metadata = {
  title: "BookYourCalendar",
  description: "A calendar booking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen">
          {/* Sidebar - Hidden on small screens, toggled with button */}
          <div
            className={`fixed left-0 top-0 h-screen w-64 text-white 
            transition-transform duration-300 ease-in-out 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}
          >
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 transition-all">
            {/* Navbar */}
            <Navbar />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 absolute top-4 left-4 z-50 bg-gray-700 text-white rounded"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="flex-1 p-4 overflow-auto">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
