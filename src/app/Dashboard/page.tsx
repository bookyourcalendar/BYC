"use client"

import React, { useEffect, useState } from "react";
import { UsersChart } from "@/components/UsersChart";
import DownloadButton from "@/components/DownloadButton";

const Dashboard = () => {
  const [meetingStats, setMeetingStats] = useState({
    booked: 0,
    attended: 0,
    cancelled: 0,
  });

  const [userCount, setUserCount] = useState({
    totalUsers: 0,
    dailyActiveUsers: 0,
    monthlyActiveUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch meeting stats
        const meetingsResponse = await fetch("http://localhost:3000/api/admin/meetingsCount");
        if (!meetingsResponse.ok) throw new Error("Failed to fetch meeting stats");
        const meetingsData = await meetingsResponse.json();

        // Fetch user stats
        const usersResponse = await fetch("http://localhost:3000/api/admin/analytics");
        if (!usersResponse.ok) throw new Error("Failed to fetch user data");
        const usersData = await usersResponse.json();

        // Update state
        setMeetingStats({
          booked: meetingsData.booked || 0,
          attended: meetingsData.attended || 0,
          cancelled: meetingsData.cancelled || 0,
        });

        setUserCount({
          totalUsers: usersData.totalUsers || 0,
          dailyActiveUsers: usersData.dailyActiveUsers || 0,
          monthlyActiveUsers: usersData.monthlyActiveUsers || 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-[#2D2D2D] mb-8 text-center">Overview</h1>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Meetings Section */}
        <div className="col-span-2 bg-[#D5ECF5] p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-[#2D2D2D] mb-6 pb-4 border-b border-[#939393] text-center">
            Meetings
          </h2>
          {loading ? (
            <p className="text-center text-[#2D2D2D]">Loading meeting data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
              <div className="bg-[#8CB0FF] w-full max-w-[400px] rounded-lg p-6 shadow-md">
                <h3 className="text-xl text-center font-semibold text-[#000000]">Meetings Booked</h3>
                <p className="text-lg text-center font-medium pt-4 text-[#2D2D2D]">
                  {meetingStats.booked}
                </p>
              </div>
              <div className="bg-[#8CB0FF] w-full max-w-[400px] rounded-lg p-6 shadow-md">
                <h3 className="text-xl text-center font-semibold text-[#000000]">Meetings Attended</h3>
                <p className="text-lg text-center font-medium pt-4 text-[#2D2D2D]">
                  {meetingStats.attended}
                </p>
              </div>
              <div className="bg-[#8CB0FF] w-full max-w-[400px] rounded-lg p-6 shadow-md">
                <h3 className="text-xl text-center font-semibold text-[#000000]">Meetings Cancelled</h3>
                <p className="text-lg text-center font-medium pt-4 text-[#2D2D2D]">
                  {meetingStats.cancelled}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Count Section */}
        <div className="bg-[#D5ECF5] p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-[#2D2D2D] mb-6 pb-4 border-b border-[#939393] text-center">
            User Count
          </h2>
          {loading ? (
            <p className="text-center text-[#2D2D2D]">Loading user data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 grid-rows-3 gap-6 place-items-center">
              <div className="bg-[#407BFF] w-full max-w-[400px] rounded-lg p-6 shadow-md text-white">
                <h3 className="text-xl text-center font-semibold">Total Users</h3>
                <p className="text-lg text-center font-medium pt-4">{userCount.totalUsers}</p>
              </div>
              <div className="bg-[#407BFF] w-full max-w-[400px] rounded-lg p-6 shadow-md text-white">
                <h3 className="text-xl text-center font-semibold">Daily Active Users</h3>
                <p className="text-lg text-center font-medium pt-4">{userCount.dailyActiveUsers}</p>
              </div>
              <div className="bg-[#407BFF] w-full max-w-[400px] rounded-lg p-6 shadow-md text-white">
                <h3 className="text-xl text-center font-semibold">Monthly Active Users</h3>
                <p className="text-lg text-center font-medium pt-4">{userCount.monthlyActiveUsers}</p>
              </div>
            </div>
          )}
        </div>

        {/* Users Chart Section */}
        <div className="bg-[#D5ECF5] p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-[#2D2D2D] mb-6 pb-4 border-b border-[#939393] text-center">
            Users Chart
          </h2>
          <p className="text-sm text-[#2D2D2D] mb-6 text-center">
            Chart showing Daily Active Users & Monthly Active Users.
          </p>
          <div className="mb-6">
            <UsersChart />
          </div>
          <div className="flex justify-center">
            <DownloadButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
