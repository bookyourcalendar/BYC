import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookYourCalendar",
  description: "A calendar booking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            {/* <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)]  bg-blue-500">
              <Sidebar />
            </div> */}
            {/* Main Content */}
            <div className="flex flex-col flex-1">
              <div className="w-full">{children}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
