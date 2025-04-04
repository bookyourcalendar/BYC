"use client";

import React, { useEffect, useState } from "react";
import { UsersChart } from "@/components/UsersChart";
import MeetingsChart from "@/components/MeetingsChart";
import DownloadButton from "@/components/DownloadButton";

const Dashboard = () => {
  const [meetingStats, setMeetingStats] = useState({
    booked: 0,
    scheduled: 0,
    cancelled: 0,
    upcoming: 0,
  });

  const [userCount, setUserCount] = useState({
    totalUsers: 0,
    DAU: 0,
    WAU: 0,
    MAU: 0,
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
          "https://www.bookyourcalendar.com/api/admin/meetingsCount"
        );
        if (!response.ok) throw new Error("Failed to fetch meeting stats");

        const data = await response.json();
        console.log("Meeting Stats:", data); // Debugging line to check response

        setMeetingStats({
          booked: data.totalBooked || 0,
          scheduled: data.totalScheduled || 0,
          cancelled: data.totalCanceled || 0,
          upcoming: data.totalUpcoming || 0,
        });
      } catch (err) {
        console.error("Error fetching meeting stats:", err); // Debugging error
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
          "https://www.bookyourcalendar.com/api/admin/analytics"
        );
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        console.log("User Stats:", data); // Debugging line to check response

        setUserCount({
          totalUsers: data.totalUsers || 0,
          dailyActiveUsers: data.DAU || 0,
          weeklyActiveUsers: data.WAU || 0,
          monthlyActiveUsers: data.MAU || 0,
        });
      } catch (err) {
        console.error("Error fetching user stats:", err); // Debugging error
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
      {/* <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div> */}

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
              <h3 className="text-xl font-medium text-center">
                Meetings Booked
              </h3>
              <p className="text-2xl font-bold text-primary pt-4 text-center">
                {meetingStats.booked}
              </p>
            </div>

            {/* Meetings Attended */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-medium text-center">
                Meetings Scheduled
              </h3>
              <p className="text-2xl font-bold text-primary pt-4 text-center">
                {meetingStats.scheduled}
              </p>
            </div>

            {/* Meetings Cancelled */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-medium text-center">
                Meetings Cancelled
              </h3>
              <p className="text-2xl font-bold text-primary pt-4 text-center">
                {meetingStats.cancelled}
              </p>
            </div>

            {/* Meetings Upcoming */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-medium text-center">
                Meetings Upcoming
              </h3>
              <p className="text-2xl font-bold text-primary pt-4 text-center">
                {meetingStats.upcoming}
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-medium text-center">Total Users</h3>
              <p className="text-2xl font-bold text-primary pt-4 text-center">
                {userCount.totalUsers}
              </p>
            </div>

            {/* Daily Active Users */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-medium text-center">
                Daily Active Users
              </h3>
              <p className="text-2xl font-bold text-primary pt-4 text-center">
                {userCount.dailyActiveUsers}
              </p>
            </div>

            {/* Weekly Active Users */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-medium text-center">
                Weekly Active Users
              </h3>
              <p className="text-2xl font-bold text-primary pt-4 text-center">
                {userCount.weeklyActiveUsers}
              </p>
            </div>

            {/* Monthly Active Users */}
            <div className="rounded-xl border p-6 bg-card text-card-foreground shadow transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-medium text-center">
                Monthly Active Users
              </h3>
              <p className="text-2xl font-bold text-primary pt-4 text-center">
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
          <div className="bg-white p-6">
            <MeetingsChart />
          </div>
          <div className="bg-white p-6">
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
