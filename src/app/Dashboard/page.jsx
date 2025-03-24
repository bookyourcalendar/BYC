"use client";

import React, { useEffect, useState } from "react";
import { UsersChart } from "@/components/UsersChart";
import MeetingsChart from "@/components/MeetingsChart";
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
        const response = await fetch(
          "http://localhost:3000/api/admin/meetingsCount"
        );
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
  }, []);

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      setLoadingUsers(true);
      setUsersError("");

      try {
        const response = await fetch(
          "http://localhost:3000/api/admin/analytics"
        );
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
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>

      {/* Meetings Section */}
      <div className="mb-8">
        <div className="text-2xl font-semibold mb-4">Meetings</div>
        {loadingMeetings ? (
          <p className="text-center text-gray-700">Loading meeting data...</p>
        ) : meetingsError ? (
          <p className="text-center text-red-500">{meetingsError}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Meetings Booked */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-medium text-center">
                Meetings Booked
              </h3>
              <p className="text-2xl font-bold text-primary pt-4 text-center">
                {meetingStats.booked}
              </p>
            </div>

            {/* Meetings Attended */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-medium text-center">
                Meetings Attended
              </h3>
              <p className="text-lg text-center font-medium pt-4">
                {meetingStats.attended}
              </p>
            </div>

            {/* Meetings Cancelled */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-medium text-center">
                Meetings Cancelled
              </h3>
              <p className="text-lg text-center font-medium pt-4">
                {meetingStats.cancelled}
              </p>
            </div>

            {/* Meetings Upcoming */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-medium text-center">
                Meetings Upcoming
              </h3>
              <p className="text-lg text-center font-medium pt-4">
                {meetingStats.cancelled}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Count Section */}
      <div className="mb-8">
        <div className="text-2xl font-semibold mb-4">User Count</div>
        {loadingUsers ? (
          <p className="text-center text-gray-700">Loading user data...</p>
        ) : usersError ? (
          <p className="text-center text-red-500">{usersError}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Total Users */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-medium text-center">Total Users</h3>
              <p className="text-lg text-center font-medium pt-4">
                {userCount.totalUsers}
              </p>
            </div>

            {/* Daily Active Users */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-medium text-center">
                Daily Active Users
              </h3>
              <p className="text-lg text-center font-medium pt-4">
                {userCount.dailyActiveUsers}
              </p>
            </div>

            {/* Monthly Active Users */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-medium text-center">
                Monthly Active Users
              </h3>
              <p className="text-lg text-center font-medium pt-4">
                {userCount.monthlyActiveUsers}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Section (Users Chart & Download Button) */}
      <div>
        <div className="text-2xl font-semibold mb-4">Analytics</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">Graph Section</h3>
            {/* <UsersChart /> */}
            <MeetingsChart />
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">Pie Chart Section</h3>
            {/* Placeholder for Pie Chart */}
            <UsersChart />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <DownloadButton />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
