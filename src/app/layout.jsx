"use client";

import { Metadata } from "next";
// import { ClerkProvider } from "@clerk/nextjs";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react"; // For a hamburger menu icon
import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";

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
  const [mounted, setMounted] = useState(false);
  
  // Only execute on client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Show a simple loading state during SSR
  if (!mounted) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedOut>
            <SignIn />
          </SignedOut>
          <SignedIn>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
          </header>
          <div className="flex flex-1">
            {/* Sidebar - Always visible on larger screens, collapsible on mobile */}
            <div
              className={`fixed left-0 top-0 h-screen bg-gray-900 text-white shadow-lg 
            transition-transform duration-300 ease-in-out z-50
            ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-64"
            } md:translate-x-0`}
            >
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-h-screen md:ml-64">
              {/* Navbar - Stays at the top */}
              <Navbar />

              {/* Mobile Menu Button */}
              <Button
                className="md:hidden p-2 absolute top-4 left-4 z-50 bg-gray-700 text-white rounded"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="w-6 h-6" />
              </Button>

              {/* Content - Below Sidebar & Navbar */}
              <div className="p-2 overflow-auto">{children}</div>
            </div>
          </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
