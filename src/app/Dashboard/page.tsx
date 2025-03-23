"use client";

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

  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [meetingsError, setMeetingsError] = useState("");
  const [usersError, setUsersError] = useState("");

  // Fetch meeting stats
  useEffect(() => {
    const fetchMeetingStats = async () => {
      setLoadingMeetings(true);
      setMeetingsError("");

      try {
        const response = await fetch(`http://localhost:3000/api/admin/meetingsCount?filter=${filter}`);
        // console.log(response);
        if (!response.ok) throw new Error("Failed to fetch meeting stats");

        const data = await response.json();
        setMeetingStats({
          booked: data.totalBooked || 0,
          attended: data.totalAttended || 0,
          cancelled: data.totalCanceled || 0,
        });
      } catch (err) {
        setMeetingsError(err.message);
      } finally {
        setLoadingMeetings(false);
      }
    };

    fetchMeetingStats();
  }, [filter]); // Refetch data when filter changes

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      setLoadingUsers(true);
      setUsersError("");

      try {
        const response = await fetch("http://localhost:3000/api/admin/analytics");
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserCount({
          totalUsers: data.totalUsers || 0,
          dailyActiveUsers: data.dailyActiveUsers || 0,
          monthlyActiveUsers: data.monthlyActiveUsers || 0,
        });
      } catch (err) {
        setUsersError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-[#2D2D2D] mb-8 text-center">Overview</h1>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Meetings Section */}
        <div className="col-span-2 bg-[#D5ECF5] p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#939393]">
            <h2 className="text-3xl font-bold text-[#2D2D2D]">Meetings</h2>
          </div>

          {loadingMeetings ? (
            <p className="text-center text-[#2D2D2D]">Loading meeting data...</p>
          ) : meetingsError ? (
            <p className="text-center text-red-500">{meetingsError}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
              {/* Meetings Booked */}
              <div className="bg-[#8CB0FF] w-full max-w-[400px] rounded-lg p-6 shadow-md">
                <h3 className="text-xl text-center font-semibold text-[#000000]">Meetings Booked</h3>
                <p className="text-lg text-center font-medium pt-4 text-[#2D2D2D]">
                  {meetingStats.booked}
                </p>
              </div>

              {/* Meetings Attended */}
              <div className="bg-[#8CB0FF] w-full max-w-[400px] rounded-lg p-6 shadow-md">
                <h3 className="text-xl text-center font-semibold text-[#000000]">Meetings Attended</h3>
                <p className="text-lg text-center font-medium pt-4 text-[#2D2D2D]">
                  {meetingStats.attended}
                </p>
              </div>

              {/* Meetings Cancelled */}
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
          {loadingUsers ? (
            <p className="text-center text-[#2D2D2D]">Loading user data...</p>
          ) : usersError ? (
            <p className="text-center text-red-500">{usersError}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 place-items-center">
              {/* Total Users */}
              <div className="bg-[#407BFF] w-full max-w-[400px] rounded-lg p-6 shadow-md text-white">
                <h3 className="text-xl text-center font-semibold">Total Users</h3>
                <p className="text-lg text-center font-medium pt-4">{userCount.totalUsers}</p>
              </div>

              {/* Daily Active Users */}
              <div className="bg-[#407BFF] w-full max-w-[400px] rounded-lg p-6 shadow-md text-white">
                <h3 className="text-xl text-center font-semibold">Daily Active Users</h3>
                <p className="text-lg text-center font-medium pt-4">{userCount.dailyActiveUsers}</p>
              </div>

              {/* Monthly Active Users */}
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
          <UsersChart />
          <div className="flex justify-center mt-4">
            <DownloadButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
